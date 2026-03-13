import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

export interface FlashItem {
  type?: "success" | "error" | "info";
  message: string;
  duration?: number;
}

interface FlashMessageProps {
  messages?: FlashItem[];
  defaultDuration?: number; // duración por defecto (ms)
}

export default function FlashMessage({
  messages = [],
  defaultDuration = 5000,
}: FlashMessageProps) {
  const [visibleMessages, setVisibleMessages] = useState<FlashItem[]>(messages);

  // Sincronizar nuevos mensajes
  useEffect(() => {
    if (messages.length > 0) setVisibleMessages(messages);
  }, [messages]);

  // Cierre automático
  useEffect(() => {
    const timers = visibleMessages.map((msg, index) =>
      setTimeout(
        () =>
          setVisibleMessages((prev) => prev.filter((_, i) => i !== index)),
        msg.duration || defaultDuration
      )
    );
    return () => timers.forEach(clearTimeout);
  }, [visibleMessages, defaultDuration]);

  const removeMessage = (index: number) => {
    setVisibleMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const styles = {
    success: {
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      title: "Éxito",
      color: "border-green-400 bg-green-50 text-green-700",
    },
    error: {
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
      title: "Error",
      color: "border-red-400 bg-red-50 text-red-700",
    },
    info: {
      icon: <Info className="h-4 w-4 text-blue-600" />,
      title: "Información",
      color: "border-blue-400 bg-blue-50 text-blue-700",
    },
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
      <AnimatePresence initial={false}>
        {visibleMessages.map((msg, index) => {
          const style = styles[msg.type || "info"];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.35, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                y: -15,
                scale: 0.95,
                transition: { duration: 0.25, ease: "easeIn" },
              }}
              layout // 👈 Esto activa el "stacking" suave
            >
              <Alert
                className={`relative flex w-80 items-start justify-between rounded-md border ${style.color} shadow-lg`}
              >
                <div className="flex gap-3 pr-8">
                  {style.icon}
                  <div>
                    <AlertTitle>{style.title}</AlertTitle>
                    <AlertDescription>{msg.message}</AlertDescription>
                  </div>
                </div>

                <button
                  onClick={() => removeMessage(index)}
                  className="absolute right-3 top-3 text-sm text-muted-foreground hover:text-foreground"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </Alert>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
