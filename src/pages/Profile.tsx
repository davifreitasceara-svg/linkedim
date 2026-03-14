import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit, Plus, ExternalLink, Briefcase, GraduationCap, Volume2,
  Trophy, Sparkles, BadgeCheck, MapPin, Users, Eye, Star,
  Link2, Github, Globe, Mail, ChevronRight, Building2,
  Award, TrendingUp, BookOpen, Code2, Palette, Zap, ThumbsUp,
  Clock, CheckCircle2, MessageCircle, Shield, Music, Camera, Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// --- THEME DEFINITIONS ---
type ThemeType = "tech" | "legal" | "creative" | "service" | "health" | "default";

interface ProfileTheme {
  cover: string;
  accent: string;
  icon: React.ElementType;
  font: string;
  glow: string;
}

const THEMES: Record<ThemeType, ProfileTheme> = {
  tech: {
    cover: "from-slate-900 via-blue-900 to-black",
    accent: "text-blue-400",
    icon: Code2,
    font: "font-mono",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
  },
  legal: {
    cover: "from-slate-800 via-indigo-950 to-slate-900",
    accent: "text-amber-500",
    icon: Shield,
    font: "font-serif",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  },
  creative: {
    cover: "from-pink-600 via-purple-700 to-indigo-800",
    accent: "text-pink-400",
    icon: Palette,
    font: "font-[Space_Grotesk]",
    glow: "shadow-[0_0_20px_rgba(219,39,119,0.3)]",
  },
  service: {
    cover: "from-emerald-600 via-teal-700 to-cyan-800",
    accent: "text-emerald-400",
    icon: Briefcase,
    font: "font-sans",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
  },
  health: {
    cover: "from-cyan-500 via-blue-600 to-indigo-700",
    accent: "text-cyan-400",
    icon: Stethoscope,
    font: "font-sans",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
  },
  default: {
    cover: "from-blue-700 via-indigo-700 to-violet-800",
    accent: "text-blue-400",
    icon: Users,
    font: "font-sans",
    glow: "",
  }
};

