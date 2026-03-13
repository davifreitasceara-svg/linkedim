import React from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus, FileText, Hash, Building2, Calendar, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Network: React.FC = () => {
  const { seniorMode } = useAccessibility();
  const { speak } = useTextToSpeech();

  const networkNav = [
    { icon: Users, label: "Conexões", count: 42 },
    { icon: UserPlus, label: "Contatos", count: 12 },
    { icon: FileText, label: "Pessoas que sigo", count: 8 },
    { icon: Building2, label: "Páginas", count: 5 },
    { icon: Calendar, label: "Eventos", count: 1 },
    { icon: Hash, label: "Hashtags", count: 14 },
  ];

  const suggestions = [
    { name: "Carlos Eduardo", role: "Especialista em Acessibilidade", mutual: 3 },
    { name: "Fernanda Costa", role: "UX Designer Sênior", mutual: 12 },
    { name: "Roberto Alves", role: "Engenheiro de Software", mutual: 1 },
    { name: "Julia Santos", role: "Tech Recruiter", mutual: 5 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
      {/* Left Sidebar */}
      <Card className="border-0 shadow-sm bg-card h-fit hidden lg:block">
        <div className="p-4 border-b border-border/50">
          <h2 className={cn("font-semibold text-foreground", seniorMode && "text-xl")}>
            Gerenciar minha rede
          </h2>
        </div>
        <div className="py-2">
          {networkNav.map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-center justify-between px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors text-muted-foreground hover:text-foreground",
                seniorMode && "py-4"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", seniorMode && "w-6 h-6")} />
                <span className={cn("text-base font-medium", seniorMode && "text-lg")}>{item.label}</span>
              </div>
              <span className={cn("text-base", seniorMode && "text-lg")}>{item.count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content */}
      <div className="space-y-4">
        <Card className="border-0 shadow-sm bg-card p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className={cn("font-semibold text-foreground", seniorMode && "text-xl")}>
              Pessoas que você talvez conheça
            </h3>
            <Button variant="ghost" size="sm" className="text-primary font-semibold">
              Ver tudo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestions.map((person, i) => (
              <Card key={i} className="border border-border/50 overflow-hidden flex flex-col items-center text-center">
                <div className="h-16 w-full bg-gradient-to-r from-primary/20 to-accent/20" />
                <Avatar className={cn("h-20 w-20 border-4 border-card -mt-10 mb-2", seniorMode && "h-24 w-24")}>
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xl font-semibold">
                    {person.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="px-3 pb-4 flex-1 flex flex-col">
                  <h4 className={cn("font-semibold text-foreground hover:underline cursor-pointer line-clamp-2", seniorMode && "text-lg")}>
                    {person.name}
                  </h4>
                  <p className={cn("text-xs text-muted-foreground mt-1 mb-2 line-clamp-2", seniorMode && "text-sm")}>
                    {person.role}
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 mb-4 mt-auto">
                    <Users className="w-3 h-3" /> {person.mutual} conexões em comum
                  </p>
                  <Button 
                    variant="outline" 
                    className={cn("w-full rounded-full font-semibold border-primary text-primary hover:bg-primary/10", seniorMode && "h-12 text-base")}
                  >
                    Conectar
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 hidden" // To be revealed via accessible controls if needed
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
