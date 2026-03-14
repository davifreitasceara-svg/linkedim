import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users, UserPlus, FileText, Hash, Building2, Calendar,
  Volume2, Sparkles, Search, TrendingUp, Star, Globe,
  CheckCircle2, MessageCircle, Zap, Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Person {
  name: string;
  role: string;
  company: string;
  mutual: number;
  isVip?: boolean;
  isVerified?: boolean;
  logo: string;
  tags: string[];
  connected?: boolean;
}

const suggestions: Person[] = [
  { name: "dvscodes IA Recruiter", role: "Recrutamento Automatizado Premium", company: "dvscodes", mutual: 42, isVip: true, isVerified: true, logo: "dvs", tags: ["IA", "Recrutamento", "UX"] },
  { name: "eduarda leal", role: "Delegada Federal", company: "Segurança Pública", mutual: 25, isVip: true, isVerified: true, logo: "EL", tags: ["Investigação", "Direito"] },
  { name: "issac silva", role: "Desenvolvedor Full Stack", company: "dvscodes", mutual: 18, logo: "IS", tags: ["React", "Node.js"] },
  { name: "kauan", role: "Streamer", company: "Twitch Partner", mutual: 150, logo: "K", tags: ["Gaming", "Live"] },
  { name: "gabriel", role: "Policial", company: "Segurança Pública", mutual: 12, logo: "G", tags: ["Tática", "Segurança"] },
  { name: "aristotoles", role: "Entregador", company: "Logística Express", mutual: 5, logo: "AR", tags: ["Logística", "Agilidade"] },
  { name: "vicente", role: "Técnico", company: "Assistência Tech", mutual: 15, logo: "V", tags: ["Hardware", "Manutenção"] },
  { name: "levi", role: "Programador", company: "dvscodes", mutual: 22, isVerified: true, logo: "L", tags: ["React", "Go", "Cloud"] },
  { name: "davi oliveira", role: "Maquinário", company: "Indústria X", mutual: 5, logo: "DO", tags: ["Operação", "Mecânica"] },
  { name: "isadora", role: "Advogada", company: "Direito Digital", mutual: 30, isVip: true, logo: "I", tags: ["Legal", "Compliance"] },
  { name: "paulo", role: "Programador", company: "Fintech Pro", mutual: 12, logo: "P", tags: ["Java", "Spring Boot"] },
  { name: "Andre", role: "Programador", company: "dvscodes", mutual: 19, logo: "A", tags: ["Node.js", "Vue"] },
  { name: "andreza", role: "Blogueira", company: "Fashion Influencer", mutual: 85, isVip: true, logo: "AZ", tags: ["Social Media", "Content"] },
  { name: "sofia", role: "Estilista", company: "Vogue Studio", mutual: 25, logo: "S", tags: ["Design", "Fashion"] },
  { name: "diogo", role: "Professor", company: "Universidade Tech", mutual: 40, isVerified: true, logo: "D", tags: ["Educação", "Pesquisa"] },
  { name: "falcone", role: "Programador", company: "Cyber Security Inc", mutual: 15, logo: "F", tags: ["Security", "Python"] },
  { name: "joao pedro", role: "Cabeleireiro", company: "Studio VIP", mutual: 10, logo: "JP", tags: ["Estética", "Atendimento"] },
  { name: "vitor cerqueira", role: "Cantor", company: "Records BR", mutual: 200, isVip: true, logo: "VC", tags: ["Música", "Performance"] },
  { name: "eros", role: "Engenheiro", company: "ConstruTech", mutual: 8, logo: "E", tags: ["Civil", "Projetos"] },
  { name: "jade", role: "Estreming", company: "Twitch Partner", mutual: 150, logo: "JD", tags: ["Live", "Games"] },
  { name: "david kayke", role: "Piao", company: "AgroForte", mutual: 3, logo: "DK", tags: ["Campo", "Logística"] },
  { name: "julio", role: "Marketing", company: "AdAgency", mutual: 18, logo: "J", tags: ["SEO", "Performance"] },
  { name: "predro victor", role: "Professor", company: "Escola SENAI", mutual: 55, isVerified: true, logo: "PV", tags: ["Ensino", "Tech"] },
  { name: "ariane", role: "Policial", company: "Segurança Pública", mutual: 12, logo: "AR", tags: ["Tática", "Investigação"] },
  { name: "calebe", role: "Professor", company: "Code Academy", mutual: 33, logo: "C", tags: ["Lógica", "JS"] },
  { name: "Gabriel Cabreira", role: "Cientista", company: "NASA Research", mutual: 10, isVip: true, isVerified: true, logo: "GC", tags: ["Ciência", "Física", "Astronomia"] },
  { name: "Julie", role: "Programadora", company: "dvscodes", mutual: 28, isVerified: true, logo: "JU", tags: ["React", "Rust", "Linux"] },
  { name: "Liana", role: "Marketing", company: "Digital Growth", mutual: 15, logo: "LI", tags: ["SEO", "Copy", "Ads"] },
  { name: "Maximiliano", role: "Veterinário", company: "Zoo Vet", mutual: 8, logo: "MX", tags: ["Animais", "Medicina"] },
  { name: "Sarah", role: "Veterinária", company: "Pet Health", mutual: 14, logo: "SA", tags: ["Clínica", "Saúde Animal"] },
];

