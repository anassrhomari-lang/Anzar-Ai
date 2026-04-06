import React from "react";
import { MapPin, Phone, Clock, ArrowRight, ChevronDown } from "lucide-react";

interface PlaceCardProps {
  place: any;
  lang?: 'fr' | 'ar';
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, lang = 'fr' }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  // Extract info from grounding chunk
  const title = place.title || (lang === 'fr' ? "Lieu inconnu" : "مكان غير معروف");
  const uri = place.uri || "#";
  
  // Mock some data for the UI to match the screenshot since groundingChunks 
  // from Google Maps tool don't provide full appointment details.
  const mockDate = lang === 'fr' ? "Mercredi, 25 Juin 2025" : "الأربعاء، 25 يونيو 2025";
  const mockTime = "10:30 AM";
  const mockSpeciality = lang === 'fr' ? "Médecine Générale" : "الطب العام";
  const mockDuration = lang === 'fr' ? "45 Minutes" : "45 دقيقة";
  const mockContact = "+212 522-123456";
  const mockType = lang === 'fr' ? "Consultation Initiale" : "استشارة أولية";
  
  const photoUrl = place.photoUri || place.imageUri || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=100&auto=format&fit=crop";

  const isRtl = lang === 'ar';

  if (showDetails) {
    return (
      <div className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 w-full max-w-md`} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
              <img src={photoUrl} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="text-start">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">{title}</h3>
              <p className="text-xs md:text-sm text-gray-500">{mockSpeciality}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowDetails(false)}
            className="flex items-center gap-1 text-xs md:text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full"
          >
            {lang === 'fr' ? "Fermer" : "إغلاق"} <ArrowRight className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className={`grid grid-cols-2 gap-y-6 gap-x-4 mb-6 text-start`}>
          <div>
            <p className="text-[10px] md:text-xs text-gray-500 mb-1">{lang === 'fr' ? "Date" : "التاريخ"}</p>
            <p className="text-xs md:text-sm font-medium text-gray-900">{mockDate}</p>
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-gray-500 mb-1">{lang === 'fr' ? "Heure" : "الوقت"}</p>
            <p className="text-xs md:text-sm font-medium text-gray-900">{mockTime}</p>
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-gray-500 mb-1">{lang === 'fr' ? "Clinique/Pharmacie" : "عيادة/صيدلية"}</p>
            <p className="text-xs md:text-sm font-medium text-gray-900">{title}</p>
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-gray-500 mb-1">{lang === 'fr' ? "Durée" : "المدة"}</p>
            <p className="text-xs md:text-sm font-medium text-gray-900">{mockDuration}</p>
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-gray-500 mb-1">{lang === 'fr' ? "Contact" : "اتصال"}</p>
            <p className="text-xs md:text-sm font-medium text-gray-900">{mockContact}</p>
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-gray-500 mb-1">{lang === 'fr' ? "Type" : "النوع"}</p>
            <p className="text-xs md:text-sm font-medium text-gray-900">{mockType}</p>
          </div>
        </div>

        <div className="text-start">
          <p className="text-xs text-gray-500 mb-2">{lang === 'fr' ? "Localisation" : "الموقع"}</p>
          <p className="text-sm font-medium text-gray-900 mb-3">{lang === 'fr' ? "Casablanca, Maroc" : "الدار البيضاء، المغرب"}</p>
          
          <a 
            href={uri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block relative h-48 md:h-64 rounded-xl overflow-hidden bg-blue-50 group"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <MapPin className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className={`absolute bottom-2 end-2 bg-white px-2 py-1 rounded text-[10px] md:text-xs font-medium text-red-500 flex items-center gap-1 shadow-sm`}>
              <MapPin className="w-2.5 h-2.5 md:w-3 h-3" /> {lang === 'fr' ? "Ouvrir la carte" : "فتح الخريطة"}
            </div>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center justify-between mb-2 w-full max-w-sm hover:shadow-md transition-shadow gap-3`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
          <img src={photoUrl} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className={`flex-1 min-w-0 text-start`}>
          <h4 className="font-semibold text-gray-900 text-sm mb-0.5 truncate">
            {title}
          </h4>
          <p className="text-xs text-gray-500 truncate">
            {place.address || (lang === 'fr' ? "Casablanca, Maroc" : "الدار البيضاء، المغرب")}
          </p>
        </div>
      </div>
      <button 
        onClick={() => setShowDetails(true)}
        className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full transition-colors flex-shrink-0"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
};
