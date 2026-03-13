import React, { useState } from "react";
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
  Clock, CheckCircle2, MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const skills = [
  { name: "React", level: 95, verified: true, endorsements: 42 },
  { name: "TypeScript", level: 90, verified: true, endorsements: 38 },
  { name: "Acessibilidade Web", level: 98, verified: true, endorsements: 27 },
  { name: "Next.js", level: 88, verified: true, endorsements: 31 },
  { name: "Tailwind CSS", level: 92, verified: false, endorsements: 19 },
  { name: "Node.js", level: 80, verified: false, endorsements: 24 },
  { name: "Figma", level: 75, verified: false, endorsements: 15 },
  { name: "WCAG 2.2", level: 97, verified: true, endorsements: 21 },
];

const experiences = [
  {
    role: "Engenheiro Frontend Sênior",
    company: "dvscodes",
    logo: "dvs",
    period: "Jan 2024 – Atual",
    location: "São Paulo, SP (Híbrido)",
    description: "Liderando o desenvolvimento do novo Design System Glassmorphism com foco em acessibilidade WCAG 2.2. Reduzimos o tempo de carregamento em 40% e aumentamos o score de acessibilidade de 68 para 97 pontos.",
    tags: ["React", "TypeScript", "Glassmorphism", "WCAG"],
    isVip: true,
  },
  {
    role: "Desenvolvedor Full Stack",
    company: "Nubank",
    logo: "NU",
    period: "Mar 2022 – Dez 2023",
    location: "São Paulo, SP (Remoto)",
    description: "Contribuí para o growth da plataforma de investimentos com mais de 8M de usuários ativos. Implementei melhorias de acessibilidade que expandiram nossa base em 15%.",
    tags: ["React Native", "Node.js", "GraphQL", "AWS"],
    isVip: false,
  },
  {
    role: "Desenvolvedor Frontend",
    company: "Startup TechBR",
    logo: "TB",
    period: "Jun 2020 – Feb 2022",
    location: "São Paulo, SP",
    description: "Responsável pelo desenvolvimento do produto SaaS de agendamento. Construí do zero a interface do cliente e o painel admin.",
    tags: ["Vue.js", "Firebase", "Figma"],
    isVip: false,
  },
];

const education = [
  {
    degree: "Mestrado em Computação Aplicada",
    school: "USP — Universidade de São Paulo",
    period: "2022 – 2024",
    desc: "Pesquisa em Interfaces Adaptativas com IA e Acessibilidade. TCC premiado como Melhor Trabalho do Ano.",
    logo: "USP",
  },
  {
    degree: "Bacharelado em Ciência da Computação",
    school: "UNICAMP",
    period: "2016 – 2020",
    desc: "Participação em hackathons nacionais. Bolsista de iniciação científica por 2 anos.",
    logo: "UNI",
  },
];

const portfolioItems = [
  {
    title: "ProConnect 2.0",
    desc: "Rede profissional acessível criada com React e Glassmorphism para a dvscodes.",
    color: "from-blue-700 to-indigo-900",
    tags: ["React", "TypeScript", "Supabase"],
    likes: 284,
    views: 3100,
  },
  {
    title: "Sistema IA Inclusiva",
    desc: "Motor de recomendação de vagas com IA acessível para PcD.",
    color: "from-violet-700 to-purple-900",
    tags: ["Python", "FastAPI", "React"],
    likes: 198,
    views: 1840,
  },
  {
    title: "Design System Glassmorphism",
    desc: "Biblioteca de componentes premium com 60+ componentes acessíveis.",
    color: "from-slate-700 to-slate-900",
    tags: ["Figma", "Tailwind", "Storybook"],
    likes: 342,
    views: 5200,
  },
  {
    title: "VoiceFlow — App de Voz",
    desc: "App para narração de vagas e portfólios com TTS avançado.",
    color: "from-emerald-700 to-teal-900",
    tags: ["React Native", "TTS API"],
    likes: 127,
    views: 920,
  },
];

