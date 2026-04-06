import React from 'react';
import { motion } from 'framer-motion';
import { Pill, AlertTriangle, CheckCircle2, Info, Stethoscope, Clock, User, Calendar, Activity, ShieldAlert, Phone, Navigation } from 'lucide-react';

export const PrescriptionCard = ({ data, lang }: { data: any, lang: 'fr' | 'ar' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-blue-100/30 overflow-hidden my-6"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 md:p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md"
          >
            <Pill className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="font-bold text-base md:text-lg leading-tight">
              {lang === 'fr' ? "Analyse de l'ordonnance" : "تحليل الوصفة الطبية"}
            </h3>
            <p className="text-[10px] md:text-xs opacity-80 font-medium">{data.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end leading-tight">
            <span className="text-xs font-bold">{data.medecin}</span>
            <span className="text-[10px] opacity-70 uppercase tracking-widest">Médecin</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <div className="p-5 md:p-8 flex flex-col gap-4 md:gap-6">
        {data.medicaments.map((med: any, idx: number) => (
          <div key={idx} className="p-4 md:p-6 bg-white/40 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-900 text-base md:text-lg group-hover:text-blue-700 transition-colors">{med.nom}</span>
              <span className="text-[10px] md:text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold uppercase tracking-wider">{med.dosage}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs md:text-sm mb-4">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <span>{med.duree}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <span>{med.posologie}</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-100/30 mb-3">
              <p className="text-xs md:text-sm text-blue-900 font-medium italic leading-relaxed">"{med.indication_simple}"</p>
            </div>
            {med.precautions && (
              <div className="flex items-start gap-2.5 text-[10px] md:text-xs text-amber-700 bg-amber-50/50 p-3 rounded-2xl border border-amber-100/50">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{med.precautions}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const AnalysisCard = ({ data, lang }: { data: any, lang: 'fr' | 'ar' }) => {
  const urgencyColors = {
    rouge: "bg-red-500 text-white border-red-600",
    orange: "bg-orange-500 text-white border-orange-600",
    verte: "bg-green-500 text-white border-green-600"
  };

  const urgencyLabels = {
    rouge: lang === 'fr' ? "URGENCE CRITIQUE" : "حالة طارئة حرجة",
    orange: lang === 'fr' ? "À SURVEILLER" : "للمراقبة",
    verte: lang === 'fr' ? "STABLE" : "مستقر"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-slate-200/30 overflow-hidden my-6"
    >
      {data.urgence === 'rouge' && (
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-5 md:p-6 text-white flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="font-bold text-base md:text-lg leading-tight">
            {lang === 'fr' ? "⚠️ CONSULTEZ LES URGENCES IMMÉDIATEMENT" : "⚠️ استشر الطوارئ فوراً"}
          </div>
        </div>
      )}
      
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg md:text-xl">{lang === 'fr' ? "Analyse Visuelle" : "التحليل البصري"}</h3>
          </div>
          <span className={`text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm ${urgencyColors[data.urgence as keyof typeof urgencyColors]}`}>
            {urgencyLabels[data.urgence as keyof typeof urgencyLabels]}
          </span>
        </div>

        <div className="space-y-6">
          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
            <h4 className="text-[10px] md:text-xs font-bold text-slate-400 mb-2 uppercase tracking-[0.2em]">{lang === 'fr' ? "Observation" : "الملاحظة"}</h4>
            <p className="text-base md:text-lg text-slate-800 leading-relaxed font-medium">{data.observation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-blue-50/50 p-5 md:p-6 rounded-2xl border border-blue-100/50 shadow-sm">
              <h4 className="text-[10px] md:text-xs font-bold text-blue-800 mb-3 uppercase tracking-[0.2em]">{lang === 'fr' ? "Hypothèses" : "الفرضيات"}</h4>
              <ul className="text-sm md:text-base text-blue-900 space-y-2 font-medium">
                {data.hypotheses.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50/50 p-5 md:p-6 rounded-2xl border border-emerald-100/50 shadow-sm">
              <h4 className="text-[10px] md:text-xs font-bold text-emerald-800 mb-3 uppercase tracking-[0.2em]">{lang === 'fr' ? "Gestes Immédiats" : "الإجراءات الفورية"}</h4>
              <ul className="text-sm md:text-base text-emerald-900 space-y-2 font-medium">
                {data.gestes_immediats.map((g: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs md:text-sm text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span>{lang === 'fr' ? "Spécialiste recommandé :" : "الأخصائي الموصى به:"} <span className="font-bold text-blue-600">{data.specialiste}</span></span>
            </div>
          </div>
        </div>
      </div>
      
      {data.disclaimer && (
        <div className="bg-gray-50 p-3 flex items-center justify-between border-t border-gray-100">
          <div className="text-[10px] text-gray-400 italic">
            {lang === 'fr' 
              ? "Ceci ne remplace pas l'avis d'un professionnel de santé." 
              : "هذا لا يحل محل رأي أخصائي الرعاية الصحية."}
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded-full border border-blue-100">
            <ShieldAlert className="w-2.5 h-2.5 text-blue-500" />
            <span className="text-[8px] font-bold text-blue-600 uppercase tracking-tighter">Verified by Anzar</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const InteractionCard = ({ data, lang }: { data: any, lang: 'fr' | 'ar' }) => {
  const verdictColors = {
    danger: "bg-red-50 border-red-200 text-red-700",
    attention: "bg-amber-50 border-amber-200 text-amber-700",
    ok: "bg-green-50 border-green-200 text-green-700"
  };

  const verdictIcons = {
    danger: <AlertTriangle className="w-6 h-6 text-red-500" />,
    attention: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    ok: <CheckCircle2 className="w-6 h-6 text-green-500" />
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-slate-200/30 overflow-hidden my-6"
    >
      <div className={`p-5 md:p-6 border-b border-white/20 flex items-center gap-4 ${verdictColors[data.verdict_global as keyof typeof verdictColors]}`}>
        <div className="w-12 h-12 rounded-2xl bg-white/40 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-sm">
          {verdictIcons[data.verdict_global as keyof typeof verdictIcons]}
        </div>
        <div>
          <h3 className="font-bold text-sm md:text-base uppercase tracking-widest">
            {lang === 'fr' ? "Verdict Global :" : "الحكم العام:"} {data.verdict_global.toUpperCase()}
          </h3>
          <p className="text-xs md:text-sm opacity-90 font-semibold leading-tight">{data.message_pharmacien}</p>
        </div>
      </div>

      <div className="p-5 md:p-8 space-y-4">
        {data.interactions && data.interactions.length > 0 ? (
          data.interactions.map((inter: any, idx: number) => (
            <div key={idx} className="flex flex-col gap-3 p-5 bg-white/40 rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm md:text-base font-bold text-slate-800">
                  <span className="text-blue-600">{inter.entre[0]}</span>
                  <span className="text-slate-300">+</span>
                  <span className="text-blue-600">{inter.entre[1]}</span>
                </div>
                <span className={`text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                  inter.niveau === 'danger' ? 'bg-red-100 text-red-600' : 
                  inter.niveau === 'attention' ? 'bg-amber-100 text-amber-600' : 
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  {inter.niveau.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{inter.explication}</p>
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                <p className="text-xs md:text-sm font-bold text-blue-700">💡 {inter.conseil}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm md:text-base text-slate-400 italic font-medium">
              {lang === 'fr' 
                ? "Aucune interaction majeure détectée." 
                : "لم يتم اكتشاف تفاعلات كبرى."}
            </p>
          </div>
        )}
      </div>

      {data.verdict_global === 'danger' && (
        <div className="p-5 md:p-8 bg-red-50/50 border-t border-red-100/50">
          <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-sm md:text-base flex items-center justify-center gap-3 shadow-xl shadow-red-200 hover:bg-red-700 transition-all active:scale-95">
            <Phone className="w-5 h-5" />
            {lang === 'fr' ? "Appeler un pharmacien" : "اتصل بصيدلي"}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export const TriageCard = ({ data, lang }: { data: any, lang: 'fr' | 'ar' }) => {
  if (data.continuer) return null;

  const verdict = data.verdict;
  const colors = {
    rouge: "bg-red-600 text-white",
    orange: "bg-orange-500 text-white",
    verte: "bg-green-500 text-white"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-slate-200/30 overflow-hidden my-6"
    >
      <div className={`p-5 md:p-6 flex items-center gap-4 ${colors[verdict.niveau as keyof typeof colors]}`}>
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-sm md:text-base uppercase tracking-widest">{lang === 'fr' ? "Verdict de Triage" : "نتيجة الفرز"}</h3>
      </div>
      <div className="p-6 md:p-10 space-y-6">
        <div>
          <p className="text-xl md:text-2xl font-bold text-slate-900 mb-4 leading-tight">{verdict.message}</p>
          <div className="p-5 md:p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold text-blue-800 uppercase tracking-[0.2em] mb-2">{lang === 'fr' ? "Action Recommandée" : "الإجراء الموصى به"}</p>
              <p className="text-base md:text-lg text-blue-900 font-semibold leading-relaxed">{verdict.action}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs md:text-sm text-slate-500 pt-4 border-t border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
            <Stethoscope className="w-4 h-4" />
          </div>
          <span>{lang === 'fr' ? "Spécialité :" : "التخصص:"} <span className="font-bold text-blue-600">{verdict.specialiste}</span></span>
        </div>
      </div>
    </motion.div>
  );
};
