import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Edit, Plus, ExternalLink, Briefcase, GraduationCap, Palette, Video, CheckCircle, Volume2, Trophy, PlayCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
}

const mockPortfolio: PortfolioItem[] = [
  {
    id: "1",
    title: "Plataforma de IA Inclusiva",
    description: "Desenvolvimento do frontend da nova geração de IA para a dvscodes.",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    link: "#",
  },
  {
    id: "2",
    title: "Sistema de Design Glassmorphism",
    description: "Criação de tokens e bibliotecas visuais focadas em estética translúcida.",
    imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop",
    link: "#",
  },
];

const skills = [
  { name: "React", verified: true }, 
  { name: "TypeScript", verified: true }, 
  { name: "Acessibilidade", verified: true }, 
  { name: "Tailwind CSS", verified: true }, 
  { name: "Figma", verified: false }, 
];

const themeOptions = [
  { label: "ProConnect (Padrão)", value: "from-primary to-accent" },
  { label: "dvscodes Corporate", value: "from-blue-600 to-indigo-800" },
  { label: "Vibrant Sunset", value: "from-orange-500 to-rose-500" },
  { label: "Nature Green", value: "from-emerald-500 to-teal-700" },
];

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  const { toast } = useToast();
  
  const [portfolio] = useState<PortfolioItem[]>(mockPortfolio);
  const [isEditing, setIsEditing] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [themeColor, setThemeColor] = useState(themeOptions[0].value);
  
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || "Seu Nome",
    title: "Especialista em Software Inclusivo",
    bio: "Engenheiro focado em criar o futuro da tecnologia com a dvscodes. Acredito que a estética avançada e a acessibilidade podem coexistir em perfeita harmonia.",
    location: "São Paulo, Brasil",
  });

  const initials = profileData.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);

  // Efeito Glassmorphism desativado no alto contraste
  const cardStyle = highContrast 
    ? "border-2 border-primary bg-background shadow-none" 
    : "border border-white/20 bg-card/60 backdrop-blur-xl shadow-xl shadow-black/5";

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      
      {/* Cenas e Badges 3D - Flutuante */}
      {!seniorMode && !highContrast && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="fixed right-8 top-32 z-10 hidden xl:flex flex-col gap-4"
        >
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 shadow-2xl text-white transform hover:scale-110 hover:-rotate-3 transition-transform cursor-context-menu ring-4 ring-white/20">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-300 drop-shadow-md" />
            <p className="font-bold text-center text-sm shadow-sm">Top 1%<br/>Inclusão</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-4 shadow-2xl text-white transform hover:scale-110 hover:rotate-3 transition-transform cursor-context-menu ring-4 ring-white/20">
            <div className="font-black text-2xl text-center drop-shadow-md">dvs</div>
            <p className="font-bold text-center text-[10px] mt-1 opacity-90">Colaborador</p>
          </div>
        </motion.div>
      )}

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={cn("overflow-hidden rounded-2xl transition-all duration-500", cardStyle)}>
          {/* Banner Editável */}
          <div className={cn("h-48 bg-gradient-to-r transition-colors duration-500", themeColor)} />
          
          <CardContent className="relative pt-0 px-6 sm:px-10">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-4">
              <Avatar className={cn("h-32 w-32 sm:h-40 sm:w-40 border-4 border-background shadow-2xl", seniorMode && "h-40 w-40")}>
                <AvatarFallback className="bg-black text-white text-4xl font-black font-[Space_Grotesk]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-16 sm:mt-0">
                <div className="space-y-1">
                  <h1 className={cn("text-3xl font-black text-foreground font-[Space_Grotesk]", seniorMode && "text-4xl")}>
                    {profileData.name} <CheckCircle className="inline-block w-6 h-6 text-blue-500 ml-1" />
                  </h1>
                  <p className={cn("text-lg font-medium text-primary", seniorMode && "text-xl")}>
                    {profileData.title} na <span className="font-bold text-blue-600 dark:text-blue-400">dvscodes</span>
                  </p>
                  <p className={cn("text-sm text-muted-foreground", seniorMode && "text-base")}>
                    📍 {profileData.location} • <span className="text-blue-500 hover:underline cursor-pointer font-medium">Informações de contato</span>
                  </p>
                </div>
                
                <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => setIsVideoOpen(true)}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-indigo-500/30 gap-2 font-bold"
                  >
                    <PlayCircle className="w-5 h-5" /> Video Pitch IA
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 font-medium"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4" /> Personalizar
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 mt-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Sobre</h3>
                <p className={cn("text-muted-foreground leading-relaxed", seniorMode && "text-xl leading-loose")}>
                  {profileData.bio}
                </p>
                <Button
                  variant="ghost"
                  className="mt-2 text-primary gap-2 pl-0 hover:bg-transparent hover:underline"
                  onClick={() => speak(`Perfil de ${profileData.name}, ${profileData.title}. Localização: ${profileData.location}. Sobre: ${profileData.bio}`)}
                  aria-label="Ouvir Resumo do Perfil"
                >
                  <Volume2 className="h-4 w-4" />
                  {seniorMode ? "Ouvir Resumo em Voz Alta" : "Modo Leitor Narrativo"}
                </Button>
              </div>

              <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Habilidades em Destaque</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill.name}
                      variant="secondary"
                      className={cn("bg-background/80 hover:bg-background border-primary/20 font-medium gap-1 py-1.5 px-3", seniorMode && "text-base")}
                    >
                      {skill.name}
                      {skill.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs com Design Moderno */}
      <Tabs defaultValue="experience" className="mt-8">
        <TabsList className={cn("w-full bg-card/60 backdrop-blur-md justify-start h-auto p-1 rounded-xl border border-white/10 flex-wrap sm:flex-nowrap", seniorMode && "flex-col")}>
          <TabsTrigger value="experience" className={cn("gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2.5 px-6 font-semibold flex-1", seniorMode && "text-lg w-full justify-start py-4")}>
            <Briefcase className="h-4 w-4" /> Experiência VIP
          </TabsTrigger>
          <TabsTrigger value="portfolio" className={cn("gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2.5 px-6 font-semibold flex-1", seniorMode && "text-lg w-full justify-start py-4")}>
            <Palette className="h-4 w-4" /> Portfólio 3D
          </TabsTrigger>
          <TabsTrigger value="education" className={cn("gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2.5 px-6 font-semibold flex-1", seniorMode && "text-lg w-full justify-start py-4")}>
            <GraduationCap className="h-4 w-4" /> Formação
          </TabsTrigger>
          <TabsTrigger value="jobs" className={cn("gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2.5 px-6 font-semibold flex-1", seniorMode && "text-lg w-full justify-start py-4")}>
            <Briefcase className="h-4 w-4" /> Vagas (3)
          </TabsTrigger>
        </TabsList>

        {/* Experience Tab - Destaque dvscodes */}
        <TabsContent value="experience" className="space-y-4 mt-6">
          <Card className={cn("overflow-hidden relative", cardStyle)}>
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <CodeIcon className="w-32 h-32" />
            </div>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-black text-xl">dvs</span>
                </div>
                <div>
                  <h3 className={cn("font-bold text-xl text-foreground", seniorMode && "text-2xl")}>
                    Engenheiro de Software Sênior & Especialista UX
                  </h3>
                  <p className="font-semibold text-blue-600 dark:text-blue-400 text-lg">dvscodes</p>
                  <p className="text-muted-foreground text-sm font-medium mt-1">Jan 2023 - Presente • 3 anos 3 meses</p>
                  <p className="text-muted-foreground text-sm font-medium">São Paulo, Brasil • Híbrido</p>
                  
                  <div className={cn("mt-4 text-foreground/90 space-y-3 leading-relaxed", seniorMode && "text-xl leading-loose")}>
                    <p>
                      Liderando o desenvolvimento da próxima geração de plataformas web com foco absoluto em acessibilidade e estética ultramoderna.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Arquitetura de sistemas Frontend React e Next.js com design "Glassmorphism" adaptativo.</li>
                      <li>Criação de contextos globais para "Modo Sênior" e "Text-to-Speech", impactando milhares de usuários.</li>
                      <li>Integração de Inteligência Artificial para leitura de tela otimizada nativa.</li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/50 flex-wrap">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">TailwindCSS</Badge>
                    <Badge variant="outline">Acessibilidade Web (WCAG)</Badge>
                    <Badge variant="outline">IA Generativa</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={cardStyle}>
            <CardContent className="p-6 sm:p-8">
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-inner flex-shrink-0">
                  <Briefcase className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <h3 className={cn("font-bold text-xl text-foreground", seniorMode && "text-2xl")}>Desenvolvedor Pleno</h3>
                  <p className="font-medium text-foreground">TechCorp Solutions</p>
                  <p className="text-muted-foreground text-sm mt-1">Fev 2020 - Dez 2022 • 2 anos 11 meses</p>
                  <p className={cn("mt-3 text-foreground/80", seniorMode && "text-xl")}>
                    Desenvolvimento de dashboards administrativos e modernização de legado.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <Card className={cn("overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20", cardStyle)}>
                  <div className="aspect-video overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                      <Button variant="secondary" className="font-bold">Ver Projeto Interativo</Button>
                    </div>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className={cn("font-bold text-xl text-foreground mb-2", seniorMode && "text-2xl")}>
                      {item.title}
                    </h3>
                    <p className={cn("text-muted-foreground mb-4 flex-1", seniorMode && "text-lg")}>
                      {item.description}
                    </p>
                    <Button variant="ghost" className="w-full justify-between group-hover:text-primary mt-auto">
                      Acessar repositório <ExternalLink className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="mt-6">
          <Card className={cardStyle}>
            <CardContent className="p-6 sm:p-8">
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className={cn("font-bold text-xl text-foreground", seniorMode && "text-2xl")}>Engenharia de Software</h3>
                  <p className="font-semibold text-foreground">Universidade de Tecnologia</p>
                  <p className="text-muted-foreground text-sm mt-1">2016 - 2020</p>
                  <p className={cn("mt-3 text-foreground/80", seniorMode && "text-xl")}>
                    Especialização em Interação Humano-Computador e Acessibilidade Digital.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs Tab (Vagas Reais e Realistas) */}
        <TabsContent value="jobs" className="mt-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-[Space_Grotesk]">Vagas Recomendadas para o seu Perfil</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">3 Novas Vagas</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vaga 1 */}
            <Card className={cn("transition-all hover:shadow-lg hover:-translate-y-1", cardStyle)}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-14 w-14 bg-red-600 text-white shadow-md border border-red-700/20"><AvatarFallback className="font-bold text-xl bg-red-600">CC</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <h3 className={cn("font-bold text-lg leading-tight", seniorMode && "text-xl")} >UX/UI Designer Especialista</h3>
                    <p className="font-bold text-red-600 mt-1">Coca-Cola</p>
                    <p className="text-sm text-muted-foreground">Híbrido • São Paulo, SP</p>
                    <p className={cn("text-sm mt-3 text-foreground/80 line-clamp-2", seniorMode && "text-base")}>
                      Desenhe as próximas campanhas mundiais da marca focadas 100% em acessibilidade e alcance universal.
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                       <Button size={seniorMode ? "lg" : "sm"} className="font-bold bg-red-600 hover:bg-red-700 text-white w-full shadow-sm">Candidatura Rápida</Button>
                       <Button size={seniorMode ? "lg" : "sm"} variant="outline" className="w-full">Saiba Mais</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vaga 2 */}
            <Card className={cn("transition-all hover:shadow-lg hover:-translate-y-1", cardStyle)}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-14 w-14 bg-[#8A05BE] text-white shadow-md border border-purple-700/20"><AvatarFallback className="font-bold text-xl bg-[#8A05BE]">nu</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <h3 className={cn("font-bold text-lg leading-tight", seniorMode && "text-xl")}>Engenheiro Frontend Sênior</h3>
                    <p className="font-bold text-[#8A05BE] mt-1">Nubank</p>
                    <p className="text-sm text-muted-foreground">Remoto • Brasil</p>
                    <p className={cn("text-sm mt-3 text-foreground/80 line-clamp-2", seniorMode && "text-base")}>
                      Integre nosso time de acessibilidade para tornar nossos serviços financeiros acessíveis a todos os brasileiros.
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                       <Button size={seniorMode ? "lg" : "sm"} className="font-bold bg-[#8A05BE] hover:bg-[#7a04a8] text-white w-full shadow-sm">Candidatura Rápida</Button>
                       <Button size={seniorMode ? "lg" : "sm"} variant="outline" className="w-full">Saiba Mais</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vaga 3 - Premium */}
            <Card className={cn("transition-all hover:shadow-lg hover:-translate-y-1 md:col-span-2 border-indigo-500/30", cardStyle)}>
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 text-xs font-bold rounded-bl-xl shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Promovida por dvscodes
              </div>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-16 w-16 bg-black text-white shadow-lg border-2 border-indigo-500 mt-2"><AvatarFallback className="font-bold text-2xl bg-black">dvs</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <h3 className={cn("font-bold text-xl leading-tight", seniorMode && "text-2xl")}>Líder Técnico de Frontend (Inclusão Visual)</h3>
                    <p className="font-black text-indigo-500 mt-1">dvscodes</p>
                    <p className="text-sm text-muted-foreground">Híbrido • São Paulo, SP</p>
                    <p className={cn("text-sm mt-3 text-foreground/90", seniorMode && "text-base")}>
                      Junte-se ao time que constrói experiências ultramodernas aliadas ao que há de mais avançado em acessibilidade web. Procuramos especialistas em Glassmorphism e integrações com IA.
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/50 flex flex-col sm:flex-row gap-3">
                       <Button size={seniorMode ? "lg" : "default"} className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full shadow-lg h-12">
                         <Trophy className="w-4 h-4 mr-2" /> Candidatura VIP (Garantida)
                       </Button>
                       <Button size={seniorMode ? "lg" : "default"} variant="outline" className="w-full font-bold border-2 h-12" onClick={() => speak("Vaga na dvscodes: Líder Técnico de Frontend. Venha construir experiências ultramodernas com acessibilidade.")}>
                         <Volume2 className="w-4 h-4 mr-2 text-primary" /> Narrar Vaga
                       </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Personalizar Perfil Inclusivo</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Título Profissional</Label>
                <Input value={profileData.title} onChange={(e) => setProfileData({ ...profileData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Localização</Label>
                <Input value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tema do Perfil (Glassmorphism Banner)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {themeOptions.map((theme) => (
                    <div 
                      key={theme.value}
                      onClick={() => setThemeColor(theme.value)}
                      className={cn(
                        "cursor-pointer border-2 rounded-lg p-2 text-center text-xs font-semibold hover:border-primary transition-colors",
                        themeColor === theme.value ? "border-primary bg-primary/10" : "border-border"
                      )}
                    >
                      <div className={cn("h-8 rounded mb-1 bg-gradient-to-r", theme.value)} />
                      {theme.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sobre Mim (Bio)</Label>
                <Textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} rows={5} className="resize-none" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6 border-t pt-4">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button onClick={() => { setIsEditing(false); toast({title:"Salvo", description:"Perfil atualizado com sucesso."}) }} className="font-bold">Salvar Alterações</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Pitch Modal (Simulated) */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-black border-0">
          <div className="aspect-video relative bg-slate-900 flex items-center justify-center group">
            <Video className="w-16 h-16 text-white/50 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="font-bold text-xl mb-1">Apresentação: {profileData.name}</h3>
              <p className="text-white/80 text-sm">Legendas geradas por IA ativadas automaticamente.</p>
            </div>
            <Button 
              variant="outline" 
              className="absolute top-4 right-4 bg-black/50 border-white/20 text-white hover:bg-white/20"
              onClick={() => setIsVideoOpen(false)}
            >
              Fechar
            </Button>
          </div>
          <div className="p-4 bg-card">
            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2"><Trophy className="w-4 h-4"/> 100% Match Cultura dvscodes</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              "Olá recrutadores e parceiros! Sou apaixonado por resolver problemas complexos com soluções elegantes. Acredito firmemente que a tecnologia deve ser bela e inclusiva para todos..."
            </p>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

// SVG Icon Component helper
const CodeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

export default Profile;
