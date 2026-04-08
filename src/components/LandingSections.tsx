import React from 'react';
import { Sparkles, Pill, ClipboardList, Store, Heart, Diamond, Activity, Thermometer, Plus, Search, AlertCircle, Bot } from 'lucide-react';
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
    title1: "ANZAR AI",
    desc1: "Votre vie privée est notre **priorité**. Échanges **100% anonymes**. Trouvez un **médicament** ou une **pharmacie de garde** en quelques secondes.",
    title2: "Comment puis-je vous aider ?",
    desc2: "Trouvez un médicament en stock près de chez vous. Consultez les pharmacies de garde et obtenez des conseils pharmaceutiques instantanés.",
    chat1: "Comment puis-je vous aider avec vos **médicaments** aujourd'hui ?",
    chat2: "Je cherche de l'**Amoxicilline 500mg**",
    chat2_res: "L'**Amoxicilline 500mg** est disponible à la **Pharmacie Centrale** (ouverte). Voulez-vous voir d'autres options ?",
    chat3: "Quelles sont les **pharmacies de garde** à Casablanca ?",
    chat3_res: "Il y a **12 pharmacies de garde** ouvertes à Casablanca en ce moment. Voici la liste...",
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
    title1: "ANZAR AI",
    desc1: "خصوصيتك هي **أولويتنا**. محادثات **مجهولة تماماً**. ابحث عن **دواء** أو **صيدلية حراسة** في ثوانٍ.",
    title2: "كيف يمكنني مساعدتك؟",
    desc2: "ابحث عن دواء متوفر بالقرب منك. استشر صيدليات الحراسة واحصل على نصائح صيدلانية فورية.",
    chat1: "كيف يمكنني مساعدتك في **أدويتك** اليوم؟",
    chat2: "أبحث عن **أموكسيسيلين 500 ملغ**",
    chat2_res: "**أموكسيسيلين 500 ملغ** متوفر في **الصيدلية المركزية** (مفتوحة). هل تريد رؤية خيارات أخرى؟",
    chat3: "ما هي **صيدليات الحراسة** في الدار البيضاء؟",
    chat3_res: "هناك **12 صيدلية حراسة** مفتوحة في الدار البيضاء الآن. إليك القائمة...",
    chat4: "هل هناك تفاعلات entre **دوليبارن** و **إيبوبروفين**؟",
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

  const renderText = (str: string, strongClassName: string = "text-blue-900") => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className={`font-bold ${strongClassName}`}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex flex-col items-center w-full max-w-5xl mx-auto mt-8 md:mt-16 pb-32 gap-20 md:gap-32 text-center px-4 md:px-8`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Section 1: Hero-like intro */}
      <section className="flex flex-col items-center w-full pt-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/40 backdrop-blur-2xl text-[#00356B] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-12 border border-white/40 shadow-2xl shadow-blue-900/5"
        >
          <img 
            src="https://framerusercontent.com/images/YPAzIjoMNrFadoMFFkX13J0nXrs.png?scale-down-to=512&width=3432&height=3432" 
            alt="AnzarAI Logo" 
            className="w-6 h-6 md:w-8 md:h-8 object-contain"
            referrerPolicy="no-referrer"
          />
          {lang === 'fr' ? "Intelligence Artificielle Médicale" : "الذكاء الاصطناعي الطبي"}
        </motion.div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-[1.05] tracking-tight">
          {renderText(text.title1)}
        </h2>
        <p className="text-slate-500 text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed mb-10 font-medium">
          {renderText(text.desc1)}
        </p>
      </section>

      {/* Section 2: Chat Experience */}
      <section className="flex flex-col items-center w-full max-w-5xl">
        <div className="bg-white/30 backdrop-blur-3xl border border-white/30 rounded-[3rem] p-10 md:p-20 w-full shadow-2xl shadow-blue-900/10 relative overflow-hidden group">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,53,107,0.05),transparent)] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00356B 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#00356B]/20 to-transparent animate-pulse" />
          
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute bottom-4 right-6 opacity-10 pointer-events-none select-none">
            <span className="text-2xl font-black tracking-tighter text-[#00356B]">ANZAR</span>
          </div>

          <div className="flex flex-col gap-10 relative z-10">
            {/* Message 1: Bot */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-end gap-4 self-start max-w-[90%] md:max-w-[75%]"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#00356B] flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20 border border-white/20">
                <Bot className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="bg-white/60 backdrop-blur-2xl border border-white/60 rounded-[2rem] rounded-bl-none p-6 md:p-8 shadow-xl shadow-blue-900/5 text-start relative group/msg">
                  <p className="text-slate-800 font-semibold text-base md:text-lg leading-relaxed">{renderText(text.chat1)}</p>
                  <div className="absolute -bottom-6 left-2 flex items-center gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anzar AI · 10:24</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Message 2: User */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-end gap-4 self-end max-w-[90%] md:max-w-[75%] flex-row-reverse"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border-2 border-white shadow-xl shrink-0">
                <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=100&auto=format&fit=crop" alt="User" className="w-full h-full object-cover"/>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <div className="bg-[#00356B] border border-white/10 rounded-[2rem] rounded-br-none p-6 md:p-8 shadow-2xl shadow-blue-900/20 text-start relative group/msg">
                  <p className="text-white font-bold text-base md:text-lg leading-relaxed">{renderText(text.chat2, "text-blue-200")}</p>
                  <div className="absolute -bottom-6 right-2 flex items-center gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest">Vous · 10:25</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Message 3: Bot Response */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-end gap-4 self-start max-w-[90%] md:max-w-[75%]"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#00356B] flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20 border border-white/20">
                <Bot className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="bg-white/80 backdrop-blur-3xl border border-white/80 rounded-[2rem] rounded-bl-none p-6 md:p-8 shadow-xl shadow-blue-900/5 text-start relative group/msg">
                  <p className="text-slate-800 font-semibold text-base md:text-lg leading-relaxed">{renderText(text.chat2_res)}</p>
                  <div className="absolute -bottom-6 left-2 flex items-center gap-2 opacity-40">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anzar AI · 10:25</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Message 4: User Question 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex items-end gap-4 self-end max-w-[90%] md:max-w-[75%] flex-row-reverse"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border-2 border-white shadow-xl shrink-0">
                <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=100&auto=format&fit=crop" alt="User" className="w-full h-full object-cover"/>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <div className="bg-[#00356B] border border-white/10 rounded-[2rem] rounded-br-none p-6 md:p-8 shadow-2xl shadow-blue-900/20 text-start relative group/msg">
                  <p className="text-white font-bold text-base md:text-lg leading-relaxed">{renderText(text.chat3, "text-blue-200")}</p>
                  <div className="absolute -bottom-6 right-2 flex items-center gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest">Vous · 10:26</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Message 5: Bot Response 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="flex items-end gap-4 self-start max-w-[90%] md:max-w-[75%]"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#00356B] flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20 border border-white/20">
                <Bot className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="bg-white/80 backdrop-blur-3xl border border-white/80 rounded-[2rem] rounded-bl-none p-6 md:p-8 shadow-xl shadow-blue-900/5 text-start relative group/msg">
                  <p className="text-slate-800 font-semibold text-base md:text-lg leading-relaxed">{renderText(text.chat3_res)}</p>
                  <div className="absolute -bottom-6 left-2 flex items-center gap-2 opacity-40">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anzar AI · 10:26</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Typing Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-2 ml-16"
            >
              <div className="flex gap-1">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              </div>
              <span className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest">
                {lang === 'fr' ? "Anzar écrit..." : "أنزار يكتب..."}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="flex flex-col items-center w-full max-w-4xl">
        <div className="flex -space-x-4 md:-space-x-6 mb-12">
          {[Pill, Store, Activity, Thermometer, Plus].map((Icon, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20, rotate: -10 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ y: -10, scale: 1.1, zIndex: 10 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-3xl border-4 border-white bg-white/80 backdrop-blur-md flex items-center justify-center shadow-xl text-blue-600 cursor-pointer transition-all"
            >
              <Icon className="w-8 h-8 md:w-10 md:h-10" />
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-[1.1] max-w-3xl">
          {renderText(text.title3)}
        </h2>

        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-blue-100 bg-blue-50/50 text-blue-600 text-xs md:text-sm font-bold mb-10 shadow-sm backdrop-blur-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          {renderText(text.badge)}
        </div>

        <p className="text-slate-500 text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed mb-16 font-medium">
          {renderText(text.desc3)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {[
            { icon: Search, title: text.feat5Title, desc: text.feat5Desc, trigger: onTriggerSearch, color: 'blue' },
            { icon: Store, title: text.feat2Title, desc: text.feat2Desc, trigger: onTriggerPharmacy, color: 'emerald' },
            { icon: ClipboardList, title: text.feat3Title, desc: text.feat3Desc, trigger: onTriggerScanner, color: 'violet' },
            { icon: Activity, title: text.feat4Title, desc: text.feat4Desc, trigger: onTriggerChecker, color: 'indigo' }
          ].map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-start gap-6 p-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm hover:shadow-2xl transition-all cursor-pointer text-start group"
              onClick={feat.trigger}
            >
              <div className={`w-14 h-14 rounded-2xl bg-${feat.color}-50 text-${feat.color}-600 flex items-center justify-center group-hover:bg-${feat.color}-600 group-hover:text-white transition-all duration-500 shadow-sm`}>
                <feat.icon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xl md:text-2xl mb-2 group-hover:text-blue-900 transition-colors">{feat.title}</h4>
                <p className="text-slate-500 text-base md:text-lg leading-relaxed group-hover:text-slate-600 transition-colors">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};
