import React from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Volume2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const Notifications: React.FC = () => {
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();

  const mockNots = [
    { id: 1, text: "O recrutador da dvscodes visualizou o seu perfil.", time: "10m", unread: true, initials: "dvs", isVip: true },
    { id: 2, text: "Seu post foi curtido por Maria Silva e outras 15 pessoas.", time: "1h", unread: true, initials: "MS", isVip: false },
    { id: 3, text: "Nova vaga correspondente ao seu perfil: Desenvolvedor Senior na TechBR.", time: "3h", unread: false, initials: "TB", isVip: false },
    { id: 4, text: "João Santos comentou no seu artigo sobre Acessibilidade Web.", time: "Ontem", unread: false, initials: "JS", isVip: false },
    { id: 5, text: "Você apareceu em 5 pesquisas de recrutadores nesta semana.", time: "2 dias", unread: false, initials: "P", isVip: false },
  ];

  const cardStyle = highContrast 
    ? "border-2 border-primary bg-background shadow-none" 
    : "border border-white/20 bg-card/60 backdrop-blur-xl shadow-xl shadow-black/5";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_320px] gap-6 max-w-7xl mx-auto pb-20">
      {/* Left Sidebar */}
      <Card className={cn("border-0 shadow-sm h-fit hidden lg:block sticky top-20 overflow-hidden", cardStyle)}>
        <div className="p-5 border-b border-border/50 bg-gradient-to-r from-blue-600/10 to-transparent">
          <h3 className={cn("font-bold text-foreground font-[Space_Grotesk]", seniorMode ? "text-2xl" : "text-xl")}>
            Central de Avisos
          </h3>
        </div>
        <div className="p-4">
          <p className={cn("text-sm text-primary font-bold hover:underline cursor-pointer transition-all hover:translate-x-1 inline-block", seniorMode && "text-base")}>
            Configurações de Notificação
          </p>
        </div>
      </Card>

      {/* Main Content */}
      <Card className={cn("border-0 overflow-hidden", cardStyle)}>
        <div className="flex gap-3 p-4 border-b border-border/50 bg-card/40 overflow-x-auto scrollbar-hide">
          <Button variant="default" className="rounded-full font-bold shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">Tudo</Button>
          <Button variant="outline" className="rounded-full font-bold border-2 hover:bg-muted">Minhas publicações</Button>
          <Button variant="outline" className="rounded-full font-bold border-2 hover:bg-muted">Menções</Button>
        </div>

        <div className="bg-background/20 backdrop-blur-sm">
          {mockNots.map((not) => (
            <div 
              key={not.id} 
              className={cn(
                "flex items-start gap-4 p-5 border-b border-border/50 hover:bg-muted/40 transition-colors relative cursor-pointer",
                not.unread && !highContrast && "bg-blue-500/5",
                not.unread && highContrast && "bg-muted"
              )}
            >
              <div className="mt-1">
                <Avatar className={cn(
                  "h-14 w-14 shadow-sm", 
                  seniorMode && "h-16 w-16",
                  not.isVip && "bg-black text-white border-2 border-indigo-500"
                )}>
                  <AvatarFallback className={cn("font-bold text-lg", not.isVip ? "bg-black text-white" : "bg-accent/20 text-accent font-semibold")}>
                    {not.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0 pr-12">
                <p className={cn("text-base text-foreground font-medium", seniorMode && "text-lg", not.unread && "font-bold text-foreground", not.isVip && "text-blue-600 dark:text-blue-400 font-bold")}>
                  {not.text}
                </p>
                <p className={cn("text-xs text-muted-foreground font-semibold mt-1", seniorMode && "text-sm", not.unread && "text-primary")}>
                  {not.time}
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:bg-background">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-background shadow-sm bg-background/50"
                  onClick={(e) => { e.stopPropagation(); speak(`Notificação: ${not.text}`); }}
                  aria-label="Ouvir Notificação"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              
              {not.unread && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-md" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Right Content */}
      <div className="hidden lg:block">
        <Card className={cn("overflow-hidden sticky top-20 border-0 shadow-lg text-center", cardStyle)}>
          <div className="h-24 bg-gradient-to-br from-blue-600 to-indigo-900 relative">
             <div className="absolute right-2 top-2 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
               Patrocínio
             </div>
          </div>
          <div className="p-6 pt-0 relative">
             <div className="mx-auto w-20 h-20 bg-black rounded-2xl border-4 border-card -mt-10 mb-4 flex items-center justify-center shadow-xl">
               <span className="text-white font-black text-2xl">dvs</span>
             </div>
            <h4 className={cn("font-black text-foreground text-lg font-[Space_Grotesk]", seniorMode && "text-xl")}>
              Carreiras Premium
            </h4>
            <p className={cn("text-sm text-muted-foreground font-medium mt-2 mb-6 leading-relaxed", seniorMode && "text-base")}>
              Seja o primeiro a ser notado pelas equipes da <span className="font-bold text-blue-600 dark:text-blue-400">dvscodes</span>.
            </p>
            <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg h-12">
              <Sparkles className="w-4 h-4 mr-2" />
              Ativar Modo VIP
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
