import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUp, Paperclip, Square, X, StopCircle, Mic, Pill, MapPin, Navigation, Scan, Search, Activity, Send, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Utility function for className merging
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

// Embedded CSS for minimal custom styles
const styles = `
  *:focus-visible {
    outline-offset: 0 !important;
    --ring-offset: 0 !important;
  }
  textarea::-webkit-scrollbar {
    display: none;
  }
  textarea {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Inject styles into document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex w-full rounded-md border-none bg-transparent px-3 py-3 text-base md:text-lg text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none",
      className
    )}
    ref={ref}
    rows={1}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// Tooltip Components
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border border-blue-100 bg-white px-3 py-1.5 text-sm text-blue-900 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Dialog Components
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-0 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute end-4 top-4 z-10 rounded-full bg-gray-100/80 p-2 hover:bg-gray-200 transition-all">
        <X className="h-5 w-5 text-gray-500 hover:text-gray-900" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-black hover:bg-black/80 text-white",
      outline: "border border-gray-200 bg-transparent hover:bg-gray-100",
      ghost: "bg-transparent hover:bg-gray-100",
    };
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6",
      icon: "h-8 w-8 rounded-xl aspect-[1/1]",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// VoiceRecorder Component
interface VoiceRecorderProps {
  isRecording: boolean;
  visualizerData: number[];
  lang?: 'fr' | 'ar';
}
const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  visualizerData,
  lang = 'fr',
}) => {
  const [time, setTime] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full transition-all duration-300 py-3",
        isRecording ? "opacity-100" : "opacity-0 h-0"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-sm text-blue-800">{formatTime(time)}</span>
      </div>
      <div className="w-full h-10 flex items-center justify-center gap-0.5 px-4 mb-4">
        {visualizerData.length > 0 ? (
          visualizerData.map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: "15%" }}
              animate={{ height: `${Math.max(15, v)}%` }}
              className="w-1 rounded-full bg-blue-500"
            />
          ))
        ) : (
          [...Array(32)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-2 rounded-full bg-blue-200"
            />
          ))
        )}
      </div>
      <p className="text-xs text-blue-600/60 text-center">
        {lang === 'fr' 
          ? "Parlez maintenant. Nous répondrons dans votre langue."
          : "تحدث الآن. سنجيب بلغتك."}
      </p>
    </div>
  );
};

// ImageViewDialog Component
interface ImageViewDialogProps {
  imageUrl: string | null;
  onClose: () => void;
}
const ImageViewDialog: React.FC<ImageViewDialogProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-[90vw] md:max-w-[800px]">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative bg-white rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src={imageUrl}
            alt="Full preview"
            className="w-full max-h-[80vh] object-contain rounded-2xl"
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

// PromptInput Context and Components
interface PromptInputContextType {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
}
const PromptInputContext = React.createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 120,
  onSubmit: undefined,
  disabled: false,
});
function usePromptInput() {
  const context = React.useContext(PromptInputContext);
  if (!context) throw new Error("usePromptInput must be used within a PromptInput");
  return context;
}

interface PromptInputProps {
  isLoading?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  maxHeight?: number | string;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}
const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  (
    {
      className,
      isLoading = false,
      maxHeight = 120,
      value,
      onValueChange,
      onSubmit,
      children,
      disabled = false,
      onDragOver,
      onDragLeave,
      onDrop,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const handleChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };
    return (
      <TooltipProvider>
        <PromptInputContext.Provider
          value={{
            isLoading,
            value: value ?? internalValue,
            setValue: onValueChange ?? handleChange,
            maxHeight,
            onSubmit,
            disabled,
          }}
        >
          <div
            ref={ref}
            className={cn(
              "rounded-[2.5rem] p-4 md:p-6 transition-all duration-500 relative z-0 backdrop-blur-3xl border border-white/40 shadow-2xl shadow-blue-900/10 bg-white/20",
              className
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {children}
          </div>
        </PromptInputContext.Provider>
      </TooltipProvider>
    );
  }
);
PromptInput.displayName = "PromptInput";

interface PromptInputTextareaProps {
  disableAutosize?: boolean;
  placeholder?: string;
}
const PromptInputTextarea: React.FC<PromptInputTextareaProps & React.ComponentProps<typeof Textarea>> = ({
  className,
  onKeyDown,
  disableAutosize = false,
  placeholder,
  ...props
}) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (disableAutosize || !textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn("text-sm md:text-base", className)}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  );
};

interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {}
const PromptInputActions: React.FC<PromptInputActionsProps> = ({ children, className, ...props }) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>
    {children}
  </div>
);

interface PromptInputActionProps extends React.ComponentProps<typeof Tooltip> {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}
const PromptInputAction: React.FC<PromptInputActionProps> = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}) => {
  const { disabled } = usePromptInput();
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

// Custom Divider Component
const CustomDivider: React.FC = () => (
  <div className="relative h-6 w-[1.5px] mx-1">
    <div
      className="absolute inset-0 bg-gradient-to-t from-transparent via-[#9b87f5]/70 to-transparent rounded-full"
      style={{
        clipPath: "polygon(0% 0%, 100% 0%, 100% 40%, 140% 50%, 100% 60%, 100% 100%, 0% 100%, 0% 60%, -40% 50%, 0% 40%)",
      }}
    />
  </div>
);

// Main PromptInputBox Component
interface PromptInputBoxProps {
  onSend?: (message: string, files?: File[], audioBlob?: Blob) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  lang?: 'fr' | 'ar';
  onTriggerPharmacy?: () => void;
  onTriggerScanner?: () => void;
  onTriggerChecker?: () => void;
  onTriggerSearch?: () => void;
  consentChecked?: boolean;
  onConsentChange?: (checked: boolean) => void;
}
export const PromptInputBox = React.forwardRef((props: PromptInputBoxProps, ref: React.Ref<HTMLDivElement>) => {
  const { onSend = () => {}, isLoading = false, placeholder, className, lang = 'fr', onTriggerPharmacy, onTriggerScanner, onTriggerChecker, onTriggerSearch, consentChecked = false, onConsentChange } = props;
  const [input, setInput] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [filePreviews, setFilePreviews] = React.useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const [audioStream, setAudioStream] = React.useState<MediaStream | null>(null);
  const [analyser, setAnalyser] = React.useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = React.useState<Uint8Array | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const [visualizerData, setVisualizerData] = React.useState<number[]>([]);
  const [showPharmacy, setShowPharmacy] = React.useState(false);
  const [showLocation, setShowLocation] = React.useState(false);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const promptBoxRef = React.useRef<HTMLDivElement>(null);

  const handleToggleChange = (value: string) => {
    if (value === "pharmacy") {
      setShowPharmacy((prev) => !prev);
      setShowLocation(false);
    } else if (value === "location") {
      setShowLocation((prev) => !prev);
      setShowPharmacy(false);
    }
  };

  const isImageFile = (file: File) => file.type.startsWith("image/");

  const processFile = (file: File) => {
    if (!isImageFile(file)) {
      console.log("Only image files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      console.log("File too large (max 10MB)");
      return;
    }
    setFiles([file]);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files) as File[];
    const imageFiles = files.filter((file) => isImageFile(file));
    if (imageFiles.length > 0) processFile(imageFiles[0]);
  }, []);

  const handlePaste = React.useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          processFile(file);
          break;
        }
      }
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const [shouldShake, setShouldShake] = useState(false);

  const handleSubmit = () => {
    if ((input.trim() || files.length > 0) && !consentChecked) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    if ((input.trim() || files.length > 0) && consentChecked) {
      let messagePrefix = "";
      if (showPharmacy) messagePrefix = "[Pharmacy: ";
      else if (showLocation) messagePrefix = "[Location: ";
      const formattedInput = messagePrefix ? `${messagePrefix}${input}]` : input;
      onSend(formattedInput, files);
      setInput("");
      setFiles([]);
      setFilePreviews({});
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        handleStopRecording(blob);
      };

      // Setup Analyser for sound wave animation
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 64;
      source.connect(analyserNode);
      
      setAnalyser(analyserNode);
      const bufferLength = analyserNode.frequencyBinCount;
      const data = new Uint8Array(bufferLength);
      setDataArray(data);

      const updateVisualizer = () => {
        analyserNode.getByteFrequencyData(data);
        const normalizedData = Array.from(data).map(v => (v / 255) * 100);
        setVisualizerData(normalizedData);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const handleStopRecording = (blob: Blob) => {
    onSend("Voice message", [], blob);
  };

  const hasContent = input.trim() !== "" || files.length > 0;

  return (
    <div className="flex flex-col gap-3 w-full">
      <PromptInput
        value={input}
        onValueChange={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        className={cn(
          "w-full bg-white/40 border border-white/40 shadow-inner rounded-[2rem] p-6 transition-all duration-300",
          isRecording && "bg-white/60",
          className
        )}
        disabled={isLoading || isRecording}
        ref={ref || promptBoxRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col min-h-[100px] justify-between">
          <div
            className={cn(
              "transition-all duration-300 flex-1",
              isRecording ? "h-0 overflow-hidden opacity-0" : "opacity-100"
            )}
          >
            <PromptInputTextarea
              placeholder={
                showPharmacy
                  ? (lang === 'fr' ? "Trouver une pharmacie de garde" : "البحث عن صيدلية حراسة")
                  : showLocation
                  ? (lang === 'fr' ? "Trouver un médecin spécialiste" : "البحث عن طبيب متخصص")
                  : placeholder || (lang === 'fr' ? "Décrivez vos symptômes ou posez une question..." : "صف الأعراض أو اطرح سؤالاً...")
              }
              className="text-base md:text-xl bg-transparent px-2 min-h-[50px] font-medium"
            />
          </div>

          {isRecording && (
            <VoiceRecorder
              isRecording={isRecording}
              visualizerData={visualizerData}
              lang={lang}
            />
          )}

          <div className="flex items-center justify-between mt-4 px-1">
            <div className="flex items-center gap-2 md:gap-3">
              <PromptInputAction tooltip={lang === 'fr' ? "Scanner une ordonnance (IA)" : "مسح الوصفة (ذكاء اصطناعي)"}>
                <button 
                  onClick={onTriggerScanner} 
                  className="flex items-center gap-3 h-12 md:h-14 px-6 md:px-8 bg-blue-50/50 text-[#00356B] rounded-2xl hover:bg-blue-100/50 transition-all text-[11px] md:text-xs font-bold border border-blue-100/50 shadow-sm active:scale-95"
                >
                  <Camera className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="hidden sm:inline">{lang === 'fr' ? "Scanner" : "مسح"}</span>
                </button>
              </PromptInputAction>

              <PromptInputAction tooltip={lang === 'fr' ? "Rechercher un médicament" : "البحث عن دواء"}>
                <button 
                  onClick={onTriggerSearch} 
                  className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-blue-50/50 text-[#00356B] rounded-2xl hover:bg-blue-100/50 transition-all border border-blue-100/50 shadow-sm active:scale-95"
                >
                  <Pill className="h-6 w-6 md:h-7 md:w-7" />
                </button>
              </PromptInputAction>

              <PromptInputAction tooltip={lang === 'fr' ? "Joindre un document" : "إرفاق مستند"}>
                <button 
                  onClick={() => uploadInputRef.current?.click()} 
                  className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-blue-50/50 text-[#00356B] rounded-2xl hover:bg-blue-100/50 transition-all border border-blue-100/50 shadow-sm active:scale-95"
                >
                  <Paperclip className="h-6 w-6 md:h-7 md:w-7" />
                  <input ref={uploadInputRef} type="file" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
                    if (e.target) e.target.value = "";
                  }} accept="image/*" />
                </button>
              </PromptInputAction>

              <PromptInputAction tooltip={lang === 'fr' ? "Pharmacies à proximité" : "الصيدليات القريبة"}>
                <button
                  onClick={() => {
                    if (onTriggerPharmacy) onTriggerPharmacy();
                    handleToggleChange("pharmacy");
                  }}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl transition-all border shadow-sm active:scale-95",
                    showPharmacy 
                      ? "bg-[#00356B] text-white border-[#00356B] shadow-lg shadow-blue-900/20" 
                      : "bg-blue-50/50 text-[#00356B] border border-blue-100/50 hover:bg-blue-100/50"
                  )}
                >
                  <MapPin className="h-6 w-6 md:h-7 md:w-7" />
                </button>
              </PromptInputAction>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <PromptInputAction tooltip={lang === 'fr' ? "Message vocal" : "رسالة صوتية"}>
                <button
                  onClick={() => isRecording ? stopRecording() : startRecording()}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl transition-all border shadow-sm active:scale-95",
                    isRecording 
                      ? "bg-red-500 text-white border-red-500 animate-pulse shadow-lg shadow-red-500/20" 
                      : "bg-blue-50/50 text-[#00356B] border border-blue-100/50 hover:bg-blue-100/50"
                  )}
                >
                  {isRecording ? <StopCircle className="h-6 w-6 md:h-7 md:w-7" /> : <Mic className="h-6 w-6 md:h-7 md:w-7" />}
                </button>
              </PromptInputAction>

              <PromptInputAction tooltip={lang === 'fr' ? "Envoyer" : "إرسال"}>
                <button
                  onClick={handleSubmit}
                  disabled={!hasContent || !consentChecked || isLoading}
                  className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all border shadow-sm active:scale-95",
                    hasContent && consentChecked 
                      ? "bg-[#00356B] text-white border-[#00356B] shadow-xl shadow-blue-900/20" 
                      : "bg-gray-50/50 text-gray-300 border-gray-100 cursor-not-allowed"
                  )}
                >
                  <Send className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </PromptInputAction>
            </div>
          </div>
        </div>
      </PromptInput>

      <motion.div 
        animate={shouldShake ? { x: [-2, 2, -2, 2, 0] } : {}}
        className="flex items-center gap-2 px-4"
      >
        <input 
          type="checkbox" 
          id="consent" 
          checked={consentChecked}
          onChange={(e) => onConsentChange?.(e.target.checked)}
          className={cn(
            "w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 transition-all",
            shouldShake && "border-red-400 ring-2 ring-red-100"
          )}
        />
        <label htmlFor="consent" className={cn(
          "text-[10px] md:text-xs cursor-pointer select-none transition-colors",
          shouldShake ? "text-red-500 font-bold" : "text-blue-400"
        )}>
          {lang === 'fr' 
            ? "Je comprends que mes données ne sont ni partagées ni stockées."
            : "أفهم أن بياناتي لا يتم مشاركتها ولا تخزينها."}
        </label>
      </motion.div>

      <ImageViewDialog imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
});
PromptInputBox.displayName = "PromptInputBox";
