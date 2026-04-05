import React from 'react';
import { Sparkles, Pill, ClipboardList, Store, Heart, Diamond, Activity, Thermometer, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingSectionsProps {
  lang: 'fr' | 'ar';
  onTriggerPharmacy?: () => void;
  onTriggerScanner?: () => void;
}

const t = {
  fr: {
    title1: "Assistant pharmaceutique **rapide** et **gratuit**",
    desc1: "Votre vie privée est notre **priorité**. Échanges **100% anonymes**. Trouvez un **médicament** ou une **pharmacie de garde** en quelques secondes.",
    title2: "Comment puis-je vous aider ?",
    desc2: "Trouvez un médicament en stock près de chez vous. Consultez les pharmacies de garde et obtenez des conseils pharmaceutiques instantanés.",
    chat1: "Comment puis-je vous aider avec vos **médicaments** aujourd'hui ?",
    chat2: "Je cherche de l'**Amoxicilline 500mg**",
    title3: "Un réseau pharmaceutique **sur mesure**",
    badge: "Stock en temps réel · Pharmacies de garde 24h/7j",
    desc3: "Connecté aux pharmacies de votre ville et alentours. Accédez aux stocks réels, comparez les prix et trouvez des génériques disponibles.",
    feat1Title: "Recherche de médicaments",
    feat1Desc: "Vérifiez la disponibilité en temps réel dans les pharmacies proches",
    feat2Title: "Pharmacies de garde",
    feat2Desc: "Localisez les pharmacies ouvertes maintenant près de chez vous",
    feat3Title: "Gestion d'ordonnance",
    feat3Desc: "Scannez votre ordonnance et préparez votre commande à l'avance"
  },
  ar: {
    title1: "مساعد صيدلاني **سريع** و**مجاني**",
    desc1: "خصوصيتك هي **أولويتنا**. محادثات **مجهولة تماماً**. ابحث عن **دواء** أو **صيدلية حراسة** في ثوانٍ.",
    title2: "كيف يمكنني مساعدتك؟",
    desc2: "ابحث عن دواء متوفر بالقرب منك. استشر صيدليات الحراسة واحصل على نصائح صيدلانية فورية.",
    chat1: "كيف يمكنني مساعدتك في **أدويتك** اليوم؟",
    chat2: "أبحث عن **أموكسيسيلين 500 ملغ**",
    title3: "شبكة صيدلانية **مخصصة**",
    badge: "مخزون مباشر · صيدليات الحراسة 24/7",
    desc3: "متصل بصيدليات مدينتكم والنواحي. اطلع على المخزون الحقيقي، قارن الأسعار وجد الأدوية الجنيسة المتوفرة.",
    feat1Title: "البحث عن الأدوية",
    feat1Desc: "تحقق من توفر الأدوية في الوقت الفعلي في الصيدليات القريبة",
    feat2Title: "صيدليات الحراسة",
    feat2Desc: "حدد مواقع الصيدليات المفتوحة الآن بالقرب منك",
    feat3Title: "إدارة الوصفات الطبية",
    feat3Desc: "امسح وصفتك الطبية ضوئياً وحضر طلبيتك مسبقاً"
  }
};

export const LandingSections: React.FC<LandingSectionsProps> = ({ lang, onTriggerPharmacy, onTriggerScanner }) => {
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
    <div className={`flex flex-col items-center w-full max-w-3xl mx-auto mt-20 pb-12 gap-20 text-center px-4`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Section 1 */}
      <section className="flex flex-col items-center w-full">
        {/* Branding - Moved to top as requested */}
        <div className="relative w-full max-w-2xl mx-auto py-6 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                <Heart className="w-14 h-14 text-red-500 fill-red-500 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
              </div>
              <h1 className="text-6xl font-medium tracking-tight flex items-start text-blue-900">
                Anzar<span className="text-blue-600 text-2xl font-bold ml-0.5 mt-1">AI</span>
              </h1>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 px-6 py-2 bg-white/60 backdrop-blur-md shadow-sm border border-blue-100 rounded-full flex items-center gap-2 transform transition-transform cursor-default"
            >
              <Diamond className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-blue-600">
                {lang === 'fr' ? 'Portail Patient' : 'بوابة المريض'}
              </span>
            </motion.div>
          </div>
          
          {/* Subtle decorative background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
        </div>

        <h2 className="text-2xl md:text-3xl font-serif text-blue-900 mb-4 leading-tight mt-8">
          {renderText(text.title1)}
        </h2>
        <p className="text-blue-700 text-base max-w-xl leading-relaxed mb-12">
          {renderText(text.desc1)}
        </p>
      </section>

      {/* Section 2 */}
      <section className="flex flex-col items-center w-full">
        <h2 className="text-2xl md:text-3xl font-serif text-blue-900 mb-4 leading-tight">
          {renderText(text.title2)}
        </h2>
        <p className="text-blue-700 text-base max-w-xl leading-relaxed mb-12">
          {renderText(text.desc2)}
        </p>

        <div className="bg-white/40 backdrop-blur-md border border-blue-100 rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-inner relative">
          <div className="flex flex-col gap-4">
            <div className={`bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm max-w-[85%] rounded-es-sm self-start text-start`}>
              <p className="text-blue-900 font-medium text-sm">{renderText(text.chat1)}</p>
            </div>
            <div className={`bg-white border border-blue-100 rounded-2xl p-4 shadow-sm max-w-[85%] relative rounded-ee-sm self-end text-start`}>
              <p className="text-blue-900 font-medium text-sm">{renderText(text.chat2)}</p>
              <div className={`absolute bottom-0 w-8 h-8 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm ${isRtl ? '-right-10' : '-left-10'}`}>
                <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=100&auto=format&fit=crop" alt="User" className="w-full h-full object-cover"/>
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

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-xs font-medium mb-6 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          {renderText(text.badge)}
        </div>

        <p className="text-blue-700 text-base max-w-xl leading-relaxed mb-10">
          {renderText(text.desc3)}
        </p>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 w-full max-w-xl shadow-sm border border-blue-100 text-start">
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4 pb-5 border-b border-blue-50">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <Pill className="w-4 h-4" />
              </div>
              <div className="text-start w-full">
                <h4 className="font-semibold text-blue-900 text-base">{text.feat1Title}</h4>
                <p className="text-blue-600/70 text-sm">{text.feat1Desc}</p>
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-start gap-4 pb-5 border-b border-blue-50 cursor-pointer hover:bg-blue-50/50 transition-colors rounded-xl -mx-2 px-2"
              onClick={onTriggerPharmacy}
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <Store className="w-4 h-4" />
              </div>
              <div className="text-start w-full">
                <h4 className="font-semibold text-blue-900 text-base">{text.feat2Title}</h4>
                <p className="text-blue-600/70 text-sm">{text.feat2Desc}</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-start gap-4 cursor-pointer hover:bg-blue-50/50 transition-colors rounded-xl -mx-2 px-2 py-2"
              onClick={onTriggerScanner}
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <ClipboardList className="w-4 h-4" />
              </div>
              <div className="text-start w-full">
                <h4 className="font-semibold text-blue-900 text-base">{text.feat3Title}</h4>
                <p className="text-blue-600/70 text-sm">{text.feat3Desc}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};
