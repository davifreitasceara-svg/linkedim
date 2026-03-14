import React, { useState, useRef, useEffect } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Video, Edit, Send, Volume2, Mic, Sparkles, Check, CheckCheck, Phone, Smile, Image, Paperclip, X, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  from: "me" | "them";
  time: string;
  read?: boolean;
  type?: "text" | "audio";
  audioDuration?: number;
}

interface Chat {
  id: number;
  name: string;
  role: string;
  msg: string;
  time: string;
  unread: number;
  isVip: boolean;
  online: boolean;
  messages: Message[];
}

const initialChats: Chat[] = [
  {
    id: 1, name: "dvscodes IA Recruiter", role: "Processo Seletivo VIP",
    msg: "Olá! Analisamos seu perfil. Há um Match Perfeito!", time: "Agora", unread: 1, isVip: true, online: true,
    messages: [
      { id: 1, text: "Olá! Analisamos seu perfil e há um Match Perfeito para uma posição Senior.", from: "them", time: "10:24", read: true },
      { id: 2, text: "A vaga é 100% remota, PJ ou CLT, salário acima do mercado.", from: "them", time: "10:25", read: true },
      { id: 3, text: "Você toparia uma conversa rápida essa semana para saber mais detalhes?", from: "them", time: "10:26", read: false },
    ]
  },
  {
    id: 2, name: "Maria Silva", role: "Designer Gráfica · Tech4All",
    msg: "Bom dia! Gostei muito das alterações de UI que você fez.", time: "10:30", unread: 0, isVip: false, online: true,
    messages: [
      { id: 1, text: "Oi! Você viu meu portfolio atualizado no feed?", from: "me", time: "09:10", read: true },
      { id: 2, text: "Sim!! Ficou incrível 🔥 As animações ficaram muito suaves.", from: "them", time: "09:15", read: true },
      { id: 3, text: "Bom dia! Gostei muito das alterações de UI que você fez.", from: "them", time: "10:30", read: true },
    ]
  },
  {
    id: 3, name: "Roberto Alves", role: "Engenheiro Sênior · Nubank",
    msg: "Podemos agendar uma call amanhã sobre o componente acessível?", time: "Ontem", unread: 0, isVip: false, online: false,
    messages: [
      { id: 1, text: "Roberto, peguei o PR de acessibilidade que você abriu. Excelente trabalho!", from: "me", time: "Ontem 14:00", read: true },
      { id: 2, text: "Valeu! Queria discutir alguns pontos com você.", from: "them", time: "Ontem 14:12", read: true },
      { id: 3, text: "Podemos agendar uma call amanhã sobre o componente acessível?", from: "them", time: "Ontem 14:13", read: true },
    ]
  },
  {
    id: 4, name: "Tech Recruiter", role: "Recrutamento · Coca-Cola Brasil",
    msg: "Seu perfil chamou nossa atenção para a vaga Híbrida...", time: "Terça", unread: 0, isVip: false, online: false,
    messages: [
      { id: 1, text: "Seu perfil chamou nossa atenção para a vaga Híbrida de Dev Sênior em SP.", from: "them", time: "Terça 09:00", read: true },
      { id: 2, text: "Temos interesse em conversar. Você está aberto a novas oportunidades?", from: "them", time: "Terça 09:01", read: true },
    ]
  },
  {
    id: 5, name: "Ana Lima", role: "Product Manager · iFood",
    msg: "Adorei seu artigo sobre acessibilidade! Podemos colaborar?", time: "Seg", unread: 3, isVip: false, online: true,
    messages: [
      { id: 1, text: "Adorei seu artigo sobre acessibilidade! Top Voice merecido 👏", from: "them", time: "Seg 11:00", read: false },
      { id: 2, text: "Estamos buscando consultores para um projeto de inclusão digital.", from: "them", time: "Seg 11:02", read: false },
      { id: 3, text: "Podemos colaborar? Tenho muito a agregar também!", from: "them", time: "Seg 11:03", read: false },
    ]
  },
];

const EMOJIS = ["😊", "👍", "🔥", "🚀", "❤️", "👏", "🎉", "💡", "✅", "🙏"];

