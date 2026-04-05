import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailLink, isSignInWithEmailLink, sendSignInLinkToEmail } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  lang: 'fr' | 'ar';
  setLang: (lang: 'fr' | 'ar') => void;
}

export const Login: React.FC<LoginProps> = ({ lang, setLang }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Sign-in cancelled by user");
        return;
      }
      console.error("Google sign-in error:", error);
      setMessage({ 
        type: 'error', 
        text: lang === 'fr' 
          ? "Erreur lors de la connexion Google. Veuillez réessayer." 
          : "خطأ أثناء تسجيل الدخول بجوجل. يرجى المحاولة مرة أخرى." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setMessage({ type: 'success', text: lang === 'fr' ? "Lien de connexion envoyé à votre email." : "تم إرسال رابط تسجيل الدخول إلى بريدك الإلكتروني." });
    } catch (error) {
      console.error("Email sign-in error:", error);
      setMessage({ type: 'error', text: lang === 'fr' ? "Erreur lors de l'envoi du lien." : "خطأ أثناء إرسال الرابط." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F0F7FF]">
      {/* Language Switcher */}
      <div className="absolute top-4 left-4 z-50">
        <button 
          onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
        >
          {lang === 'fr' ? 'AR' : 'FR'}
        </button>
      </div>

      {/* Left Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden"
        >
          <div className="p-8 pb-4 text-center">
            <div className="text-4xl font-bold tracking-tighter text-blue-600 mb-8">anzar</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {lang === 'fr' ? 'Bienvenue' : 'مرحباً بك'}
            </h1>
            <p className="text-gray-500 text-sm">
              {lang === 'fr' ? 'Accédez à votre assistant pharmaceutique intelligent' : 'ادخل إلى مساعدك الصيدلاني الذكي'}
            </p>
          </div>

          <div className="p-8 pt-4 space-y-6">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              {lang === 'fr' ? 'Continuer avec Google' : 'المتابعة باستخدام جوجل'}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400 tracking-widest font-bold">
                  {lang === 'fr' ? 'OU PAR EMAIL' : 'أو عبر البريد'}
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                  {lang === 'fr' ? 'EMAIL' : 'البريد الإلكتروني'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pharmacien@exemple.ma"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {lang === 'fr' ? 'Se connecter sans mot de passe' : 'تسجيل الدخول بدون كلمة مرور'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <button className="text-xs text-blue-600 font-medium hover:underline">
                {lang === 'fr' ? 'Se connecter avec un mot de passe' : 'تسجيل الدخول بكلمة مرور'}
              </button>
            </div>

            {message && (
              <div className={`p-3 rounded-xl text-xs text-center ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {message.text}
              </div>
            )}

            <div className="pt-4 text-center">
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {lang === 'fr' ? (
                  <>En continuant, vous acceptez notre <a href="#" className="underline">Politique de confidentialité</a>.</>
                ) : (
                  <>بالمتابعة، فإنك توافق على <a href="#" className="underline">سياسة الخصوصية</a> الخاصة بنا.</>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden md:flex flex-1 bg-blue-900 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-950"></div>
          <div className="absolute top-0 right-0 w-full h-full opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.1 }} />
                  <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <path d="M0 0 L100 0 L100 100 Z" fill="url(#grad1)" />
            </svg>
          </div>
          {/* Rain-like animated lines (Anzar) */}
          <div className="absolute inset-0 flex justify-around opacity-20 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ y: -200 }}
                animate={{ y: 1000 }}
                transition={{ 
                  duration: 1.5 + Math.random() * 2, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: Math.random() * 2
                }}
                className="w-[1px] h-40 bg-gradient-to-b from-transparent via-blue-400 to-transparent"
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold leading-tight mb-12">
              Your pharmaceutical assistant, <br />
              <span className="text-blue-400">powered by AI.</span>
            </h2>
            
            <div className="space-y-10">
              <div className="space-y-3">
                <h3 className="text-2xl font-medium opacity-90">
                  Votre assistant pharmaceutique, <br />
                  propulsé par <span className="text-blue-400">AI.</span>
                </h3>
                <p className="text-blue-200 text-base leading-relaxed max-w-md">
                  Trouvez vos médicaments et pharmacies de garde au Maroc en un instant grâce à l'intelligence artificielle.
                </p>
              </div>

              <div className="space-y-3 text-right" dir="rtl">
                <h3 className="text-2xl font-medium opacity-90">
                  مساعدك الصيدلاني، <br />
                  مدعوم <span className="text-blue-400">بالذكاء الاصطناعي.</span>
                </h3>
                <p className="text-blue-200 text-base leading-relaxed max-w-md mr-auto">
                  ابحث عن أدويتك وصيدليات الحراسة في المغرب في لحظة بفضل الذكاء الاصطناعي.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <div className="w-12 h-12 rounded-full border-2 border-blue-400/30 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-blue-400 animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
