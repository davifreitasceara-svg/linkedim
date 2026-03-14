import React, { useState, useMemo } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Briefcase, MapPin, Clock, Star, CheckCircle2, Volume2,
  Sparkles, Search, Filter, TrendingUp, Users, Building2,
  ChevronRight, Bookmark, Share2, Zap, Globe, Coffee
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  match: number;
  tags: string[];
  description: string;
  requirements: string[];
  posted: string;
  applied?: boolean;
  isSponsored?: boolean;
  isHot?: boolean;
  remote?: boolean;
  applicants: number;
}

const mockJobs: Job[] = [
  {
    id: "dvs-1",
    title: "Especialista em UI/UX e Acessibilidade",
    company: "dvscodes",
    logo: "dvs",
    location: "São Paulo, SP (Híbrido)",
    type: "CLT",
    salary: "R$ 12.000 – R$ 18.000",
    match: 100,
    tags: ["UX", "Acessibilidade", "Figma", "WCAG"],
    description: "Redefinindo o futuro da web inclusiva. Procuramos alguém apaixonado por estética avançada e rigoroso com diretrizes WCAG. Oferecemos stock options + benefícios Premium.",
    requirements: ["4+ anos de UX", "Conhecimento WCAG 2.2", "Figma avançado"],
    posted: "Há 2h",
    isSponsored: true,
    isHot: true,
    applicants: 48,
  },
  {
    id: "1",
    title: "Desenvolvedor Frontend Sênior",
    company: "Nubank",
    logo: "nu",
    location: "Remoto",
    type: "CLT",
    salary: "R$ 20.000 – R$ 28.000",
    match: 97,
    tags: ["React", "TypeScript", "Design System"],
    description: "Buscamos dev sênior para evoluir nosso Design System e criar experiências de banco digital de classe mundial.",
    requirements: ["5+ anos React", "TypeScript", "Testes automatizados"],
    posted: "Há 3h",
    isHot: true,
    remote: true,
    applicants: 234,
  },
  {
    id: "2",
    title: "Engenheiro de Software Full Stack",
    company: "Coca-Cola",
    logo: "CC",
    location: "São Paulo, SP",
    type: "CLT",
    salary: "R$ 16.000 – R$ 22.000",
    match: 91,
    tags: ["Node.js", "React", "AWS", "SQL"],
    description: "Faça parte da transformação digital da maior marca de bebidas do mundo. Aqui você vai escalar sistemas globais.",
    requirements: ["Node.js", "React", "Cloud AWS", "Banco de dados"],
    posted: "Há 6h",
    applicants: 312,
  },
  {
    id: "3",
    title: "Product Designer — Apps Mobile",
    company: "iFood",
    logo: "iF",
    location: "São Paulo, SP (Híbrido)",
    type: "CLT",
    salary: "R$ 13.000 – R$ 17.000",
    match: 88,
    tags: ["Figma", "UX Research", "Prototipagem"],
    description: "Projete experiências que chegam à mesa de milhões de brasileiros diariamente. Time de design world-class.",
    requirements: ["Figma", "UX Research", "Portfólio sólido"],
    posted: "Há 1 dia",
    applicants: 189,
  },
  {
    id: "4",
    title: "Tech Lead — Plataforma de Pagamentos",
    company: "Mercado Pago",
    logo: "MP",
    location: "Buenos Aires / Remoto",
    type: "CLT",
    salary: "R$ 25.000 – R$ 35.000",
    match: 85,
    tags: ["Java", "Microservices", "Fintech", "Liderança"],
    description: "Lidere squads de alta performance em uma das maiores fintechs da América Latina.",
    requirements: ["Liderança técnica", "Java/Kotlin", "Microservices"],
    posted: "Há 1 dia",
    remote: true,
    applicants: 97,
  },
  {
    id: "5",
    title: "Data Scientist — IA Aplicada",
    company: "Petrobras",
    logo: "PB",
    location: "Rio de Janeiro, RJ",
    type: "PJ / CLT",
    salary: "R$ 18.000 – R$ 26.000",
    match: 82,
    tags: ["Python", "Machine Learning", "Keras", "SQL"],
    description: "Aplique modelos de IA para otimizar operações em uma das maiores empresas de energia do mundo.",
    requirements: ["Python", "TensorFlow / PyTorch", "SQL avançado"],
    posted: "Há 2 dias",
    applicants: 155,
  },
  {
    id: "6",
    title: "Arquiteto de Soluções Cloud",
    company: "Embraer",
    logo: "EM",
    location: "São José dos Campos, SP",
    type: "CLT",
    salary: "R$ 22.000 – R$ 30.000",
    match: 79,
    tags: ["AWS", "Azure", "Kubernetes", "DevOps"],
    description: "Arquitete infraestrutura de missão crítica para a maior fabricante de aeronaves comerciais da América Latina.",
    requirements: ["AWS/Azure certificado", "Kubernetes", "5+ anos cloud"],
    posted: "Há 3 dias",
    applicants: 73,
  },
  {
    id: "7",
    title: "Desenvolvedor Mobile — React Native",
    company: "Rappi",
    logo: "RP",
    location: "Remoto",
    type: "PJ",
    salary: "R$ 14.000 – R$ 19.000",
    match: 76,
    tags: ["React Native", "Expo", "Redux", "TypeScript"],
    description: "Construa o super-app do delivery da América Latina e impacte dezenas de milhões de usuários.",
    requirements: ["React Native", "iOS/Android", "APIs REST"],
    posted: "Há 4 dias",
    remote: true,
    applicants: 267,
  },
];

