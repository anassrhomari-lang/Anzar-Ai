import React, { useState } from 'react';
import { Search, X, Pill, ExternalLink, Loader2, AlertCircle, ChevronRight, Beaker, Tag, Info, DollarSign, Layers, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { MedicineAutocomplete } from './MedicineAutocomplete';

interface Medicine {
  name: string;
  laboratory: string;
  therapeuticClass: string;
  indication: string;
  dosage: string;
  price: string;
  generics: string[];
}

interface MedicineSearchProps {
  onClose: () => void;
  lang: 'fr' | 'ar';
}

// Simple client-side cache for medicine search
const searchCache = new Map<string, Medicine[]>();

export const MedicineSearch: React.FC<MedicineSearchProps> = ({ onClose, lang }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestions = lang === 'fr' 
    ? ["Doliprane", "Amoxicilline", "Spasfon", "Humex", "Ventoline"]
    : ["دوليبران", "أموكسيسيلين", "سباسفون", "هوميكس", "فنتولين"];

  const extractJson = (text: string) => {
    try {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      const startArr = text.indexOf('[');
      const endArr = text.lastIndexOf(']');
      
      let finalStart = -1;
      let finalEnd = -1;
      
      if (start !== -1 && (startArr === -1 || start < startArr)) {
        finalStart = start;
        finalEnd = end;
      } else if (startArr !== -1) {
        finalStart = startArr;
        finalEnd = endArr;
      }
      
      if (finalStart !== -1 && finalEnd !== -1) {
        const jsonStr = text.substring(finalStart, finalEnd + 1);
        return JSON.parse(jsonStr);
      }
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  };

  const handleSearch = async (e?: React.FormEvent, suggestion?: string) => {
    if (e) e.preventDefault();
    const searchVal = suggestion || query;
    const trimmedQuery = searchVal.trim().toLowerCase();
    if (!trimmedQuery) return;
    
    if (suggestion) setQuery(suggestion);

    // Check cache first
    const cacheKey = `${lang}:${trimmedQuery}`;
    if (searchCache.has(cacheKey)) {
      setResults(searchCache.get(cacheKey)!);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      // Step 1: Try local search
      const localResponse = await fetch(`/api/medicaments/search?q=${encodeURIComponent(trimmedQuery)}`);
      if (localResponse.ok) {
        const localData = await localResponse.json();
        if (Array.isArray(localData) && localData.length > 0) {
          // Map local data to the Medicine interface
          let mappedData = localData.map((item: any) => ({
            name: item.nom,
            laboratory: item.labo,
            therapeuticClass: item.classe || "N/A",
            indication: item.details || "N/A",
            dosage: item.dosage || "N/A",
            price: item.ppv ? `${item.ppv} DH` : "N/A",
            generics: item.generics || []
          }));

          // Translate if Arabic
          if (lang === 'ar') {
            const translateData = async (retryCount = 0): Promise<any[]> => {
              try {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                const translationPrompt = `Traduisez les informations médicales suivantes en arabe. 
                Pour chaque objet du tableau, traduisez les champs suivants :
                - therapeuticClass
                - indication
                - dosage
                - generics (chaque élément du tableau)
                
                Gardez les noms propres (name, laboratory) tels quels ou translittérez-les si nécessaire.
                Répondez UNIQUEMENT avec le tableau JSON d'objets traduit, en conservant la même structure.
                
                Données : ${JSON.stringify(mappedData)}`;

                const translationResponse = await ai.models.generateContent({
                  model: "gemini-2.0-flash",
                  contents: translationPrompt,
                  config: { 
                    responseMimeType: "application/json"
                  }
                });
                
                const translated = extractJson(translationResponse.text || "[]") || [];
                if (Array.isArray(translated) && translated.length === mappedData.length) {
                  return translated;
                }
                return mappedData;
              } catch (e: any) {
                console.error("Translation error", e);
                if ((e?.status === 429 || e?.code === 429 || (e?.status >= 500)) && retryCount < 3) {
                  const delay = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
                  await new Promise(resolve => setTimeout(resolve, delay));
                  return translateData(retryCount + 1);
                }
                return mappedData;
              }
            };
            
            mappedData = await translateData();
          }

          searchCache.set(cacheKey, mappedData);
          setResults(mappedData);
          setIsLoading(false);
          return;
        }
      }

      // Step 2: Fallback to Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const targetLang = lang === 'fr' ? 'français' : 'arabe';
      const prompt = `Recherche des informations précises sur le médicament marocain "${trimmedQuery}" ou son générique. 
      Utilise les données de medicament.ma si possible.
      Réponds en ${targetLang}.
      Pour chaque médicament trouvé, fournis les détails suivants au format JSON (tableau d'objets) :
      - name: Nom commercial
      - laboratory: Laboratoire
      - therapeuticClass: Classe thérapeutique
      - indication: À quoi ça sert (langage simple)
      - dosage: Posologie standard
      - price: Prix AMM Maroc (ex: 45.00 DH)
      - generics: Liste des génériques équivalents disponibles au Maroc
      
      Réponds UNIQUEMENT avec le JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const data = extractJson(response.text || "[]") || [];
      if (Array.isArray(data)) {
        searchCache.set(cacheKey, data);
        setResults(data);
        if (data.length === 0) {
          setError(lang === 'fr' ? "Aucun médicament trouvé." : "لم يتم العثور على أي دواء.");
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Medicine search error:", err);
      setError(lang === 'fr' ? "Erreur lors de la recherche. Veuillez réessayer." : "خطأ أثناء البحث. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerScrape = async () => {
    const letters = 'ABC'.split('');
    for (const l of letters) {
      await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letter: l })
      });
    }
    alert(lang === 'fr' ? "Initialisation lancée en arrière-plan pour les lettres A, B, C." : "بدأ التهيئة في الخلفية للحروف A, B, C.");
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px]"
      />
      
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="fixed bottom-0 left-0 right-0 z-[110] bg-white rounded-t-[3rem] shadow-2xl border-t border-blue-100 max-h-[92vh] flex flex-col overflow-hidden"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />

        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-white shrink-0">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
          <div className="flex-1 relative">
            <MedicineAutocomplete 
              value={query}
              onChange={setQuery}
              onSelect={(medicine) => {
                setQuery(medicine.nom);
                handleSearch(undefined, medicine.nom);
              }}
              placeholder={lang === 'fr' ? "Nom du médicament ou générique..." : "اسم الدواء أو الجنيس..."}
              lang={lang}
              inputClassName="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-[#00356B] transition-all"
            />
          </div>
          <button 
            onClick={() => handleSearch()}
            disabled={isLoading || !query.trim()}
            className="px-4 py-2.5 bg-[#00356B] text-white rounded-2xl text-sm font-bold shadow-sm hover:bg-[#002a55] disabled:opacity-50 transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (lang === 'fr' ? "Chercher" : "بحث")}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/30">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-800 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {!isLoading && results.length === 0 && !error && (
              <div className="py-12 flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                  <Pill className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-blue-900">
                    {lang === 'fr' ? "Recherche de médicaments" : "البحث عن الأدوية"}
                  </h3>
                  <p className="text-sm text-blue-700 max-w-xs mt-1 opacity-70">
                    {lang === 'fr' 
                      ? "Entrez un nom commercial ou une molécule pour voir les détails et les prix au Maroc." 
                      : "أدخل اسماً تجارياً أو جزيئاً للاطلاع على التفاصيل والأسعار في المغرب."}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 max-w-md">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(undefined, s)}
                      className="px-3 py-1.5 bg-white border border-blue-100 rounded-full text-xs text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={triggerScrape}
                  className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100 flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  {lang === 'fr' ? "Initialiser la base de données (A, B, C)" : "تهيئة قاعدة البيانات (A, B, C)"}
                </button>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {results.map((med, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl border border-blue-50 shadow-sm overflow-hidden"
                >
                  <div className="p-5 border-b border-blue-50 bg-gradient-to-r from-blue-50/30 to-transparent">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-serif font-bold text-blue-900 uppercase tracking-tight">{med.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-blue-600/70 text-xs font-medium">
                          <Beaker className="w-3 h-3" />
                          {med.laboratory}
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm">
                        {med.price}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mb-0.5">
                            {lang === 'fr' ? "Classe Thérapeutique" : "الفئة العلاجية"}
                          </p>
                          <p className="text-sm text-blue-900 font-medium leading-relaxed">{med.therapeuticClass}</p>
                        </div>
                      </div>
 
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Info className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mb-0.5">
                            {lang === 'fr' ? "Indication" : "دواعي الاستعمال"}
                          </p>
                          <p className="text-sm text-blue-900 leading-relaxed">{med.indication}</p>
                        </div>
                      </div>
                    </div>
 
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mb-0.5">
                            {lang === 'fr' ? "Posologie Standard" : "الجرعة القياسية"}
                          </p>
                          <p className="text-sm text-blue-900 leading-relaxed">{med.dosage}</p>
                        </div>
                      </div>
 
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="w-full">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mb-1">
                            {lang === 'fr' ? "Génériques Équivalents" : "الأدوية الجنيسة المكافئة"}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {med.generics.map((gen, gIdx) => (
                              <span key={gIdx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-[10px] font-medium border border-gray-200">
                                {gen}
                              </span>
                            ))}
                            {med.generics.length === 0 && (
                              <span className="text-xs text-gray-400 italic">
                                {lang === 'fr' ? "Aucun générique listé" : "لا توجد أدوية جنيسة مدرجة"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
 
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-[10px] text-gray-400 italic">Source : medicament.ma & IA</p>
                    <a 
                      href={`https://medicament.ma/?s=${encodeURIComponent(med.name)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      {lang === 'fr' ? "Voir sur medicament.ma" : "انظر على medicament.ma"} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};
