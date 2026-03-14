import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  { id: "e-l-1", name: "eduarda leal", title: "delegada federal", skills: ["Investigação", "Segurança", "Direito"], location: "Brasília" },
  { id: "i-s-1", name: "issac silva", title: "Desenvolvedor Full Stack", skills: ["React", "Node.js", "TypeScript"], location: "Rio de Janeiro" },
  { id: "k-1", name: "kauan", title: "stremer", skills: ["Gaming", "Streaming", "Conteúdo"], location: "Belo Horizonte" },
  { id: "g-1", name: "gabriel", title: "policial", skills: ["Tática", "Segurança Pública"], location: "Curitiba" },
  { id: "a-r-1", name: "aristotoles", title: "entregador", skills: ["Logística", "Agilidade"], location: "Porto Alegre" },
  { id: "v-1", name: "vicente", title: "técnico", skills: ["Hardware", "Redes"], location: "São Paulo" },
  { id: "l-1", name: "levi", title: "programador", skills: ["React", "Go"], location: "Rio de Janeiro" },
  { id: "do-1", name: "davi oliveira", title: "maquinário", skills: ["Mecânica", "Operação"], location: "Santos" },
  { id: "i-1", name: "isadora", title: "advogada", skills: ["Direito Digital", "Criminal"], location: "Brasília" },
  { id: "p-1", name: "paulo", title: "programador", skills: ["Java", "SQL"], location: "Belo Horizonte" },
  { id: "a-1", name: "Andre", title: "programador", skills: ["Node.js", "DevOps"], location: "Curitiba" },
  { id: "az-1", name: "andreza", title: "blogueira", skills: ["Social Media", "Lifestyle"], location: "Recife" },
  { id: "s-1", name: "sofia", title: "estilista", skills: ["Fashion Design", "Corte"], location: "Milão (Home Office)" },
  { id: "d-1", name: "diogo", title: "professor", skills: ["História", "Filosofia"], location: "Porto Alegre" },
  { id: "f-1", name: "falcone", title: "programador", skills: ["Cybersecurity", "C++"], location: "Vila Velha" },
  { id: "jp-1", name: "joao pedro", title: "cabeleireiro", skills: ["Visagismo", "Cor"], location: "Fortaleza" },
  { id: "vc-1", name: "vitor cerqueira", title: "cantor", skills: ["Vocal", "Composição"], location: "Salvador" },
  { id: "e-1", name: "eros", title: "engenheiro", skills: ["Civil", "Estruturas"], location: "Goiânia" },
  { id: "jd-1", name: "jade", title: "estreming", skills: ["Gaming", "Twitch"], location: "Internet" },
  { id: "dk-1", name: "david kayke", title: "piao", skills: ["Campo", "Trator"], location: "Cuiabá" },
  { id: "j-1", name: "julio", title: "marketing", skills: ["Ads", "Copy"], location: "Florianópolis" },
  { id: "pv-1", name: "predro victor", title: "professor", skills: ["Matemática", "Robótica"], location: "Manaus" },
  { id: "ar-1", name: "ariane", title: "policial", skills: ["Tática", "Combate"], location: "Belém" },
  { id: "c-1", name: "calebe", title: "professor", skills: ["Português", "Literatura"], location: "Natal" },
  { id: "gc-1", name: "Gabriel Cabreira", title: "cientista", skills: ["Física", "Dados"], location: "Houston (NASA)" },
  { id: "ju-1", name: "julie", title: "programadora", skills: ["Rust", "React"], location: "Palo Alto" },
  { id: "li-1", name: "liana", title: "marketing", skills: ["SEO", "Growth"], location: "Dublin" },
  { id: "mx-1", name: "maximiliano", title: "veterinario", skills: ["Exóticos", "Cirurgia"], location: "Berlim" },
  { id: "sa-1", name: "sarah", title: "veterinaria", skills: ["Clínica", "Diagnóstico"], location: "Toronto" },
];

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
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
                  <div 
                    className="flex flex-1 items-center gap-4 cursor-pointer group/item"
                    onClick={() => navigate(`/profile/${pro.name}`)}
                  >
                    <Avatar className={cn("h-12 w-12 group-hover/item:scale-105 transition-transform", seniorMode && "h-16 w-16")}>
                      <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                        {pro.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-semibold text-foreground truncate group-hover/item:text-primary transition-colors", seniorMode && "text-lg")}>
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
                  </div>
                  <Button
                    variant="outline"
                    size={seniorMode ? "lg" : "sm"}
                    className="gap-2 shrink-0"
                    onClick={() => navigate(`/profile/${pro.name}`)}
                  >
                    <UserPlus className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
                    {seniorMode ? "Ver Perfil" : "Ver"}
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
