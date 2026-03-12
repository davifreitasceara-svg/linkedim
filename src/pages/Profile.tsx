import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSeniorMode } from "@/contexts/SeniorModeContext";
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
import { Edit, Plus, ExternalLink, Briefcase, GraduationCap, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

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
    title: "Identidade Visual - TechBR",
    description: "Criação completa de identidade visual incluindo logo, papelaria e manual de marca.",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    link: "#",
  },
  {
    id: "2",
    title: "Website Corporativo",
    description: "Design e desenvolvimento de website responsivo para empresa de consultoria.",
    imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop",
    link: "#",
  },
  {
    id: "3",
    title: "Campanha Digital",
    description: "Peças para campanha de marketing digital em redes sociais.",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
  },
];

const skills = ["Design Gráfico", "UI/UX", "Branding", "Illustrator", "Figma", "Photoshop", "React", "TypeScript"];

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { seniorMode } = useSeniorMode();
  const [portfolio] = useState<PortfolioItem[]>(mockPortfolio);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || "Seu Nome",
    title: "Profissional Criativo",
    bio: "Apaixonado por criar experiências visuais impactantes. Com mais de 5 anos de experiência em design gráfico e branding.",
    location: "São Paulo, Brasil",
  });

  const initials = profileData.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-lg overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary to-accent" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col items-center -mt-16">
              <Avatar className={cn("h-24 w-24 border-4 border-card", seniorMode && "h-32 w-32")}>
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center mt-4 space-y-1">
                <h1 className={cn("text-2xl font-bold text-foreground font-[Space_Grotesk]", seniorMode && "text-3xl")}>
                  {profileData.name}
                </h1>
                <p className={cn("text-muted-foreground font-medium", seniorMode && "text-lg")}>
                  {profileData.title}
                </p>
                <p className={cn("text-sm text-muted-foreground", seniorMode && "text-base")}>
                  📍 {profileData.location}
                </p>
              </div>
              <p className={cn("text-center mt-4 text-muted-foreground max-w-md", seniorMode && "text-lg")}>
                {profileData.bio}
              </p>
              <Button
                variant="outline"
                className={cn("mt-4 gap-2", seniorMode && "h-12 text-base px-6")}
                onClick={() => setIsEditing(true)}
              >
                <Edit className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
                Editar Perfil
              </Button>
            </div>

            {/* Skills */}
            <div className="mt-6">
              <h3 className={cn("font-semibold mb-3 text-foreground", seniorMode && "text-lg")}>
                Habilidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className={cn("font-medium", seniorMode && "text-base px-4 py-1.5")}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="portfolio">
        <TabsList className={cn("w-full", seniorMode && "h-14")}>
          <TabsTrigger
            value="portfolio"
            className={cn("flex-1 gap-2", seniorMode && "text-base py-3")}
          >
            <Palette className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
            Portfólio
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className={cn("flex-1 gap-2", seniorMode && "text-base py-3")}
          >
            <Briefcase className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
            Experiência
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className={cn("flex-1 gap-2", seniorMode && "text-base py-3")}
          >
            <GraduationCap className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
            Formação
          </TabsTrigger>
        </TabsList>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className={cn("text-xl font-bold font-[Space_Grotesk]", seniorMode && "text-2xl")}>
              Meus Trabalhos
            </h2>
            <Button size={seniorMode ? "lg" : "default"} className="gap-2">
              <Plus className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
              Adicionar
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolio.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-md overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className={cn("font-semibold text-foreground", seniorMode && "text-lg")}>
                      {item.title}
                    </h3>
                    <p className={cn("text-sm text-muted-foreground mt-1", seniorMode && "text-base")}>
                      {item.description}
                    </p>
                    {item.link && (
                      <Button variant="link" className="p-0 mt-2 gap-1 text-primary">
                        Ver projeto <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-4 mt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", seniorMode && "text-xl")}>
                <Briefcase className="h-5 w-5 text-primary" />
                Designer Gráfico Sênior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("text-muted-foreground", seniorMode && "text-lg")}>
                Agência Criativa XYZ • 2020 - Presente
              </p>
              <p className={cn("mt-2 text-foreground", seniorMode && "text-lg")}>
                Responsável pela criação de identidades visuais, materiais de marketing e interfaces digitais para clientes de diversos segmentos.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", seniorMode && "text-xl")}>
                <Briefcase className="h-5 w-5 text-primary" />
                Designer Júnior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("text-muted-foreground", seniorMode && "text-lg")}>
                Studio Design • 2018 - 2020
              </p>
              <p className={cn("mt-2 text-foreground", seniorMode && "text-lg")}>
                Criação de peças gráficas para redes sociais e materiais impressos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-4 mt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", seniorMode && "text-xl")}>
                <GraduationCap className="h-5 w-5 text-primary" />
                Design Gráfico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("text-muted-foreground", seniorMode && "text-lg")}>
                SENAI • 2016 - 2018
              </p>
              <p className={cn("mt-2 text-foreground", seniorMode && "text-lg")}>
                Curso técnico em Design Gráfico com foco em identidade visual e produção gráfica.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Título Profissional</Label>
              <Input
                value={profileData.title}
                onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Localização</Label>
              <Input
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Sobre</Label>
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={4}
              />
            </div>
            <Button onClick={() => setIsEditing(false)} className="w-full">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
