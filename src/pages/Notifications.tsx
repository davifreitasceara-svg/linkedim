import React from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Notifications: React.FC = () => {
  const { seniorMode } = useAccessibility();
  const { speak } = useTextToSpeech();

  const mockNots = [
    { id: 1, text: "Seu post foi curtido por Maria Silva e outras 15 pessoas.", time: "1h", unread: true, initials: "MS" },
    { id: 2, text: "Nova vaga correspondente ao seu perfil: Desenvolvedor Senior na TechBR.", time: "3h", unread: false, initials: "TB" },
    { id: 3, text: "João Santos comentou no seu artigo sobre Acessibilidade Web.", time: "Ontem", unread: false, initials: "JS" },
    { id: 4, text: "Você apareceu em 5 pesquisas de recrutadores nesta semana.", time: "2 dias", unread: false, initials: "P" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_300px] gap-6 max-w-6xl mx-auto">
      {/* Left Sidebar */}
      <Card className="border-0 shadow-sm bg-card h-fit hidden lg:block p-4">
        <h3 className={cn("font-semibold text-foreground mb-4", seniorMode && "text-xl")}>
          Gerenciar Notificações
        </h3>
        <p className={cn("text-sm text-primary font-semibold hover:underline cursor-pointer", seniorMode && "text-base")}>
          Ver configurações
        </p>
      </Card>

      {/* Main Content */}
      <Card className="border-0 shadow-sm bg-card overflow-hidden">
        <div className="flex gap-4 p-4 border-b border-border/50 bg-card overflow-x-auto">
          <Button variant="default" className="rounded-full font-semibold">Tudo</Button>
          <Button variant="outline" className="rounded-full font-semibold">Minhas publicações</Button>
          <Button variant="outline" className="rounded-full font-semibold">Menções</Button>
        </div>

        <div>
          {mockNots.map((not) => (
            <div 
              key={not.id} 
              className={cn(
                "flex items-start gap-3 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors relative cursor-pointer",
                not.unread && "bg-primary/5"
              )}
            >
              <div className="mt-1">
                <Avatar className={cn("h-12 w-12", seniorMode && "h-14 w-14")}>
                  <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                    {not.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0 pr-12">
                <p className={cn("text-sm text-foreground", seniorMode && "text-lg")}>
                  {not.text}
                </p>
                <p className={cn("text-xs text-muted-foreground mt-1", seniorMode && "text-sm")}>
                  {not.time}
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                  onClick={(e) => { e.stopPropagation(); speak(`Notificação: ${not.text}`); }}
                  aria-label="Ouvir Notificação"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              
              {not.unread && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Right Content */}
      <div className="hidden lg:block">
        <Card className="border-0 shadow-sm bg-card p-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground mb-4">Anúncio</p>
          <div className="w-16 h-16 bg-muted mx-auto mb-2 rounded border" />
          <h4 className="text-sm font-semibold text-foreground">Premium para Carreiras</h4>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Destaque-se para os recrutadores e veja quem acessou seu perfil.</p>
          <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary/10 font-bold mb-2">
            Experimentar grátis
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
