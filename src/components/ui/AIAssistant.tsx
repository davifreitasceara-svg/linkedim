import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, X, Send, Cpu, MessageSquare, Zap, 
  BrainCircuit, Bot, Info, Lightbulb, TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "ai";
  content: string;
  time: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "ai", 
      content: "Olá! Eu sou a ProAI da dvscodes. Como posso ajudar você a impulsionar sua carreira hoje? Posso sugerir vagas, revisar seu perfil ou dar dicas de networking.", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      role: "user",
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // AI Simulation logic
    setTimeout(() => {
      let aiResponse = "Essa é uma excelente pergunta! Deixe-me analisar seu perfil e as tendências do mercado para 2026...";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes("vaga") || lowerInput.includes("trabalho")) {
        aiResponse = "Vi que há uma forte demanda para Especialistas em Acessibilidade na dvscodes e no iFood. Ambos valorizam candidatos que entendem de WCAG e UX inclusivo. Quer que eu te mostre como se candidatar?";
      } else if (lowerInput.includes("perfil") || lowerInput.includes("currículo")) {
        aiResponse = "Seu perfil está 85% completo. Sugiro adicionar uma descrição mais detalhada de seus projetos de UI/UX para atrair recrutadores da Nubank e Embraer.";
      } else if (lowerInput.includes("oi") || lowerInput.includes("olá")) {
        aiResponse = "Olá de novo! Estou pronta para te ajudar. O mercado de tecnologia está aquecido hoje, especialmente em IA e Design de Sistemas.";
      }

      const aiMsg: Message = {
        role: "ai",
        content: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-[100] flex flex-col items-start gap-4">
      {/* ── CHAT WINDOW ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom left" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[350px] sm:w-[400px] h-[500px] shadow-2xl rounded-3xl overflow-hidden border border-primary/20 bg-card/80 backdrop-blur-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-b border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 relative overflow-hidden group">
                  <Cpu className="h-6 w-6 text-white relative z-10" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" 
                  />
                </div>
                <div>
                  <CardTitle className="text-sm font-black flex items-center gap-1.5">
                    ProAI <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-tighter">dvscodes</span>
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> IA Avançada Online
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Content */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: m.role === "ai" ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex gap-2 max-w-[85%]",
                      m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className={cn(
                        "text-[10px] font-black",
                        m.role === "ai" ? "bg-primary text-white" : "bg-muted"
                      )}>
                        {m.role === "ai" ? <BrainCircuit className="h-4 w-4" /> : "EU"}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "p-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm",
                      m.role === "ai" 
                        ? "bg-muted/50 rounded-tl-none border border-border/50 text-foreground" 
                        : "bg-primary text-primary-foreground rounded-tr-none"
                    )}>
                      {m.content}
                      <p className={cn(
                        "text-[9px] mt-1 font-bold",
                        m.role === "ai" ? "text-muted-foreground" : "text-primary-foreground/70"
                      )}>{m.time}</p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-2 mr-auto max-w-[85%]">
                     <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-white text-[10px] font-black">
                        <BrainCircuit className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none border border-border/50 flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Footer Suggestions */}
            <div className="p-2 border-t border-border/10 flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { icon: Lightbulb, label: "Dicas de Carreira" },
                { icon: TrendingUp, label: "Vagas Recomendadas" },
                { icon: Info, label: "Revisar Perfil" }
              ].map((s, i) => (
                <button
                  key={i}
                  className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-muted/40 hover:bg-muted rounded-full text-[11px] font-bold transition-colors border border-border/40"
                  onClick={() => setInput(s.label)}
                >
                  <s.icon className="h-3 w-3 text-primary" />
                  {s.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background/50 border-t border-border/10">
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <input
                  type="text"
                  placeholder="Pergunte qualquer coisa à IA..."
                  className="flex-1 bg-muted/60 border-0 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 ring-primary/20 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="rounded-xl bg-primary text-white shadow-lg shadow-primary/20"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOGGLE BUTTON ── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-3xl flex items-center justify-center transition-all duration-300 relative group overflow-hidden shadow-2xl shadow-primary/30",
          isOpen ? "bg-card border border-primary/20" : "bg-primary"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Glow effect */}
        {!isOpen && (
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white/20 rounded-full blur-xl"
          />
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-7 w-7 text-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex items-center justify-center gap-1"
            >
               <Sparkles className="h-8 w-8 text-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AIAssistant;