const FILTERS = ["Todas", "Remoto", "Híbrido", "CLT", "PJ", "Alta compatibilidade"];
const COMPANY_LOGOS: Record<string, string> = {
  dvs: "bg-gradient-to-br from-blue-700 to-indigo-700",
  nu: "bg-gradient-to-br from-violet-600 to-purple-700",
  CC: "bg-gradient-to-br from-red-600 to-red-700",
  iF: "bg-gradient-to-br from-red-500 to-orange-600",
  MP: "bg-gradient-to-br from-blue-500 to-cyan-600",
  PB: "bg-gradient-to-br from-green-600 to-emerald-700",
  EM: "bg-gradient-to-br from-blue-800 to-indigo-900",
  RP: "bg-gradient-to-br from-orange-400 to-yellow-500",
};

const Jobs: React.FC = () => {
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(mockJobs[0]);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const cardStyle = highContrast
    ? "border-2 border-primary bg-background shadow-none"
    : "border border-border/60 bg-card/70 backdrop-blur-xl shadow-md";

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter =
        activeFilter === "Todas" ||
        (activeFilter === "Remoto" && job.remote) ||
        (activeFilter === "Híbrido" && job.location.includes("Híbrido")) ||
        (activeFilter === "CLT" && job.type.includes("CLT")) ||
        (activeFilter === "PJ" && job.type.includes("PJ")) ||
        (activeFilter === "Alta compatibilidade" && job.match >= 88);
      return matchesSearch && matchesFilter;
    });
  }, [jobs, searchTerm, activeFilter]);

  const handleApply = (job: Job) => {
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, applied: true } : j));
    if (selectedJob?.id === job.id) setSelectedJob({ ...job, applied: true });
    speak(`Candidatura enviada para ${job.title} na empresa ${job.company}.`);
    toast({
      title: "✅ Candidatura Enviada!",
      description: job.isSponsored
        ? "Seu perfil foi enviado com destaque VIP para a dvscodes."
        : `Candidatura para ${job.company} enviada com 1 clique.`,
    });
  };

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* ── HEADER ── */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={cn("font-black text-foreground font-[Space_Grotesk]", seniorMode ? "text-3xl" : "text-2xl")}>
              Vagas para você 🎯
            </h1>
            <p className={cn("text-muted-foreground font-medium mt-0.5", seniorMode && "text-lg")}>
              <span className="text-primary font-bold">{filteredJobs.length} vagas</span> compatíveis com o seu perfil
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Cargo, empresa ou skill..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={cn("pl-9 rounded-xl border-2 w-full sm:w-64", seniorMode && "h-12 text-base")}
              />
            </div>
            <Button variant="outline" className={cn("rounded-xl border-2 gap-2 font-bold", seniorMode && "h-12")}>
              <Filter className="h-4 w-4" /> Filtrar
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all",
                seniorMode && "text-base px-5 py-2.5",
                activeFilter === f
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md shadow-indigo-500/25"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 bg-card/60"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── STATS BANNER ── */}
      <div className={cn("grid grid-cols-3 gap-3 mb-6", seniorMode && "grid-cols-1 gap-4")}>
        {[
          { icon: TrendingUp, label: "Vagas novas hoje", value: "3.241", color: "text-blue-600" },
          { icon: Users, label: "Recrutadores ativos", value: "842", color: "text-indigo-600" },
          { icon: Building2, label: "Empresas parceiras", value: "128", color: "text-violet-600" },
        ].map((s, i) => (
          <Card key={i} className={cn("p-4 text-center", cardStyle)}>
            <s.icon className={cn("h-6 w-6 mx-auto mb-1", s.color, seniorMode && "h-8 w-8")} />
            <p className={cn("font-black text-foreground text-xl", seniorMode && "text-3xl")}>{s.value}</p>
            <p className={cn("text-xs text-muted-foreground font-medium", seniorMode && "text-sm")}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* ── MAIN CONTENT: List + Detail ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">

        {/* ── JOB LIST ── */}
        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-hide pr-1">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedJob(job)}
              >
                <Card className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  cardStyle,
                  selectedJob?.id === job.id && !highContrast && "border-primary/60 shadow-md shadow-primary/10 bg-primary/5",
                  job.isSponsored && !highContrast && "border-blue-500/30"
                )}>
                  <CardContent className={cn("p-4", seniorMode && "p-5")}>
                    {/* Top row */}
                    <div className="flex gap-3 mb-3">
                      <Avatar className={cn("h-11 w-11 rounded-xl shrink-0 shadow-sm", seniorMode && "h-14 w-14 rounded-2xl")}>
                        <AvatarFallback className={cn("rounded-xl font-black text-sm text-white", COMPANY_LOGOS[job.logo] || "bg-gradient-to-br from-slate-600 to-slate-700", seniorMode && "rounded-2xl text-base")}>
                          {job.logo}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h3 className={cn("font-bold text-foreground leading-tight line-clamp-2", seniorMode ? "text-lg" : "text-sm")}>
                            {job.title}
                          </h3>
                          {job.isHot && (
                            <span className="shrink-0 text-[10px] font-black bg-orange-500/10 text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Zap className="h-2.5 w-2.5" /> Hot
                            </span>
                          )}
                        </div>
                        <p className={cn("text-muted-foreground font-medium", seniorMode ? "text-base" : "text-xs")}>
                          {job.company}
                        </p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                      <span className={cn("flex items-center gap-1 text-muted-foreground", seniorMode ? "text-sm" : "text-xs")}>
                        <MapPin className="h-3 w-3" />{job.location}
                      </span>
                      <span className={cn("flex items-center gap-1 text-muted-foreground", seniorMode ? "text-sm" : "text-xs")}>
                        <Clock className="h-3 w-3" />{job.posted}
                      </span>
                    </div>

                    {/* Match + Salary */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          "flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-xs",
                          job.match >= 95 ? "bg-green-500/10 text-green-600 border border-green-500/20"
                            : job.match >= 85 ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                              : "bg-muted text-muted-foreground border border-border"
                        )}>
                          <Star className="h-3 w-3 fill-current" /> {job.match}% match
                        </div>
                        {job.isSponsored && (
                          <span className="text-[9px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase tracking-wide">
                            Destaque
                          </span>
                        )}
                      </div>
                      <span className={cn("font-bold text-primary text-xs", seniorMode && "text-sm")}>{job.salary}</span>
                    </div>

                    {job.applied && (
                      <div className="mt-2 flex items-center gap-1 text-green-600 text-xs font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Candidatura enviada
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-bold text-muted-foreground">Nenhuma vaga encontrada</p>
              <Button variant="ghost" className="mt-2" onClick={() => { setSearchTerm(""); setActiveFilter("Todas"); }}>
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        {/* ── JOB DETAIL ── */}
        <AnimatePresence mode="wait">
          {selectedJob && (
            <motion.div
              key={selectedJob.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Card className={cn("sticky top-20 overflow-hidden", cardStyle)}>
                {/* Header Gradient */}
                <div className={cn(
                  "h-28 relative flex items-end p-6",
                  selectedJob.isSponsored
                    ? "bg-gradient-to-br from-blue-700 to-indigo-900"
                    : "bg-gradient-to-br from-slate-700 to-slate-900"
                )}>
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white,_transparent)]" />
                  <div className="flex items-end gap-4 relative z-10 w-full">
                    <Avatar className={cn("h-14 w-14 rounded-2xl border-4 border-white/20 shadow-xl", seniorMode && "h-16 w-16")}>
                      <AvatarFallback className={cn("rounded-2xl font-black text-white text-lg", COMPANY_LOGOS[selectedJob.logo] || "bg-slate-600")}>
                        {selectedJob.logo}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-white">
                      <p className="text-xs font-bold text-white/70 uppercase tracking-wider">{selectedJob.company}</p>
                      <h2 className={cn("font-black leading-tight", seniorMode ? "text-xl" : "text-lg")}>
                        {selectedJob.title}
                      </h2>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => toggleSave(selectedJob.id)}
                        className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                        aria-label={saved.has(selectedJob.id) ? "Remover dos salvos" : "Salvar vaga"}
                      >
                        <Bookmark className={cn("h-4 w-4 text-white", saved.has(selectedJob.id) && "fill-current")} />
                      </button>
                      <button
                        onClick={() => speak(`${selectedJob.title} na empresa ${selectedJob.company}. Salário: ${selectedJob.salary}. ${selectedJob.description}`)}
                        className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                        aria-label="Ouvir vaga"
                      >
                        <Volume2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                <CardContent className={cn("p-6 space-y-5", seniorMode && "p-7 space-y-6")}>
                  {/* Quick info */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: MapPin, label: "Local", value: selectedJob.location },
                      { icon: Briefcase, label: "Contrato", value: selectedJob.type },
                      { icon: Clock, label: "Publicada", value: selectedJob.posted },
                      { icon: Users, label: "Candidatos", value: `${selectedJob.applicants} inscritos` },
                    ].map((info, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-muted/40 border border-border/50">
                        <info.icon className={cn("h-4 w-4 text-primary mt-0.5 shrink-0", seniorMode && "h-5 w-5")} />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{info.label}</p>
                          <p className={cn("font-semibold text-foreground text-xs", seniorMode && "text-sm")}>{info.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Salary + Match */}
                  <div className="flex gap-3">
                    <div className="flex-1 p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Salário</p>
                      <p className={cn("font-black text-primary", seniorMode ? "text-xl" : "text-base")}>{selectedJob.salary}</p>
                    </div>
                    <div className={cn(
                      "flex-1 p-3 rounded-xl border text-center",
                      selectedJob.match >= 90 ? "bg-green-500/5 border-green-500/20" : "bg-muted/40 border-border/50"
                    )}>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Compatibilidade</p>
                      <p className={cn("font-black", seniorMode ? "text-xl" : "text-base", selectedJob.match >= 90 ? "text-green-600" : "text-foreground")}>
                        {selectedJob.match}% ⚡
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <p className={cn("text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2", seniorMode && "text-sm")}>Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className={cn("text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2", seniorMode && "text-sm")}>Descrição</p>
                    <p className={cn("text-foreground font-medium leading-relaxed", seniorMode ? "text-lg" : "text-sm")}>
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* Requirements */}
                  <div>
                    <p className={cn("text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2", seniorMode && "text-sm")}>Requisitos</p>
                    <ul className="space-y-1.5">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className={cn("flex items-center gap-2 text-foreground font-medium", seniorMode ? "text-base" : "text-sm")}>
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-3 pt-1">
                    {selectedJob.applied ? (
                      <Button disabled className={cn("flex-1 rounded-xl font-bold gap-2 bg-green-500/10 text-green-600 border-2 border-green-500/30", seniorMode && "h-14 text-lg")}>
                        <CheckCircle2 className="h-5 w-5" /> Candidatura Enviada!
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleApply(selectedJob)}
                        className={cn(
                          "flex-1 rounded-xl font-black gap-2 shadow-lg",
                          seniorMode ? "h-14 text-xl" : "h-12",
                          selectedJob.isSponsored
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25"
                            : "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white dark:from-primary dark:to-indigo-600"
                        )}
                      >
                        {selectedJob.isSponsored ? <Sparkles className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        {selectedJob.isSponsored ? "Candidatura VIP" : "Candidatar-se"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn("rounded-xl border-2 shrink-0", seniorMode && "h-14 w-14")}
                      aria-label="Compartilhar vaga"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedJob.isSponsored && (
                    <p className="text-center text-xs font-medium text-muted-foreground flex items-center justify-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      Powered by <span className="font-black text-foreground">dvscodes</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Jobs;
