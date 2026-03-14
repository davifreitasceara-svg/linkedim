import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart, MessageCircle, Send,
  Bookmark, Sparkles, MoreHorizontal,
  ThumbsUp, Globe, BadgeCheck, Play, Pause,
  Headphones, Video, Zap, TrendingUp, Briefcase, X, Image, Volume2
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
  isJob?: boolean;
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
    id: "job-1",
    author: "dvscodes Careers",
    authorLogo: "dvs",
    title: "Vaga Recomendada Mensal",
    content: "Estamos buscando Especialistas em Acessibilidade Digital e UX/UI para construir o futuro da web inclusiva conosco.",
    likes: 1204,
    comments: 45,
    shares: 210,
    liked: false,
    bookmarked: true,
    timeAgo: "Vaga sugerida pela IA",
    isVerified: true,
    isJob: true,
    imageGradient: "from-blue-800 via-indigo-900 to-slate-900"
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

const mockStories = [
  { id: 1, name: "Você", logo: "VC", hasStory: false },
  { id: 2, name: "dvscodes", logo: "dvs", hasStory: true, isLive: true },
  { id: 3, name: "Nubank", logo: "NU", hasStory: true },
  { id: 4, name: "Ana P.", logo: "AP", hasStory: true },
  { id: 5, name: "Carlos", logo: "CE", hasStory: true },
  { id: 6, name: "TechBR", logo: "TB", hasStory: false },
  { id: 7, name: "Beatriz", logo: "BL", hasStory: false }
];

