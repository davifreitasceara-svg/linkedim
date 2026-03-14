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
      stats: { views: "1.2k", connections: "420", searches: "85" },
      highlights: ["Líder Técnico dvscodes", "Especialista WCAG", "Open Source Contributor"]
    };
  }

  const n = name.toLowerCase();
  
  // --- INDIVIDUAL PERSONALIZATION ---

  // LEGAL & SECURITY
  if (n.includes("eduarda leal")) return {
    name: "Eduarda Leal", role: "Delegada Federal", company: "Polícia Federal", location: "Brasília, DF",
    bio: "Especialista em inteligência cibernética e combate ao crime organizado. Atuando na linha de frente da segurança nacional com foco em tecnologia forense.",
    theme: "legal" as ThemeType, isVip: true, initials: "EL",
    skills: ["Inteligência", "Forense Digital", "Criminologia", "Gestão de Crise"],
    stats: { views: "5.2k", connections: "1.8k", searches: "450" },
    highlights: ["Medalha Mérito Policial", "Caso 'Dark Web' 2025", "Expert em Cripto-investigação"]
  };
  if (n.includes("isadora")) return {
    name: "Isadora Lima", role: "Advogada de Direito Digital", company: "CyberLaw & Associados", location: "São Paulo, SP",
    bio: "Defensora da privacidade e da ética na rede. Especialista em LGPD e litígios envolvendo tecnologia e propriedade intelectual.",
    theme: "legal" as ThemeType, isVip: true, initials: "IL",
    skills: ["LGPD", "Compliance", "Direito Digital", "Propriedade Intelectual"],
    stats: { views: "3.1k", connections: "950", searches: "180" },
    highlights: ["Top Voice Jurídico 2026", "Consultora 'Privacy First'", "Palestrante WebSummit"]
  };
  if (n.includes("gabriel") && !n.includes("cabreira")) return {
    name: "Gabriel Santos", role: "Policial Militar", company: "Segurança Pública", location: "Curitiba, PR",
    bio: "Dedicado ao policiamento ostensivo e à proteção da comunidade. Especialista em táticas urbanas e mediação de conflitos.",
    theme: "legal" as ThemeType, isVip: false, initials: "G",
    skills: ["Tática Urbana", "Segurança", "Mediação", "Primeiros Socorros"],
    stats: { views: "1.1k", connections: "480", searches: "95" },
    highlights: ["Destaque Operacional", "Instrutor de Táticas", "Comunitário do Ano"]
  };
  if (n.includes("ariane")) return {
    name: "Ariane Souza", role: "Policial Civil / Investigadora", company: "Segurança Pública", location: "Belém, PA",
    bio: "Investigadora focada em crimes financeiros e lavagem de dinheiro. Unindo perícia técnica e faro investigativo para servir ao estado.",
    theme: "legal" as ThemeType, isVip: false, initials: "AS",
    skills: ["Investigação", "Perícia", "Criminalística", "Análise de Dados"],
    stats: { views: "1.5k", connections: "620", searches: "110" },
    highlights: ["Certificação Anti-Fraude", "Caso 'Lavanderia' 2025", "Perita em Rastreamento"]
  };

  // TECH & INNOVATION
  if (n.includes("issac silva")) return {
    name: "Isaac Silva", role: "Desenvolvedor Full Stack Sênior", company: "dvscodes", location: "Rio de Janeiro, RJ",
    bio: "Arquiteto de sistemas apaixonado por código limpo e escalabilidade. Especialista em ecossistemas JavaScript/TypeScript e arquitetura serverless.",
    theme: "tech" as ThemeType, isVip: true, initials: "IS",
    skills: ["React", "Node.js", "Serverless", "Arquitetura"],
    stats: { views: "4.1k", connections: "1.4k", searches: "320" },
    highlights: ["MVP dvscodes 2025", "Speaker na JSConf", "Criador do 'Inclusion-UI'"]
  };
  if (n.includes("levi")) return {
    name: "Levi Costa", role: "Backend Developer / Go Expert", company: "dvscodes", location: "Remoto",
    bio: "Construindo motores de processamento de alta performance em Go e Rust. Focado em baixa latência e sistemas distribuídos.",
    theme: "tech" as ThemeType, isVip: true, initials: "L",
    skills: ["Go", "Rust", "Distributed Systems", "Cloud Engine"],
    stats: { views: "2.8k", connections: "890", searches: "150" },
    highlights: ["Contribuidor Core Go", "Microservices Expert", "Latência Zero Award"]
  };
  if (n.includes("gabriel cabreira")) return {
    name: "Gabriel Cabreira", role: "Cientista de Dados / IA Researcher", company: "NASA Research", location: "Houston, TX",
    bio: "Pesquisador em aprendizado de máquina aplicado à astrofísica. Traduzindo dados estelares em modelos preditivos que expandem nossa visão do cosmos.",
    theme: "tech" as ThemeType, isVip: true, initials: "GC",
    skills: ["Python", "Machine Learning", "Physics", "Big Data"],
    stats: { views: "8.5k", connections: "2.1k", searches: "800" },
    highlights: ["Prêmio NASA Innovation", "Publicação na Nature", "IA Discovery Pioneer"]
  };
  if (n.includes("julie")) return {
    name: "Julie Wagner", role: "Sênior Rust Engineer", company: "dvscodes", location: "Palo Alto, CA",
    bio: "Explorando os limites da segurança de memória com Rust. Focada em otimização de sistemas críticos e infraestrutura de hardware.",
    theme: "tech" as ThemeType, isVip: true, initials: "JW",
    skills: ["Rust", "Systems Engineering", "Security", "C++"],
    stats: { views: "3.2k", connections: "1.1k", searches: "240" },
    highlights: ["Rustacean of the Year", "Optimized Core 2026", "Security Lead"]
  };
  if (n.includes("andre") && !n.includes("andreza")) return {
    name: "Andre Oliveira", role: "Cloud Architect / DevOps", company: "DevCloud Solutions", location: "Curitiba, PR",
    bio: "Automatizando o impossível. Especialista em infraestrutura como código e pipelines de CI/CD que rodam na velocidade da luz.",
    theme: "tech" as ThemeType, isVip: false, initials: "A",
    skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
    stats: { views: "1.9k", connections: "540", searches: "130" },
    highlights: ["AWS Certified Hero", "Docker Optimization Award", "DevOps Master"]
  };
  if (n.includes("paulo")) return {
    name: "Paulo Mendes", role: "Java Solutions Architect", company: "Fintech Pro", location: "Belo Horizonte, MG",
    bio: "Especialista em sistemas bancários de alta confiabilidade. Transformando requisitos financeiros em arquiteturas robustas e seguras.",
    theme: "tech" as ThemeType, isVip: false, initials: "P",
    skills: ["Java", "Spring Boot", "Microservices", "Fintech"],
    stats: { views: "1.6k", connections: "480", searches: "90" },
    highlights: ["Java Champion", "Arquitetura PIX 2.0", "Security First"]
  };
  if (n.includes("falcone")) return {
    name: "Falcone Silva", role: "Cybersecurity Analyst", company: "ArmorTech", location: "Vila Velha, ES",
    bio: "Defendendo perímetros digitais. Especialista em testes de invasão e proteção de dados contra ameaças persistentes avançadas.",
    theme: "tech" as ThemeType, isVip: false, initials: "F",
    skills: ["Pentest", "Infosec", "Crypto", "Python"],
    stats: { views: "1.2k", connections: "390", searches: "70" },
    highlights: ["Certified Hacker (CEH)", "Bug Bounty Top 10", "Firewall Expert"]
  };

  // CREATIVE & MEDIA
  if (n.includes("kauan")) return {
    name: "Kauan Streamer", role: "Pro Gamer & Content Creator", company: "Independent", location: "Belo Horizonte, MG",
    bio: "Criando entretenimento de alta qualidade através do streaming. Compartilhando gameplays épicas e construindo uma comunidade vibrante.",
    theme: "creative" as ThemeType, isVip: true, initials: "K",
    skills: ["Streaming", "Video Editing", "Gaming", "Branding"],
    stats: { views: "25k", connections: "5.1k", searches: "1.5k" },
    highlights: ["Top 10 Twitch BR", "Parceiro Oficial ProConnect", "Recorde de Views"]
  };
  if (n.includes("jade")) return {
    name: "Jade Streaming", role: "Twitch Partner / Influencer", company: "Galaxy Squad", location: "Internet",
    bio: "A maior hub de entretenimento live. Focada em talk shows, design de interiores virtual e engajamento comunitário em tempo real.",
    theme: "creative" as ThemeType, isVip: true, initials: "JD",
    skills: ["Live", "Social Media", "Community", "Entertainment"],
    stats: { views: "18k", connections: "4.2k", searches: "1.1k" },
    highlights: ["Socia de Honra ProConnect", "Trend Topic 2026", "Criatividade Premium"]
  };
  if (n.includes("andreza")) return {
    name: "Andreza Blogueira", role: "Digital Influencer / Lifestyle", company: "Trendsetters", location: "Recife, PE",
    bio: "Conectando marcas a pessoas de forma autêntica. Especialista em curadoria de estilo, viagens e inovação no mercado de beleza.",
    theme: "creative" as ThemeType, isVip: true, initials: "AZ",
    skills: ["Storytelling", "SEO", "Marketing", "Curadoria"],
    stats: { views: "120k", connections: "15k", searches: "8.2k" },
    highlights: ["Blogger of the Year", "Lançamento 'Trend2026'", "Embaixadora Glam"]
  };
  if (n.includes("vitor cerqueira")) return {
    name: "Vitor Cerqueira", role: "Cantor & Compositor", company: "Art Records", location: "Salvador, BA",
    bio: "A música como ponte entre o clássico e o moderno. Explorando novas sonoridades e emocionando públicos ao redor do Brasil.",
    theme: "creative" as ThemeType, isVip: true, initials: "VC",
    skills: ["Composição", "Performance", "Produção", "Vocal"],
    stats: { views: "45k", connections: "8.5k", searches: "2.1k" },
    highlights: ["Grammy Latino Nominee", "Turnê 'Inovação'", "Top Chart Artist"]
  };
  if (n.includes("sofia")) return {
    name: "Sofia Designer", role: "Fashion Estilista / Designer", company: "Vogue Creative", location: "Milão / Remoto",
    bio: "Redefinindo o conceito de alta costura com materiais sustentáveis. Unindo design clássico com inovação têxtil de 2026.",
    theme: "creative" as ThemeType, isVip: true, initials: "S",
    skills: ["Fashion Design", "Textiles", "Creativity", "Sustainability"],
    stats: { views: "3.8k", connections: "1.2k", searches: "310" },
    highlights: ["Seman de Moda de Milão", "Eco-Designer do Ano", "Vogue Featured"]
  };
  if (n.includes("joao pedro")) return {
    name: "João Pedro Studio", role: "Master Hair Stylist / Visagista", company: "Studio VIP", location: "Fortaleza, CE",
    bio: "Transformando a autoimagem através do visagismo. Especialista em cortes de alta precisão e colorimetria avançada.",
    theme: "creative" as ThemeType, isVip: false, initials: "JP",
    skills: ["Visagisimo", "Corte", "Atendimento Premium", "Colorimetria"],
    stats: { views: "2.1k", connections: "940", searches: "160" },
    highlights: ["Tesoura de Ouro 2025", "Mestre em Colometria", "Studio Referência"]
  };
  if (n.includes("julio")) return {
    name: "Julio Marketing", role: "Performance Director", company: "AdAgency Pro", location: "Florianópolis, SC",
    bio: "Métricas que contam histórias. Especialista em campanhas de alta conversão e análise comportamental em escala.",
    theme: "creative" as ThemeType, isVip: false, initials: "J",
    skills: ["Google Ads", "Analytics", "Copywriting", "Estratégia"],
    stats: { views: "1.9k", connections: "520", searches: "110" },
    highlights: ["Google Premier Partner", "Expert em CRO", "Data-Driven Strategy"]
  };
  if (n.includes("liana")) return {
    name: "Liana Growth", role: "Growth Marketer / SEO", company: "Digital Launch", location: "Dublin, IE",
    bio: "Escalando startups globalmente. Focada em SEO técnico, retenção de usuários e expansão de mercado no ecossistema europeu.",
    theme: "creative" as ThemeType, isVip: false, initials: "LI",
    skills: ["SEO", "User Growth", "Market Research", "Product"],
    stats: { views: "2.5k", connections: "740", searches: "190" },
    highlights: ["SEO of the Year 2025", "Growth Lead Europe", "Analytics Master"]
  };

  // HEALTH
  if (n.includes("sarah")) return {
    name: "Sarah Miller", role: "Médica Veterinária Especialista", company: "Pet Health Global", location: "Toronto, CA",
    bio: "Dedicada à saúde preventiva e bem-estar de animais domésticos. Especialista em diagnósticos por imagem e cuidados paliativos.",
    theme: "health" as ThemeType, isVip: false, initials: "SM",
    skills: ["Diagnóstico", "Cirurgia", "Cuidado Animal", "Medicina"],
    stats: { views: "2.1k", connections: "890", searches: "130" },
    highlights: ["Clínica Destaque 2025", "Especialista em Felinos", "Saúde Animal Award"]
  };
  if (n.includes("maximiliano")) return {
    name: "Maximiliano Vet", role: "Veterinário de Animais Exóticos", company: "Wildlife Clinic", location: "Berlim, DE",
    bio: "Referência no tratamento de aves e répteis. Comprometido com a conservação e medicina de espécies selvagens.",
    theme: "health" as ThemeType, isVip: false, initials: "MX",
    skills: ["Exóticos", "Biologia", "Resgate", "Cirurgia"],
    stats: { views: "3.2k", connections: "1.1k", searches: "210" },
    highlights: ["Conservacionista do Ano", "Resgate Wildlife Pioneer", "PhD em Exóticos"]
  };

  // SERVICES & PRODUCTION
  if (n.includes("vice") || n.includes("vicente")) return {
    name: "Vicente Técnico", role: "Técnico Especialista em Redes", company: "Tech Support BR", location: "São Paulo, SP",
    bio: "Solucionando problemas de infraestrutura de rede em tempo recorde. Especialista em hardware crítico e conectividade 6G.",
    theme: "service" as ThemeType, isVip: false, initials: "V",
    skills: ["Hardware", "Infra Redes", "Suporte", "Manutenção"],
    stats: { views: "1.1k", connections: "320", searches: "60" },
    highlights: ["Nível Diamante Suporte", "Especialista 6G", "Hardware Master"]
  };
  if (n.includes("davi oliveira")) return {
    name: "Davi Oliveira", role: "Operador de Maquinário Pesado", company: "Indústria X", location: "Santos, SP",
    bio: "Expertise técnica na operação de guindastes e sistemas industriais complexos. Focado em segurança operacional e produtiva no setor portuário.",
    theme: "service" as ThemeType, isVip: false, initials: "DO",
    skills: ["Mecânica", "Operação", "Segurança Industrial", "Logística"],
    stats: { views: "1.3k", connections: "280", searches: "45" },
    highlights: ["Operação Segura 2025", "Eficiência Portuária", "Mestre Industrial"]
  };
  if (n.includes("david kayke")) return {
    name: "David Kayke Peão", role: "Gestor Agro / Campo Expert", company: "Fazenda AgroForte", location: "Cuiabá, MT",
    bio: "Liderando a produção agrícola com tecnologia de ponta. Unindo a tradição do campo com as inovações do agronegócio digital.",
    theme: "service" as ThemeType, isVip: false, initials: "DK",
    skills: ["AgroTech", "Gestão", "Pecuária", "Máquinas"],
    stats: { views: "2.4k", connections: "410", searches: "180" },
    highlights: ["Fazenda Digital do Ano", "Líder Agrotech", "Inovação no Campo"]
  };
  if (n.includes("aristotoles")) return {
    name: "Aristóteles Silva", role: "Gestor de Logística / Entregador", company: "Flash Delivery", location: "Porto Alegre, RS",
    bio: "Otimizando rotas e garantindo entregas perfeitas. Especialista na última milha da logística urbana com foco em eficiência.",
    theme: "service" as ThemeType, isVip: false, initials: "AS",
    skills: ["Logística", "Gestão Rotas", "Agilidade", "Transporte"],
    stats: { views: "900", connections: "220", searches: "40" },
    highlights: ["Entrega Recorde 2026", "Logística Urbana Sênior", "Flash Delivery Ace"]
  };

  // EDUCATION & ACADEMIC
  if (n.includes("diogo") || n.includes("predro victor") || n.includes("calebe") || n.includes("professor")) return {
    name: name, role: n.includes("diogo") ? "Professor de História" : n.includes("predro") ? "Especialista em Robótica" : "Educador Sênior",
    company: n.includes("predro") ? "SENAI Hub" : "University Tech", location: "Brasil",
    bio: "Educando as próximas gerações para o futuro digital. Acreditamos que o conhecimento é a principal ferramenta de inclusão e progresso.",
    theme: "default" as ThemeType, isVip: false, initials: name.slice(0, 2).toUpperCase(),
    skills: ["Educação", "Didática", "Metodologias Ativas", "Ensino"],
    stats: { views: "3.2k", connections: "890", searches: "240" },
    highlights: ["Educador Nota 10", "Destaque Acadêmico", "Inovação Educacional"]
  };

  if (n.includes("eros")) return {
    name: "Eros Martins", role: "Engenheiro Civil / Estruturas", company: "ConstruTech SA", location: "Goiânia, GO",
    bio: "Expert em cálculos estruturais complexos e grandes obras. Focado em construção sustentável e novos materiais de 2026.",
    theme: "tech" as ThemeType, isVip: false, initials: "E",
    skills: ["Cálculo", "Projetos", "Sustentabilidade", "Obras"],
    stats: { views: "1.4k", connections: "450", searches: "80" },
    highlights: ["Sustentabilidade em Obras", "Estrutura do Ano", "Inovação Civil"]
  };

  // Default fallback
  return {
    name: name,
    role: "Profissional na dvscodes Network",
    company: "Conectado",
    location: "Brasil",
    bio: "Entusiasta de tecnologia e conexões humanas. Buscando colaborar em projetos inovadores e expandir horizontes no ProConnect.",
    theme: "default" as ThemeType,
    isVip: false,
    initials: name.slice(0, 2).toUpperCase(),
    skills: ["Soft Skills", "Colaboração", "Netwoking", "Adaptabilidade"],
    stats: { views: "450", connections: "120", searches: "25" },
    highlights: ["Iniciante Premium", "Conectado", "Pioneer"]
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

        {/* HIGHLIGHTS SECTION */}
        {person.highlights && (
          <Card className={cn("p-6", cardStyle)}>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className={cn("h-6 w-6", theme.accent)} />
              <h3 className={cn("font-black text-foreground text-xl font-[Space_Grotesk]")}>Destaques</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {person.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/40 group hover:border-primary/50 transition-all">
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center bg-background shadow-sm")}>
                    <Award className={cn("h-4 w-4", theme.accent)} />
                  </div>
                  <span className="font-bold text-sm text-foreground/90">{h}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

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