// --- MOCK DATA ENGINE ---
const getPersonData = (name: string | undefined, currentUser: { user_metadata?: { full_name?: string }; email?: string } | null) => {
  if (!name || name.toLowerCase() === "você" || name === currentUser?.user_metadata?.full_name) {
    return {
      name: currentUser?.user_metadata?.full_name || "Seu Nome",
      role: "Engenheiro Frontend Sênior",
      company: "dvscodes",
      location: "São Paulo, SP",
      bio: "Engenheiro de Software com 6 anos de experiência em interfaces web modernas e acessíveis. Apaixonado pela intersecção entre estética avançada e inclusão digital.",
      theme: "tech" as ThemeType,
      isVip: true,
      initials: currentUser?.email?.slice(0, 2).toUpperCase() || "VC",
      skills: ["React", "TypeScript", "Acessibilidade", "Next.js"],
      stats: { views: "1.2k", connections: "420", searches: "85" }
    };
  }

  const n = name.toLowerCase();
  
  if (n.includes("isadora")) return {
    name: "Isadora Lima", role: "Advogada Criminalista", company: "Direito Digital & Associados", location: "Brasília, DF",
    bio: "Especialista em Direito Digital e Cibercrime. Defendendo a ética e a justiça no ambiente virtual desde 2018.",
    theme: "legal" as ThemeType, isVip: true, initials: "IL",
    skills: ["Direito Digital", "LGPD", "Compliance", "Mediação"],
    stats: { views: "3.4k", connections: "1.2k", searches: "210" }
  };

  if (n.includes("levi") || n.includes("paulo") || n.includes("andre") || n.includes("falcone")) return {
    name: name, role: "Software Engineer", company: "dvscodes", location: "Remoto",
    bio: "Transformando café em código performático e escalável. Especialista em arquiteturas modernas e sistemas distribuídos.",
    theme: "tech" as ThemeType, isVip: n.includes("levi"), initials: name.slice(0, 2).toUpperCase(),
    skills: ["Node.js", "React", "Docker", "Kubernetes"],
    stats: { views: "850", connections: "310", searches: "45" }
  };

  if (n.includes("vitor") || n.includes("andreza") || n.includes("sofia") || n.includes("jade")) return {
    name: name, role: n.includes("cantor") ? "Cantor & Compositor" : n.includes("blogueira") ? "Content Creator" : "Estilista / Creative",
    company: "Studio Creative", location: "São Paulo, SP",
    bio: "A arte é a expressão da alma. Criando experiências sensoriais e visuais que conectam pessoas ao redor do mundo.",
    theme: "creative" as ThemeType, isVip: true, initials: name.slice(0, 2).toUpperCase(),
    skills: ["Creative Direction", "Social Media", "Adobe Suite", "Branding"],
    stats: { views: "15k", connections: "5.4k", searches: "1.2k" }
  };

  if (n.includes("veterinari") || n.includes("maximiliano") || n.includes("sarah")) return {
    name: name, role: "Médico Veterinário", company: "Pet Health Specialist", location: "Curitiba, PR",
    bio: "Dedicado ao bem-estar animal e à saúde preventiva. Porque cada vida importa, independentemente do tamanho.",
    theme: "health" as ThemeType, isVip: false, initials: name.slice(0, 2).toUpperCase(),
    skills: ["Medicina Veterinária", "Cirurgia", "Diagnóstico", "Cuidado Animal"],
    stats: { views: "2.1k", connections: "890", searches: "130" }
  };

  if (n.includes("policial") || n.includes("ariane") || n.includes("delegada") || n.includes("gabriel")) return {
    name: name, role: n.includes("delegada") ? "Delegada Federal" : "Oficial de Segurança", company: "Segurança Pública", location: "Brasília, DF",
    bio: "Comprometido com a ordem e a proteção da sociedade. Uso de tecnologia e inteligência para garantir um ambiente mais seguro para todos.",
    theme: "legal" as ThemeType, isVip: n.includes("delegada"), initials: name.slice(0, 2).toUpperCase(),
    skills: ["Estratégia", "Tática", "Investigação", "Liderança"],
    stats: { views: "1.2k", connections: "500", searches: "180" }
  };

  // Default fallback for others
  return {
    name: name,
    role: "Profissional Multidisciplinar",
    company: "Senior Connect Network",
    location: "Brasil",
    bio: "Membro ativo da comunidade ProConnect. Buscando conexões valiosas e crescimento profissional constante na nova economia digital.",
    theme: "service" as ThemeType,
    isVip: false,
    initials: name.slice(0, 2).toUpperCase(),
    skills: ["Comunicação", "Liderança", "Negociação", "Estratégia"],
    stats: { views: "450", connections: "120", searches: "25" }
  };
};

