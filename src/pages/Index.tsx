import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart, MessageCircle, ImagePlus, Send, Mic, Volume2,
  Bookmark, Trophy, Sparkles, MoreHorizontal,
  ThumbsUp, Globe, BadgeCheck, Play, Pause, FastForward,
  Headphones, Video, Zap, Star, TrendingUp
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
  video?: boolean;
  audio?: boolean;
  imageGradient?: string;
  reactions?: { emoji: string; count: number }[];
  commentsList?: Comment[];
}

const mockPosts: Post[] = [
  {
    id: "v-1",
    author: "ProConnect TV",
    authorLogo: "TV",
    title: "Editorial · Tecnologia em Vídeo",
    content: "Assista agora: Como a dvscodes está revolucionando a acessibilidade com IA generativa em tempo real. O futuro é inclusivo! 🎬\n\n#Inovação #Acessibilidade #dvscodes",
    likes: 8942,
    comments: 521,
    shares: 1240,
    liked: false,
    bookmarked: false,
    timeAgo: "15m",
    isVerified: true,
    video: true,
    imageGradient: "from-blue-600 via-purple-700 to-pink-600",
    views: 125000,
  },
  {
    id: "a-1",
    author: "Luís Fernando",
    authorLogo: "LF",
    title: "Diretor de Engenharia na Nubank",
    content: "Pensei muito sobre isso hoje e acabei gravando um áudio rápido sobre liderança técnica em tempos de IA. O que vocês acham? 🎧",
    likes: 2431,
    comments: 142,
    shares: 67,
    liked: true,
    bookmarked: false,
    timeAgo: "45m",
    isVerified: true,
    audio: true,
  },
  {
    id: "dvs-1",
    author: "dvscodes",
    authorLogo: "dvs",
    title: "Tecnologia & Acessibilidade · Patrocinado",
    content: "🚀 Nossa nova UI Glassmorphism adaptativa recebeu o Prêmio WCAG Excellence 2026!\n\nConstruímos algo visualmente deslumbrante e 100% inclusivo. #dvscodes #Acessibilidade",
    likes: 3248,
    comments: 418,
    shares: 512,
    liked: false,
    bookmarked: false,
    timeAgo: "2h",
    isVerified: true,
    isSponsored: true,
    image: true,
    imageGradient: "from-blue-700 via-indigo-700 to-violet-800",
  }
];

const names = ["Beatriz Lima", "Carlos Eduardo", "Julia Silva", "Tech World", "Senior Link", "Dev Master", "Inovação BR"];
const logos = ["BL", "CE", "JS", "TW", "SL", "DM", "IB"];
const topics = [
  "O mercado de TI em 2026 está incrível!",
  "Dica do dia: Use Framer Motion para animações fluidas.",
  "Como conseguir sua primeira vaga sênior?",
  "A importância do contraste acessível no design moderno.",
  "IA não vai substituir devs, vai potencializá-los.",
  "Acabei de publicar um novo vídeo sobre Next.js!",
  "Quem mais ama o modo Senior Mode do ProConnect?"
];

