import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, ImagePlus, Send, Mic, Volume2, Bookmark, Users, Hexagon, Trophy, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
  timeAgo: string;
  isSponsored?: boolean;
}

const mockPosts: Post[] = [
  {
    id: "dvs-1",
    author: "dvscodes",
    title: "Empresa de Tecnologia e Inovação em Acessibilidade",
    content: "🚀 O futuro é inclusivo! Estamos orgulhosos de anunciar o lançamento da nova arquitetura de UI com Glassmorphism adaptativo e suporte total a leitores de tela na nossa plataforma. Acreditamos que estética e acessibilidade podem e devem andar juntas. Venha fazer parte do nosso time de pioneiros! #dvscodes #Acessibilidade #Inovação",
    likes: 1042,
    comments: 156,
    liked: true,
    timeAgo: "1h",
    isSponsored: true,
  },
  {
    id: "1",
    author: "Maria Silva",
    title: "Designer Gráfica",
    content: "Acabei de finalizar um projeto incrível de identidade visual para uma startup de tecnologia. O processo criativo foi desafiador mas o resultado ficou fantástico! 🎨✨ Inspirado no design system da dvscodes.",
    likes: 24,
    comments: 5,
    liked: false,
    timeAgo: "2h",
  },
  {
    id: "2",
    author: "João Santos",
    title: "Desenvolvedor Full Stack • Top Voice Inclusão",
    content: "Compartilhando meu novo portfólio de projetos web com foco em WCAG. Foram 6 meses de trabalho intenso e muito aprendizado colaborando em open-source. Confira no meu perfil! 🚀",
    likes: 42,
    comments: 12,
    liked: true,
    timeAgo: "5h",
  },
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
  const fullName = user?.user_metadata?.full_name || "Seu Nome";

  const cardStyle = highContrast 
    ? "border-2 border-primary bg-background shadow-none" 
    : "border border-white/20 bg-card/60 backdrop-blur-xl shadow-xl shadow-black/5";

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Aviso", description: "Seu navegador não suporta digitação por voz.", variant: "destructive" });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNewPost((prev) => prev ? prev + " " + transcript : transcript);
    };
    recognition.start();
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      author: fullName,
      title: "Desenvolvedor Especialista",
      content: newPost,
      likes: 0,
      comments: 0,
      liked: false,
      timeAgo: "agora",
    };
    setPosts([post, ...posts]);
    setNewPost("");
    toast({ title: "Sucesso", description: "Sua postagem foi publicada no GlassFeed!" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)] lg:grid-cols-[250px_minmax(0,1fr)_320px] gap-6 max-w-7xl mx-auto pb-20">
      
      {/* Left Column: Mini Profile */}
      <div className="hidden md:block space-y-4">
        <Card className={cn("overflow-hidden text-center sticky top-20", cardStyle)}>
          <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-800" />
          <CardContent className="pt-0 pb-4 px-4 relative">
            <Avatar className={cn("h-16 w-16 border-2 border-background shadow-lg mx-auto -mt-8", seniorMode && "h-20 w-20")}>
              <AvatarFallback className="bg-black text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="mt-3">
              <h2 className={cn("font-bold text-foreground hover:underline cursor-pointer", seniorMode && "text-xl")}>
                {fullName}
              </h2>
              <p className={cn("text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1", seniorMode && "text-sm")}>
                Engenheiro de Software na dvscodes
              </p>
            </div>
          </CardContent>
          <div className="border-t border-border/50 py-3 px-4 text-left bg-muted/10">
            <div className="flex justify-between items-center group cursor-pointer">
              <span className={cn("text-xs text-muted-foreground font-medium", seniorMode && "text-sm")}>Conexões Inclusivas</span>
              <span className={cn("text-xs text-primary font-bold group-hover:underline", seniorMode && "text-sm")}>420</span>
            </div>
            <div className="flex justify-between items-center group cursor-pointer mt-2">
              <span className={cn("text-xs text-muted-foreground font-medium", seniorMode && "text-sm")}>Quem viu seu perfil</span>
              <span className={cn("text-xs text-primary font-bold group-hover:underline", seniorMode && "text-sm")}>183</span>
            </div>
          </div>
          <div className="border-t border-border/50 py-3 px-4 text-left hover:bg-muted/30 cursor-pointer transition-colors flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-muted-foreground" />
            <span className={cn("text-xs text-foreground font-semibold", seniorMode && "text-sm")}>Meus itens salvas</span>
          </div>
        </Card>

        {/* Cenas 3D Lateral */}
        {!seniorMode && !highContrast && (
          <Card className={cn("p-4 sticky top-[340px] text-center overflow-hidden border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-purple-500/20")}>
            <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
              <Sparkles className="w-16 h-16 animate-pulse" />
            </div>
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-300 drop-shadow-md" />
            <h3 className="font-bold text-lg mb-1 shadow-sm">Pioneiro dvscodes</h3>
            <p className="text-xs text-white/90">Você está entre os primeiros a experimentar a nova UI inclusiva.</p>
          </Card>
        )}
      </div>

      {/* Main Column: Feed */}
      <div className="space-y-4">
        {/* Create Post */}
        <Card className={cardStyle}>
          <CardContent className="pt-4 pb-2 px-4 sm:px-6">
            <div className="flex gap-3">
              <Avatar className={cn("h-12 w-12", seniorMode && "h-14 w-14")}>
                <AvatarFallback className="bg-black text-white font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Tem algo novo para compartilhar com sua rede hoje?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className={cn(
                    "resize-none border-2 border-border/40 bg-muted/20 focus-visible:ring-1 focus-visible:border-primary hover:bg-muted/30 rounded-full py-3 px-5 transition-all cursor-text min-h-[50px] font-medium shadow-inner",
                    seniorMode && "text-lg",
                    newPost.length > 0 && "rounded-2xl min-h-[120px]"
                  )}
                  rows={newPost.length > 0 ? 3 : 1}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3 pt-1">
              <div className="flex flex-wrap gap-1">
                <Button variant="ghost" size="sm" className={cn("text-muted-foreground hover:text-foreground font-semibold hover:bg-primary/5", seniorMode && "h-12 px-4")} aria-label="Adicionar foto">
                  <ImagePlus className={cn("h-5 w-5 text-blue-500", seniorMode ? "mr-2 h-6 w-6" : "mr-2")} />
                  <span className={cn(seniorMode ? "text-sm" : "text-xs hidden sm:inline")}>Mídia</span>
                </Button>
                <Button variant="ghost" size="sm" className={cn("text-muted-foreground hover:text-foreground font-semibold hover:bg-primary/5", seniorMode && "h-12 px-4")} aria-label="Adicionar evento">
                  <Hexagon className={cn("h-5 w-5 text-orange-400", seniorMode ? "mr-2 h-6 w-6" : "mr-2")} />
                  <span className={cn(seniorMode ? "text-sm" : "text-xs hidden sm:inline")}>Evento</span>
                </Button>
                <Button 
                  variant={isListening ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={startListening}
                  className={cn("text-muted-foreground hover:text-foreground font-semibold hover:bg-primary/5", seniorMode && "h-12 px-4")}
                  aria-label={isListening ? "Gravando voz..." : "Digitar por voz"}
                >
                  <Mic className={cn("h-5 w-5 text-primary", seniorMode ? "mr-2 h-6 w-6" : "mr-2", isListening && "animate-pulse scale-110")} />
                  <span className={cn(seniorMode ? "text-sm" : "text-xs hidden sm:inline")}>{isListening ? "Ouvindo..." : "Gravar"}</span>
                </Button>
              </div>
              <Button
                onClick={handleCreatePost}
                disabled={!newPost.trim() && !isListening}
                size="sm"
                className={cn("font-bold rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20", seniorMode && "h-12 px-6 text-base")}
                aria-label="Publicar postagem"
              >
                {seniorMode ? "Publicar agora" : "Publicar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Divider */}
        <div className="flex items-center gap-2 mb-2 mt-6 px-2">
          <div className="h-px bg-border/50 flex-1" />
          <span className="text-xs text-muted-foreground font-semibold">Feed Glassmorphism Inclusivo 🌟</span>
        </div>

        {/* Posts Feed */}
        <AnimatePresence>
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={cn("mb-6 overflow-hidden", cardStyle)}>
                <CardHeader className="pb-2 pt-5 px-5 sm:px-6">
                  <div className="flex items-start gap-4">
                    <Avatar className={cn("h-12 w-12 cursor-pointer border border-border/50 shadow-sm", seniorMode && "h-14 w-14", post.author === 'dvscodes' && "bg-black text-white h-14 w-14")}>
                      <AvatarFallback className={cn("bg-accent text-accent-foreground font-bold", post.author === 'dvscodes' && "bg-black text-white")}>
                        {post.author === 'dvscodes' ? 'dvs' : post.author.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn("font-bold text-foreground hover:text-primary cursor-pointer hover:underline", seniorMode && "text-lg")}>
                          {post.author}
                        </p>
                        {post.isSponsored && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">Patrocinado</span>
                        )}
                      </div>
                      <p className={cn("text-xs text-muted-foreground font-medium", seniorMode && "text-base")}>
                        {post.title}
                      </p>
                      <p className={cn("text-xs text-muted-foreground/80 flex items-center gap-1 mt-0.5", seniorMode && "text-sm")}>
                        {post.timeAgo} • <span className="text-[10px]">🌍</span>
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 sm:px-6 pb-4">
                  <p className={cn("text-foreground text-sm font-medium leading-relaxed mb-5 whitespace-pre-wrap", seniorMode && "text-lg leading-loose")}>
                    {post.content}
                  </p>
                  
                  {/* Patrocinado Banner (dvscodes) */}
                  {post.isSponsored && !seniorMode && !highContrast && (
                    <div className="my-4 rounded-xl aspect-video bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-6 text-center text-white relative overflow-hidden group cursor-pointer shadow-inner">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="relative z-10">
                        <div className="text-4xl font-black mb-2 tracking-tighter drop-shadow-lg">dvscodes</div>
                        <p className="font-semibold text-white/90 text-sm">Onde a estética encontra a acessibilidade.</p>
                        <Button className="mt-4 bg-white text-indigo-900 hover:bg-gray-100 rounded-full font-bold shadow-xl">
                          Conheça nossa cultura
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground border-b border-border/50 pb-3 mb-2 px-1">
                    <div className="flex items-center gap-1.5">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-1 shadow-sm"><Heart className="w-3 h-3 text-white fill-current" /></div>
                      <span className={cn(seniorMode && "text-sm")}>{post.likes} adoraram isso</span>
                    </div>
                    <span className={cn("hover:text-primary hover:underline cursor-pointer", seniorMode && "text-sm")}>{post.comments} comentários</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <Button
                      variant="ghost"
                      size={seniorMode ? "lg" : "sm"}
                      onClick={() => toggleLike(post.id)}
                      className={cn(
                        "flex-1 gap-2 text-muted-foreground font-bold hover:bg-primary/5",
                        post.liked && "text-blue-600 dark:text-blue-400"
                      )}
                      aria-label={post.liked ? "Descurtir" : "Gostei"}
                    >
                      <Heart className={cn("h-5 w-5", seniorMode && "h-6 w-6", post.liked && "fill-current")} />
                      <span className={cn("hidden sm:inline", seniorMode && "text-base")}>Gostei</span>
                    </Button>
                    <Button variant="ghost" size={seniorMode ? "lg" : "sm"} className="flex-1 gap-2 text-muted-foreground font-bold hover:bg-primary/5" aria-label="Comentar">
                      <MessageCircle className={cn("h-5 w-5", seniorMode && "h-6 w-6")} />
                      <span className={cn("hidden sm:inline", seniorMode && "text-base")}>Comentar</span>
                    </Button>
                    <Button variant="ghost" size={seniorMode ? "lg" : "sm"} className="flex-1 gap-2 text-muted-foreground font-bold hover:bg-primary/5" aria-label="Compartilhar">
                      <Share2 className={cn("h-5 w-5", seniorMode && "h-6 w-6")} />
                      <span className={cn("hidden sm:inline", seniorMode && "text-base")}>Compartilhar</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size={seniorMode ? "lg" : "sm"} 
                      className="flex-1 gap-2 text-indigo-500 font-bold hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10"
                      onClick={() => speak(`${post.author} postou: ${post.content}`)}
                      aria-label="Ouvir post"
                    >
                      <Volume2 className={cn("h-5 w-5", seniorMode && "h-6 w-6")} />
                      <span className={cn("hidden sm:inline", seniorMode && "text-base")}>Ouvir</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Right Column: Recommendations */}
      <div className="hidden lg:block space-y-4">
        <Card className={cn("p-5 sticky top-20", cardStyle)}>
          <h3 className={cn("font-bold text-foreground mb-5", seniorMode && "text-lg")}>
            Adicionar ao seu feed
          </h3>
          <div className="space-y-5">
            <div className="flex gap-3">
              <Avatar className={cn("h-12 w-12 bg-black", seniorMode && "h-14 w-14")}>
                <AvatarFallback className="bg-black text-white font-bold text-sm">dvs</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className={cn("font-bold text-sm text-foreground", seniorMode && "text-base")}>dvscodes</h4>
                <p className={cn("text-xs text-muted-foreground mb-2 font-medium line-clamp-2", seniorMode && "text-sm")}>Pioneiros em Software Inclusivo e Design Avançado.</p>
                <Button variant="outline" size="sm" className="rounded-full h-8 font-bold border-2 hover:bg-muted">
                  + Seguir
                </Button>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Avatar className={cn("h-12 w-12", seniorMode && "h-14 w-14")}>
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-sm">AI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className={cn("font-bold text-sm text-foreground", seniorMode && "text-base")}>Acessibilidade News</h4>
                <p className={cn("text-xs text-muted-foreground mb-2 font-medium line-clamp-2", seniorMode && "text-sm")}>Novidades sobre WCAG 2.2 e VoiceOver.</p>
                <Button variant="outline" size="sm" className="rounded-full h-8 font-bold border-2 hover:bg-muted">
                  + Seguir
                </Button>
              </div>
            </div>
          </div>
          <Button variant="link" className="px-0 mt-5 text-sm font-bold text-muted-foreground hover:text-primary">
            Ver todas as recomendações →
          </Button>
        </Card>

        {/* Footer Links - Glassmorphism */}
        <div className="text-center text-xs font-medium text-muted-foreground mt-6 px-4">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-3">
            <span className="hover:text-primary cursor-pointer hover:underline">Sobre a dvscodes</span>
            <span className="hover:text-primary cursor-pointer hover:underline">Acessibilidade</span>
            <span className="hover:text-primary cursor-pointer hover:underline">Central de Ajuda</span>
            <span className="hover:text-primary cursor-pointer hover:underline">Privacidade e Termos</span>
          </div>
          <p className="text-foreground font-semibold">ProConnect Especial <br/> powered by dvscodes © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
