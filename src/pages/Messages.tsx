import React, { useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Video, Edit, Send, Volume2, Mic, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const Messages: React.FC = () => {
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  
  const chats = [
    { id: 1, name: "dvscodes IA Recruiter", role: "Processo Seletivo VIP", msg: "Olá! Analisamos seu perfil e há um Match Perfeito. Podemos conversar?", time: "Agora", unread: 1, isVip: true },
    { id: 2, name: "Maria Silva", role: "Designer Gráfica via Tech4All", msg: "Bom dia! Gostei muito das alterações de UI que você fez.", time: "10:30", unread: 0, isVip: false },
    { id: 3, name: "Roberto Alves", role: "Engenheiro Nubank", msg: "Podemos agendar uma call amanhã sobre o componente acessível?", time: "Ontem", unread: 0, isVip: false },
    { id: 4, name: "Tech Recruiter", role: "Recrutamento Coca-Cola", msg: "Seu perfil chamou nossa atenção para a vaga Híbrida...", time: "Terça", unread: 0, isVip: false },
  ];

  const [activeChat, setActiveChat] = useState(chats[0]);
  const [inputText, setInputText] = useState("");

  const readMessage = (msg: string) => {
    speak(`${activeChat.name} disse: ${msg}`);
  };

  const cardStyle = highContrast 
    ? "border-2 border-primary bg-background shadow-none" 
    : "border border-white/20 bg-card/60 backdrop-blur-xl shadow-xl shadow-black/5";

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <Card className={cn("overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[500px]", cardStyle)}>
        {/* Left Sidebar - Chat List */}
        <div className="w-full md:w-[380px] border-r border-border/50 flex flex-col h-full bg-card/40 relative z-10 backdrop-blur-md">
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/10">
            <h2 className={cn("font-bold text-foreground font-[Space_Grotesk]", seniorMode ? "text-2xl" : "text-xl")}>Mensagens</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/50">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/50">
                <Edit className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="p-3 border-b border-border/50 bg-muted/5">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground font-bold" />
              <Input
                type="search"
                placeholder="Pesquisar mensagens"
                className={cn("pl-10 bg-muted/40 border-border/50 rounded-full font-medium shadow-inner", seniorMode && "h-12 text-base")}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto w-full">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={cn(
                  "flex gap-4 p-4 cursor-pointer transition-all border-l-4",
                  activeChat.id === chat.id 
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "border-transparent hover:bg-muted/30",
                  seniorMode && "p-5"
                )}
              >
                <Avatar className={cn(
                  "h-14 w-14 shadow-sm border border-border/50", 
                  seniorMode && "h-16 w-16",
                  chat.isVip && "bg-black text-white border-2 border-indigo-500"
                )}>
                  <AvatarFallback className={cn("font-bold text-lg", chat.isVip && "bg-black text-white")}>
                    {chat.isVip ? "dvs" : chat.name.substring(0,2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className={cn("font-bold text-foreground text-base truncate flex items-center gap-1", seniorMode && "text-lg")}>
                      {chat.name}
                      {chat.isVip && <Sparkles className="h-3 w-3 text-blue-500" />}
                    </h4>
                    <span className={cn("text-xs font-semibold whitespace-nowrap ml-2", seniorMode ? "text-sm" : "", chat.unread > 0 ? "text-primary" : "text-muted-foreground")}>
                      {chat.time}
                    </span>
                  </div>
                  <p className={cn("text-xs truncate font-medium mt-1", seniorMode && "text-sm", chat.unread > 0 ? "text-foreground font-bold" : "text-muted-foreground")}>
                    {chat.msg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Active Chat */}
        <div className="flex-1 flex flex-col h-full bg-background/20 hidden md:flex relative">
          {/* Chat Header */}
          <div className="p-4 border-b border-border/50 bg-card/60 backdrop-blur-md flex justify-between items-center h-[76px]">
            <div className="flex flex-col">
              <h3 className={cn("font-bold text-foreground flex items-center gap-2", seniorMode ? "text-2xl" : "text-xl")}>
                {activeChat.name}
                {activeChat.isVip && <span className="text-[10px] uppercase bg-indigo-500 text-white px-2 py-0.5 rounded-full">Oficial</span>}
              </h3>
              <p className={cn("text-sm font-semibold text-muted-foreground", seniorMode && "text-base", activeChat.isVip && "text-blue-500")}>
                {activeChat.role}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="gap-2 font-bold hover:bg-primary/10" onClick={() => speak(`Conversa com ${activeChat.name}, cargo: ${activeChat.role}`)}>
                <Volume2 className="h-5 w-5 text-primary" />
                {seniorMode && <span>Ouvir Contato</span>}
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted/50">
                <Video className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div className="flex gap-4 max-w-[85%]">
              <Avatar className={cn("h-10 w-10 mt-auto shadow-sm", seniorMode && "h-12 w-12", activeChat.isVip && "bg-black text-white px-2")}>
                <AvatarFallback className={cn("font-bold", activeChat.isVip ? "bg-black" : "bg-primary/20 text-primary uppercase")}>
                  {activeChat.isVip ? "dvs" : activeChat.name.substring(0,2)}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "border rounded-3xl rounded-bl-sm p-4 shadow-md relative group pr-12 text-sm sm:text-base font-medium",
                activeChat.isVip ? "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 dark:from-indigo-950/40 dark:to-blue-900/40 dark:border-indigo-800" : "bg-card border-border/50"
              )}>
                <p className={cn("text-foreground", seniorMode && "text-lg")}>
                  {activeChat.msg}
                </p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => readMessage(activeChat.msg)}
                  className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background rounded-full"
                >
                  <Volume2 className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-card/60 backdrop-blur-md border-t border-border/50">
            <div className="bg-background/80 rounded-2xl p-2 flex items-end gap-2 border border-border/60 focus-within:ring-2 focus-within:ring-primary/50 transition-all shadow-inner">
              <textarea
                placeholder="Escreva uma mensagem..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={cn(
                  "w-full bg-transparent border-0 resize-none outline-none text-base font-medium p-3 max-h-32",
                  seniorMode && "text-xl p-4"
                )}
                rows={1}
              />
              <div className="flex items-center gap-1 pb-1.5 pr-1.5">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button 
                  size="default" 
                  className={cn("h-10 rounded-full px-5 font-bold shadow-md transition-all", !inputText.trim() ? "opacity-50" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white")}
                  disabled={!inputText.trim()}
                >
                  <Send className="h-4 w-4 mr-2" /> Enviar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Messages;
