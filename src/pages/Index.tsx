import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSeniorMode } from "@/contexts/SeniorModeContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, ImagePlus, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
  timeAgo: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Maria Silva",
    title: "Designer Gráfica",
    content: "Acabei de finalizar um projeto incrível de identidade visual para uma startup de tecnologia. O processo criativo foi desafiador mas o resultado ficou fantástico! 🎨✨",
    likes: 24,
    comments: 5,
    liked: false,
    timeAgo: "2h",
  },
  {
    id: "2",
    author: "João Santos",
    title: "Desenvolvedor Full Stack",
    content: "Compartilhando meu novo portfólio de projetos web. Foram 6 meses de trabalho intenso e muito aprendizado. Confira no meu perfil! 🚀",
    likes: 42,
    comments: 12,
    liked: true,
    timeAgo: "5h",
  },
  {
    id: "3",
    author: "Ana Oliveira",
    title: "Fotógrafa Profissional",
    content: "Ensaio fotográfico corporativo para a empresa TechBR. Adorei o resultado e a equipe foi incrível de trabalhar. Fotos no portfólio! 📸",
    likes: 38,
    comments: 8,
    liked: false,
    timeAgo: "1d",
  },
];

const Index: React.FC = () => {
  const { user } = useAuth();
  const { seniorMode } = useSeniorMode();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");

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
      author: user?.user_metadata?.full_name || "Você",
      title: "Profissional",
      content: newPost,
      likes: 0,
      comments: 0,
      liked: false,
      timeAgo: "agora",
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Create Post */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar className={cn("h-10 w-10", seniorMode && "h-12 w-12")}>
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {user?.email?.slice(0, 2).toUpperCase() || "VC"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="O que você está trabalhando?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className={cn(
                  "resize-none border-0 bg-muted/50 focus-visible:ring-1",
                  seniorMode && "text-lg min-h-[100px]"
                )}
                rows={3}
              />
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" className={cn(seniorMode && "h-12 px-4")}>
                  <ImagePlus className={cn("h-4 w-4 mr-2", seniorMode && "h-5 w-5")} />
                  {seniorMode ? "Adicionar Foto" : "Foto"}
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  size={seniorMode ? "lg" : "default"}
                  className="gap-2"
                >
                  <Send className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <AnimatePresence>
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className={cn("h-10 w-10", seniorMode && "h-12 w-12")}>
                    <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                      {post.author.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={cn("font-semibold text-foreground", seniorMode && "text-lg")}>
                      {post.author}
                    </p>
                    <p className={cn("text-sm text-muted-foreground", seniorMode && "text-base")}>
                      {post.title} • {post.timeAgo}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className={cn("text-foreground leading-relaxed", seniorMode && "text-lg leading-loose")}>
                  {post.content}
                </p>
                <div className="flex items-center gap-1 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size={seniorMode ? "lg" : "sm"}
                    onClick={() => toggleLike(post.id)}
                    className={cn(
                      "gap-2",
                      post.liked && "text-destructive"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", seniorMode && "h-5 w-5", post.liked && "fill-current")} />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size={seniorMode ? "lg" : "sm"} className="gap-2">
                    <MessageCircle className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
                    <span>{post.comments}</span>
                  </Button>
                  <Button variant="ghost" size={seniorMode ? "lg" : "sm"} className="gap-2">
                    <Share2 className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
                    {seniorMode && <span>Compartilhar</span>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Index;