const achievements = [
  { icon: Trophy, label: "Pioneiro dvscodes", desc: "1º usuário da plataforma", color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { icon: Zap, label: "Top Voice", desc: "Inclusão Digital 2025", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
  { icon: BadgeCheck, label: "Verificado", desc: "Perfil certificado", color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { icon: Star, label: "Destaque da Semana", desc: "Março 2026", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
];

const availableJobs = [
  { title: "Especialista UI/UX", company: "dvscodes", salary: "R$ 12–18k", type: "Híbrido", isVip: true },
  { title: "Dev Frontend Sênior", company: "Nubank", salary: "R$ 20–28k", type: "Remoto" },
  { title: "Tech Lead", company: "iFood", salary: "R$ 18–25k", type: "Híbrido" },
];

const COMPANY_COLORS: Record<string, string> = {
  dvs: "bg-gradient-to-br from-blue-700 to-indigo-700",
  NU: "bg-gradient-to-br from-violet-700 to-purple-800",
  TB: "bg-gradient-to-br from-slate-600 to-slate-700",
  USP: "bg-gradient-to-br from-slate-800 to-slate-900",
  UNI: "bg-gradient-to-br from-blue-800 to-blue-900",
};

const completionItems = [
  { label: "Foto de perfil", done: true },
  { label: "Headline profissional", done: true },
  { label: "Experiência adicionada", done: true },
  { label: "Habilidades listadas", done: true },
  { label: "Educação", done: true },
  { label: "Portfólio", done: true },
  { label: "Sobre / Bio", done: false },
  { label: "Contato confirmado", done: false },
];

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  const { toast } = useToast();

  const initials = user?.email?.slice(0, 2).toUpperCase() || "VC";
  const fullName = user?.user_metadata?.full_name || "Seu Nome";
  const [coverTheme, _setCoverTheme] = useState("from-blue-700 via-indigo-700 to-violet-800");
  const [openSkillIdx, setOpenSkillIdx] = useState<number | null>(null);

  const cardStyle = highContrast
    ? "border-2 border-primary bg-background shadow-none"
    : "border border-border/60 bg-card/70 backdrop-blur-xl shadow-md";

  const completedCount = completionItems.filter(i => i.done).length;
  const completionPct = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 max-w-7xl mx-auto pb-20">

      {/* ── MAIN LEFT COLUMN ── */}
      <div className="space-y-4">

        {/* HERO CARD */}
        <Card className={cn("overflow-hidden", cardStyle)}>
          {/* Cover */}
          <div className={cn("h-40 bg-gradient-to-br relative cursor-pointer group", coverTheme)}>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent)]" />
            <button className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1.5 transition-all opacity-0 group-hover:opacity-100">
              <Edit className="h-3 w-3" /> Alterar capa
            </button>
          </div>

          <CardContent className="px-5 pb-5 relative">
            {/* Avatar */}
            <div className="flex justify-between items-start -mt-12 mb-3">
              <div className="relative">
                <Avatar className={cn("h-24 w-24 border-4 border-background shadow-2xl", seniorMode && "h-28 w-28")}>
                  <AvatarFallback className="bg-gradient-to-br from-blue-700 to-indigo-700 text-white font-black text-3xl font-[Space_Grotesk]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-2 border-background rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex gap-2 mt-14">
                <Button
                  onClick={() => speak(`Perfil de ${fullName}. Engenheiro Frontend Sênior na dvscodes. São Paulo, SP.`)}
                  variant="outline" size="sm"
                  className={cn("rounded-full border-2 gap-2 font-bold", seniorMode && "h-12 text-base")}
                >
                  <Volume2 className="h-4 w-4" /> Ouvir
                </Button>
                <Button size="sm" className={cn("rounded-full gap-2 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md", seniorMode && "h-12 text-base")}>
                  <Edit className="h-4 w-4" /> Editar perfil
                </Button>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={cn("font-black text-foreground font-[Space_Grotesk]", seniorMode ? "text-3xl" : "text-2xl")}>
                  {fullName}
                </h1>
                <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-500 stroke-white" />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" /> Top Voice
                </span>
              </div>

              <p className={cn("text-muted-foreground font-semibold mt-1", seniorMode ? "text-lg" : "text-base")}>
                Engenheiro Frontend Sênior · <span className="text-blue-600 dark:text-blue-400 font-black">dvscodes</span>
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <span className={cn("flex items-center gap-1.5 text-muted-foreground font-medium", seniorMode ? "text-base" : "text-sm")}>
                  <MapPin className="h-3.5 w-3.5" /> São Paulo, SP · Brasil
                </span>
                <span className={cn("flex items-center gap-1.5 text-primary font-bold cursor-pointer hover:underline", seniorMode ? "text-base" : "text-sm")}>
                  <Users className="h-3.5 w-3.5" /> 420 conexões
                </span>
                <span className={cn("flex items-center gap-1.5 text-muted-foreground font-medium", seniorMode ? "text-base" : "text-sm")}>
                  <Eye className="h-3.5 w-3.5" /> 183 visualizações
                </span>
              </div>

              {/* Links */}
              <div className="flex gap-3 mt-3 flex-wrap">
                {[
                  { icon: Globe, label: "Portfólio" },
                  { icon: Github, label: "GitHub" },
                  { icon: Mail, label: user?.email || "email@dvscodes.com" },
                ].map((link, i) => (
                  <button key={i} className={cn(
                    "flex items-center gap-1.5 text-primary hover:underline font-semibold",
                    seniorMode ? "text-base" : "text-sm"
                  )}>
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <Button className={cn("rounded-full font-bold gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md", seniorMode && "h-12 text-base")}>
                  <MessageCircle className="h-4 w-4" /> Mensagem
                </Button>
                <Button variant="outline" className={cn("rounded-full font-bold border-2 gap-2", seniorMode && "h-12 text-base")}>
                  <Plus className="h-4 w-4" /> Conectar
                </Button>
                <Button variant="ghost" className={cn("rounded-full font-bold gap-2", seniorMode && "h-12 text-base")}>
                  <Link2 className="h-4 w-4" /> Copiar link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PROFILE COMPLETION */}
        <Card className={cn("p-5", cardStyle)}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={cn("font-black text-foreground font-[Space_Grotesk]", seniorMode ? "text-xl" : "text-base")}>
              Fortaleza do perfil
            </h3>
            <span className={cn("font-black text-primary", seniorMode ? "text-xl" : "text-base")}>{completionPct}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {completionItems.map((item, i) => (
              <div key={i} className={cn("flex items-center gap-2", seniorMode ? "text-base" : "text-xs")}>
                <CheckCircle2 className={cn("h-3.5 w-3.5 shrink-0", item.done ? "text-green-500" : "text-muted-foreground/30")} />
                <span className={item.done ? "text-foreground font-medium" : "text-muted-foreground/50 line-through"}>{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* TABS */}
        <Card className={cn("overflow-hidden", cardStyle)}>
          <Tabs defaultValue="sobre">
            <div className="border-b border-border/50 bg-muted/10">
              <TabsList className="flex w-full rounded-none bg-transparent h-auto p-0 gap-0 overflow-x-auto scrollbar-hide">
                {["sobre", "experiencia", "educacao", "habilidades", "portfolio", "conquistas", "vagas"].map(tab => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={cn(
                      "flex-1 min-w-[90px] rounded-none border-b-2 border-transparent font-bold capitalize py-3.5 text-xs data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-muted/30 transition-all",
                      seniorMode && "text-sm py-4 min-w-[110px]"
                    )}
                  >
                    {{
                      sobre: "Sobre",
                      experiencia: "Experiência",
                      educacao: "Educação",
                      habilidades: "Skills",
                      portfolio: "Portfólio",
                      conquistas: "Conquistas",
                      vagas: "Vagas",
                    }[tab]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* SOBRE */}
            <TabsContent value="sobre" className="p-5 space-y-4">
              <p className={cn("text-foreground font-medium leading-relaxed", seniorMode ? "text-lg leading-loose" : "text-sm")}>
                Engenheiro de Software com 6 anos de experiência em <strong>interfaces web modernas e acessíveis</strong>. Apaixonado pela intersecção entre estética avançada e inclusão digital — acredito que tecnologia bonita pode e deve ser acessível para todos.
              </p>
              <p className={cn("text-foreground font-medium leading-relaxed", seniorMode ? "text-lg leading-loose" : "text-sm")}>
                Atualmente na <span className="text-blue-600 dark:text-blue-400 font-black">dvscodes</span>, liderando a implementação do primeiro Design System Glassmorphism totalmente compatível com WCAG 2.2. Score de acessibilidade 97/100.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["🎯 Especialista em WCAG 2.2", "⚡ React / Next.js", "🎨 Design Thinking", "🌍 Open Source Contributor", "🏆 Top Voice LinkedIn"].map(t => (
                  <span key={t} className={cn("px-3 py-1.5 rounded-full bg-muted/60 border border-border/60 font-semibold text-foreground", seniorMode ? "text-base" : "text-xs")}>
                    {t}
                  </span>
                ))}
              </div>
            </TabsContent>

            {/* EXPERIÊNCIA */}
            <TabsContent value="experiencia" className="p-5 space-y-5">
              {experiences.map((exp, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className={cn("flex gap-4 pb-5", i < experiences.length - 1 && "border-b border-border/40")}>
                    <div className="shrink-0">
                      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm", COMPANY_COLORS[exp.logo] || "bg-secondary")}>
                        {exp.logo}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h4 className={cn("font-black text-foreground", seniorMode ? "text-xl" : "text-base")}>{exp.role}</h4>
                          <p className={cn("font-bold", seniorMode ? "text-base" : "text-sm", exp.isVip ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground")}>
                            {exp.company} {exp.isVip && <Sparkles className="inline h-3.5 w-3.5 text-blue-500" />}
                          </p>
                        </div>
                        {exp.isVip && (
                          <span className="text-[10px] font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-0.5 rounded-full">VIP</span>
                        )}
                      </div>
                      <div className={cn("flex items-center gap-3 mt-1 text-muted-foreground flex-wrap", seniorMode ? "text-sm" : "text-xs")}>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exp.period}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{exp.location}</span>
                      </div>
                      <p className={cn("text-foreground font-medium leading-relaxed mt-2", seniorMode ? "text-base leading-relaxed" : "text-sm")}>
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {exp.tags.map(t => (
                          <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <Button variant="ghost" className={cn("w-full gap-2 font-bold rounded-xl border border-border/50 hover:bg-muted/40", seniorMode && "h-14 text-lg")}>
                <Plus className="h-4 w-4" /> Adicionar experiência
              </Button>
            </TabsContent>

            {/* EDUCAÇÃO */}
            <TabsContent value="educacao" className="p-5 space-y-5">
              {education.map((edu, i) => (
                <div key={i} className={cn("flex gap-4 pb-5", i < education.length - 1 && "border-b border-border/40")}>
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm shrink-0", COMPANY_COLORS[edu.logo] || "bg-secondary")}>
                    {edu.logo}
                  </div>
                  <div className="flex-1">
                    <h4 className={cn("font-black text-foreground", seniorMode ? "text-xl" : "text-base")}>{edu.degree}</h4>
                    <p className={cn("font-bold text-muted-foreground", seniorMode ? "text-base" : "text-sm")}>{edu.school}</p>
                    <p className={cn("text-muted-foreground flex items-center gap-1 mt-0.5", seniorMode ? "text-sm" : "text-xs")}>
                      <Clock className="h-3 w-3" />{edu.period}
                    </p>
                    <p className={cn("text-foreground font-medium mt-2 leading-relaxed", seniorMode ? "text-base" : "text-sm")}>{edu.desc}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className={cn("w-full gap-2 font-bold rounded-xl border border-border/50 hover:bg-muted/40", seniorMode && "h-14 text-lg")}>
                <Plus className="h-4 w-4" /> Adicionar educação
              </Button>
            </TabsContent>

            {/* HABILIDADES */}
            <TabsContent value="habilidades" className="p-5">
              <div className="space-y-3">
                {skills.map((skill, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <button
                      onClick={() => setOpenSkillIdx(openSkillIdx === i ? null : i)}
                      className="w-full text-left group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-bold text-foreground group-hover:text-primary transition-colors", seniorMode ? "text-lg" : "text-sm")}>
                            {skill.name}
                          </span>
                          {skill.verified && (
                            <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500 stroke-white" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span className={cn("font-black text-primary", seniorMode ? "text-base" : "text-sm")}>{skill.level}%</span>
                          <span className={cn("flex items-center gap-1", seniorMode ? "text-sm" : "text-xs")}>
                            <ThumbsUp className="h-3 w-3" />{skill.endorsements}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            skill.level >= 90 ? "bg-gradient-to-r from-green-500 to-emerald-600"
                              : skill.level >= 75 ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                                : "bg-gradient-to-r from-orange-400 to-amber-500"
                          )}
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {openSkillIdx === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 ml-0 p-3 bg-muted/40 border border-border/60 rounded-xl">
                            <p className={cn("text-muted-foreground font-medium", seniorMode ? "text-sm" : "text-xs")}>
                              {skill.endorsements} pessoas validaram esta habilidade {skill.verified && "· Verificado pelo LinkedIn"}
                            </p>
                            <Button size="sm" variant="outline" className="mt-2 rounded-full font-bold border-2 text-xs" onClick={() => toast({ title: "✅ Habilidade validada!" })}>
                              <ThumbsUp className="h-3 w-3 mr-1" /> Validar habilidade
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
              <Button variant="ghost" className={cn("w-full gap-2 font-bold rounded-xl border border-border/50 hover:bg-muted/40 mt-4", seniorMode && "h-14 text-lg")}>
                <Plus className="h-4 w-4" /> Adicionar habilidade
              </Button>
            </TabsContent>

            {/* PORTFÓLIO */}
            <TabsContent value="portfolio" className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolioItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card className={cn("overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all group", cardStyle)}>
                      <div className={cn("h-28 bg-gradient-to-br relative flex items-center justify-center text-white", item.color)}>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <p className="relative z-10 font-black text-lg font-[Space_Grotesk] text-center px-4">{item.title}</p>
                      </div>
                      <CardContent className="p-3">
                        <p className={cn("text-muted-foreground font-medium mb-2", seniorMode ? "text-sm" : "text-xs")}>{item.desc}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags.map(t => (
                            <span key={t} className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span className={cn("flex items-center gap-1", seniorMode ? "text-sm" : "text-xs")}>
                            <ThumbsUp className="h-3 w-3" /> {item.likes}
                          </span>
                          <span className={cn("flex items-center gap-1", seniorMode ? "text-sm" : "text-xs")}>
                            <Eye className="h-3 w-3" /> {item.views.toLocaleString()}
                          </span>
                          <Button variant="ghost" size="sm" className="ml-auto h-7 rounded-full text-primary font-bold text-xs hover:bg-primary/10">
                            <ExternalLink className="h-3 w-3 mr-1" /> Ver
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <Button variant="ghost" className={cn("w-full gap-2 font-bold rounded-xl border border-border/50 hover:bg-muted/40 mt-4", seniorMode && "h-14 text-lg")}>
                <Plus className="h-4 w-4" /> Adicionar projeto
              </Button>
            </TabsContent>

            {/* CONQUISTAS */}
            <TabsContent value="conquistas" className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className={cn("flex items-center gap-4 p-4 rounded-2xl border", ach.bg)}>
                      <div className={cn("h-12 w-12 rounded-xl border flex items-center justify-center shrink-0", ach.bg)}>
                        <ach.icon className={cn("h-6 w-6", ach.color)} />
                      </div>
                      <div>
                        <p className={cn("font-black text-foreground", seniorMode ? "text-lg" : "text-sm")}>{ach.label}</p>
                        <p className={cn("text-muted-foreground font-medium", seniorMode ? "text-base" : "text-xs")}>{ach.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* VAGAS */}
            <TabsContent value="vagas" className="p-5 space-y-3">
              <p className={cn("text-muted-foreground font-medium mb-4", seniorMode ? "text-base" : "text-sm")}>
                <span className="text-primary font-black">{availableJobs.length} vagas</span> compatíveis com seu perfil atual
              </p>
              {availableJobs.map((job, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer hover:shadow-md transition-all group",
                    job.isVip ? "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60" : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                  )}>
                    <div className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0",
                      job.isVip ? "bg-gradient-to-br from-blue-700 to-indigo-700" : "bg-secondary text-secondary-foreground"
                    )}>
                      {job.company === "Nubank" ? "NU" : job.company === "iFood" ? "iF" : "dvs"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-black text-foreground group-hover:text-primary transition-colors", seniorMode ? "text-lg" : "text-sm")}>{job.title}</p>
                      <p className={cn("text-muted-foreground font-semibold", seniorMode ? "text-base" : "text-xs")}>
                        {job.company} · {job.type}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn("font-black text-primary", seniorMode ? "text-base" : "text-sm")}>{job.salary}</p>
                      {job.isVip && (
                        <span className="text-[10px] font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-0.5 rounded-full">VIP</span>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="space-y-4">
        {/* Stats */}
        <Card className={cn("p-4 sticky top-20", cardStyle)}>
          <h3 className={cn("font-black text-foreground mb-4 font-[Space_Grotesk]", seniorMode ? "text-xl" : "text-base")}>
            Análise do perfil
          </h3>
          <div className="space-y-3">
            {[
              { icon: Eye, label: "Quem viu o perfil", value: "183", trend: "+12% esta semana", color: "text-blue-600" },
              { icon: TrendingUp, label: "Aparições em busca", value: "42", trend: "+8% este mês", color: "text-indigo-600" },
              { icon: Users, label: "Conexões diretas", value: "420", trend: "+7 esta semana", color: "text-violet-600" },
              { icon: Star, label: "Score de perfil", value: "97/100", trend: "Excelente", color: "text-yellow-500" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 cursor-pointer transition-colors group">
                <div className={cn("h-9 w-9 rounded-xl bg-muted/60 flex items-center justify-center shrink-0", seniorMode && "h-11 w-11")}>
                  <s.icon className={cn("h-4 w-4", s.color, seniorMode && "h-5 w-5")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-muted-foreground font-medium truncate", seniorMode ? "text-sm" : "text-xs")}>{s.label}</p>
                  <p className={cn("font-black text-foreground", seniorMode ? "text-lg" : "text-base")}>{s.value}</p>
                  <p className={cn("text-green-600 font-semibold", seniorMode ? "text-sm" : "text-[10px]")}>{s.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Open to Work */}
        <Card className={cn("p-4 text-center overflow-hidden relative", cardStyle, "border-green-500/30 bg-green-500/5")}>
          <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse" />
          <div className="h-10 w-10 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-2">
            <Briefcase className="h-5 w-5 text-green-600" />
          </div>
          <h4 className={cn("font-black text-green-600 mb-1", seniorMode ? "text-xl" : "text-base")}>Open to Work</h4>
          <p className={cn("text-muted-foreground font-medium mb-3", seniorMode ? "text-base" : "text-xs")}>
            Disponível para oportunidades remotas e híbridas
          </p>
          <Button size="sm" className="rounded-full font-bold bg-green-500 hover:bg-green-600 text-white border-0 w-full">
            Editar preferências
          </Button>
        </Card>

        {/* People Also Viewed */}
        <Card className={cn("p-4", cardStyle)}>
          <h3 className={cn("font-black text-foreground mb-3 font-[Space_Grotesk]", seniorMode ? "text-lg" : "text-sm")}>
            Quem também visualizou
          </h3>
          <div className="space-y-3">
            {[
              { name: "Carlos Lima", role: "CTO · Embraer", logo: "CL" },
              { name: "dvscodes HR", role: "Recruiter VIP", logo: "dvs", isVip: true },
              { name: "Juliana Porto", role: "UX Lead · iFood", logo: "JP" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3 cursor-pointer group">
                <Avatar className={cn("h-9 w-9 shrink-0", seniorMode && "h-11 w-11")}>
                  <AvatarFallback className={cn("font-black text-xs", p.isVip ? "bg-black text-white" : "bg-secondary text-secondary-foreground")}>
                    {p.logo}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-bold text-foreground group-hover:text-primary truncate", seniorMode ? "text-sm" : "text-xs")}>{p.name}</p>
                  <p className={cn("text-muted-foreground truncate", seniorMode ? "text-sm" : "text-[10px]", p.isVip && "text-blue-600 font-semibold dark:text-blue-400")}>{p.role}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 rounded-full text-primary font-bold text-xs opacity-0 group-hover:opacity-100 border border-primary/30">
                  Ver
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