const Index: React.FC = () => {
  const { user } = useAuth();
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [likingId, setLikingId] = useState<string | null>(null);
  const [showSurroundFx, setShowSurroundFx] = useState(false);
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
      { threshold: 1.0, rootMargin: "200px" }
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

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * names.length);
      const isVideo = Math.random() > 0.7;
      const isAudio = !isVideo && Math.random() > 0.7;
      const isImg = !isVideo && !isAudio && Math.random() > 0.5;

      const extra: Post = {
        id: `ai-post-${Date.now()}-${Math.random()}`,
        author: names[randomIdx],
        authorLogo: logos[randomIdx],
        title: "Conteúdo Gerado por IA",
        content: topics[Math.floor(Math.random() * topics.length)],
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 200),
        shares: Math.floor(Math.random() * 100),
        liked: false,
        bookmarked: false,
        timeAgo: "agora mesmo",
        isVerified: Math.random() > 0.6,
        video: isVideo,
        audio: isAudio,
        image: isImg,
        imageGradient: `from-${["red", "blue", "green", "purple", "orange"][randomIdx % 5]}-600 to-indigo-900`,
        views: isVideo ? Math.floor(Math.random() * 50000) : undefined
      };
      
      setPosts(prev => [...prev, extra]);
      setIsLoadingMore(false);
    }, 1500);
  };

  const toggleLike = (postId: string) => {
    setLikingId(postId);
    setShowSurroundFx(true);
    setTimeout(() => {
      setLikingId(null);
      setShowSurroundFx(false);
    }, 1500);
    
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const cardStyle = highContrast
    ? "border-2 border-primary bg-background shadow-none"
    : "border border-border/60 bg-card/70 backdrop-blur-xl shadow-md";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_300px] gap-5 max-w-7xl mx-auto pb-20 relative">
      
      {/* ── SURROUND FX ── */}
      <AnimatePresence>
        {showSurroundFx && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center overflow-hidden"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  x: Math.random() * 1000 - 500,
                  y: Math.random() * 1000 - 500,
                  opacity: [0, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute"
              >
                <Heart className="h-12 w-12 text-primary fill-primary opacity-20" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEFT SIDEBAR ── */}
      <div className="hidden md:block space-y-4">
        <Card className={cn("overflow-hidden sticky top-20", cardStyle)}>
          <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-800" />
          <CardContent className="pt-0 pb-4 px-4 relative text-center">
            <Avatar className={cn("h-16 w-16 border-4 border-background shadow-lg mx-auto -mt-8", seniorMode && "h-20 w-20")}>
              <AvatarFallback className="bg-gradient-to-br from-blue-700 to-indigo-700 text-white font-black">{initials}</AvatarFallback>
            </Avatar>
            <div className="mt-3">
              <h2 className={cn("font-black text-foreground", seniorMode ? "text-xl" : "text-base")}>{fullName}</h2>
              <p className="text-blue-600 dark:text-blue-400 text-xs mt-0.5">Eng. Software na dvscodes</p>
            </div>
          </CardContent>
          <div className="border-t border-border/40 py-2">
            <div className="flex justify-between px-4 py-1.5 hover:bg-muted/30 cursor-pointer">
              <span className="text-muted-foreground text-[10px] font-bold uppercase">Conexões</span>
              <span className="text-primary font-black text-xs">482</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── CENTER FEED ── */}
      <div className="space-y-4 min-w-0">
        <AnimatePresence>
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx < 3 ? idx * 0.1 : 0 }}
            >
              <Card className={cn("overflow-hidden group/post", cardStyle)}>
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
                      <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                        {post.timeAgo} • <Globe className="h-2.5 w-2.5" />
                        {post.isSponsored && <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-1">Patrocinado</span>}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreHorizontal className="h-4 w-4" /></Button>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                  <p className={cn("text-sm font-medium leading-relaxed mb-4", seniorMode && "text-base")}>
                    {post.content}
                  </p>

                  {/* Multimedia Content */}
                  {post.video ? (
                    <div className={cn("relative aspect-video rounded-2xl bg-gradient-to-br flex flex-col items-center justify-center text-white overflow-hidden shadow-2xl", post.imageGradient)}>
                      <div className="absolute inset-0 bg-black/20 group-hover/post:bg-black/10 transition-colors" />
                      <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 relative z-10 shadow-xl group-hover/post:scale-110 transition-transform">
                        <Play className="h-8 w-8 fill-white text-white ml-1" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{post.views?.toLocaleString()} visualizações</span>
                        </div>
                        <div className="h-1 w-24 bg-white/30 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ x: [-100, 100] }} 
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="h-full w-full bg-primary" 
                          />
                        </div>
                      </div>
                    </div>
                  ) : post.audio ? (
                    <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <Button size="icon" className="h-12 w-12 rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                          <Play className="h-5 w-5 fill-current ml-1" />
                        </Button>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-primary tracking-tighter flex items-center gap-1">
                              <Headphones className="h-3 w-3" /> Mensagem de Áudio
                            </span>
                            <span className="text-[10px] font-black text-muted-foreground">0:42 / 1:30</span>
                          </div>
                          <div className="flex gap-0.5 items-end h-10">
                            {[...Array(40)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ height: [10, Math.random() * 40, 10] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
                                className="w-1 bg-primary/40 rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : post.image ? (
                    <div className={cn("aspect-video rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-2xl shadow-xl", post.imageGradient)}>
                      {post.author}
                    </div>
                  ) : post.isSponsored && (
                    <div className={cn("p-8 rounded-2xl bg-gradient-to-br flex flex-col items-center justify-center text-white text-center shadow-xl border-4 border-white/10", post.imageGradient)}>
                      <Sparkles className="h-12 w-12 mb-4 animate-pulse" />
                      <h3 className="text-xl font-black mb-2">Inovações dvscodes</h3>
                      <p className="text-sm opacity-90 font-bold">O Futuro da Acessibilidade Digital</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-muted-foreground border-b border-border/20 pb-2">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white border-2 border-card"><Heart className="h-2 w-2 fill-white" /></div>
                        <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white border-2 border-card"><ThumbsUp className="h-2 w-2 fill-white" /></div>
                      </div>
                      <span className="ml-1">{post.likes} curtidas</span>
                    </div>
                    <span>{post.comments} comentários</span>
                  </div>

                  <div className="flex items-center gap-1 pt-1">
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={cn("flex-1 gap-2 font-black transition-all", post.liked && "text-primary")}
                    >
                      <ThumbsUp className={cn("h-4 w-4", likingId === post.id && "animate-heart-beat", post.liked && "fill-primary")} />
                      Gostei
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 gap-2 font-black"><MessageCircle className="h-4 w-4" /> Comentar</Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full"><Bookmark className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Sentinel */}
        <div ref={observerTarget} className="pt-4 pb-12">
          {isLoadingMore ? (
             <Card className={cn("p-4 animate-pulse", cardStyle)}>
                <div className="flex gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-muted" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/3 rounded-full bg-muted" />
                    <div className="h-3 w-1/4 rounded-full bg-muted opacity-50" />
                  </div>
                </div>
                <div className="h-40 w-full rounded-2xl bg-muted" />
             </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <Zap className="h-6 w-6 text-primary animate-bounce" />
              <span className="text-[10px] font-black text-muted-foreground/40 tracking-widest uppercase">
                Gerando Conteúdo Único pela dvscodes IA...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="hidden lg:block space-y-4">
        <Card className={cn("p-5 sticky top-20", cardStyle)}>
          <h3 className="font-black text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Trending AI
          </h3>
          <div className="space-y-5">
            {[
              { tag: "#AcessibilidadeDigital", count: "42k" },
              { tag: "#dvscodesIA", count: "12k" },
              { tag: "#OdinProject", count: "8k" },
              { tag: "#Web2026", count: "5k" }
            ].map((t, i) => (
              <div key={i} className="group cursor-pointer">
                <p className="text-xs font-black group-hover:text-primary transition-colors">{t.tag}</p>
                <p className="text-[10px] text-muted-foreground font-bold">{t.count} visualizações</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
