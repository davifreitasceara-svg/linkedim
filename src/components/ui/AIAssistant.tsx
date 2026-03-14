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
      if (lowerInput.includes("vaga") || lowerInput.includes("trabalho") || lowerInput.includes("emprego")) {
        aiResponse = "Com base no seu perfil senior, identifiquei 3 vagas estratégicas que deram 'Match':\n1. Tech Lead na dvscodes (Remoto)\n2. Senior Architect no Nubank (Híbrido SP)\n3. UX Specialist na Embraer.\nDeseja que eu prepare uma carta de apresentação personalizada para uma delas?";
      } else if (lowerInput.includes("perfil") || lowerInput.includes("currículo") || lowerInput.includes("curriculo")) {
        aiResponse = "Sua análise de perfil dvscodes está pronta: Você pontua 92/100 em 'Liderança Técnica'. Recomendo destacar sua experiência recente com IA Generativa para subir para 98/100. Posso sugerir palavras-chave de alto impacto?";
      } else if (lowerInput.includes("networking") || lowerInput.includes("conectar") || lowerInput.includes("conversa")) {
        aiResponse = "Notei que você e o CTO da Nubank têm 12 conexões em comum. Uma abordagem consultiva sobre o novo componente de acessibilidade deles seria um excelente 'quebra-gelo'. Quer que eu redija um convite inteligente?";
      } else if (lowerInput.includes("ajuda") || lowerInput.includes("como funciona")) {
        aiResponse = "Posso atuar como seu mentor de carreira 24h. Tente perguntar sobre 'tendências para 2026', 'melhorar perfil' ou peça para eu encontrar vagas específicas.";
      } else if (lowerInput.includes("oi") || lowerInput.includes("olá") || lowerInput.includes("ola")) {
        aiResponse = "Olá! Que satisfação falar com um profissional do seu calibre. Em que posso ser útil na sua jornada ProConnect hoje?";
      } else {
        aiResponse = "Análise concluída: A sua dúvida envolve visão estratégica. Para 2026, vejo que profissionais com sua senioridade estão focando em 'Human-Centered AI'. Gostaria de saber mais sobre como aplicar isso no seu contexto?";
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
      <div className="relative group">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-20 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-sm font-black border border-white/10 shadow-xl pointer-events-none"
            >
              Pergunte à <span className="text-primary italic">ProAI</span> ✨
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-transparent border-marker-right" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-16 w-16 md:h-20 md:w-20 rounded-[2rem] flex items-center justify-center transition-all duration-300 relative overflow-hidden shadow-2xl",
            isOpen 
              ? "bg-card border border-primary/20" 
              : "bg-gradient-to-br from-primary via-indigo-600 to-blue-700 p-[2px]"
          )}
        >
          {/* Inner ring for non-open state */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary via-indigo-600 to-blue-700 flex items-center justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)] opacity-50" />
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent,white,transparent)]"
               />
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                className="relative z-10"
              >
                <X className="h-8 w-8 text-foreground" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                className="relative z-10 flex flex-col items-center justify-center"
              >
                 <Sparkles className="h-9 w-9 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                 <span className="text-[10px] text-white/80 font-black mt-1 uppercase tracking-widest">AI</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default AIAssistant;
