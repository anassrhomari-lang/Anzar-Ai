import React from 'react';
import { motion } from 'framer-motion';
import { X, Shield, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
  lang: 'fr' | 'ar';
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose, lang }) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[210] bg-white rounded-t-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />

        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="font-serif font-bold text-blue-900 text-xl">
              {lang === 'fr' ? "Politique de Confidentialité" : "سياسة الخصوصية"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 prose prose-sm max-w-none prose-blue">
          {lang === 'fr' ? (
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="font-bold text-blue-800">Version 1.0 — Entrée en vigueur : 5 avril 2026</p>
              
              <p>
                La présente Politique de Confidentialité décrit la manière dont <strong>Doctify Maroc</strong> (« nous », « notre ») collecte, utilise et protège vos informations personnelles lorsque vous utilisez l'application <strong>Anzar</strong>, dans son module dédié aux services pharmaceutiques. Nous nous engageons à traiter vos données conformément à la Loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.
              </p>

              <h4 className="text-blue-900 font-bold flex items-center gap-2">
                <FileText className="w-4 h-4" /> 1. Responsable du Traitement
              </h4>
              <p>
                Raison sociale : Doctify Maroc (RadAI)<br />
                Siège social : Casablanca, Maroc<br />
                Contact DPO : privacy@anzar.ma
              </p>

              <h4 className="text-blue-900 font-bold flex items-center gap-2">
                <Eye className="w-4 h-4" /> 2. Données Collectées
              </h4>
              <div className="space-y-3">
                <p><strong>2.1 Données de localisation :</strong> Avec votre consentement, nous collectons votre position uniquement pour identifier les pharmacies à proximité. Votre position n'est <strong>jamais stockée</strong> sur nos serveurs.</p>
                <p><strong>2.2 Données de santé :</strong> Vos requêtes (symptômes, médicaments) sont traitées en temps réel par notre IA. Ces échanges sont <strong>éphémères</strong> et supprimés en fin de session.</p>
                <p><strong>2.3 Données techniques :</strong> Nous collectons des données anonymisées (type de navigateur, erreurs) pour améliorer le service.</p>
              </div>

              <h4 className="text-blue-900 font-bold flex items-center gap-2">
                <Lock className="w-4 h-4" /> 3. Base Légale et Conservation
              </h4>
              <p>
                Le traitement repose sur votre <strong>consentement</strong> et l'exécution du service. Nous appliquons le principe de minimisation : les données de localisation et de chat sont supprimées immédiatement après usage ou en fin de session.
              </p>

              <h4 className="text-blue-900 font-bold flex items-center gap-2">
                <Shield className="w-4 h-4" /> 4. Partage et Sécurité
              </h4>
              <p>
                Nous partageons des données anonymisées uniquement avec des tiers techniques (Google Maps, Overpass API). Nous ne vendons <strong>jamais</strong> vos données à des régies publicitaires ou laboratoires.
              </p>

              <h4 className="text-blue-900 font-bold">5. Vos Droits</h4>
              <p>
                Conformément à la Loi 09-08, vous disposez d'un droit d'accès, de rectification et de suppression. Contactez-nous à privacy@anzar.ma.
              </p>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-xs italic">
                Note : Anzar utilise le stockage de session (sessionStorage) pour mémoriser temporairement vos préférences. Aucune base de données de profils patients n'est constituée.
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-gray-700 leading-relaxed text-right">
              <p className="font-bold text-blue-800">الإصدار 1.0 — ساري المفعول من: 5 أبريل 2026</p>
              
              <p>
                تصف سياسة الخصوصية هذه الطريقة التي تقوم بها <strong>Doctify Maroc</strong> («نحن»، «خاصتنا») بجمع واستخدام وحماية معلوماتك الشخصية عند استخدام تطبيق <strong>Anzar</strong>. نحن ملتزمون بمعالجة بياناتك وفقاً للقانون رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي.
              </p>

              <h4 className="text-blue-900 font-bold flex items-center gap-2">
                <FileText className="w-4 h-4" /> 1. المسؤول عن المعالجة
              </h4>
              <p>
                الاسم التجاري: Doctify Maroc (RadAI)<br />
                المقر الاجتماعي: الدار البيضاء، المغرب<br />
                الاتصال بمسؤول حماية البيانات: privacy@anzar.ma
              </p>

              <h4 className="text-blue-900 font-bold flex items-center gap-2">
                <Eye className="w-4 h-4" /> 2. البيانات التي يتم جمعها
              </h4>
              <div className="space-y-3">
                <p><strong>2.1 بيانات الموقع:</strong> بموافقتك، نجمع موقعك فقط لتحديد الصيدليات القريبة. موقعك <strong>لا يتم تخزينه أبداً</strong> على خوادمنا.</p>
                <p><strong>2.2 البيانات الصحية:</strong> تتم معالجة طلباتك (الأعراض، الأدوية) في الوقت الفعلي بواسطة ذكائنا الاصطناعي. هذه المحادثات <strong>مؤقتة</strong> ويتم حذفها في نهاية الجلسة.</p>
                <p><strong>2.3 البيانات التقنية:</strong> نجمع بيانات مجهولة المصدر (نوع المتصفح، الأخطاء) لتحسين الخدمة.</p>
              </div>

              <h4 className="text-blue-900 font-bold flex items-center gap-2">
                <Lock className="w-4 h-4" /> 3. الأساس القانوني والاحتفاظ
              </h4>
              <p>
                تعتمد المعالجة على <strong>موافقتك</strong> وتنفيذ الخدمة. نحن نطبق مبدأ التقليل من البيانات: يتم حذف بيانات الموقع والمحادثات فوراً بعد الاستخدام أو في نهاية الجلسة.
              </p>

              <h4 className="text-blue-900 font-bold flex items-center gap-2">
                <Shield className="w-4 h-4" /> 4. المشاركة والأمان
              </h4>
              <p>
                نشارك بيانات مجهولة المصدر فقط مع أطراف تقنية (Google Maps، Overpass API). نحن <strong>لا نبيع</strong> بياناتك أبداً لوكالات الإعلان أو المختبرات.
              </p>

              <h4 className="text-blue-900 font-bold">5. حقوقك</h4>
              <p>
                وفقاً للقانون 09-08، لديك الحق في الوصول والتصحيح والحذف. اتصل بنا على privacy@anzar.ma.
              </p>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-xs italic">
                ملاحظة: يستخدم Anzar تخزين الجلسة (sessionStorage) لتذكر تفضيلاتك مؤقتاً. لا يتم إنشاء أي قاعدة بيانات لملفات تعريف المرضى.
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};
