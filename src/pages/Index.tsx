import React, { useState, useEffect, useRef } from "react";
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

const names = ["Beatriz Lima", "Carlos Eduardo", "Julia Silva", "Tech World", "Senior Link", "Dev Master", "Inovação BR"];
const logos = ["BL", "CE", "JS", "TW", "SL", "DM", "IB"];
const topics = [
  "O mercado de TI em 2026 está incrível!",
  "Dica do dia: Use Framer Motion para animações fluidas.",
  "Como conseguir sua primeira vaga sênior?",
  "A importância do contraste acessível no design moderno.",
  "IA não vai substituir devs, vai potencializá-los."
];

const Index: React.FC = () => {
  const { user } = useAuth();
  const { seniorMode, highContrast, screenReaderMode } = useAccessibility();
  const { toast } = useToast();
  const { speak, stop } = useTextToSpeech();
  
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [showSurroundFx, setShowSurroundFx] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // New Post State
  const [newPostText, setNewPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  // Post Interactions State
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  
  // Audio Player State
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingMore]);

  // Handle Audio Progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playingAudio) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          const current = prev[playingAudio] || 0;
          if (current >= 100) {
            setPlayingAudio(null);
            return { ...prev, [playingAudio]: 0 }; // Reset
          }
          return { ...prev, [playingAudio]: current + 2 }; // Speed of audio playback
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

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    setIsPosting(true);
    
    setTimeout(() => {
      const newPost: Post = {
        id: `user-${Date.now()}`,
        author: fullName,
        authorLogo: initials,
        title: user?.user_metadata?.job_title || "Profissional na dvscodes",
        content: newPostText,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        bookmarked: false,
        timeAgo: "Agora",
        isVerified: true
      };
      
      setPosts([newPost, ...posts]);
      setNewPostText("");
      setIsPosting(false);
      toast({
        title: "Publicado!",
        description: "Sua publicação está visível na sua rede.",
      });
    }, 800);
  };

  const handlePostComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newComments = p.commentsList || [];
        return {
          ...p,
          comments: p.comments + 1,
          commentsList: [...newComments, {
            id: `cmd-${Date.now()}`,
            author: fullName,
            initials: initials,
            text: newCommentText,
            time: "Agora"
          }]
        };
      }
      return p;
    }));
    setNewCommentText("");
  };

  const handleShare = (id: string, author: string) => {
    toast({
      title: "Link Copiado!",
      description: `Link da publicação de ${author} copiado para área de transferência.`,
    });
    setPosts(prev => prev.map(p => p.id === id ? { ...p, shares: p.shares + 1 } : p));
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
        
        {/* STORIES HEADER */}
        <Card className={cn("p-4 flex gap-4 overflow-x-auto scrollbar-hide items-center", cardStyle)}>
          {mockStories.map((story) => (
            <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0">
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
                {story.isLive && (
                  <div className="absolute -bottom-1 -left-1 right-[-4px] bg-red-500 text-white rounded-sm h-4 flex items-center justify-center font-black text-[8px] uppercase tracking-tighter shadow-sm border border-background">
                    AO VIVO
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground line-clamp-1 max-w-[60px] text-center">
                {story.name}
              </span>
            </div>
          ))}
        </Card>

        {/* FEED POSTS */}
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
                      <AvatarFallback className={cn("rounded-xl font-bold", post.authorLogo === "dvs" || post.authorLogo === "IA" ? "bg-black text-white" : "bg-secondary")}>
                        {post.authorLogo}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-black text-sm hover:underline cursor-pointer flex items-center gap-1">
                          {post.author} 
                          {post.isJob && <Briefcase className="h-3 w-3 text-primary" />}
                        </span>
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
                      <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 relative z-10 shadow-xl group-hover/post:scale-110 transition-transform cursor-pointer">
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
                        <Button 
                          onClick={() => toggleAudio(post.id)}
                          size="icon" 
                          className={cn("h-12 w-12 rounded-full text-white shadow-lg transition-all", playingAudio === post.id ? "bg-red-500 hover:bg-red-600" : "bg-primary")}
                        >
                          {playingAudio === post.id ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
                        </Button>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-primary tracking-tighter flex items-center gap-1">
                              <Headphones className="h-3 w-3" /> 
                              {playingAudio === post.id ? "Reproduzindo..." : "Mensagem de Áudio"}
                            </span>
                            <span className="text-[10px] font-black text-muted-foreground">
                              {playingAudio === post.id ? `0:${Math.floor(((audioProgress[post.id] || 0) / 100) * 42).toString().padStart(2, '0')}` : "0:00"} / 0:42
                            </span>
                          </div>
                          
                          {/* Audio Waveform Interactive */}
                          <div className="flex gap-[2px] items-center h-10 w-full bg-black/5 dark:bg-white/5 rounded-lg px-2 relative overflow-hidden">
                             {/* Progress indicator background */}
                             <motion.div 
                                className="absolute left-0 top-0 bottom-0 bg-primary/10 z-0"
                                animate={{ width: `${audioProgress[post.id] || 0}%` }}
                                transition={{ ease: "linear" }}
                             />
                            {[...Array(50)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ 
                                  height: playingAudio === post.id 
                                    ? [10, Math.random() * 30 + 10, 10] 
                                    : [10, 10, 10] 
                                }}
                                transition={{ duration: 0.5, repeat: playingAudio === post.id ? Infinity : 0, delay: i * 0.02 }}
                                className={cn(
                                  "flex-1 rounded-full relative z-10",
                                  ((audioProgress[post.id] || 0) / 100) > i / 50 ? "bg-primary" : "bg-primary/30"
                                )}
                              />
                            ))}
                          </div>

                        </div>
                      </div>
                    </div>
                  ) : post.isJob ? (
                    <div className={cn("rounded-2xl border-2 border-border/50 bg-muted/20 overflow-hidden relative shadow-md")}>
                      <div className="absolute top-0 right-0 p-3">
                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/5"><X className="h-4 w-4" /></Button>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-800 to-black flex items-center justify-center shadow-lg">
                            <Briefcase className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-black text-lg">Tech Lead Acessibilidade</h4>
                            <p className="text-sm font-bold text-muted-foreground">dvscodes • Remoto (Brasil)</p>
                          </div>
                        </div>
                        <Button className="w-full font-bold h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                          Candidatura Simples (1 Clique)
                        </Button>
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
                      <Button variant="ghost" size="sm" className="flex-1 gap-2 font-black" onClick={() => toggleComments(post.id)}>
                        <MessageCircle className="h-4 w-4" /> Comentar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 gap-2 font-black text-blue-600 dark:text-blue-400"
                        onClick={() => speak(`${post.author} publicou: ${post.content}`)}
                      >
                        <Volume2 className="h-4 w-4" /> Escutar
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => toggleBookmark(post.id)}>
                        <Bookmark className={cn("h-4 w-4", post.bookmarked && "fill-primary text-primary")} />
                      </Button>
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
