import React from 'react';
import { Sparkles, Pill, ClipboardList, Store, Heart, Diamond, Activity, Thermometer, Plus, Search, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingSectionsProps {
  lang: 'fr' | 'ar';
  onTriggerPharmacy?: () => void;
  onTriggerScanner?: () => void;
  onTriggerChecker?: () => void;
  onTriggerSearch?: () => void;
}

const t = {
  fr: {
    title1: "Assistant pharmaceutique **rapide** et **gratuit**",
    desc1: "Votre vie privée est notre **priorité**. Échanges **100% anonymes**. Trouvez un **médicament** ou une **pharmacie de garde** en quelques secondes.",
    title2: "Comment puis-je vous aider ?",
    desc2: "Trouvez un médicament en stock près de chez vous. Consultez les pharmacies de garde et obtenez des conseils pharmaceutiques instantanés.",
    chat1: "Comment puis-je vous aider avec vos **médicaments** aujourd'hui ?",
    chat2: "Je cherche de l'**Amoxicilline 500mg**",
    chat3: "Quelles sont les **pharmacies de garde** à Casablanca ?",
    chat4: "Est-ce que le **Doliprane** a des interactions avec l'**Ibuprofène** ?",
    title3: "Un réseau pharmaceutique **sur mesure**",
    badge: "Stock en temps réel · Pharmacies de garde 24h/7j",
    desc3: "Connecté aux pharmacies de votre ville et alentours. Accédez aux stocks réels, comparez les prix et trouvez des génériques disponibles.",
    feat2Title: "Pharmacies de garde",
    feat2Desc: "Localisez les pharmacies ouvertes maintenant près de chez vous",
    feat3Title: "Scanner une ordonnance",
    feat3Desc: "IA lit votre ordonnance · Explication en Darija ou Français",
    feat4Title: "Vérifier mes médicaments",
    feat4Desc: "Entrez 2 médicaments, on vérifie les interactions en 3 secondes",
    feat5Title: "Rechercher un médicament",
    feat5Desc: "Prix AMM · Génériques · Stock proche"
  },
  ar: {
    title1: "مساعد صيدلاني **سريع** و**مجاني**",
    desc1: "خصوصيتك هي **أولويتنا**. محادثات **مجهولة تماماً**. ابحث عن **دواء** أو **صيدلية حراسة** في ثوانٍ.",
    title2: "كيف يمكنني مساعدتك؟",
    desc2: "ابحث عن دواء متوفر بالقرب منك. استشر صيدليات الحراسة واحصل على نصائح صيدلانية فورية.",
    chat1: "كيف يمكنني مساعدتك في **أدويتك** اليوم؟",
    chat2: "أبحث عن **أموكسيسيلين 500 ملغ**",
    chat3: "ما هي **صيدليات الحراسة** في الدار البيضاء؟",
    chat4: "هل هناك تفاعلات بين **دوليبارن** و **إيبوبروفين**؟",
    title3: "شبكة صيدلانية **مخصصة**",
    badge: "مخزون مباشر · صيدليات الحراسة 24/7",
    desc3: "متصل بصيدليات مدينتكم والنواحي. اطلع على المخزون الحقيقي، قارن الأسعار وجد الأدوية الجنيسة المتوفرة.",
    feat2Title: "صيدليات الحراسة",
    feat2Desc: "حدد مواقع الصيدليات المفتوحة الآن بالقرب منك",
    feat3Title: "مسح الوصفة الطبية",
    feat3Desc: "الذكاء الاصطناعي يقرأ وصفتك · شرح بالدارجة أو الفرنسية",
    feat4Title: "التحقق من أدويتي",
    feat4Desc: "أدخل دواءين، نتحقق من التفاعلات في 3 ثوانٍ",
    feat5Title: "البحث عن دواء",
    feat5Desc: "أثمنة AMM · الأدوية الجنيسة · المخزون القريب"
  }
};

export const LandingSections: React.FC<LandingSectionsProps> = ({ lang, onTriggerPharmacy, onTriggerScanner, onTriggerChecker, onTriggerSearch }) => {
  const text = t[lang];
  const isRtl = lang === 'ar';

  const renderText = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-blue-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex flex-col items-center w-full max-w-3xl mx-auto mt-20 md:mt-32 pb-12 gap-16 text-center px-4`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Section 1 */}
      <section className="flex flex-col items-center w-full pt-12 md:pt-20">
        <h2 className="text-2xl md:text-3xl font-serif text-blue-900 mb-4 leading-tight">
          {renderText(text.title1)}
        </h2>
        <p className="text-blue-700 text-sm md:text-base max-w-xl leading-relaxed mb-12">
          {renderText(text.desc1)}
        </p>
      </section>

      {/* Section 2 */}
      <section className="flex flex-col items-center w-full">
        <h2 className="text-2xl md:text-3xl font-serif text-blue-900 mb-4 leading-tight">
          {renderText(text.title2)}
        </h2>
        <p className="text-blue-700 text-sm md:text-base max-w-xl leading-relaxed mb-12">
          {renderText(text.desc2)}
        </p>

        <div className="bg-white/50 backdrop-blur-md border border-blue-50/50 rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-inner relative">
          <div className="flex flex-col gap-4">
            <div className={`bg-blue-50/30 border border-blue-50/50 rounded-xl p-4 shadow-sm max-w-[85%] rounded-es-sm self-start text-start`}>
              <p className="text-blue-900 font-medium text-sm">{renderText(text.chat1)}</p>
            </div>
            <div className={`bg-white/80 border border-blue-50/50 rounded-xl p-4 shadow-sm max-w-[85%] relative rounded-ee-sm self-end text-start`}>
              <p className="text-blue-900 font-medium text-sm">{renderText(text.chat2)}</p>
              <div className={`absolute bottom-0 w-8 h-8 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm ${isRtl ? '-right-10' : '-left-10'}`}>
                <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=100&auto=format&fit=crop" alt="User" className="w-full h-full object-cover"/>
              </div>
            </div>
            <div className={`bg-blue-50/30 border border-blue-50/50 rounded-xl p-4 shadow-sm max-w-[85%] rounded-es-sm self-start text-start`}>
              <p className="text-blue-900 font-medium text-sm">{renderText(text.chat3)}</p>
            </div>
            <div className={`bg-white/80 border border-blue-50/50 rounded-xl p-4 shadow-sm max-w-[85%] relative rounded-ee-sm self-end text-start`}>
              <p className="text-blue-900 font-medium text-sm">{renderText(text.chat4)}</p>
              <div className={`absolute bottom-0 w-8 h-8 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm ${isRtl ? '-right-10' : '-left-10'}`}>
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="User" className="w-full h-full object-cover"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="flex flex-col items-center w-full">
        <div className="flex -space-x-3 mb-6">
          <div className="w-12 h-12 rounded-full border-2 border-white bg-white/60 backdrop-blur-md flex items-center justify-center shadow-sm text-blue-500">
            <Pill className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white bg-white/60 backdrop-blur-md flex items-center justify-center shadow-sm text-emerald-500">
            <Store className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white bg-white/60 backdrop-blur-md flex items-center justify-center shadow-sm text-rose-500">
            <Activity className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white bg-white/60 backdrop-blur-md flex items-center justify-center shadow-sm text-amber-500">
            <Thermometer className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white bg-white/60 backdrop-blur-md flex items-center justify-center shadow-sm text-indigo-500">
            <Plus className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-serif text-blue-900 mb-4 leading-tight max-w-xl">
          {renderText(text.title3)}
        </h2>

        <div className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border border-blue-50/50 bg-blue-50/30 text-blue-500 text-[10px] md:text-xs font-medium mb-6 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          {renderText(text.badge)}
        </div>

        <p className="text-blue-700 text-sm md:text-base max-w-xl leading-relaxed mb-10">
          {renderText(text.desc3)}
        </p>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-sm border border-blue-50/50 text-start">
          <div className="flex flex-col gap-6">
            {/* 1. Rechercher un médicament */}
            <motion.div 
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-start gap-4 pb-6 border-b border-blue-50 cursor-pointer hover:bg-blue-50/50 transition-colors rounded-2xl -mx-2 px-2 py-2"
              onClick={onTriggerSearch}
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <Search className="w-5 h-5" />
              </div>
              <div className="text-start w-full">
                <h4 className="font-serif font-bold text-blue-900 text-base md:text-lg">{text.feat5Title}</h4>
                <p className="text-blue-600/70 text-sm md:text-base leading-relaxed">{text.feat5Desc}</p>
              </div>
            </motion.div>

            {/* 2. Pharmacies de garde */}
            <motion.div 
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-start gap-4 pb-6 border-b border-blue-50 cursor-pointer hover:bg-blue-50/50 transition-colors rounded-2xl -mx-2 px-2 py-2"
              onClick={onTriggerPharmacy}
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <Store className="w-5 h-5" />
              </div>
              <div className="text-start w-full">
                <h4 className="font-serif font-bold text-blue-900 text-base md:text-lg">{text.feat2Title}</h4>
                <p className="text-blue-600/70 text-sm md:text-base leading-relaxed">{text.feat2Desc}</p>
              </div>
            </motion.div>

            {/* 3. Scanner une ordonnance */}
            <motion.div 
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-start gap-4 pb-6 border-b border-blue-50 cursor-pointer hover:bg-blue-50/50 transition-colors rounded-2xl -mx-2 px-2 py-2"
              onClick={onTriggerScanner}
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="text-start w-full">
                <h4 className="font-serif font-bold text-blue-900 text-base md:text-lg">{text.feat3Title}</h4>
                <p className="text-blue-600/70 text-sm md:text-base leading-relaxed">{text.feat3Desc}</p>
              </div>
            </motion.div>

            {/* 4. Interactions médicaments */}
            <motion.div 
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-start gap-4 cursor-pointer hover:bg-blue-50/50 transition-colors rounded-2xl -mx-2 px-2 py-2"
              onClick={onTriggerChecker}
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <div className="flex items-center -space-x-1">
                  <Pill className="w-4 h-4" />
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                </div>
              </div>
              <div className="text-start w-full">
                <h4 className="font-serif font-bold text-blue-900 text-base md:text-lg">{text.feat4Title}</h4>
                <p className="text-blue-600/70 text-sm md:text-base leading-relaxed">{text.feat4Desc}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};