const Profile: React.FC = () => {
  const { name: urlName } = useParams<{ name?: string }>();
  const { user } = useAuth();
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  const { toast } = useToast();

  const person = getPersonData(urlName, user);
  const theme = THEMES[person.theme] || THEMES.default;
  const isOwnProfile = !urlName || urlName.toLowerCase() === "você" || urlName === user?.user_metadata?.full_name;

  const cardStyle = highContrast
    ? "border-2 border-primary bg-background shadow-none"
    : cn("border border-border/60 bg-card/70 backdrop-blur-xl transition-all duration-500", theme.glow);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 max-w-7xl mx-auto pb-20"
    >
      {/* ── MAIN LEFT COLUMN ── */}
      <div className="space-y-4">
        {/* HERO CARD */}
        <Card className={cn("overflow-hidden border-0", cardStyle)}>
          {/* Cover */}
          <div className={cn("h-48 bg-gradient-to-br relative overflow-hidden", theme.cover)}>
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {isOwnProfile && (
              <button className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-2 transition-all border border-white/10">
                <Edit className="h-3.5 w-3.5" /> Editar Capa
              </button>
            )}
          </div>

          <CardContent className="px-6 pb-6 relative">
            {/* Avatar & Actions */}
            <div className="flex justify-between items-end -mt-14 mb-4">
              <div className="relative">
                <Avatar className={cn(
                  "h-28 w-28 border-4 border-background shadow-2xl transition-transform hover:scale-105 duration-300",
                  seniorMode && "h-32 w-32"
                )}>
                  <AvatarFallback className={cn(
                    "text-white font-black text-4xl font-[Space_Grotesk] bg-gradient-to-br",
                    theme.cover
                  )}>
                    {person.initials}
                  </AvatarFallback>
                </Avatar>
                {person.isVip && (
                  <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-4 border-background flex items-center justify-center shadow-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex gap-2 mb-2">
                <Button
                  onClick={() => speak(`Perfil de ${person.name}. ${person.role} na ${person.company}.`)}
                  variant="outline" size="sm"
                  className={cn("rounded-full border-2 gap-2 font-bold backdrop-blur-sm bg-background/50", seniorMode && "h-12 text-base")}
                >
                  <Volume2 className="h-4 w-4" /> {seniorMode ? "Ouvir Perfil" : "Ouvir"}
                </Button>
                
                {isOwnProfile ? (
                  <Button size="sm" className={cn("rounded-full gap-2 font-black bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20", seniorMode && "h-12 text-base")}>
                    <Edit className="h-4 w-4" /> Configurar
                  </Button>
                ) : (
                  <Button 
                    onClick={() => toast({ title: "Conexão solicitada! 🤝", description: `Um convite foi enviado para ${person.name}` })}
                    size="sm" 
                    className={cn("rounded-full gap-2 font-black bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20", seniorMode && "h-12 text-base")}
                  >
                    <Plus className="h-4 w-4" /> Conectar
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className={theme.font}>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={cn("font-black text-foreground drop-shadow-sm", seniorMode ? "text-4xl" : "text-3xl")}>
                  {person.name}
                </h1>
                {person.isVip && <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500 stroke-white" />}
                {person.isVip && (
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3" /> PREMIUM
                  </span>
                )}
              </div>

              <p className={cn("font-bold mt-1 text-lg mb-2", theme.accent)}>
                {person.role} · <span className="text-foreground opacity-80">{person.company}</span>
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
                <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <MapPin className="h-4 w-4 text-primary" /> {person.location}
                </span>
                <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Users className="h-4 w-4 text-primary" /> {person.stats.connections} conexões
                </span>
                <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Eye className="h-4 w-4 text-primary" /> {person.stats.views} visualizações
                </span>
              </div>

              <div className="flex gap-4 mt-6">
                {!isOwnProfile && (
                  <Button variant="outline" className="flex-1 rounded-xl h-12 font-black border-2 gap-2 hover:bg-primary/5 transition-all">
                    <MessageCircle className="h-5 w-5" /> Enviar Mensagem
                  </Button>
                )}
                <Button variant="secondary" className="rounded-xl h-12 px-6 font-black border-2 border-transparent hover:border-border transition-all">
                  <Link2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BIO SECTION */}
        <Card className={cn("p-6", cardStyle)}>
          <div className="flex items-center gap-3 mb-4">
            <theme.icon className={cn("h-6 w-6", theme.accent)} />
            <h3 className={cn("font-black text-foreground text-xl font-[Space_Grotesk]")}>Sobre</h3>
          </div>
          <p className={cn("text-foreground font-medium leading-relaxed", seniorMode ? "text-xl leading-loose" : "text-base")}>
            {person.bio}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {person.skills.map(skill => (
              <span key={skill} className={cn(
                "px-4 py-2 rounded-xl font-bold border-2 transition-all hover:scale-105 cursor-default shadow-sm",
                highContrast ? "border-primary" : "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary"
              )}>
                {skill}
              </span>
            ))}
          </div>
        </Card>

        {/* TABS FOR MORE INFO */}
        <Tabs defaultValue="experiencia" className="w-full">
          <TabsList className="w-full bg-muted/40 p-1 h-14 rounded-2xl border border-border/50 backdrop-blur-md">
            <TabsTrigger value="experiencia" className="flex-1 rounded-xl font-black data-[state=active]:bg-background data-[state=active]:shadow-md">Experiência</TabsTrigger>
            <TabsTrigger value="portfolio" className="flex-1 rounded-xl font-black data-[state=active]:bg-background data-[state=active]:shadow-md">Portfólio</TabsTrigger>
            <TabsTrigger value="conquistas" className="flex-1 rounded-xl font-black data-[state=active]:bg-background data-[state=active]:shadow-md">Conquistas</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="experiencia">
              <Card className={cn("p-6 mt-4 border-0", cardStyle)}>
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center font-black text-white shadow-xl bg-gradient-to-br", theme.cover)}>
                      {person.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-black text-xl">{person.role}</h4>
                      <p className="font-bold text-muted-foreground">{person.company} · Integral</p>
                      <p className="text-sm text-muted-foreground mt-1">Jan 2024 - Presente · 2 anos</p>
                      <p className="mt-4 text-foreground/80 leading-relaxed font-medium">Liderança estratégica e desenvolvimento de soluções inovadoras no setor de {person.role.toLowerCase()}.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="portfolio">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {[1, 2].map(i => (
                  <Card key={i} className={cn("overflow-hidden hover:shadow-2xl transition-all cursor-pointer group border-0", cardStyle)}>
                    <div className={cn("h-32 bg-gradient-to-br relative", theme.cover)}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Star className="h-10 w-10 text-white/50 group-hover:scale-125 transition-transform" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-black text-lg">Projeto de Impacto {i}</h4>
                      <p className="text-sm text-muted-foreground font-medium mt-1">Desenvolvido com foco em alta performance e design adaptativo.</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="space-y-4">
        {/* PROFILE SCORE */}
        <Card className={cn("p-6 text-center border-0", cardStyle)}>
          <div className="relative h-24 w-24 mx-auto mb-4">
            <svg className="h-full w-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
              <motion.circle 
                cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" 
                strokeDasharray={251.2}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 * (1 - 0.95) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={theme.accent}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">95%</div>
          </div>
          <h4 className="font-black text-lg">Score de Perfil</h4>
          <p className="text-xs text-muted-foreground mt-1 font-bold">Excelente · Nível Expert</p>
          <Button variant="outline" className="w-full mt-4 rounded-xl border-2 font-bold hover:bg-primary/5">
            Ver analytics
          </Button>
        </Card>

        {/* SIMILAR PEOPLE */}
        <Card className={cn("p-5 border-0", cardStyle)}>
          <h3 className="font-black text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Perfis Similares
          </h3>
          <div className="space-y-4">
            {["Gabriel", "Julie", "Sarah"].map((name, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer">
                <Avatar className="h-10 w-10 border border-border/50 group-hover:border-primary transition-colors">
                  <AvatarFallback className="bg-muted text-xs font-bold">{name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{name}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold truncate">Profissional Verificado</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all mr-1" />
              </div>
            ))}
          </div>
        </Card>

        {/* ADS / CTA */}
        <Card className={cn("p-6 bg-primary text-primary-foreground border-0 shadow-xl relative overflow-hidden")}>
          <div className="absolute -top-10 -right-10 h-32 w-32 bg-white/10 rounded-full blur-3xl" />
          <Award className="h-10 w-10 mb-4 opacity-80" />
          <h4 className="font-black text-lg leading-tight mb-2">Seja Membro Premium</h4>
          <p className="text-xs font-medium opacity-90 mb-4">Acesse estatísticas avançadas e tenha destaque em buscas de recrutamento.</p>
          <Button className="w-full bg-white text-primary hover:bg-slate-100 transition-all font-black rounded-xl">
            Saber mais
          </Button>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;
