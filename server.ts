import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let firebaseConfig;
try {
  firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));
} catch (e) {
  console.error("Failed to read firebase-applet-config.json", e);
  process.exit(1);
}

// In Cloud Run, initializeApp() with no arguments uses the default service account and project
const adminApp = admin.initializeApp();

// Try to get the database from config, fallback to (default)
const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
let db = getFirestore(adminApp, databaseId);

console.log(`Firebase Admin initialized for database: ${databaseId}`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API: Search Medicaments
  app.get("/api/medicaments/search", async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const query = q.toUpperCase();
    
    const tryQuery = async (database: any) => {
      return await database.collection("medicaments")
        .where("nom", ">=", query)
        .where("nom", "<=", query + "\uf8ff")
        .limit(20)
        .get();
    };

    try {
      let snapshot;
      try {
        snapshot = await tryQuery(db);
      } catch (error: any) {
        // If permission denied on named database, try (default)
        if (error.message?.includes("PERMISSION_DENIED") && databaseId !== '(default)') {
          console.warn(`Permission denied on ${databaseId}, trying (default) database...`);
          const defaultDb = getFirestore(adminApp, '(default)');
          snapshot = await tryQuery(defaultDb);
          // If successful, update the global db for future requests
          db = defaultDb;
        } else {
          throw error;
        }
      }

      const results = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API: Trigger Scrape (Admin only - simplified for demo)
  app.post("/api/admin/scrape", async (req, res) => {
    // In a real app, check for admin auth here
    const { letter } = req.body;
    if (!letter) return res.status(400).json({ error: "Letter required" });

    res.json({ message: `Scraping started for letter ${letter}` });

    // Run scraping in background
    scrapeLetter(letter).catch(console.error);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

async function scrapeLetter(lettre: string) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = page === 1
      ? `https://medicament.ma/listing-des-medicaments/?lettre=${lettre}`
      : `https://medicament.ma/listing-des-medicaments/page/${page}/?lettre=${lettre}`;

    console.log(`Scraping: ${url}`);
    try {
      const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Anzar/1.0 contact@anzar.ma' }
      });

      const $ = cheerio.load(data);
      const items: any[] = [];

      $('ul li a[href*="/medicament/"]').each((i, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr('href');

        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        const details = lines[1] || '';
        
        // Basic parsing of details line: "Boite de X - PPV: XX dhs - LABO"
        const ppvMatch = details.match(/PPV:\s*([\d.]+)/i);
        const laboMatch = details.split('-').pop()?.trim();

        items.push({
          nom: lines[0],
          url: href,
          details: details,
          ppv: ppvMatch ? ppvMatch[1] : '',
          labo: laboMatch || '',
          forme: lines[0].split(',')[1]?.trim() || ''
        });
      });

      if (items.length === 0) {
        hasMore = false;
      } else {
        // Save to Firestore
        const batch = db.batch();
        for (const item of items) {
          // Use URL as ID to avoid duplicates
          const docId = Buffer.from(item.url).toString('base64').replace(/\//g, '_');
          const docRef = db.collection("medicaments").doc(docId);
          batch.set(docRef, item, { merge: true });
          
          // Scrape details for each item (in a real scenario, we'd queue this)
          // For now, let's just save the listing info
        }
        await batch.commit();
        console.log(`Saved ${items.length} items for ${lettre} page ${page}`);
        
        page++;
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      hasMore = false;
    }
  }
}

startServer();
