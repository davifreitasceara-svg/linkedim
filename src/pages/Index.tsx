import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart, MessageCircle, Share2, ImagePlus, Send, Mic, Volume2,
  Bookmark, Users, Hexagon, Trophy, Sparkles, MoreHorizontal,
  ThumbsUp, Repeat2, TrendingUp, Zap, Globe, ChevronRight,
  Building2, BadgeCheck, Clock, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  author: string;
  authorLogo: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  bookmarked: boolean;
  timeAgo: string;
  isVerified?: boolean;
  isSponsored?: boolean;
  views?: number;
  image?: boolean;
  imageGradient?: string;
  reactions?: { emoji: string; count: number }[];
}

const mockPosts: Post[] = [
  {
    id: "dvs-1",
    author: "dvscodes",
    authorLogo: "dvs",
    title: "Tecnologia & Acessibilidade · Empresa Patrocinada",
    content: "🚀 Orgulhosos em anunciar: nossa nova UI Glassmorphism adaptativa recebeu o **Prêmio WCAG Excellence 2026**!\n\nConstruímos algo que antes parecia impossível: uma interface de alto desempenho visual que mantém 100% de acessibilidade para todos.\n\nIsso é o que a dvscodes representa. #Acessibilidade #DesignInclusivo #dvscodes",
    likes: 3248,
    comments: 418,
    shares: 512,
    liked: false,
    bookmarked: false,
    timeAgo: "2h",
    isVerified: true,
    isSponsored: true,
    views: 48200,
    image: true,
    imageGradient: "from-blue-700 via-indigo-700 to-violet-800",
    reactions: [{ emoji: "👏", count: 1204 }, { emoji: "🚀", count: 843 }, { emoji: "❤️", count: 641 }],
  },
  {
    id: "1",
    author: "João Santos",
    authorLogo: "JS",
    title: "Desenvolvedor Full Stack · Top Voice Inclusão Digital",
    content: "💡 Acabei de abrir meu portfólio com 12 projetos de acessibilidade web — incluindo um leitor de tela 100% feito em React!\n\nLevei 6 meses trabalhando nisso. Cada detalhe foi pensado para que qualquer pessoa possa navegar sem barreiras. Feedback muito bem-vindo! 🙏\n\n#WebAcessível #React #Portfólio",
    likes: 842,
    comments: 93,
    shares: 67,
    liked: true,
    bookmarked: true,
    timeAgo: "4h",
    isVerified: true,
    views: 6100,
    reactions: [{ emoji: "👏", count: 412 }, { emoji: "🔥", count: 230 }],
  },
  {
    id: "2",
    author: "Nubank",
    authorLogo: "NU",
    title: "Fintech · 40 milhões de clientes",
    content: "Estamos contratando! 🟣\n\nAbrimos 80 novas vagas em tecnologia — remoto para todo o Brasil.\n\nEngenheiros Frontend, Backend, Mobile e Data Science. Se você quer construir o banco do futuro, seu lugar é aqui.\n\n👇 Acesse o link para se candidatar.",
    likes: 5109,
    comments: 732,
    shares: 1840,
    liked: false,
    bookmarked: false,
    timeAgo: "5h",
    isVerified: true,
    views: 92400,
    image: true,
    imageGradient: "from-violet-700 via-purple-700 to-pink-800",
    reactions: [{ emoji: "🎉", count: 2100 }, { emoji: "👀", count: 890 }],
  },
  {
    id: "3",
    author: "Mariana Costa",
    authorLogo: "MC",
    title: "UX Lead na iFood · Palestrante",
    content: "Thread sobre como aumentamos em 40% a retenção de usuários idosos no nosso app mudando APENAS esses 5 pontos de UX:\n\n1️⃣ Tamanho mínimo de fonte: 16px\n2️⃣ Contraste de 7:1 em todos os textos\n3️⃣ Reduzimos cliques por fluxo de 7 para 3\n4️⃣ Adicionamos confirmação por voz\n5️⃣ Modo de tela simples (sem animações)\n\nSão pequenas mudanças, resultado enorme. 🔥",
    likes: 1632,
    comments: 201,
    shares: 388,
    liked: false,
    bookmarked: false,
    timeAgo: "7h",
    isVerified: true,
    views: 18700,
    reactions: [{ emoji: "💯", count: 820 }, { emoji: "💡", count: 410 }],
  },
  {
    id: "4",
    author: "Coca-Cola Brasil",
    authorLogo: "CC",
    title: "FMCG & Technology · São Paulo",
    content: "Transformação digital chegou à fábrica! 🏭\n\nImplementamos nossa primeira linha de produção controlada por IA — reduzindo desperdício em 23% e aumentando eficiência em 31%.\n\nOrgulhosos de ter o melhor time de engenharia do Brasil. #IoT #Industria4 #CocaCola",
    likes: 2784,
    comments: 156,
    shares: 423,
    liked: false,
    bookmarked: false,
    timeAgo: "1 dia",
    isVerified: true,
    views: 52000,
    image: true,
    imageGradient: "from-red-700 via-red-600 to-orange-700",
    reactions: [{ emoji: "🔥", count: 1100 }, { emoji: "👏", count: 892 }],
  },
  {
    id: "5",
    author: "Ana Beatriz Fernandes",
    authorLogo: "AB",
    title: "Data Scientist · Petrobras · MSc. IA",
    content: "Resultado da minha pesquisa: modelos de linguagem (LLMs) podem reduzir em 67% o tempo de análise de relatórios geológicos.\n\nPubliquei o artigo completo no GitHub. Foi um prazer enorme trabalhar nessa pesquisa que une ciência de dados com engenharia de petróleo. 🛢️🤖",
    likes: 967,
    comments: 84,
    shares: 213,
    liked: false,
    bookmarked: false,
    timeAgo: "1 dia",
    views: 9200,
    reactions: [{ emoji: "🧠", count: 520 }, { emoji: "🚀", count: 245 }],
  },
];

