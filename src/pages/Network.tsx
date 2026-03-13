import React from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus, FileText, Hash, Building2, Calendar, Volume2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const Network: React.FC = () => {
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();

  const networkNav = [
    { icon: Users, label: "Conexões", count: 420 },
    { icon: UserPlus, label: "Contatos VIP", count: 12 },
    { icon: FileText, label: "Pessoas que sigo", count: 108 },
    { icon: Building2, label: "Páginas", count: 15 },
    { icon: Calendar, label: "Eventos", count: 3 },
    { icon: Hash, label: "Hashtags", count: 14 },
  ];

  const suggestions = [
    { name: "dvscodes AI", role: "Recrutamento Automatizado Premium", mutual: 42, isVip: true },
    { name: "Carlos Eduardo", role: "Especialista em Acessibilidade", mutual: 3 },
    { name: "Fernanda Costa", role: "UX Designer Sênior na dvscodes", mutual: 12, isVip: true },
    { name: "Roberto Alves", role: "Engenheiro de Software", mutual: 1 },
    { name: "Julia Santos", role: "Tech Recruiter", mutual: 5 },
  ];

  const cardStyle = highContrast 
    ? "border-2 border-primary bg-background shadow-none" 
    : "border border-white/20 bg-card/60 backdrop-blur-xl shadow-xl shadow-black/5";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 max-w-7xl mx-auto pb-20">
      {/* Left Sidebar */}
      <Card className={cn("h-fit hidden lg:block overflow-hidden sticky top-20", cardStyle)}>
        <div className="p-5 border-b border-border/50 bg-gradient-to-r from-blue-600/10 to-transparent">
          <h2 className={cn("font-bold text-foreground font-[Space_Grotesk]", seniorMode ? "text-2xl" : "text-xl")}>
            Sua Rede Premium
          </h2>
        </div>
        <div className="py-3">
          {networkNav.map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-center justify-between px-5 py-3 hover:bg-muted/50 cursor-pointer transition-colors text-muted-foreground hover:text-foreground font-medium",
                seniorMode && "py-4"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", seniorMode && "w-6 h-6", i === 1 && "text-blue-500")} />
                <span className={cn("text-base", seniorMode && "text-lg", i === 1 && "font-bold text-foreground")}>{item.label}</span>
              </div>
              <span className={cn("text-base font-bold", seniorMode && "text-lg")}>{item.count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content */}
      <div className="space-y-6">
        <Card className={cn("p-5 sm:p-6", cardStyle)}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={cn("font-bold text-foreground font-[Space_Grotesk]", seniorMode ? "text-2xl" : "text-xl")}>
              Pessoas que você talvez conheça
            </h3>
            <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/10">
              Ver tudo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {suggestions.map((person, i) => (
              <Card key={i} className={cn(
                "overflow-hidden flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1",
                cardStyle,
                person.isVip && !highContrast ? "border-blue-500/30 shadow-blue-500/10" : "border-border/50"
              )}>
                {person.isVip && (
                  <div className="absolute top-0 right-0 w-full flex justify-end">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl shadow-md flex items-center gap-1 z-10">
                      <Sparkles className="w-3 h-3" /> VIP
                    </div>
                  </div>
                )}
                <div className={cn(
                  "h-16 w-full relative",
                  person.isVip ? "bg-gradient-to-r from-blue-600 to-indigo-800" : "bg-gradient-to-r from-primary/10 to-accent/10"
                )} />
                <Avatar className={cn(
                  "h-20 w-20 border-4 border-card -mt-10 mb-2 relative z-10 shadow-lg", 
                  seniorMode && "h-24 w-24",
                  person.isVip && "border-indigo-500 bg-black text-white"
                )}>
                  <AvatarFallback className={cn("font-bold text-xl", person.isVip ? "bg-black text-white" : "bg-secondary text-secondary-foreground")}>
                    {person.name === "dvscodes AI" ? "dvs" : person.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="px-4 pb-5 flex-1 flex flex-col w-full">
                  <h4 className={cn("font-bold text-foreground hover:underline cursor-pointer line-clamp-2 leading-tight", seniorMode && "text-xl")}>
                    {person.name}
                  </h4>
                  <p className={cn("text-xs text-muted-foreground font-medium mt-1.5 mb-2 line-clamp-2", seniorMode && "text-sm", person.isVip && "text-blue-600 dark:text-blue-400")}>
                    {person.role}
                  </p>
                  <p className="text-[11px] font-medium text-muted-foreground/80 flex items-center justify-center gap-1 mb-4 mt-auto">
                    <Users className="w-3.5 h-3.5" /> {person.mutual} conexões em comum
                  </p>
                  <Button 
                    variant={person.isVip ? "default" : "outline"} 
                    className={cn(
                      "w-full rounded-full font-bold shadow-sm", 
                      seniorMode && "h-12 text-base",
                      person.isVip ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0" : "border-2 hover:bg-muted"
                    )}
                  >
                    {person.isVip ? "+ Conectar VIP" : "Conectar"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 hidden"
                    onClick={() => speak(`Sugestão de conexão: ${person.name}, ${person.role}. Vocês possuem ${person.mutual} conexões em comum.`)}
                    aria-label="Ouvir perfil"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Network;
