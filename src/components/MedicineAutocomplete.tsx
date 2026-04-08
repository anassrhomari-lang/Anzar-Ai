import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MedicineAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (medicine: any) => void;
  placeholder: string;
  lang: 'fr' | 'ar';
  className?: string;
  inputClassName?: string;
}

export const MedicineAutocomplete: React.FC<MedicineAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  lang,
  className = "",
  inputClassName = ""
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        // Capitalize first letter for better matching with medicament.ma data
        const formattedQuery = value.charAt(0).toUpperCase() + value.slice(1);
        const response = await fetch(`/api/medicaments/search?q=${encodeURIComponent(formattedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.slice(0, 5)); // Limit to 5 suggestions
          setIsOpen(data.length > 0);
        }
      } catch (error) {
        console.error("Autocomplete error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={inputClassName || "w-full px-6 py-4 rounded-2xl border border-blue-100 focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 text-base placeholder:text-blue-300 transition-all bg-white shadow-sm pr-12"}
        />
        <div className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 flex items-center gap-2`}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-blue-300" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-blue-50 overflow-hidden z-[200]"
          >
            {suggestions.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
                className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-blue-50 last:border-none group"
              >
                <div className="p-2 rounded-xl bg-blue-50 text-[#00356B] group-hover:bg-[#00356B] group-hover:text-white transition-colors">
                  <Pill className="w-4 h-4" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-slate-800 truncate group-hover:text-[#00356B] transition-colors">{item.nom}</span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {item.labo} • {item.ppv} DH
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