const storyUsers = [
  { name: "dvscodes", logo: "dvs", isVip: true, seen: false },
  { name: "Nubank", logo: "NU", isVip: false, seen: false },
  { name: "João S.", logo: "JS", isVip: false, seen: true },
  { name: "Mariana", logo: "MC", isVip: false, seen: false },
  { name: "iFood", logo: "iF", isVip: false, seen: true },
  { name: "Embraer", logo: "EM", isVip: false, seen: false },
];

const trending = [
  "#Acessibilidade",
  "#React2026",
  "#dvscodes",
  "#IA",
  "#Nubank",
  "#WCAG",
];

const whoIsOnline = [
  { name: "Felipe Santos", role: "Dev Frontend", logo: "FS" },
  { name: "Carla Mendes", role: "Product Manager", logo: "CM" },
  { name: "dvscodes AI", logo: "dvs", role: "Recrutadora VIP", isVip: true },
];

const Index: React.FC = () => {
  const { user } = useAuth();
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [isListening, setIsListening] = useState(false);

  const initials = user?.email?.slice(0, 2).toUpperCase() || "VC";
  const fullName = user?.user_metadata?.full_name || "Você";

  const cardStyle = highContrast
    ? "border-2 border-primary bg-background shadow-none"
    : "border border-border/60 bg-card/70 backdrop-blur-xl shadow-md";

  const toggleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const toggleBookmark = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p));
  };

  const startListening = () => {
    // @ts-ignore
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast({ title: "Aviso", description: "Seu navegador não suporta digitação por voz.", variant: "destructive" });
      return;
    }
    const r = new SR();
    r.lang = "pt-BR";
    r.onstart = () => setIsListening(true);
    r.onend = () => setIsListening(false);
    r.onresult = (e: any) => setNewPost(p => p ? p + " " + e.results[0][0].transcript : e.results[0][0].transcript);
    r.start();
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      author: fullName,
      authorLogo: initials,
      title: "Publicação",
      content: newPost,
      likes: 0, comments: 0, shares: 0,
      liked: false, bookmarked: false,
      timeAgo: "agora",
      views: 0,
    };
    setPosts([post, ...posts]);
    setNewPost("");
    toast({ title: "✅ Publicado!", description: "Sua postagem está no Feed." });
  };

  const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_300px] gap-5 max-w-7xl mx-auto pb-20">

      {/* ── LEFT SIDEBAR ── */}
      <div className="hidden md:block space-y-4">
        {/* Mini Profile */}
        <Card className={cn("overflow-hidden text-center sticky top-20", cardStyle)}>
          <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-800" />
          <CardContent className="pt-0 pb-4 px-4 relative">
            <Avatar className={cn("h-16 w-16 border-4 border-background shadow-lg mx-auto -mt-8", seniorMode && "h-20 w-20")}>
              <AvatarFallback className="bg-gradient-to-br from-blue-700 to-indigo-700 text-white font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="mt-3">
              <h2 className={cn("font-black text-foreground hover:underline cursor-pointer font-[Space_Grotesk]", seniorMode ? "text-xl" : "text-base")}>
                {fullName}
              </h2>
              <p className={cn("font-semibold text-blue-600 dark:text-blue-400 mt-0.5", seniorMode ? "text-sm" : "text-xs")}>
                Eng. Software na dvscodes
              </p>
            </div>
          </CardContent>
          <div className="border-t border-border/50 bg-muted/10">
            {[
              { label: "Conexões", value: "420" },
              { label: "Quem viu o perfil", value: "183" },
              { label: "Aparições em busca", value: "42" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center px-4 py-2.5 hover:bg-muted/30 cursor-pointer group border-b border-border/30 last:border-0">
                <span className={cn("text-muted-foreground font-medium", seniorMode ? "text-sm" : "text-xs")}>{item.label}</span>
                <span className={cn("text-primary font-black group-hover:underline", seniorMode ? "text-sm" : "text-xs")}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border/50 hover:bg-muted/30 cursor-pointer flex items-center gap-2 transition-colors">
            <Bookmark className="w-4 h-4 text-muted-foreground" />
            <span className={cn("text-foreground font-semibold", seniorMode ? "text-sm" : "text-xs")}>Itens salvos</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground ml-auto" />
          </div>
        </Card>

        {/* Badge Premium */}
        {!seniorMode && !highContrast && (
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/20">
            <div className="p-4 text-center relative">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <Sparkles className="w-full h-full" />
              </div>
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-300 drop-shadow" />
              <h3 className="font-black text-base mb-1 font-[Space_Grotesk]">Pioneiro dvscodes</h3>
              <p className="text-xs text-white/85 leading-relaxed">Entre os primeiros na nova plataforma de acessibilidade premium</p>
              <Button size="sm" className="mt-3 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold text-xs">
                Ver conquistas
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* ── CENTER FEED ── */}
      <div className="space-y-4 min-w-0">
        {/* Stories + Online */}
        <Card className={cn("p-4", cardStyle)}>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {/* Add Story */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
              <div className={cn(
                "h-14 w-14 rounded-2xl border-2 border-dashed border-primary/60 flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors",
                seniorMode && "h-16 w-16"
              )}>
                <span className="text-2xl text-primary font-black">+</span>
              </div>
              <span className={cn("text-muted-foreground font-medium whitespace-nowrap", seniorMode ? "text-sm" : "text-[10px]")}>Você</span>
            </div>
            {storyUsers.map((u, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                <div className={cn(
                  "rounded-2xl p-0.5",
                  u.seen ? "bg-border/60" : u.isVip ? "bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px]" : "bg-gradient-to-br from-primary to-violet-500 p-[2px]"
                )}>
                  <Avatar className={cn("h-13 w-13 rounded-[14px] border-2 border-background", seniorMode && "h-15 w-15")}>
                    <AvatarFallback className={cn(
                      "rounded-[14px] font-black text-sm",
                      u.isVip ? "bg-black text-white" : "bg-secondary text-secondary-foreground"
                    )}>
                      {u.logo}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className={cn("text-foreground font-semibold whitespace-nowrap", seniorMode ? "text-sm" : "text-[10px]")}>{u.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Create Post */}
        <Card className={cardStyle}>
          <CardContent className="pt-4 pb-3 px-4 sm:px-5">
            <div className="flex gap-3">
              <Avatar className={cn("h-11 w-11 shrink-0", seniorMode && "h-14 w-14")}>
                <AvatarFallback className="bg-gradient-to-br from-blue-700 to-indigo-700 text-white font-black text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Tem algo para compartilhar com sua rede?"
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  className={cn(
                    "resize-none border-2 border-border/40 bg-muted/20 hover:bg-muted/30 focus-visible:ring-1 focus-visible:border-primary rounded-2xl py-3 px-4 transition-all font-medium min-h-[44px] placeholder:text-muted-foreground/70",
                    seniorMode && "text-lg",
                    newPost.length > 0 && "min-h-[100px]"
                  )}
                  rows={newPost.length > 0 ? 3 : 1}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 pt-1 border-t border-border/30">
              <div className="flex gap-0.5">
                {[
                  { icon: ImagePlus, label: "Mídia", color: "text-blue-500" },
                  { icon: Hexagon, label: "Evento", color: "text-orange-400" },
                  { icon: Mic, label: "Voz", color: "text-primary", onClick: startListening, active: isListening },
                ].map((a, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    onClick={a.onClick}
                    className={cn(
                      "gap-1.5 font-bold hover:bg-muted/60 rounded-xl",
                      seniorMode && "h-12 px-4",
                      a.active && "bg-primary/10"
                    )}
                  >
                    <a.icon className={cn("h-4 w-4", a.color, seniorMode && "h-5 w-5", a.active && "animate-pulse")} />
                    <span className={cn("hidden sm:inline", seniorMode ? "text-sm" : "text-xs")}>
                      {a.active ? "Ouvindo..." : a.label}
                    </span>
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                size="sm"
                className={cn(
                  "font-black rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/25",
                  seniorMode && "h-12 px-6 text-base"
                )}
              >
                <Send className="h-4 w-4 mr-2" />
                Publicar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feed Divider */}
        <div className="flex items-center gap-2 px-1">
          <div className="h-px bg-border/50 flex-1" />
          <span className={cn("text-muted-foreground font-semibold flex items-center gap-1.5", seniorMode ? "text-sm" : "text-xs")}>
            <Zap className="h-3.5 w-3.5 text-yellow-500" />
            Feed ProConnect 2.0
          </span>
          <div className="h-px bg-border/50 flex-1" />
        </div>

        {/* Posts */}
        <AnimatePresence>
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className={cn("overflow-hidden", cardStyle, post.isSponsored && !highContrast && "border-blue-500/30")}>
                <CardHeader className="pb-2 pt-4 px-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar className={cn("h-12 w-12 rounded-xl cursor-pointer border border-border/50 shadow-sm shrink-0", seniorMode && "h-14 w-14")}>
                        <AvatarFallback className={cn(
                          "rounded-xl font-black text-sm",
                          post.authorLogo === "dvs" ? "bg-gradient-to-br from-blue-700 to-indigo-700 text-white"
                          : post.authorLogo === "NU" ? "bg-violet-700 text-white"
                          : post.authorLogo === "CC" ? "bg-red-700 text-white"
                          : "bg-secondary text-secondary-foreground"
                        )}>
                          {post.authorLogo}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className={cn("font-black text-foreground hover:text-primary cursor-pointer hover:underline leading-tight", seniorMode ? "text-lg" : "text-sm")}>
                            {post.author}
                          </p>
                          {post.isVerified && (
                            <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500 stroke-white shrink-0" />
                          )}
                          {post.isSponsored && (
                            <span className="text-[10px] font-bold uppercase tracking-wide bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                              Destaque
                            </span>
                          )}
                        </div>
                        <p className={cn("text-muted-foreground font-medium", seniorMode ? "text-sm" : "text-xs")}>{post.title}</p>
                        <p className={cn("text-muted-foreground/70 flex items-center gap-1 mt-0.5", seniorMode ? "text-sm" : "text-[11px]")}>
                          <Clock className="h-3 w-3" />{post.timeAgo}
                          {post.views && <><span className="mx-1">·</span><Eye className="h-3 w-3" />{formatCount(post.views)} visualizações</>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => speak(`${post.author} publicou: ${post.content}`)}
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                        aria-label="Ouvir post"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-5 pb-4">
                  <p className={cn("text-foreground font-medium leading-relaxed whitespace-pre-wrap mb-4", seniorMode ? "text-lg leading-loose" : "text-sm")}>
                    {post.content}
                  </p>

                  {/* Image Banner */}
                  {post.image && !seniorMode && !highContrast && (
                    <div className={cn(
                      "rounded-2xl aspect-video bg-gradient-to-br flex items-center justify-center text-white mb-4 overflow-hidden cursor-pointer relative group shadow-inner",
                      post.imageGradient
                    )}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="relative z-10 text-center px-8">
                        <p className="font-black text-3xl mb-2 font-[Space_Grotesk]">{post.author}</p>
                        <p className="text-sm text-white/80 font-medium">{post.title}</p>
                      </div>
                    </div>
                  )}

                  {/* Reactions */}
                  {post.reactions && post.reactions.length > 0 && (
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground border-b border-border/40 pb-2 mb-2 px-1">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1">
                          {post.reactions.slice(0, 3).map((r, i) => (
                            <div key={i} className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] border-2 border-background shadow-sm z-10">
                              {r.emoji}
                            </div>
                          ))}
                        </div>
                        <span className={cn(seniorMode && "text-sm")}>
                          {formatCount(post.reactions.reduce((acc, r) => acc + r.count, 0))} reações
                        </span>
                      </div>
                      <span
                        className={cn("hover:text-primary hover:underline cursor-pointer", seniorMode && "text-sm")}
                        onClick={() => speak(`${post.comments} comentários nesta publicação`)}
                      >
                        {formatCount(post.comments)} comentários
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 -mx-2">
                    {[
                      {
                        icon: ThumbsUp,
                        label: `${formatCount(post.likes)}`,
                        active: post.liked,
                        onClick: () => toggleLike(post.id),
                        activeClass: "text-blue-600 dark:text-blue-400",
                        ariaLabel: post.liked ? "Descurtir" : "Gostei"
                      },
                      { icon: MessageCircle, label: `${formatCount(post.comments)}`, ariaLabel: "Comentar" },
                      { icon: Repeat2, label: `${formatCount(post.shares)}`, ariaLabel: "Compartilhar" },
                      {
                        icon: Bookmark,
                        label: "",
                        active: post.bookmarked,
                        onClick: () => toggleBookmark(post.id),
                        activeClass: "text-yellow-500 fill-yellow-500",
                        ariaLabel: post.bookmarked ? "Remover dos salvos" : "Salvar"
                      },
                    ].map((action, j) => (
                      <Button
                        key={j}
                        variant="ghost"
                        size={seniorMode ? "default" : "sm"}
                        onClick={action.onClick}
                        className={cn(
                          "flex-1 gap-1.5 font-bold hover:bg-muted/60 rounded-xl transition-all",
                          action.active ? action.activeClass : "text-muted-foreground"
                        )}
                        aria-label={action.ariaLabel}
                      >
                        <action.icon className={cn("h-4 w-4", seniorMode && "h-5 w-5", action.active && action.activeClass)} />
                        {action.label && (
                          <span className={cn("hidden sm:inline font-bold", seniorMode && "text-base")}>{action.label}</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="hidden lg:block space-y-4">
        {/* Trending */}
        <Card className={cn("overflow-hidden sticky top-20", cardStyle)}>
          <div className="p-4 border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className={cn("font-black text-foreground font-[Space_Grotesk]", seniorMode ? "text-lg" : "text-base")}>Trending</h3>
          </div>
          <div className="py-2">
            {trending.map((tag, i) => (
              <button key={i} className="w-full text-left px-4 py-2.5 hover:bg-muted/40 transition-colors flex items-center justify-between group">
                <span className={cn("font-bold", seniorMode ? "text-base" : "text-sm", tag === "#dvscodes" ? "text-primary" : "text-foreground")}>
                  {tag}
                </span>
                <span className={cn("text-muted-foreground font-medium", seniorMode ? "text-sm" : "text-xs")}>
                  {[18200, 9400, 7820, 6100, 5490, 4230][i]?.toLocaleString()} posts
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Online Now */}
        <Card className={cn("p-4", cardStyle)}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <h3 className={cn("font-black text-foreground font-[Space_Grotesk]", seniorMode ? "text-lg" : "text-sm")}>Online agora</h3>
          </div>
          <div className="space-y-3">
            {whoIsOnline.map((p, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <Avatar className={cn("h-9 w-9", seniorMode && "h-11 w-11")}>
                    <AvatarFallback className={cn("font-black text-xs", p.isVip ? "bg-black text-white" : "bg-secondary text-secondary-foreground")}>
                      {p.logo}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-bold text-foreground group-hover:text-primary truncate", seniorMode ? "text-sm" : "text-xs")}>{p.name}</p>
                  <p className={cn("text-muted-foreground truncate", seniorMode ? "text-sm" : "text-[10px]", p.isVip && "text-blue-600 dark:text-blue-400 font-semibold")}>{p.role}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-primary/10">
                  <MessageCircle className="h-3.5 w-3.5 text-primary" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Sugestões para Seguir */}
        <Card className={cn("p-4", cardStyle)}>
          <h3 className={cn("font-black text-foreground mb-3 font-[Space_Grotesk]", seniorMode ? "text-lg" : "text-sm")}>
            Adicionar ao feed
          </h3>
          <div className="space-y-4">
            {[
              { logo: "dvs", name: "dvscodes", desc: "Software Inclusivo", isVip: true },
              { logo: "AI", name: "Acessibilidade BR", desc: "Comunidade · 48k membros" },
            ].map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Avatar className={cn("h-10 w-10 rounded-xl", seniorMode && "h-12 w-12")}>
                  <AvatarFallback className={cn("rounded-xl font-black text-xs", s.isVip ? "bg-gradient-to-br from-blue-700 to-indigo-700 text-white" : "bg-primary/20 text-primary")}>
                    {s.logo}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className={cn("font-black text-foreground", seniorMode ? "text-base" : "text-sm")}>{s.name}</h4>
                  <p className={cn("text-muted-foreground mb-2", seniorMode ? "text-sm" : "text-xs")}>{s.desc}</p>
                  <Button variant="outline" size="sm" className="rounded-full h-7 font-bold border-2 hover:bg-muted text-xs">
                    + Seguir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs font-medium text-muted-foreground px-2">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
            {["Sobre", "Privacidade", "Termos", "Ajuda"].map(l => (
              <span key={l} className="hover:text-primary cursor-pointer hover:underline">{l}</span>
            ))}
          </div>
          <p className="font-black text-foreground text-[11px]">ProConnect 2.0 · dvscodes © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
