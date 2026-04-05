/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { PanelLeft, X, User, Bot, Home, MapPin, Navigation, Phone, Clock, ExternalLink, Loader2, Store, MessageSquare, Plus, Trash2, History, Activity, Check } from "lucide-react";
import { PromptInputBox } from "./components/PromptInputBox";
import { GoogleGenAI } from "@google/genai";
import { PlaceCard } from "./components/PlaceCard";
import { LandingSections } from "./components/LandingSections";
import { PrescriptionScanner } from "./components/PrescriptionScanner";
import { MedicineSearch } from "./components/MedicineSearch";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "model";
  text: string;
  places?: any[];
  showPlaces?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

const MOROCCAN_CITIES = [
  { name: "Casablanca", lat: 33.5731, lng: -7.5898 },
  { name: "Rabat", lat: 34.0209, lng: -6.8416 },
  { name: "Marrakech", lat: 31.6295, lng: -7.9811 },
  { name: "Fès", lat: 34.0181, lng: -5.0078 },
  { name: "Tanger", lat: 35.7595, lng: -5.8340 },
  { name: "Agadir", lat: 30.4278, lng: -9.5981 },
  { name: "Meknès", lat: 33.8935, lng: -5.5473 },
  { name: "Oujda", lat: 34.6867, lng: -1.9114 },
  { name: "Kenitra", lat: 34.2610, lng: -6.5802 },
  { name: "Tétouan", lat: 35.5785, lng: -5.3684 },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<'fr' | 'ar'>('fr');
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [showPharmacySheet, setShowPharmacySheet] = useState(false);
  const [pharmacyType, setPharmacyType] = useState<"garde" | "normale">("normale");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [manualCity, setManualCity] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [checkerInput, setCheckerInput] = useState("");
  const [checkerResult, setCheckerResult] = useState<{ status: 'green' | 'yellow' | 'red', text: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const checkInteractions = async () => {
    if (!checkerInput.trim()) return;
    setIsChecking(true);
    setCheckerResult(null);
    
    const meds = checkerInput.split(',').map(m => m.trim()).filter(m => m.length > 0);
    if (meds.length < 2) {
      setCheckerResult({ 
        status: 'yellow', 
        text: lang === 'fr' ? "Veuillez entrer au moins deux médicaments." : "يرجى إدخال دواءين على الأقل." 
      });
      setIsChecking(false);
      return;
    }

    try {
      // OpenFDA search for adverse events involving these drugs
      // We'll search for reports where both drugs are mentioned as suspect
      const query = meds.map(m => `patient.drug.medicinalproduct:"${m}"`).join(' AND ');
      const url = `https://api.fda.gov/drug/event.json?search=${encodeURIComponent(query)}&limit=1`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // If we find co-reported events, we flag it. 
        // This is a simplified logic as requested.
        setCheckerResult({
          status: 'red',
          text: lang === 'fr' 
            ? "🔴 Danger : Des interactions ont été signalées pour cette combinaison. Évitez de les combiner sans avis médical." 
            : "🔴 خطر: تم الإبلاغ عن تفاعلات لهذه المجموعة. تجنب الجمع بينها دون استشارة طبية."
        });
      } else {
        // Fallback to AI for a more nuanced check if OpenFDA is inconclusive or no exact matches
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const aiPrompt = `Vérifie les interactions médicamenteuses entre : ${meds.join(', ')}. 
        Réponds UNIQUEMENT au format JSON : {"status": "green" | "yellow" | "red", "text": "explication courte"}.
        Utilise les codes : 🟢 pour green, 🟡 pour yellow, 🔴 pour red.`;
        
        const aiResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: aiPrompt,
          config: { responseMimeType: "application/json" }
        });
        
        const result = JSON.parse(aiResponse.text || "{}");
        setCheckerResult({
          status: result.status || 'green',
          text: result.text || (lang === 'fr' ? "🟢 Pas d'interaction majeure connue." : "🟢 لا توجد تفاعلات رئيسية معروفة.")
        });
      }
    } catch (error) {
      console.error("Interaction check error:", error);
      setCheckerResult({
        status: 'yellow',
        text: lang === 'fr' ? "Erreur lors de la vérification. Consultez un pharmacien." : "خطأ أثناء التحقق. استشر الصيدلاني."
      });
    } finally {
      setIsChecking(false);
    }
  };
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  // Load conversations from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('anzar_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
      } catch (e) {
        console.error("Failed to load conversations", e);
      }
    }
  }, []);

  // Save current conversation to local storage
  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      setConversations(prev => {
        const existing = prev.find(c => c.id === currentConversationId);
        let updated;
        if (existing) {
          updated = prev.map(c => c.id === currentConversationId ? {
            ...c,
            messages,
            timestamp: Date.now()
          } : c);
        } else {
          // Create new conversation entry
          const firstMessage = messages.find(m => m.role === 'user')?.text || "Nouvelle conversation";
          const title = firstMessage.length > 30 ? firstMessage.substring(0, 30) + "..." : firstMessage;
          updated = [{
            id: currentConversationId,
            title,
            messages,
            timestamp: Date.now()
          }, ...prev];
        }
        localStorage.setItem('anzar_conversations', JSON.stringify(updated));
        return updated;
      });
    }
  }, [messages, currentConversationId]);

  const startNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setIsMenuOpen(false);
  };

  const loadConversation = (conv: Conversation) => {
    setMessages(conv.messages);
    setCurrentConversationId(conv.id);
    setIsMenuOpen(false);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    localStorage.setItem('anzar_conversations', JSON.stringify(updated));
    if (currentConversationId === id) {
      startNewChat();
    }
  };
  
  const confirmPlaces = (index: number) => {
    setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, showPlaces: true } : msg));
  };
  
  const messagesLangRef = useRef<'fr' | 'ar'>('fr');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Try to get location on mount
    const savedLocation = sessionStorage.getItem('userLocation');
    if (savedLocation) {
      setUserCoords(JSON.parse(savedLocation));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(coords);
          sessionStorage.setItem('userLocation', JSON.stringify(coords));
        },
        (err) => console.log("Initial geolocation check failed:", err.message),
        { timeout: 10000 }
      );
    }
  }, []);

  const getPharmacyType = () => {
    const now = new Date();
    const day = now.getDay(); // 0=Sunday, 1=Monday ... 6=Saturday
    const hour = now.getHours();

    // Night duty: 21h → 8h next day
    // Weekend: Saturday after 14h → Monday 8h
    // Regular hours: weekdays 8h-21h, Saturday 8h-14h

    if (
      (day === 6 && hour >= 14) || // Saturday afternoon
      day === 0 ||                  // Sunday
      hour >= 21 ||                 // Night
      hour < 8                      // Early morning
    ) {
      return "garde";
    } else {
      return "normale";
    }
  };

  const fetchPharmacies = async (lat: number, lng: number, type: "garde" | "normale") => {
    try {
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="pharmacy"](around:2000,${lat},${lng});out body;`);
      const data = await response.json();
      
      const results = data.elements.map((el: any) => {
        // Calculate distance
        const R = 6371e3; // metres
        const φ1 = lat * Math.PI/180;
        const φ2 = el.lat * Math.PI/180;
        const Δφ = (el.lat-lat) * Math.PI/180;
        const Δλ = (el.lon-lng) * Math.PI/180;
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c; // in metres

        return {
          id: el.id,
          name: el.tags.name || (lang === 'fr' ? "Pharmacie sans nom" : "صيدلية بدون اسم"),
          lat: el.lat,
          lng: el.lon,
          distance: Math.round(d),
          phone: el.tags.phone || el.tags["contact:phone"] || null,
          address: el.tags["addr:street"] || null,
        };
      }).sort((a: any, b: any) => a.distance - b.distance);

      setPharmacies(results);
      setShowPharmacySheet(true);
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
      setLocationError("Erreur lors de la récupération des pharmacies.");
    }
  };

  const triggerPharmacyFinder = async () => {
    setIsLocating(true);
    setLocationError(null);
    
    const type = getPharmacyType();
    setPharmacyType(type);

    let lat = userCoords?.lat || 33.5731;
    let lng = userCoords?.lng || -7.5898;

    if (!userCoords) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000, enableHighAccuracy: true });
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        setUserCoords({ lat, lng });
        sessionStorage.setItem('userLocation', JSON.stringify({ lat, lng }));
      } catch (e) {
        console.error("Geolocation failed:", e);
        setLocationError(lang === 'fr' 
          ? "Impossible de vous localiser automatiquement. Veuillez autoriser l'accès à votre position ou entrer votre ville." 
          : "تعذر تحديد موقعك تلقائيًا. يرجى السماح بالوصول إلى موقعك أو إدخال مدينتك.");
        setIsLocating(false);
        return; // Stop here and wait for user input
      }
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Trouve les pharmacies ${type === 'garde' ? 'de garde' : 'ouvertes'} dans un rayon STRICT de 10km maximum autour de ma position (lat: ${lat}, lng: ${lng}). Ne cherche jamais au-delà de cette distance.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          tools: [
            { googleMaps: {} }
          ],
          toolConfig: {
            retrievalConfig: {
              latLng: { latitude: lat, longitude: lng }
            }
          }
        }
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const places = chunks?.map((c: any) => c.maps).filter(Boolean) || [];
      
      const results = places.map((p: any, i: number) => ({
        id: `ai-${i}`,
        name: p.title,
        lat: lat, // Approximation since we don't get coords back directly in grounding chunks
        lng: lng,
        distance: 0,
        uri: p.uri,
        address: lang === 'fr' ? "Voir sur la carte" : "انظر على الخريطة",
      }));

      setPharmacies(results);
      setShowPharmacySheet(true);
    } catch (error) {
      console.error("Error fetching pharmacies with AI:", error);
      setLocationError("Erreur lors de la recherche des pharmacies avec l'IA.");
    } finally {
      setIsLocating(false);
    }
  };

  // Translate existing messages when language changes
  useEffect(() => {
    if (messages.length === 0 || messagesLangRef.current === lang || isLoading) return;

    const translateMessages = async () => {
      setIsLoading(true);
      const sourceMessages = [...messages];
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const targetLangName = lang === 'fr' ? 'français' : 'arabe';
        
        const prompt = `Traduisez l'historique de chat suivant en ${targetLangName}. 
        Conservez le ton professionnel et direct. 
        Mettez en gras les informations clés (médicaments, dosages, pharmacies, interactions).
        Répondez UNIQUEMENT avec un tableau JSON d'objets {role, text}.
        
        Historique :
        ${JSON.stringify(sourceMessages.map(m => ({ role: m.role, text: m.text })))}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        try {
          const translated = JSON.parse(response.text || "[]");
          if (Array.isArray(translated) && translated.length === sourceMessages.length) {
            setMessages(prev => prev.map((msg, i) => ({
              ...msg,
              text: translated[i]?.text || msg.text
            })));
            messagesLangRef.current = lang;
          }
        } catch (e) {
          console.error("Failed to parse translation JSON", e);
        }
      } catch (error) {
        console.error("Translation error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    translateMessages();
  }, [lang, messages.length, isLoading]);

  const handleSend = async (text: string, files?: File[]) => {
    if (!text.trim() && (!files || files.length === 0)) return;

    // Initialize conversation ID if not present
    if (!currentConversationId) {
      setCurrentConversationId(Date.now().toString());
    }

    // Auto-trigger pharmacy finder based on keywords
    const keywords = ["pharmacie", "médicament", "garde", "ouvert", "dawa", "صيدلية"];
    const isPharmacyQuery = keywords.some(kw => text.toLowerCase().includes(kw));
    
    if (isPharmacyQuery && pharmacies.length === 0 && !isLocating) {
      // We'll let the AI handle it with grounding now
    }

    messagesLangRef.current = lang; // Mark current messages as being in the current language
    let useMaps = isPharmacyQuery;
    let query = text;

    // Parse prefix
    if (text.startsWith("[Pharmacy: ")) {
      useMaps = true;
      query = text.replace("[Pharmacy: ", "").replace(/\]$/, "");
    } else if (text.startsWith("[Location: ")) {
      useMaps = true;
      query = text.replace("[Location: ", "").replace(/\]$/, "");
    }

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemInstruction = lang === 'fr' 
        ? "Tu es Anzar, un assistant médical marocain expert. Tu réponds en français ou en Darija selon la langue de l'utilisateur. Tes conseils doivent être clairs, simples et responsables. Rappelle TOUJOURS de consulter un médecin pour les cas sérieux. Si l'utilisateur décrit des symptômes, termine TOUJOURS ta réponse par l'un de ces niveaux de gravité :\n\n🟢 Gérable à domicile — voici comment\n🟡 Consulter un médecin dans les 24-48h\n🔴 Urgences maintenant\n\nUtilise les outils de recherche Google Maps pour trouver des lieux réels UNIQUEMENT dans la ville actuelle de l'utilisateur."
        : "أنت أنزار، مساعد طبي مغربي خبير. تجيب باللغة الفرنسية أو الدارجة حسب لغة المستخدم. يجب أن تكون نصائحك واضحة وبسيطة ومسؤولة. ذكر دائمًا باستشارة الطبيب في الحالات الخطيرة. إذا وصف المستخدم أعراضًا، فقم دائمًا بإنهاء إجابتك بأحد مستويات الخطورة التالية:\n\n🟢 يمكن إدارتها في المنزل - إليك الطريقة\n🟡 استشر الطبيب خلال 24-48 ساعة\n🔴 الطوارئ الآن\n\nاستخدم أدوات بحث خرائط جوجل للعثور على أماكن حقيقية فقط في مدينة المستخدم الحالية.";

      const config: any = {
        systemInstruction,
        tools: [
          { googleMaps: {} }
        ],
      };

      if (useMaps) {
        // Try to use existing coords or get new ones
        let lat = userCoords?.lat;
        let lng = userCoords?.lng;

        if (!lat || !lng) {
          try {
            const pos = await Promise.race([
              new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
              }),
              new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
            ]) as GeolocationPosition;
            
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            setUserCoords({ lat, lng });
            sessionStorage.setItem('userLocation', JSON.stringify({ lat, lng }));
          } catch (e) {
            console.log("Could not get location for grounding, using default");
            lat = 33.5731;
            lng = -7.5898;
          }
        }
        
        config.toolConfig = {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        };
      }

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.1-pro-preview",
        contents: query,
        config,
      });

      setMessages((prev) => [
        ...prev,
        { role: "model", text: "" },
      ]);
      setIsLoading(false);

      let textResponse = "";
      let places: any[] = [];

      for await (const chunk of responseStream) {
        textResponse += chunk.text || "";
        const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const newPlaces = chunks?.map((c: any) => c.maps).filter(Boolean) || [];
        if (newPlaces.length > 0) {
          places = [...places, ...newPlaces];
        }

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "model",
            text: textResponse,
            places: places.length > 0 ? places : undefined,
            showPlaces: false,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Error calling Gemini:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Désolé, une erreur s'est produite lors de la communication avec le serveur." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanComplete = (details: string) => {
    if (!currentConversationId) {
      setCurrentConversationId(Date.now().toString());
    }
    const userMessage: Message = {
      role: "user",
      text: lang === 'fr' ? "Analyse de mon ordonnance" : "تحليل وصفتي الطبية"
    };
    const modelMessage: Message = {
      role: "model",
      text: details
    };
    setMessages(prev => [...prev, userMessage, modelMessage]);
  };

  return (
    <div 
      className="h-[100dvh] flex flex-col font-sans relative overflow-hidden"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#FBFDFF]" />
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden z-0 pointer-events-none animate-in fade-in slide-in-from-bottom-24 duration-1000 ease-out flex justify-center items-end h-[85vh] opacity-100">
        <svg 
          viewBox="0 0 2292 800" 
          className="w-[300%] md:w-[250%] h-full min-w-[1500px] object-cover object-bottom"
          preserveAspectRatio="none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_5226_125)">
            <path 
              d="M1113.5 40C502.673 39.9999 40 793 40 793H2252C2252 793 1724.33 40 1113.5 40Z" 
              fill="url(#paint0_radial_5226_125)"
            />
          </g>
          <defs>
            <filter id="filter0_f_5226_125" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur"/>
            </filter>
            <radialGradient id="paint0_radial_5226_125" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1146 793) rotate(-90) scale(753 1106)">
              <stop offset="0%" stopColor="#F0F7FF" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#F9FBFF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} bottom-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? "translate-x-0" : (lang === 'ar' ? "translate-x-full" : "-translate-x-full")}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div className="text-xl md:text-2xl font-bold tracking-tight text-blue-600">anzar</div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
        
        <div className="p-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startNewChat}
            className="w-full py-2.5 md:py-3 px-4 bg-blue-600 text-white rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {lang === 'fr' ? 'Nouvelle discussion' : 'محادثة جديدة'}
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-blue-400/60 flex items-center gap-2">
            <History className="w-3 h-3" />
            {lang === 'fr' ? 'Historique' : 'السجل'}
          </div>
          
          {conversations.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-blue-300 italic">
                {lang === 'fr' ? 'Aucun historique' : 'لا يوجد سجل'}
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => loadConversation(conv)}
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                  currentConversationId === conv.id 
                    ? "bg-blue-50 text-blue-700 border border-blue-100" 
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <MessageSquare className={`w-4 h-4 shrink-0 ${currentConversationId === conv.id ? "text-blue-600" : "text-gray-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{conv.title}</p>
                  <p className="text-[9px] opacity-60">
                    {new Date(conv.timestamp).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-MA', { 
                      day: 'numeric', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <motion.a 
            whileHover={{ x: 5 }}
            href="#" 
            className="flex items-center gap-3 px-3 py-2 text-xs text-gray-500 hover:text-blue-600 transition-all"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            {lang === 'fr' ? 'Open Source' : 'المصدر المفتوح'}
          </motion.a>
          <motion.a 
            whileHover={{ x: 5 }}
            href="#" 
            className="flex items-center gap-3 px-3 py-2 text-xs text-gray-500 hover:text-blue-600 transition-all"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            {lang === 'fr' ? 'Pharmacie de Gardes' : 'صيدليات الحراسة'}
          </motion.a>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-2 bg-transparent shrink-0">
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(true)}
            className="p-1.5 -ms-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <PanelLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMessages([])}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title={lang === 'fr' ? 'Accueil' : 'الرئيسية'}
          >
            <Home className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileHover={{ opacity: 0.8, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMessages([])}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="text-lg md:text-xl font-bold tracking-tight text-blue-900">anzar</div>
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            className="w-7 h-7 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-xs font-medium text-blue-700 transition-colors shadow-sm"
          >
            {lang === 'fr' ? 'AR' : 'FR'}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pt-4 pb-4 w-full">
          {messages.length === 0 ? (
            <div className="w-full">
              <div className="max-w-2xl mx-auto px-6 mt-8 mb-8">
                <h1 className="text-xl md:text-2xl font-medium text-blue-900 mb-6">
                  {lang === 'fr' ? "Comment puis-je vous aider ?" : "كيف يمكنني مساعدتك؟"}
                </h1>

                <div className="flex flex-col gap-2.5 items-start">
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all text-blue-800 text-sm font-medium shadow-sm"
                  >
                    {lang === 'fr' ? "Rechercher un médicament" : "البحث عن دواء"}
                  </button>
                  <button 
                    onClick={() => setIsCheckerOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all text-blue-800 text-sm font-medium shadow-sm"
                  >
                    {lang === 'fr' ? "Vérifier mes médicaments" : "التحقق من أدويتي"}
                  </button>
                  <button 
                    onClick={() => handleSend(lang === 'fr' ? "Interactions médicamenteuses de mon ordonnance" : "التفاعلات الدوائية لوصفتي الطبية")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all text-blue-800 text-sm font-medium shadow-sm"
                  >
                    {lang === 'fr' ? "Interactions médicamenteuses de mon ordonnance" : "التفاعلات الدوائية لوصفتي الطبية"}
                  </button>
                </div>
              </div>
              
              <LandingSections 
                lang={lang} 
                onTriggerPharmacy={triggerPharmacyFinder} 
                onTriggerScanner={() => setIsScannerOpen(true)}
                onTriggerChecker={() => setIsCheckerOpen(true)}
                onTriggerSearch={() => setIsSearchOpen(true)}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full px-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div 
                    className={`max-w-[85%] ${
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-xl rounded-te-sm px-4 py-3 shadow-md" 
                        : "text-blue-900 py-2"
                    }`}
                  >
                    <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-serif prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-blue-900 prose-strong:font-bold prose-p:text-blue-800">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                  
                  {msg.places && msg.places.length > 0 && (
                    <div className="mt-4 flex flex-col gap-3 w-full">
                      {!msg.showPlaces ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col items-center gap-3"
                        >
                          <p className="text-sm text-blue-800 font-medium text-center">
                            {lang === 'fr' 
                              ? "Souhaitez-vous voir l'itinéraire vers les pharmacies trouvées ?" 
                              : "هل ترغب في رؤية المسار إلى الصيدليات التي تم العثور عليها؟"}
                          </p>
                          <div className="flex gap-2 w-full">
                            <button 
                              onClick={() => confirmPlaces(idx)}
                              className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors"
                            >
                              {lang === 'fr' ? "Oui, voir l'itinéraire" : "نعم، أريد المسار"}
                            </button>
                            <button 
                              onClick={() => setMessages(prev => prev.map((m, i) => i === idx ? { ...m, places: undefined } : m))}
                              className="px-4 py-2 bg-white border border-blue-100 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors"
                            >
                              {lang === 'fr' ? "Non" : "لا"}
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        msg.places.map((place, pIdx) => (
                          <PlaceCard key={pIdx} place={place} lang={lang} />
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl rounded-ss-sm px-4 py-3 border border-gray-100 shadow-sm flex gap-1 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input Area */}
        <div className="relative z-20 p-4 w-full bg-gradient-to-t from-[#FBFDFF] via-[#FBFDFF] to-transparent pt-4 shrink-0">
          <div className="max-w-2xl mx-auto relative">
            {/* Pharmacy Bottom Sheet */}
            <AnimatePresence>
              {showPharmacySheet && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute bottom-full left-0 right-0 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30 max-h-[60vh] flex flex-col"
                >
                  <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${pharmacyType === 'garde' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                      <h3 className="font-bold text-gray-900">
                        {pharmacyType === 'garde' 
                          ? "Pharmacies de garde · Ouvertes maintenant 🟢" 
                          : "Pharmacies près de vous 📍"}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setShowPharmacySheet(false)}
                      className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto p-4 flex flex-col gap-3">
                    {pharmacies.length === 0 ? (
                      <div className="py-8 text-center text-gray-500">
                        Aucune pharmacie trouvée à proximité.
                      </div>
                    ) : (
                      pharmacies.map((pharmacy) => (
                        <div key={pharmacy.id} className="p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-all shadow-sm hover:shadow-md">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Store className="w-5 h-5 text-gray-700" />
                              <h4 className="font-bold text-gray-900">{pharmacy.name}</h4>
                            </div>
                            {pharmacy.distance > 0 && (
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {pharmacy.distance >= 1000 
                                  ? `${(pharmacy.distance / 1000).toFixed(1)} km` 
                                  : `${pharmacy.distance} m`}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-1.5 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{pharmacyType === 'garde' ? 'Ouvert (Garde)' : 'Ouvert'}</span>
                            </div>
                            {pharmacy.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <a href={`tel:${pharmacy.phone}`} className="hover:text-blue-600 underline underline-offset-2">{pharmacy.phone}</a>
                              </div>
                            )}
                          </div>
                          
                          <a 
                            href={pharmacy.uri || `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 md:py-2.5 bg-gray-900 text-white rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                          >
                            <Navigation className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            Itinéraire
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Locating Loader */}
            <AnimatePresence>
              {isLocating && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-100 flex items-center gap-2 z-40"
                >
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-xs font-medium text-gray-700">Recherche de votre position...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {locationError && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 right-0 mb-4 p-4 bg-white/90 backdrop-blur-md rounded-xl border border-blue-200 flex flex-col gap-2 z-40 shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">{locationError}</span>
                    <button onClick={() => setLocationError(null)}><X className="w-4 h-4 text-blue-400 hover:text-blue-600 transition-colors" /></button>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Entrez votre ville (ex: Meknès)" 
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-blue-100 rounded-xl text-sm text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const city = MOROCCAN_CITIES.find(c => c.name.toLowerCase() === manualCity.toLowerCase());
                          if (city) {
                            const coords = { lat: city.lat, lng: city.lng };
                            setUserCoords(coords);
                            sessionStorage.setItem('userLocation', JSON.stringify(coords));
                            setLocationError(null);
                            setManualCity("");
                            triggerPharmacyFinder();
                          } else {
                            // If not in list, just close and try to search by name in the prompt
                            setLocationError(null);
                            setManualCity("");
                            triggerPharmacyFinder();
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-[10px] text-blue-600 font-medium mb-1 px-1">Villes suggérées :</p>
                    <div className="flex flex-wrap gap-1.5">
                      {MOROCCAN_CITIES.map((city) => (
                        <motion.button
                          key={city.name}
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 246, 255, 1)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const coords = { lat: city.lat, lng: city.lng };
                            setUserCoords(coords);
                            sessionStorage.setItem('userLocation', JSON.stringify(coords));
                            setLocationError(null);
                            triggerPharmacyFinder();
                          }}
                          className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-medium text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
                        >
                          {city.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-4 text-center">
              <h2 className="text-xl md:text-2xl font-medium text-blue-900">
                {lang === 'fr' ? (
                  <>Assistant pharmaceutique <span className="font-bold text-blue-800">rapide</span> et <span className="font-bold text-blue-800">gratuit</span></>
                ) : (
                  <>مساعد صيدلي <span className="font-bold text-blue-800">سريع</span> و <span className="font-bold text-blue-800">مجاني</span></>
                )}
              </h2>
            </div>

            <PromptInputBox 
              placeholder={lang === 'fr' ? "Décrivez vos symptômes ou posez une question..." : "صف الأعراض أو اطرح سؤالاً..."}
              onSend={handleSend}
              isLoading={isLoading}
              lang={lang}
              onTriggerPharmacy={triggerPharmacyFinder}
              onTriggerScanner={() => setIsScannerOpen(true)}
              onTriggerChecker={() => setIsCheckerOpen(true)}
              onTriggerSearch={() => setIsSearchOpen(true)}
              consentChecked={consentChecked}
              onConsentChange={setConsentChecked}
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isScannerOpen && (
          <PrescriptionScanner 
            lang={lang}
            onClose={() => setIsScannerOpen(false)}
            onScanComplete={handleScanComplete}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <MedicineSearch 
            lang={lang}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Interaction Checker Modal */}
      <AnimatePresence>
        {isCheckerOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-blue-100 w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-blue-50 flex items-center justify-between bg-blue-50/30">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-blue-900">
                    {lang === 'fr' ? "Vérifier mes médicaments" : "التحقق من الأدوية"}
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    setIsCheckerOpen(false);
                    setCheckerResult(null);
                    setCheckerInput("");
                  }}
                  className="p-1.5 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-blue-400" />
                </button>
              </div>
              
              <div className="p-6 flex flex-col gap-4">
                <p className="text-xs text-blue-700 leading-relaxed">
                  {lang === 'fr' 
                    ? "Entrez les noms des médicaments séparés par une virgule pour vérifier les interactions connues." 
                    : "أدخل أسماء الأدوية مفصولة بفاصلة للتحقق من التفاعلات المعروفة."}
                </p>
                
                <div className="relative">
                  <input
                    type="text"
                    value={checkerInput}
                    onChange={(e) => setCheckerInput(e.target.value)}
                    placeholder={lang === 'fr' ? "Ex: Aspirine, Ibuprofène" : "مثال: أسبرين، إيبوبروفين"}
                    className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-300 focus:ring-0 text-sm placeholder:text-blue-300"
                  />
                </div>

                <button
                  onClick={checkInteractions}
                  disabled={isChecking || !checkerInput.trim()}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isChecking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {lang === 'fr' ? "Vérifier" : "تحقق"}
                </button>

                {checkerResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${
                      checkerResult.status === 'red' ? 'bg-red-50 border-red-100 text-red-800' :
                      checkerResult.status === 'yellow' ? 'bg-yellow-50 border-yellow-100 text-yellow-800' :
                      'bg-green-50 border-green-100 text-green-800'
                    } text-xs font-medium leading-relaxed`}
                  >
                    {checkerResult.text}
                  </motion.div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 italic text-center">
                {lang === 'fr' 
                  ? "Source : OpenFDA & IA. Ne remplace pas l'avis d'un professionnel." 
                  : "المصدر: OpenFDA والذكاء الاصطناعي. لا يغني عن رأي المختص."}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


