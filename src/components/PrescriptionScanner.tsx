import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Loader2, Check, AlertCircle, RefreshCw, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

interface PrescriptionScannerProps {
  onClose: () => void;
  onScanComplete: (details: string) => void;
  lang: 'fr' | 'ar';
}

export const PrescriptionScanner: React.FC<PrescriptionScannerProps> = ({ onClose, onScanComplete, lang }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(lang === 'fr' ? "Impossible d'accéder à la caméra. Veuillez vérifier les permissions." : "تعذر الوصول إلى الكاميرا. يرجى التحقق من الأذونات.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const captureAndProcess = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    setError(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = lang === 'fr' 
          ? "Analyse cette ordonnance médicale. Pour chaque médicament détecté, affiche les informations suivantes en français :\n- Nom commercial\n- Nom générique\n- Posologie (dosage et fréquence)\n- Effets secondaires fréquents\n- Interactions courantes\nRéponds de manière claire et structurée pour un patient."
          : "حلل هذه الوصفة الطبية. لكل دواء يتم اكتشافه، اعرض المعلومات التالية باللغة العربية:\n- الاسم التجاري\n- الاسم العلمي (الجنيس)\n- الجرعة (الكمية والتكرار)\n- الآثار الجانبية الشائعة\n- التفاعلات الشائعة\nأجب بطريقة واضحة ومنظمة للمريض.";

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { mimeType: "image/jpeg", data: base64Image } }
              ]
            }
          ]
        });

        const result = response.text;
        if (result) {
          onScanComplete(result);
          onClose();
        } else {
          throw new Error("Empty response from AI");
        }
      } catch (err) {
        console.error("Error processing prescription:", err);
        setError(lang === 'fr' ? "Erreur lors de l'analyse de l'ordonnance. Veuillez réessayer." : "خطأ أثناء تحليل الوصفة الطبية. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsScanning(false);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4"
    >
      <div className="absolute top-4 right-4 z-[110]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="relative w-full max-w-md aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {isCameraActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="text-sm font-medium">{lang === 'fr' ? 'Initialisation de la caméra...' : 'جاري تشغيل الكاميرا...'}</p>
          </div>
        )}

        {/* Scanning Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-8 border-2 border-blue-400/50 rounded-2xl">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
            
            {isScanning && (
              <motion.div 
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
              />
            )}
          </div>
        </div>

        {error && (
          <div className="absolute inset-x-4 bottom-20 p-4 bg-red-500/90 backdrop-blur-md rounded-2xl text-white text-sm flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center space-y-6 w-full max-w-md">
        <p className="text-white/70 text-center text-sm px-8">
          {lang === 'fr' 
            ? "Placez l'ordonnance dans le cadre et assurez-vous que le texte est bien lisible." 
            : "ضع الوصفة الطبية داخل الإطار وتأكد من أن النص واضح ومقروء."}
        </p>

        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startCamera}
            className="p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!isCameraActive || isScanning}
            onClick={captureAndProcess}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${
              isScanning ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'
            }`}
          >
            {isScanning ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : (
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full" />
              </div>
            )}
          </motion.button>

          <div className="w-14" /> {/* Spacer */}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
};