const networkNav = [
  { icon: Users, label: "Conexões", count: 420 },
  { icon: UserPlus, label: "Convites", count: 7 },
  { icon: FileText, label: "Seguindo", count: 108 },
  { icon: Building2, label: "Páginas", count: 15 },
  { icon: Calendar, label: "Eventos", count: 3 },
  { icon: Hash, label: "Hashtags", count: 14 },
];

const Network: React.FC = () => {
  const navigate = useNavigate();
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  const { toast } = useToast();
  const [people, setPeople] = useState<Person[]>(suggestions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"todos" | "vip" | "verificados">("todos");
  const [activeTab, setActiveTab] = useState("Conexões");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const cardStyle = highContrast
    ? "border-2 border-primary bg-background shadow-none"
    : "border border-border/60 bg-card/70 backdrop-blur-xl shadow-md";

  const filtered = people.filter(p => {
    const matchSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter =
      filter === "todos" ||
      (filter === "vip" && p.isVip) ||
      (filter === "verificados" && p.isVerified);
    return matchSearch && matchFilter;
  });

  const handleConnect = (name: string) => {
    setPeople(prev => prev.map(p => p.name === name ? { ...p, connected: true } : p));
    speak(`Convite enviado para ${name}`);
    toast({ title: "Convite enviado! 🤝", description: `Você se conectou com ${name}` });
  };

  const handleSidebarTab = (label: string) => {
    setActiveTab(label);
    toast({ title: label, description: `Acessando área de ${label}.` });
  };

  const handleSeeAll = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const more: Person[] = [
        { name: "Guilherme Santos", role: "Mobile Developer", company: "Nubank", mutual: 14, isVerified: true, logo: "GS", tags: ["React Native", "Swift"] },
        { name: "Carla Diniz", role: "Product Designer", company: "Globo", mutual: 21, isVip: true, logo: "CD", tags: ["UI/UX", "Acessibilidade"] },
        { name: "Felipe Almeida", role: "Fullstack Engineer", company: "C6 Bank", mutual: 3, logo: "FA", tags: ["Node.js", "React"] }
      ];
      setPeople([...people, ...more]);
      setIsLoadingMore(false);
      toast({ title: "Novas Sugestões", description: "Mais conexões adicionadas pelo algoritmo da IA." });
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 max-w-7xl mx-auto pb-20">

      {/* ── SIDEBAR ── */}
      <div className="space-y-4">
        <Card className={cn("overflow-hidden sticky top-20", cardStyle)}>
          <div className="p-5 border-b border-border/50 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent">
            <h2 className={cn("font-black text-foreground font-[Space_Grotesk]", seniorMode ? "text-2xl" : "text-lg")}>
              Sua Rede Premium
            </h2>
            <p className={cn("text-muted-foreground font-medium mt-0.5", seniorMode ? "text-base" : "text-xs")}>
              Gerencie suas conexões
            </p>
          </div>
          <div className="py-2">
            {networkNav.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSidebarTab(item.label)}
                className={cn(
                  "flex items-center justify-between w-full px-5 py-3 hover:bg-muted/40 cursor-pointer transition-colors text-muted-foreground hover:text-foreground font-medium group",
                  seniorMode && "py-4",
                  activeTab === item.label && "text-foreground bg-primary/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5", seniorMode && "w-6 h-6", activeTab === item.label && "text-primary")} />
                  <span className={cn("text-sm", seniorMode && "text-base", activeTab === item.label && "font-bold text-foreground")}>
                    {item.label}
                  </span>
                </div>
                <span className={cn(
                  "text-sm font-black px-2 py-0.5 rounded-full",
                  activeTab === item.label ? "bg-primary text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Hashtags Populares */}
        <Card className={cn("p-4", cardStyle)}>
          <h3 className={cn("font-bold mb-3 flex items-center gap-2", seniorMode ? "text-lg" : "text-sm")}>
            <TrendingUp className="h-4 w-4 text-primary" /> Trending na sua área
          </h3>
          <div className="flex flex-wrap gap-2">
            {["#Acessibilidade", "#ReactJS", "#UXDesign", "#dvscodes", "#TypeScript", "#IA"].map(tag => (
              <span key={tag} className={cn(
                "px-2.5 py-1 rounded-full font-bold cursor-pointer hover:bg-primary/20 transition-colors",
                seniorMode ? "text-sm" : "text-xs",
                tag === "#dvscodes"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-muted/60 text-muted-foreground border border-border/50"
              )}>
                {tag}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* ── MAIN ── */}
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Award, label: "Perfil visto", value: "183×", color: "text-blue-600" },
            { icon: TrendingUp, label: "Apareceu em buscas", value: "42×", color: "text-indigo-600" },
            { icon: Zap, label: "Score de rede", value: "★ 8.7", color: "text-yellow-500" },
          ].map((s, i) => (
            <Card key={i} className={cn("p-3 text-center", cardStyle)}>
              <s.icon className={cn("h-5 w-5 mx-auto mb-1", s.color, seniorMode && "h-6 w-6")} />
              <p className={cn("font-black text-foreground", seniorMode ? "text-xl" : "text-base")}>{s.value}</p>
              <p className={cn("text-muted-foreground font-medium", seniorMode ? "text-sm" : "text-[10px]")}>{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Search + Filter */}
        <Card className={cn("p-4", cardStyle)}>
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar por nome, cargo ou empresa..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={cn("pl-9 rounded-xl border-2", seniorMode && "h-12 text-base")}
              />
            </div>
            <div className="flex gap-2">
              {(["todos", "vip", "verificados"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 rounded-xl font-bold text-sm border-2 transition-all h-10",
                    seniorMode && "h-12 text-base px-4",
                    filter === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/60 text-muted-foreground hover:text-foreground bg-muted/40"
                  )}
                >
                  {f === "todos" ? "Todos" : f === "vip" ? "⭐ VIP" : "✓ Verificados"}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* People Grid */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className={cn("font-bold text-foreground", seniorMode ? "text-xl" : "text-base")}>
              Pessoas que você talvez conheça
              <span className="ml-2 text-muted-foreground font-medium text-sm">({filtered.length})</span>
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary font-bold hover:bg-primary/10"
              onClick={handleSeeAll}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Carregando..." : "Ver todos →"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((person, i) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={cn(
                    "overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl relative",
                    cardStyle,
                    person.isVip && !highContrast && "border-blue-500/30 shadow-blue-500/5"
                  )}>
                    {person.isVip && (
                      <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-0.5 text-[10px] font-black rounded-full flex items-center gap-1 shadow-md">
                        <Sparkles className="w-2.5 h-2.5" /> VIP
                      </div>
                    )}
                    {/* Cover */}
                    <div className={cn(
                      "h-14 w-full",
                      person.isVip
                        ? "bg-gradient-to-r from-blue-700 to-indigo-900"
                        : "bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
                    )} />
                    {/* Body */}
                    <div 
                      className="px-4 pb-4 flex flex-col items-center text-center -mt-7 cursor-pointer group/card"
                      onClick={() => navigate(`/profile/${person.name}`)}
                    >
                      <Avatar className={cn(
                        "h-14 w-14 border-4 border-card shadow-lg mb-2 relative z-10 transition-transform group-hover/card:scale-110",
                        seniorMode && "h-16 w-16",
                        person.isVip && "border-indigo-300 dark:border-indigo-700"
                      )}>
                        <AvatarFallback className={cn(
                          "font-black text-sm",
                          person.isVip ? "bg-gradient-to-br from-blue-700 to-indigo-700 text-white" : "bg-secondary text-secondary-foreground"
                        )}>
                          {person.name === "dvscodes AI Recruiter" ? "dvs" : person.logo}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className={cn("font-bold text-foreground leading-tight line-clamp-2 group-hover/card:text-primary transition-colors", seniorMode ? "text-lg" : "text-sm")}>
                          {person.name}
                        </h4>
                        {person.isVerified && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 fill-blue-500 stroke-white" />
                        )}
                      </div>
                      <p className={cn(
                        "font-medium line-clamp-2 leading-snug mb-1",
                        seniorMode ? "text-sm" : "text-xs",
                        person.isVip ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                      )}>
                        {person.role}
                      </p>
                      <p className={cn("text-muted-foreground/70 font-semibold mb-3", seniorMode ? "text-sm" : "text-[10px]")}>
                        <Building2 className="inline h-3 w-3 mr-0.5" />{person.company}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap justify-center gap-1 mb-3">
                        {person.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className={cn(
                        "flex items-center gap-1 text-muted-foreground/80 font-medium mb-3",
                        seniorMode ? "text-sm" : "text-[10px]"
                      )}>
                        <Users className="w-3 h-3" />{person.mutual} conexões em comum
                      </p>

                      <div className="flex gap-2 w-full">
                        {person.connected ? (
                          <Button disabled className="flex-1 rounded-full font-bold h-9 bg-green-500/10 text-green-600 text-xs border border-green-500/30">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Conectado
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleConnect(person.name)}
                            className={cn(
                              "flex-1 rounded-full font-bold h-9 text-xs",
                              person.isVip
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md"
                                : "border-2 border-primary/40 text-primary bg-transparent hover:bg-primary/10"
                            )}
                          >
                            <UserPlus className="h-3.5 w-3.5 mr-1" />
                            {person.isVip ? "Conectar VIP" : "Conectar"}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full border border-border/60 hover:text-primary hover:bg-primary/5"
                          onClick={() => speak(`${person.name}, ${person.role} na empresa ${person.company}. ${person.mutual} conexões em comum.`)}
                          aria-label="Ouvir perfil"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-bold text-muted-foreground">Nenhuma pessoa encontrada</p>
              <Button variant="ghost" className="mt-2" onClick={() => { setSearchTerm(""); setFilter("todos"); }}>
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Network;