const names = ["eduarda leal", "issac silva", "kauan", "gabriel", "aristotoles", "vicente", "levi", "davi oliveira", "isadora", "paulo", "Andre", "andreza", "sofia", "diogo", "falcone", "joao pedro", "vitor cerqueira", "eros", "jade", "david kayke", "julio", "predro victor", "ariane", "calebe", "Gabriel Cabreira", "Julie", "Liana", "Maximiliano", "Sarah"];
const logos = ["EL", "IS", "K", "G", "AR", "V", "L", "DO", "I", "P", "A", "AZ", "S", "D", "F", "JP", "VC", "E", "JD", "DK", "J", "PV", "AR", "C", "GC", "JU", "LI", "MX", "SA"];
const topics = [
  "O mercado de TI em 2026 está incrível!",
  "Dica do dia: Use Framer Motion para animações fluidas.",
  "Como conseguir sua primeira vaga sênior?",
  "A importância do contraste acessível no design moderno.",
  "IA não vai substituir devs, vai potencializá-los."
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { seniorMode, highContrast, screenReaderMode } = useAccessibility();
  const { toast } = useToast();
  const { speak, stop } = useTextToSpeech();
  
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [showSurroundFx, setShowSurroundFx] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const [newPostText, setNewPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<string, number>>({});

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

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isLoadingMore]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playingAudio) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          const current = prev[playingAudio] || 0;
          if (current >= 100) {
            setPlayingAudio(null);
            return { ...prev, [playingAudio]: 0 };
          }
          return { ...prev, [playingAudio]: current + 2 };
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [playingAudio]);

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * names.length);
      const isVideo = Math.random() > 0.8;
      const isAudio = !isVideo && Math.random() > 0.7;
      const isJob = !isVideo && !isAudio && Math.random() > 0.7;
      const isImg = !isVideo && !isAudio && !isJob && Math.random() > 0.5;

      const extra: Post = {
        id: `ai-post-${Date.now()}-${Math.random()}`,
        author: isJob ? "Recrutador IA" : names[randomIdx],
        authorLogo: isJob ? "IA" : logos[randomIdx],
        title: isJob ? "Vaga Exclusiva Inline" : "Conteúdo Gerado por IA",
        content: isJob 
          ? `Temos uma ótima oportunidade para ${fullName} como Tech Lead! Clique em Candidatura Simples para aplicar instantaneamente com seu perfil.`
          : topics[Math.floor(Math.random() * topics.length)],
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 200),
        shares: Math.floor(Math.random() * 100),
        liked: false,
        bookmarked: false,
        timeAgo: "agora mesmo",
        isVerified: Math.random() > 0.6,
        video: isVideo,
        audio: isAudio,
        isJob: isJob,
        image: isImg,
        imageGradient: isJob 
          ? "from-slate-800 to-black" 
          : `from-${["red", "blue", "green", "purple", "orange"][randomIdx % 5]}-600 to-indigo-900`,
        views: isVideo ? Math.floor(Math.random() * 50000) : undefined
      };
      
      setPosts(prev => [...prev, extra]);
      setIsLoadingMore(false);
    }, 1500);
  };

  const toggleAudio = (id: string) => {
    if (playingAudio === id) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(id);
    }
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

  const toggleBookmark = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isBookmarked = !p.bookmarked;
        if (isBookmarked) {
          toast({ title: "Salvo", description: "Publicação salva nos seus Itens." });
        }
        return { ...p, bookmarked: isBookmarked };
      }
      return p;
    }));
  };

  const toggleComments = (id: string) => {
    if (expandedComments === id) {
      setExpandedComments(null);
    } else {
      setExpandedComments(id);
    }
  };

  const cardStyle = highContrast
    ? "border-2 border-primary bg-background shadow-none"
    : "border border-border/60 bg-card/70 backdrop-blur-xl shadow-md";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_300px] gap-5 max-w-7xl mx-auto pb-20 relative">
      <AnimatePresence>
        {showSurroundFx && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center overflow-hidden"
          >
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, Math.random() * 1.5 + 0.5, 0],
                  x: Math.random() * 1200 - 600,
                  y: Math.random() * 1200 - 600,
                  opacity: [0, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute"
              >
                <Heart className="h-16 w-16 text-primary fill-primary opacity-30" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:block space-y-4">
        <Card className={cn("overflow-hidden sticky top-20", cardStyle)}>
          <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-800" />
          <CardContent className="pt-0 pb-4 px-4 relative text-center">
            <div 
              className="cursor-pointer group"
              onClick={() => navigate("/profile")}
            >
              <Avatar className={cn("h-16 w-16 border-4 border-background shadow-lg mx-auto -mt-8 transition-transform group-hover:scale-105", seniorMode && "h-20 w-20")}>
                <AvatarFallback className="bg-gradient-to-br from-blue-700 to-indigo-700 text-white font-black">{initials}</AvatarFallback>
              </Avatar>
              <div className="mt-3">
                <h2 className={cn("font-black text-foreground group-hover:text-primary transition-colors", seniorMode ? "text-xl" : "text-base")}>{fullName}</h2>
                <p className="text-blue-600 dark:text-blue-400 text-xs mt-0.5">Ver meu perfil</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 min-w-0">
        <Card className={cn("p-4 flex gap-4 overflow-x-auto scrollbar-hide items-center", cardStyle)}>
          {mockStories.map((story) => (
            <div 
              key={story.id} 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => navigate(story.id === 1 ? "/profile" : `/profile/${story.name}`)}
            >
              <div className="relative">
                <Avatar className={cn(
                  "h-14 w-14 border-2 transition-transform group-hover:scale-105",
                  story.hasStory ? "border-primary p-0.5" : "border-border/50",
                  story.isLive && "border-red-500 animate-pulse"
                )}>
                  <AvatarFallback className={cn("rounded-full font-bold", story.logo === "dvs" ? "bg-black text-white" : "bg-secondary")}>
                    {story.id === 1 ? initials : story.logo}
                  </AvatarFallback>
                </Avatar>
                {story.id === 1 && (
                  <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center border-2 border-background font-black text-xs">
                    +
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground line-clamp-1 max-w-[60px] text-center">
                {story.name}
              </span>
            </div>
          ))}
        </Card>

        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx < 3 ? idx * 0.1 : 0 }}
          >
            <Card className={cn("overflow-hidden group/post", cardStyle)}>
              <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                <div 
                  className="flex items-center gap-3 cursor-pointer group/author"
                  onClick={() => navigate(`/profile/${post.author}`)}
                >
                  <Avatar className="h-10 w-10 rounded-xl border border-border/50 group-hover/author:scale-105 transition-transform">
                    <AvatarFallback className={cn("rounded-xl font-bold", post.authorLogo === "dvs" || post.authorLogo === "IA" ? "bg-black text-white" : "bg-secondary")}>
                      {post.authorLogo}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-black text-sm group-hover/author:text-primary transition-colors flex items-center gap-1">
                        {post.author} 
                        {post.isJob && <Briefcase className="h-3 w-3 text-primary" />}
                      </span>
                      {post.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500 stroke-white" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                      {post.timeAgo} • <Globe className="h-2.5 w-2.5" />
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreHorizontal className="h-4 w-4" /></Button>
              </CardHeader>

              <CardContent className="px-4 pb-4">
                <p className={cn("text-sm font-medium leading-relaxed mb-4", seniorMode && "text-base")}>
                  {post.content}
                </p>

                {post.video ? (
                  <div className={cn("relative aspect-video rounded-2xl bg-gradient-to-br flex flex-col items-center justify-center text-white overflow-hidden shadow-2xl", post.imageGradient)}>
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                ) : post.audio ? (
                  <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Button 
                        onClick={() => toggleAudio(post.id)}
                        size="icon" 
                        className={cn("h-12 w-12 rounded-full", playingAudio === post.id ? "bg-red-500" : "bg-primary")}
                      >
                        {playingAudio === post.id ? <Pause /> : <Play className="ml-1" />}
                      </Button>
                      <div className="flex-1">
                        <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary"
                            animate={{ width: `${audioProgress[post.id] || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : post.isJob ? (
                  <div className="p-6 rounded-2xl border-2 border-border/50 bg-muted/20">
                    <h4 className="font-black text-lg">Vaga Sugerida</h4>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">Candidatura Simples</Button>
                  </div>
                ) : post.image ? (
                  <div className={cn("aspect-video rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-xl shadow-xl", post.imageGradient)}>
                    {post.author}
                  </div>
                ) : null}

                <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-muted-foreground border-b border-border/20 pb-2">
                  <span>{post.likes} curtidas • {post.comments} comentários</span>
                </div>

                <div className="flex items-center gap-1 pt-1">
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => toggleLike(post.id)}
                    className={cn("flex-1 gap-2 font-black", post.liked && "text-primary")}
                  >
                    <ThumbsUp className={cn("h-4 w-4", post.liked && "fill-primary")} />
                    Gostei
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 gap-2 font-black" onClick={() => toggleComments(post.id)}>
                    <MessageCircle className="h-4 w-4" /> Comentar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 gap-2 font-black text-blue-600 dark:text-blue-400"
                    onClick={() => speak(`${post.author} disse: ${post.content}`)}
                  >
                    <Volume2 className="h-4 w-4" /> Escutar
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleBookmark(post.id)}>
                    <Bookmark className={cn("h-4 w-4", post.bookmarked && "fill-primary text-primary")} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <div ref={observerTarget} className="flex flex-col items-center justify-center py-10 gap-3">
          <Zap className="h-6 w-6 text-primary animate-bounce" />
          <span className="text-[10px] font-black text-muted-foreground/40 tracking-widest uppercase">
            Sugerindo novos conteúdos...
          </span>
        </div>
      </div>

      <div className="hidden lg:block space-y-4">
        <Card className={cn("p-5 sticky top-20", cardStyle)}>
          <h3 className="font-black text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Tendências
          </h3>
          <div className="space-y-4">
            {["#Acessibilidade", "#dvscodes", "#UIUX2026"].map(tag => (
              <div key={tag} className="cursor-pointer group">
                <p className="text-xs font-black group-hover:text-primary transition-colors">{tag}</p>
                <p className="text-[10px] text-muted-foreground">Em alta no Brasil</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