const Messages: React.FC = () => {
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Chat>(initialChats[0]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  
  // Call Modals State
  const [activeCall, setActiveCall] = useState<"audio" | "video" | null>(null);
  
  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<number, number>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout>>();
  const recordingTimer = useRef<ReturnType<typeof setInterval>>();

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimer.current!);
      setRecordingTime(0);
    }
    return () => clearInterval(recordingTimer.current!);
  }, [isRecording]);

  // Handle Playback Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playingAudio !== null) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          const current = prev[playingAudio] || 0;
          if (current >= 100) {
            setPlayingAudio(null);
            return { ...prev, [playingAudio]: 0 };
          }
          return { ...prev, [playingAudio]: current + 5 }; // progress
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [playingAudio]);

  const toggleAudio = (id: number) => {
    if (playingAudio === id) setPlayingAudio(null);
    else setPlayingAudio(id);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [activeChat.id, activeChat.messages.length]);

  const handleSend = (type: "text" | "audio" = "text", duration: number = 0) => {
    if (type === "text" && !inputText.trim()) return;
    
    const newMsg: Message = {
      id: Date.now(),
      text: type === "audio" ? "Mensagem de Áudio" : inputText.trim(),
      from: "me",
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      read: false,
      type: type,
      audioDuration: duration,
    };

    const updatedChats = chats.map(c =>
      c.id === activeChat.id
        ? { ...c, messages: [...c.messages, newMsg], msg: type === "audio" ? "🎵 Áudio" : inputText.trim(), time: "Agora" }
        : c
    );
    setChats(updatedChats);
    const updated = updatedChats.find(c => c.id === activeChat.id)!;
    setActiveChat(updated);
    setInputText("");
    setShowEmoji(false);

    // Simulate reply
    setIsTyping(true);
    typingTimer.current = setTimeout(() => {
      const isReplyAudio = Math.random() > 0.7;
      const replyTypes = [
        "Entendido! Vou verificar isso e te retorno em breve.",
        "Perfeito! Podemos agendar para essa semana?",
        "Ótimo! Obrigado pela resposta rápida 😊",
        "Show! Vou encaminhar para o time.",
      ];
      
      const reply: Message = {
        id: Date.now() + 1,
        text: isReplyAudio ? "Mensagem de Áudio" : replyTypes[Math.floor(Math.random() * replyTypes.length)],
        from: "them",
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        read: false,
        type: isReplyAudio ? "audio" : "text",
        audioDuration: isReplyAudio ? Math.floor(Math.random() * 20) + 5 : undefined
      };
      
      setIsTyping(false);
      setChats(prev => prev.map(c =>
        c.id === activeChat.id
          ? { ...c, messages: [...c.messages, newMsg, reply], msg: isReplyAudio ? "🎵 Áudio" : reply.text, time: "Agora" }
          : c
      ));
      setActiveChat(prev => ({ ...prev, messages: [...prev.messages, newMsg, reply] }));
    }, 2000 + Math.random() * 1000);
  };

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      handleSend("audio", recordingTime);
    } else {
      setIsRecording(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend("text");
    }
  };

  const selectChat = (chat: Chat) => {
    const markedRead = { ...chat, unread: 0, messages: chat.messages.map(m => ({ ...m, read: true })) };
    setActiveChat(markedRead);
    setChats(prev => prev.map(c => c.id === chat.id ? markedRead : c));
    setShowEmoji(false);
    clearTimeout(typingTimer.current);
    setIsTyping(false);
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now(),
      name: "Nova Conversa",
      role: "Conexão",
      msg: "",
      time: "Agora",
      unread: 0,
      isVip: false,
      online: true,
      messages: []
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat);
  };

  const totalUnread = chats.reduce((acc, c) => acc + c.unread, 0);

  const cardStyle = highContrast
    ? "border-2 border-primary bg-background shadow-none"
    : "border border-white/20 bg-card/60 backdrop-blur-xl shadow-xl shadow-black/5";

  const getInitials = (chat: Chat) => chat.isVip ? "dvs" : chat.name.substring(0, 2).toUpperCase();

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <Card className={cn("overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[500px]", cardStyle)}>

        {/* ── LEFT SIDEBAR ── */}
        <div className="w-full md:w-[360px] border-r border-border/50 flex flex-col h-full bg-card/40 relative z-10">
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/10">
            <div className="flex items-center gap-2">
              <h2 className={cn("font-black text-foreground font-[Space_Grotesk]", seniorMode ? "text-2xl" : "text-xl")}>
                Mensagens
              </h2>
              {totalUnread > 0 && (
                <span className="bg-primary text-white text-xs font-black rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {totalUnread}
                </span>
              )}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/50">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full hover:bg-muted/50"
                onClick={handleNewChat}
              >
                <Edit className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-3 border-b border-border/50 bg-muted/5">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquisar mensagens"
                className={cn("pl-10 bg-muted/40 border-border/50 rounded-full font-medium shadow-inner", seniorMode && "h-12 text-base")}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => selectChat(chat)}
                className={cn(
                  "flex gap-3 p-4 cursor-pointer transition-all border-l-4",
                  activeChat.id === chat.id
                    ? "bg-primary/5 border-primary"
                    : "border-transparent hover:bg-muted/30",
                  seniorMode && "p-5"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className={cn(
                    "h-12 w-12 shadow-sm border border-border/50",
                    seniorMode && "h-14 w-14",
                    chat.isVip && "border-2 border-indigo-500"
                  )}>
                    <AvatarFallback className={cn("font-bold text-base", chat.isVip ? "bg-black text-white" : "bg-secondary text-secondary-foreground")}>
                      {getInitials(chat)}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className={cn("font-bold text-foreground truncate flex items-center gap-1", seniorMode ? "text-base" : "text-sm")}>
                      {chat.name}
                      {chat.isVip && <Sparkles className="h-3 w-3 text-blue-500 shrink-0" />}
                    </h4>
                    <span className={cn("text-[11px] font-semibold whitespace-nowrap", chat.unread > 0 ? "text-primary" : "text-muted-foreground")}>
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <p className={cn("text-xs truncate font-medium", chat.unread > 0 ? "text-foreground font-bold" : "text-muted-foreground", seniorMode && "text-sm")}>
                      {chat.msg}
                    </p>
                    {chat.unread > 0 && (
                      <span className="h-5 w-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CHAT PANEL ── */}
        <div className="flex-1 flex flex-col h-full bg-background/20 hidden md:flex relative">

          {/* Chat Header */}
          <div className="p-4 border-b border-border/50 bg-card/60 backdrop-blur-md flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className={cn("h-10 w-10", activeChat.isVip && "border-2 border-indigo-500")}>
                  <AvatarFallback className={cn("font-bold", activeChat.isVip ? "bg-black text-white" : "bg-primary/20 text-primary")}>
                    {getInitials(activeChat)}
                  </AvatarFallback>
                </Avatar>
                {activeChat.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>
              <div>
                <h3 className={cn("font-black text-foreground flex items-center gap-2", seniorMode ? "text-xl" : "text-base")}>
                  {activeChat.name}
                  {activeChat.isVip && <span className="text-[10px] uppercase bg-indigo-500 text-white px-2 py-0.5 rounded-full">Oficial</span>}
                </h3>
                <p className={cn("font-semibold", seniorMode ? "text-sm" : "text-xs", activeChat.online ? "text-green-500" : "text-muted-foreground")}>
                  {activeChat.online ? "● Online agora" : activeChat.role}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/50"
                onClick={() => speak(`Conversa com ${activeChat.name}`)}>
                <Volume2 className="h-4 w-4 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/50" onClick={() => setActiveCall("audio")}>
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/50" onClick={() => setActiveCall("video")}>
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeChat.messages.map((msg, i) => {
              const isMe = msg.from === "me";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn("flex gap-3", isMe ? "flex-row-reverse" : "flex-row")}
                >
                  {!isMe && (
                    <Avatar className={cn("h-8 w-8 mt-auto shrink-0", activeChat.isVip && "border border-indigo-400")}>
                      <AvatarFallback className={cn("font-bold text-xs", activeChat.isVip ? "bg-black text-white" : "bg-primary/20 text-primary")}>
                        {getInitials(activeChat)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("max-w-[75%] flex flex-col", isMe ? "items-end" : "items-start")}>
                    {msg.type === "audio" ? (
                      <div className={cn(
                        "px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 w-64",
                        isMe ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm" 
                             : "bg-card border border-border/60 text-foreground rounded-bl-sm"
                      )}>
                        <Button 
                          onClick={() => toggleAudio(msg.id)}
                          size="icon" 
                          className={cn("h-10 w-10 shrink-0 rounded-full", isMe ? "bg-white/20 text-white hover:bg-white/30" : "bg-primary text-white shadow-md")}
                        >
                          {playingAudio === msg.id ? <Volume2 className="h-4 w-4 animate-pulse" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </Button>
                        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                           {/* Waveform */}
                           <div className="flex items-center gap-[2px] h-6 w-full opacity-80">
                              {[...Array(15)].map((_, w_i) => (
                                 <motion.div
                                    key={w_i}
                                    animate={{ height: playingAudio === msg.id ? [4, Math.random() * 16 + 8, 4] : 4 }}
                                    transition={{ duration: 0.5, repeat: playingAudio === msg.id ? Infinity : 0, delay: w_i * 0.05 }}
                                    className={cn("flex-1 rounded-full", ((audioProgress[msg.id] || 0) / 100) > (w_i/15) ? (isMe ? "bg-white" : "bg-primary") : (isMe ? "bg-white/30" : "bg-primary/20"))}
                                 />
                              ))}
                           </div>
                           <span className={cn("text-[10px] font-bold text-right", isMe ? "text-white/80" : "text-muted-foreground")}>
                             {playingAudio === msg.id ? `0:${Math.floor(((audioProgress[msg.id] || 0) / 100) * (msg.audioDuration || 0)).toString().padStart(2, '0')}` : `0:${msg.audioDuration?.toString().padStart(2, '0')}`}
                           </span>
                        </div>
                      </div>
                    ) : (
                      <div className={cn(
                        "px-4 py-2.5 rounded-2xl shadow-sm text-sm font-medium leading-relaxed",
                        isMe
                          ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm"
                          : activeChat.isVip
                            ? "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-900/40 border border-indigo-200 dark:border-indigo-800 text-foreground rounded-bl-sm"
                            : "bg-card border border-border/60 text-foreground rounded-bl-sm",
                        seniorMode && "text-base py-3 px-5"
                      )}>
                        {msg.text}
                      </div>
                    )}
                    <div className={cn("flex items-center gap-1 mt-1 px-1", isMe ? "flex-row-reverse" : "")}>
                      <span className="text-[10px] text-muted-foreground font-medium">{msg.time}</span>
                      {isMe && (
                        msg.read
                          ? <CheckCheck className="h-3 w-3 text-blue-500" />
                          : <Check className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex gap-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={cn("font-bold text-xs", activeChat.isVip ? "bg-black text-white" : "bg-primary/20 text-primary")}>
                      {getInitials(activeChat)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-card border border-border/60 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-4 pb-2"
              >
                <div className="bg-card border border-border/60 rounded-2xl p-3 flex gap-2 flex-wrap shadow-lg">
                  {EMOJIS.map(emoji => (
                    <button key={emoji} onClick={() => setInputText(p => p + emoji)}
                      className="text-xl hover:scale-125 transition-transform">
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Input */}
          <div className="p-4 bg-card/60 backdrop-blur-md border-t border-border/50">
            <div className="bg-background/80 rounded-2xl p-2 flex items-end gap-2 border border-border/60 focus-within:ring-2 focus-within:ring-primary/50 transition-all shadow-inner">
              <div className="flex items-center gap-1 pb-1.5 pl-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                  onClick={() => setShowEmoji(v => !v)}>
                  <Smile className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <textarea
                placeholder={isRecording ? "Gravando áudio..." : "Escreva uma mensagem..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRecording}
                className={cn(
                  "flex-1 bg-transparent border-0 resize-none outline-none font-medium p-2 max-h-32",
                  isRecording && "text-red-500 animate-pulse",
                  seniorMode ? "text-xl" : "text-sm"
                )}
                rows={1}
              />
              <div className="flex items-center gap-1 pb-1.5 pr-1.5">
                {!inputText.trim() && (
                  <div className="flex items-center gap-2">
                    {isRecording && <span className="text-xs font-bold text-red-500 mr-2">0:{recordingTime.toString().padStart(2, '0')}</span>}
                    <Button 
                      variant={isRecording ? "default" : "ghost"} 
                      size="icon" 
                      className={cn("h-9 w-9 rounded-full transition-all", isRecording ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : "text-muted-foreground hover:text-foreground")}
                      onClick={handleMicClick}
                    >
                      {isRecording ? <Check className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                  </div>
                )}
                <Button
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-full font-bold shadow-md transition-all",
                    inputText.trim() && !isRecording
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white scale-100"
                      : "opacity-40 cursor-default bg-muted hidden md:flex"
                  )}
                  onClick={() => handleSend("text")}
                  disabled={!inputText.trim() || isRecording}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {seniorMode && (
              <p className="text-xs text-muted-foreground text-center mt-2 font-medium">
                Pressione Enter para enviar · Shift+Enter para nova linha
              </p>
            )}
          </div>
        </div>
        
        {/* Modals Simulation for Calls */}
        <AnimatePresence>
          {activeCall && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-sm bg-card border-border/50 shadow-2xl overflow-hidden">
                <div className="p-6 flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/20">
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black">{getInitials(activeChat)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold mb-1">{activeChat.name}</h3>
                  <p className="text-muted-foreground mb-6 flex items-center gap-2">
                    {activeCall === "video" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                    Chamando...
                  </p>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setActiveCall(null)}
                      className="rounded-full h-14 w-14 bg-red-500 hover:bg-red-600 text-white shadow-lg"
                    >
                      <Phone className="w-6 h-6 rotate-135" /> {/* Simulate hangup */}
                    </Button>
                    <Button 
                      className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600 text-white shadow-lg"
                    >
                      <Mic className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default Messages;
