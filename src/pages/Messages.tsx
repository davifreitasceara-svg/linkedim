import React, { useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Video, Edit, Send, Volume2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const Messages: React.FC = () => {
  const { seniorMode } = useAccessibility();
  const { speak } = useTextToSpeech();
  
  const chats = [
    { id: 1, name: "Maria Silva", role: "Designer Gráfica via Tech4All", msg: "Bom dia! Tudo bem?", time: "10:30", unread: 2 },
    { id: 2, name: "Roberto Alves", role: "Engenheiro de Software", msg: "Podemos agendar uma call amanhã?", time: "Ontem", unread: 0 },
    { id: 3, name: "Tech Recruiter", role: "Recrutamento GlobalHR", msg: "Seu perfil chamou nossa atenção...", time: "Terça", unread: 0 },
  ];

  const [activeChat, setActiveChat] = useState(chats[0]);
  const [inputText, setInputText] = useState("");

  const readMessage = (msg: string) => {
    speak(`${activeChat.name} disse: ${msg}`);
  };

  return (
    <Card className="border-0 shadow-sm bg-card h-[calc(100vh-120px)] overflow-hidden flex flex-col md:flex-row">
      {/* Left Sidebar - Chat List */}
      <div className="w-full md:w-[350px] border-r border-border/50 flex flex-col h-full bg-card relative z-10">
        <div className="p-3 border-b border-border/50 flex justify-between items-center">
          <h2 className={cn("font-semibold text-foreground", seniorMode && "text-xl")}>Mensagens</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-2 border-b border-border/50 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar mensagens"
              className={cn("pl-9 bg-muted border-0", seniorMode && "h-12 text-base")}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={cn(
                "flex gap-3 p-3 cursor-pointer transition-colors border-l-4",
                activeChat.id === chat.id 
                  ? "bg-muted/50 border-primary" 
                  : "border-transparent hover:bg-muted/30",
                seniorMode && "p-4"
              )}
            >
              <Avatar className={cn("h-12 w-12", seniorMode && "h-14 w-14")}>
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {chat.name.substring(0,2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className={cn("font-semibold text-foreground text-sm truncate", seniorMode && "text-base")}>
                    {chat.name}
                  </h4>
                  <span className={cn("text-xs text-muted-foreground whitespace-nowrap ml-2", seniorMode && "text-sm")}>
                    {chat.time}
                  </span>
                </div>
                <p className={cn("text-xs text-muted-foreground truncate", seniorMode && "text-sm", chat.unread > 0 && "font-semibold text-foreground")}>
                  {chat.msg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Active Chat */}
      <div className="flex-1 flex flex-col h-full bg-muted/5 hidden md:flex">
        {/* Chat Header */}
        <div className="p-3 border-b border-border/50 bg-card flex justify-between items-center h-16">
          <div className="flex flex-col">
            <h3 className={cn("font-semibold text-foreground", seniorMode && "text-xl")}>
              {activeChat.name}
            </h3>
            <p className={cn("text-xs text-muted-foreground", seniorMode && "text-sm")}>
              {activeChat.role}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => speak(`Conversa com ${activeChat.name}, cargo: ${activeChat.role}`)}>
              <Volume2 className="h-4 w-4" />
              {seniorMode && <span>Ouvir</span>}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex gap-3 max-w-[80%]">
            <Avatar className={cn("h-8 w-8 mt-auto", seniorMode && "h-10 w-10")}>
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {activeChat.name.substring(0,2)}
              </AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border/50 rounded-2xl rounded-bl-sm p-3 shadow-sm relative group pr-10">
              <p className={cn("text-sm text-foreground", seniorMode && "text-base")}>
                {activeChat.msg}
              </p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => readMessage(activeChat.msg)}
                className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-card border-t border-border/50">
          <div className="bg-muted rounded-xl p-2 flex items-end gap-2 border border-border/50 focus-within:ring-1 focus-within:border-primary transition-all">
            <textarea
              placeholder="Escreva uma mensagem..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={cn(
                "w-full bg-transparent border-0 resize-none outline-none text-sm p-2 max-h-32",
                seniorMode && "text-base p-3"
              )}
              rows={1}
            />
            <div className="flex items-center gap-1 pb-1 pr-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                className={cn("h-8 rounded-full px-4 font-semibold", !inputText.trim() && "opacity-50")}
                disabled={!inputText.trim()}
              >
                <Send className="h-4 w-4 mr-1" /> Enviar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Messages;
