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
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MEDIA_DEVICES_NOT_SUPPORTED");
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' } } 
      });
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      if (err.message === "MEDIA_DEVICES_NOT_SUPPORTED") {
        setError(lang === 'fr' ? "Votre navigateur ne supporte pas l'accès à la caméra." : "متصفحك لا يدعم الوصول إلى الكاميرا.");
      } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError(lang === 'fr' ? "Accès à la caméra refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur." : "تم رفض الوصول إلى الكاميرا. يرجى السماح بالوصول في إعدادات المتصفح.");
      } else {
        setError(lang === 'fr' ? "Impossible d'accéder à la caméra. Veuillez vérifier les permissions." : "تعذر الوصول إلى الكاميرا. يرجى التحقق من الأذونات.");
      }
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

  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  const [showFlash, setShowFlash] = useState(false);

  const captureAndProcess = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);

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
        const prompt = `Tu es un pharmacien marocain expert. Lis cette ordonnance et retourne un JSON. Réponds UNIQUEMENT en JSON. Langue de réponse: ${lang === 'fr' ? 'français' : 'arabe'}.
        Format JSON attendu:
        {
          "medicaments": [
            {
              "nom": "...",
              "dosage": "...",
              "duree": "...",
              "posologie": "...",
              "indication_simple": "à quoi ça sert en 1 phrase",
              "precautions": "..."
            }
          ],
          "medecin": "...",
          "date": "..."
        }`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { mimeType: "image/jpeg", data: base64Image } }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
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
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="fixed bottom-0 left-0 right-0 z-[110] bg-[#0A0A0A] rounded-t-[3rem] shadow-2xl border-t border-white/10 max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-4 mb-2 shrink-0" />

        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-blue-400" />
            <h3 className="font-serif font-bold text-white text-lg">
              {lang === 'fr' ? "Scanner l'ordonnance" : "مسح الوصفة الطبية"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors shadow-sm"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col items-center p-6 gap-8">
          <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
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

            {/* Flash Effect */}
            <AnimatePresence>
              {showFlash && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white z-50"
                />
              )}
            </AnimatePresence>

            {/* Scanning Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-8 border-2 border-blue-400/50 rounded-3xl">
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
              <div className="absolute inset-x-4 bottom-4 p-4 bg-red-500/90 backdrop-blur-md rounded-3xl text-white text-sm flex items-start gap-3 shadow-lg">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center space-y-8 w-full max-w-md pb-8">
            <p className="text-white/60 text-center text-sm px-8 leading-relaxed font-medium">
              {lang === 'fr' 
                ? "Placez l'ordonnance dans le cadre. Notre IA analysera chaque médicament pour vous donner des explications claires." 
                : "ضع الوصفة الطبية داخل الإطار. سيقوم الذكاء الاصطناعي لدينا بتحليل كل دواء ليعطيك تفسيرات واضحة."}
            </p>

            <div className="flex items-center gap-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="p-5 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors border border-white/5"
              >
                <RefreshCw className="w-7 h-7" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={!isCameraActive || isScanning}
                onClick={captureAndProcess}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                  isScanning ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'
                }`}
              >
                {isScanning ? (
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                ) : (
                  <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-inner" />
                  </div>
                )}
              </motion.button>

              <div className="w-16" /> {/* Spacer */}
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </>
  );
};
