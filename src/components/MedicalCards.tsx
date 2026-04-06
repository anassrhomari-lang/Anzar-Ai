import React from 'react';
import { motion } from 'framer-motion';
import { Pill, AlertTriangle, CheckCircle2, Info, Stethoscope, Clock, User, Calendar, Activity, ShieldAlert, Phone, Navigation } from 'lucide-react';

export const PrescriptionCard = ({ data, lang }: { data: any, lang: 'fr' | 'ar' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white border border-blue-100 rounded-3xl shadow-xl shadow-blue-50/50 overflow-hidden my-4"
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Pill className="w-5 h-5" />
          </motion.div>
          <h3 className="font-bold text-sm md:text-base">
            {lang === 'fr' ? "Analyse de l'ordonnance" : "تحليل الوصفة الطبية"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] opacity-80 flex flex-col items-end leading-tight">
            <span className="font-bold">{data.medecin}</span>
            <span>{data.date}</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {data.medicaments.map((med: any, idx: number) => (
          <div key={idx} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-900">{med.nom}</span>
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">{med.dosage}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div className="flex items-center gap-1.5 text-blue-700">
                <Clock className="w-3 h-3" />
                <span>{med.duree}</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-700">
                <Activity className="w-3 h-3" />
                <span>{med.posologie}</span>
              </div>
            </div>
            <p className="text-xs text-blue-800 mb-2 italic">"{med.indication_simple}"</p>
            {med.precautions && (
              <div className="flex items-start gap-1.5 text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                <span>{med.precautions}</span>
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
      className="w-full bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-100 overflow-hidden my-4"
    >
      {data.urgence === 'rouge' && (
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 text-white flex items-center gap-3 animate-pulse">
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <div className="font-bold text-sm">
            {lang === 'fr' ? "⚠️ CONSULTEZ LES URGENCES IMMÉDIATEMENT" : "⚠️ استشر الطوارئ فوراً"}
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-blue-900">{lang === 'fr' ? "Analyse Visuelle" : "التحليل البصري"}</h3>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${urgencyColors[data.urgence as keyof typeof urgencyColors]}`}>
            {urgencyLabels[data.urgence as keyof typeof urgencyLabels]}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-blue-800 mb-1 uppercase tracking-wider">{lang === 'fr' ? "Observation" : "الملاحظة"}</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{data.observation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
              <h4 className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wider">{lang === 'fr' ? "Hypothèses" : "الفرضيات"}</h4>
              <ul className="text-xs text-blue-900 space-y-1">
                {data.hypotheses.map((h: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 p-3 rounded-xl border border-green-100">
              <h4 className="text-xs font-bold text-green-800 mb-2 uppercase tracking-wider">{lang === 'fr' ? "Gestes Immédiats" : "الإجراءات الفورية"}</h4>
              <ul className="text-xs text-green-900 space-y-1">
                {data.gestes_immediats.map((g: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <User className="w-3 h-3" />
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
      className="w-full bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-100 overflow-hidden my-4"
    >
      <div className={`p-4 border-b flex items-center gap-4 ${verdictColors[data.verdict_global as keyof typeof verdictColors]}`}>
        {verdictIcons[data.verdict_global as keyof typeof verdictIcons]}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider">
            {lang === 'fr' ? "Verdict Global :" : "الحكم العام:"} {data.verdict_global.toUpperCase()}
          </h3>
          <p className="text-xs opacity-90 font-medium">{data.message_pharmacien}</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {data.interactions && data.interactions.length > 0 ? (
          data.interactions.map((inter: any, idx: number) => (
            <div key={idx} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <span className="text-blue-600">{inter.entre[0]}</span>
                  <span className="text-gray-400">+</span>
                  <span className="text-blue-600">{inter.entre[1]}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  inter.niveau === 'danger' ? 'bg-red-100 text-red-600' : 
                  inter.niveau === 'attention' ? 'bg-amber-100 text-amber-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {inter.niveau}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{inter.explication}</p>
              <p className="text-[10px] font-bold text-blue-700 mt-1">💡 {inter.conseil}</p>
            </div>
          ))
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-500 italic">
              {lang === 'fr' 
                ? "Aucune interaction majeure détectée ou médicaments non spécifiés." 
                : "لم يتم اكتشاف تفاعلات كبرى أو لم يتم تحديد الأدوية."}
            </p>
          </div>
        )}
      </div>

      {data.verdict_global === 'danger' && (
        <div className="p-4 bg-red-50 border-t border-red-100">
          <button className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-red-700 transition-colors">
            <Phone className="w-4 h-4" />
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
      className="w-full bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-gray-200 overflow-hidden my-4"
    >
      <div className={`p-4 flex items-center gap-3 ${colors[verdict.niveau as keyof typeof colors]}`}>
        <ShieldAlert className="w-6 h-6" />
        <h3 className="font-bold text-sm uppercase tracking-wider">{lang === 'fr' ? "Verdict de Triage" : "نتيجة الفرز"}</h3>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <p className="text-lg font-bold text-gray-900 mb-2">{verdict.message}</p>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
            <Navigation className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-tight mb-1">{lang === 'fr' ? "Action Recommandée" : "الإجراء الموصى به"}</p>
              <p className="text-sm text-blue-900 font-medium">{verdict.action}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Stethoscope className="w-4 h-4" />
          <span>{lang === 'fr' ? "Spécialité :" : "التخصص:"} <span className="font-bold text-blue-600">{verdict.specialiste}</span></span>
        </div>
      </div>
    </motion.div>
  );
};
