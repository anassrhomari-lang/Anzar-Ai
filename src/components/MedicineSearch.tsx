import React, { useState } from 'react';
import { Search, X, Pill, ExternalLink, Loader2, AlertCircle, ChevronRight, Beaker, Tag, Info, DollarSign, Layers, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

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

export const MedicineSearch: React.FC<MedicineSearchProps> = ({ onClose, lang }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Recherche des informations précises sur le médicament marocain "${query}" ou son générique. 
      Utilise les données de medicament.ma si possible.
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
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || "[]");
      if (Array.isArray(data)) {
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'fr' ? "Nom du médicament ou générique..." : "اسم الدواء أو الجنيس..."}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            autoFocus
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </form>
        <button 
          onClick={() => handleSearch()}
          disabled={isLoading || !query.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
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
            <div className="py-20 flex flex-col items-center text-center gap-4 opacity-40">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Pill className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900">
                  {lang === 'fr' ? "Recherche de médicaments" : "البحث عن الأدوية"}
                </h3>
                <p className="text-sm text-blue-700 max-w-xs mt-1">
                  {lang === 'fr' 
                    ? "Entrez un nom commercial ou une molécule pour voir les détails et les prix au Maroc." 
                    : "أدخل اسماً تجارياً أو جزيئاً للاطلاع على التفاصيل والأسعار في المغرب."}
                </p>
              </div>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {results.map((med, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden"
              >
                <div className="p-5 border-b border-blue-50 bg-gradient-to-r from-blue-50/30 to-transparent">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-blue-900 uppercase tracking-tight">{med.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-blue-600/70 text-xs font-medium">
                        <Beaker className="w-3 h-3" />
                        {med.laboratory}
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm">
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
                        <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mb-0.5">Classe Thérapeutique</p>
                        <p className="text-sm text-blue-900 font-medium leading-relaxed">{med.therapeuticClass}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <Info className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mb-0.5">Indication</p>
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
                        <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mb-0.5">Posologie Standard</p>
                        <p className="text-sm text-blue-900 leading-relaxed">{med.dosage}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="w-full">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mb-1">Génériques Équivalents</p>
                        <div className="flex flex-wrap gap-1.5">
                          {med.generics.map((gen, gIdx) => (
                            <span key={gIdx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-[10px] font-medium border border-gray-200">
                              {gen}
                            </span>
                          ))}
                          {med.generics.length === 0 && (
                            <span className="text-xs text-gray-400 italic">Aucun générique listé</span>
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
                    Voir sur medicament.ma <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
