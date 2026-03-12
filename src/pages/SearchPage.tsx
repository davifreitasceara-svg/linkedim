import React, { useState } from "react";
import { useSeniorMode } from "@/contexts/SeniorModeContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Professional {
  id: string;
  name: string;
  title: string;
  skills: string[];
  location: string;
}

const mockProfessionals: Professional[] = [
  { id: "1", name: "Maria Silva", title: "Designer Gráfica", skills: ["Illustrator", "Branding", "UI/UX"], location: "São Paulo" },
  { id: "2", name: "João Santos", title: "Desenvolvedor Full Stack", skills: ["React", "Node.js", "TypeScript"], location: "Rio de Janeiro" },
  { id: "3", name: "Ana Oliveira", title: "Fotógrafa", skills: ["Lightroom", "Edição", "Retrato"], location: "Belo Horizonte" },
  { id: "4", name: "Carlos Lima", title: "Editor de Vídeo", skills: ["Premiere", "After Effects", "Motion"], location: "Curitiba" },
  { id: "5", name: "Fernanda Costa", title: "Redatora", skills: ["SEO", "Copywriting", "Blog"], location: "Porto Alegre" },
];

const SearchPage: React.FC = () => {
  const { seniorMode } = useSeniorMode();
  const [query, setQuery] = useState("");

  const filtered = mockProfessionals.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className={cn("text-2xl font-bold font-[Space_Grotesk] text-foreground", seniorMode && "text-3xl")}>
          Buscar Profissionais
        </h1>
        <p className={cn("text-muted-foreground mt-1", seniorMode && "text-lg")}>
          Encontre talentos por nome, profissão ou habilidade
        </p>
      </div>

      <div className="relative">
        <Search className={cn("absolute left-3 top-3 h-5 w-5 text-muted-foreground", seniorMode && "top-4 h-6 w-6 left-4")} />
        <Input
          placeholder="Buscar por nome, profissão ou habilidade..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn("pl-10 h-11", seniorMode && "pl-14 h-14 text-lg")}
        />
      </div>

      <div className="space-y-3">
        {filtered.map((pro, i) => (
          <motion.div
            key={pro.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className={cn("h-12 w-12", seniorMode && "h-16 w-16")}>
                    <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                      {pro.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-semibold text-foreground truncate", seniorMode && "text-lg")}>
                      {pro.name}
                    </p>
                    <p className={cn("text-sm text-muted-foreground", seniorMode && "text-base")}>
                      {pro.title} • {pro.location}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {pro.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className={cn("text-xs", seniorMode && "text-sm px-3")}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size={seniorMode ? "lg" : "sm"}
                    className="gap-2 shrink-0"
                  >
                    <UserPlus className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
                    {seniorMode ? "Conectar" : ""}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className={cn("text-muted-foreground", seniorMode && "text-lg")}>
              Nenhum profissional encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
