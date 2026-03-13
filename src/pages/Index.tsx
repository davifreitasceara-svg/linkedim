import React, { useState, useEffect, useRef } from "react";
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
  Building2, BadgeCheck, Clock, Eye, Smile, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author: string;
  initials: string;
  text: string;
  time: string;
}

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
  commentsList?: Comment[];
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
    commentsList: [
      { id: "c1", author: "Felipe Santos", initials: "FS", text: "Isso é revolucionário! Parabéns ao time.", time: "1h" },
      { id: "c2", author: "Carla Mendes", initials: "CM", text: "Excelente trabalho em UX.", time: "45m" }
    ]
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
  },
];

const storyUsers = [
  { name: "Sua história", logo: "+", isMe: true, seen: false },
  { name: "dvscodes", logo: "dvs", isVip: true, seen: false },
  { name: "Nubank", logo: "NU", isVip: false, seen: false },
  { name: "João S.", logo: "JS", isVip: false, seen: true },
  { name: "iFood", logo: "iF", isVip: false, seen: true },
  { name: "Embraer", logo: "EM", isVip: false, seen: false },
  { name: "XP Inc.", logo: "XP", isVip: false, seen: false },
];

const Index: React.FC = () => {
  const { user } = useAuth();
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [likingId, setLikingId] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const initials = user?.email?.slice(0, 2).toUpperCase() || "VC";
  const fullName = user?.user_metadata?.full_name || "Você";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoadingMore]);

  const cardStyle = highContrast
    ? "border-2 border-primary bg-background shadow-none"
    : "border border-border/60 bg-card/70 backdrop-blur-xl shadow-md";

  const toggleLike = (postId: string) => {
    setLikingId(postId);
    setTimeout(() => setLikingId(null), 400);
    
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const extra: Post[] = [
        {
          id: `extra-${Date.now()}`,
          author: "Ana Beatriz Fernandes",
          authorLogo: "AB",
          title: "Data Scientist · Petrobras",
          content: "Resultado da minha pesquisa: modelos de linguagem (LLMs) podem reduzir em 67% o tempo de análise de relatórios geológicos. #IA #Petrobras",
          likes: 967,
          comments: 84,
          shares: 213,
          liked: false,
          bookmarked: false,
          timeAgo: "1 dia",
          views: 9200,
        }
      ];
      setPosts(prev => [...prev, ...extra]);
      setIsLoadingMore(false);
    }, 1500);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_300px] gap-5 max-w-7xl mx-auto pb-20">

      {/* ── LEFT SIDEBAR ── */}
      <div className="hidden md:block space-y-4">
        <Card className={cn("overflow-hidden sticky top-20", cardStyle)}>
          <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-800" />
          <CardContent className="pt-0 pb-4 px-4 relative text-center">
            <Avatar className={cn("h-16 w-16 border-4 border-background shadow-lg mx-auto -mt-8", seniorMode && "h-20 w-20")}>
              <AvatarFallback className="bg-gradient-to-br from-blue-700 to-indigo-700 text-white font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="mt-3">
              <h2 className={cn("font-black text-foreground hover:underline cursor-pointer", seniorMode ? "text-xl" : "text-base")}>
                {fullName}
              </h2>
              <p className={cn("text-blue-600 dark:text-blue-400 mt-0.5", seniorMode ? "text-sm" : "text-xs")}>
                Eng. Software na dvscodes
              </p>
            </div>
          </CardContent>
          <div className="border-t border-border/40 py-2">
            {[
              { label: "Conexões", value: "482" },
              { label: "Vistas ao perfil", value: "194" }
            ].map(item => (
              <div key={item.label} className="flex justify-between px-4 py-1.5 hover:bg-muted/30 cursor-pointer group">
                <span className="text-muted-foreground text-[11px] font-semibold">{item.label}</span>
                <span className="text-primary font-black text-[11px]">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── CENTER FEED ── */}
      <div className="space-y-4 min-w-0">
        {/* Stories */}
        <Card className={cn("p-4 overflow-hidden", cardStyle)}>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
            {storyUsers.map((u, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                <div className={cn(
                  "rounded-2xl p-0.5",
                  u.seen ? "bg-border/40" : "bg-gradient-to-br from-primary to-indigo-600 p-[2px]"
                )}>
                  <Avatar className={cn("h-14 w-14 rounded-[14px] border-2 border-background", seniorMode && "h-16 w-16")}>
                    <AvatarFallback className={cn("rounded-[14px] font-black", u.isVip ? "bg-black text-white" : "bg-secondary")}>
                      {u.logo}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-[10px] font-bold truncate max-w-[60px]">{u.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Create Post */}
        <Card className={cardStyle}>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-primary text-white font-black">{initials}</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="No que você está pensando?"
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                className={cn("resize-none border-0 bg-muted/30 rounded-2xl min-h-[44px]", seniorMode && "text-lg")}
              />
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/30">
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="rounded-full gap-2 text-muted-foreground">
                  <ImagePlus className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-bold">Foto</span>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full gap-2 text-muted-foreground">
                  <Mic className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold">Voz</span>
                </Button>
              </div>
              <Button
                disabled={!newPost.trim()}
                onClick={handleCreatePost}
                size="sm"
                className="rounded-full bg-primary text-white font-black px-5 shadow-lg shadow-primary/20"
              >
                Publicar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <AnimatePresence>
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={cn("overflow-hidden", cardStyle)}>
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-xl border border-border/50">
                      <AvatarFallback className={cn("rounded-xl font-bold", post.authorLogo === "dvs" ? "bg-black text-white" : "bg-secondary")}>
                        {post.authorLogo}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-black text-sm hover:underline cursor-pointer">{post.author}</span>
                        {post.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500 stroke-white" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium">{post.timeAgo} • <Globe className="h-2.5 w-2.5 inline" /></p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreHorizontal className="h-4 w-4" /></Button>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                  <p className={cn("text-sm font-medium leading-relaxed whitespace-pre-wrap", seniorMode && "text-lg")}>
                    {post.content}
                  </p>

                  {post.image && (
                    <div className={cn("mt-4 aspect-video rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-2xl shadow-inner", post.imageGradient)}>
                      {post.author}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-muted-foreground border-b border-border/20 pb-2">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                      <div className="flex -space-x-1">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[8px] text-white border-2 border-card shadow-sm"><Heart className="h-2 w-2 fill-white" /></div>
                        <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white border-2 border-card shadow-sm"><ThumbsUp className="h-2 w-2 fill-white" /></div>
                      </div>
                      <span className="ml-1">{post.likes} curtidas</span>
                    </div>
                    <span>{post.comments} comentários • {post.shares} compartilhamentos</span>
                  </div>

                  <div className="flex items-center gap-1 pt-1 -mx-2">
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={cn("flex-1 gap-2 font-bold hover:bg-muted/50 transition-all", post.liked && "text-primary")}
                    >
                      <ThumbsUp className={cn("h-4 w-4", likingId === post.id && post.liked && "animate-heart-beat", post.liked && "fill-primary")} />
                      {seniorMode ? "Gostei" : post.likes}
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => toggleComments(post.id)}
                      className="flex-1 gap-2 font-bold hover:bg-muted/50"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {seniorMode ? "Comentar" : post.comments}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted/50"><Bookmark className="h-4 w-4" /></Button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {expandedComments[post.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-muted/20 border-t border-border/20 -mx-4 px-4 py-3"
                      >
                        <div className="flex gap-2 mb-4">
                          <Avatar className="h-8 w-8"><AvatarFallback className="text-[10px] font-black">{initials}</AvatarFallback></Avatar>
                          <div className="flex-1 bg-background rounded-xl border px-3 py-1.5 focus-within:ring-1 ring-primary/30 transition-shadow">
                            <input className="w-full bg-transparent border-0 outline-none text-xs font-semibold py-1" placeholder="Adicionar um comentário..." />
                          </div>
                        </div>

                        {(post.commentsList || []).map(c => (
                          <div key={c.id} className="flex gap-2 mb-3 last:mb-0">
                            <Avatar className="h-8 w-8"><AvatarFallback className="text-[10px] font-black">{c.initials}</AvatarFallback></Avatar>
                            <div className="flex-1 bg-muted/40 rounded-2xl rounded-tl-sm px-3 py-2">
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-xs">{c.author}</span>
                                <span className="text-[9px] text-muted-foreground font-medium">{c.time}</span>
                              </div>
                              <p className="text-xs font-medium text-foreground/80 leading-relaxed">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Skeletons or Sentinel */}
        <div ref={observerTarget} className="space-y-4 pt-4">
          {isLoadingMore ? (
            [1, 2].map(i => (
              <Card key={i} className={cn("p-4", cardStyle)}>
                <div className="flex gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl skeleton" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/3 rounded-full skeleton" />
                    <div className="h-3 w-1/4 rounded-full skeleton opacity-50" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full rounded-full skeleton" />
                  <div className="h-4 w-5/6 rounded-full skeleton" />
                </div>
                <div className="h-40 w-full rounded-2xl skeleton" />
              </Card>
            ))
          ) : (
            <div className="h-10 flex items-center justify-center">
              <span className="text-[10px] font-black text-muted-foreground/40 tracking-widest uppercase flex items-center gap-2">
                <Sparkles className="h-3 w-3 animate-pulse" /> Carregando mais com Inteligência dvscodes <Sparkles className="h-3 w-3 animate-pulse" />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="hidden lg:block space-y-4">
        <Card className={cn("p-4 sticky top-20", cardStyle)}>
          <h3 className="font-black text-sm mb-4">Trending Topics</h3>
          <div className="space-y-4">
            {["#Acessibilidade", "#WebDesign2026", "#dvscodes", "#IAnoTrabalho"].map(tag => (
              <div key={tag} className="group cursor-pointer">
                <p className="text-xs font-black group-hover:text-primary transition-colors">{tag}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">1.2k publicações hoje</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
