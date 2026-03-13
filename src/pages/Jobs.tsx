import React, { useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, MapPin, Building, Star, CheckCircle2, Volume2, Sparkles, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  match: number;
  description: string;
  applied?: boolean;
  isSponsored?: boolean;
}

const mockJobs: Job[] = [
  {
    id: "dvs-1",
    title: "Especialista em UI/UX e Acessibilidade",
    company: "dvscodes",
    location: "São Paulo, SP (Híbrido)",
    type: "Tempo Integral",
    match: 100,
    description: "Junte-se ao time que está redefinindo o futuro da web inclusiva. Procuramos alguém apaixonado por estética avançada (como Glassmorphism) e rigoroso com diretrizes WCAG. Oferecemos pacote de benefícios Premium + Stock Options.",
    isSponsored: true,
  },
  {
    id: "1",
    title: "Desenvolvedor Frontend Sênior",
    company: "Tech4All",
    location: "Remoto",
    type: "Tempo Integral",
    match: 95,
    description: "Buscamos um desenvolvedor experiente em React. Vaga voltada para melhorias de impacto na experiência do usuário.",
  },
  {
    id: "2",
    title: "Consultor de Diversidade e Inclusão",
    company: "GlobalHR",
    location: "São Paulo, SP",
    type: "Híbrido",
    match: 88,
    description: "Liderar iniciativas de inclusão digital e contratação de talentos diversos e experientes.",
  },
];

const Jobs: React.FC = () => {
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  const cardStyle = highContrast 
    ? "border-2 border-primary bg-background shadow-none" 
    : "border border-white/20 bg-card/60 backdrop-blur-xl shadow-xl shadow-black/5";

  const handleApply = (id: string, isSponsored?: boolean) => {
    setJobs(currentJobs => 
      currentJobs.map(job => 
        job.id === id ? { ...job, applied: true } : job
      )
    );
    
    speak(`Candidatura ${isSponsored ? 'VIP ' : ''}enviada com sucesso! O currículo do seu perfil foi compartilhado.`);
    toast({
      title: "Candidatura Concluída!",
      description: isSponsored ? "Seu perfil foi enviado com destaque VIP para a dvscodes." : "Sua candidatura foi enviada com 1 clique.",
    });
  };

  const readJob = (job: Job) => {
    speak(`Vaga para ${job.title} na empresa ${job.company}. Local de trabalho: ${job.location}. Compatibilidade de ${job.match} por cento. Descrição: ${job.description}`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 pt-4">
      <div className="mb-8 text-center sm:text-left bg-gradient-to-r from-blue-600/10 to-transparent p-6 rounded-2xl border border-blue-500/20">
        <h1 className={cn("font-black text-foreground font-[Space_Grotesk]", seniorMode ? "text-4xl" : "text-3xl")}>
          Vagas Premium
        </h1>
        <p className={cn("text-muted-foreground mt-2 font-medium max-w-2xl", seniorMode ? "text-xl" : "text-base")}>
          Oportunidades filtradas pela nossa IA para o seu perfil e momento de carreira. 
          Vagas da <span className="font-bold text-blue-600 dark:text-blue-400">dvscodes</span> possuem candidatura prioritária garantida.
        </p>
      </div>

      <AnimatePresence>
        {jobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={cn(
              "overflow-hidden relative transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl", 
              cardStyle,
              job.isSponsored && !highContrast ? "border-blue-500/30 shadow-blue-500/10" : ""
            )}>
              {/* Badges do Canto */}
              <div className="absolute top-0 right-0 flex max-w-[50%] flex-wrap justify-end">
                {job.isSponsored && (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 text-xs font-bold flex items-center gap-1 rounded-bl-xl shadow-lg">
                    <Sparkles className="w-3 h-3" /> Promovida por dvscodes
                  </div>
                )}
                {job.match >= 95 && (
                  <div className={cn(
                    "px-4 py-1.5 text-xs font-bold flex items-center gap-1 shadow-lg",
                    job.isSponsored ? "bg-amber-500 text-amber-950 rounded-bl-xl ml-2" : "bg-primary text-primary-foreground rounded-bl-xl"
                  )}>
                    <Trophy className="w-3 h-3" /> Match Perfeito
                  </div>
                )}
              </div>
              
              <CardContent className="p-6 md:p-8 pt-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  
                  {/* Avatar / Logo */}
                  <div className="flex gap-4">
                    <Avatar className={cn(
                      "h-16 w-16 shadow-md border border-border/50 flex-shrink-0 mt-1",
                      seniorMode && "h-20 w-20",
                      job.company === 'dvscodes' && "bg-black text-white h-20 w-20 border-2 border-indigo-500"
                    )}>
                      <AvatarFallback className={cn("font-bold text-xl", job.company === 'dvscodes' && "bg-black text-white")}>
                        {job.company === 'dvscodes' ? 'dvs' : job.company.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Descrição Básica */}
                    <div className="space-y-4 flex-1">
                      <div>
                        <h2 className={cn("font-bold text-foreground font-[Space_Grotesk] leading-tight", seniorMode ? "text-3xl mb-3" : "text-2xl mb-2")}>
                          {job.title}
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-muted-foreground font-medium">
                          <span className={cn("flex items-center gap-1.5 text-primary", job.company === 'dvscodes' && "font-bold text-blue-600 dark:text-blue-400")}>
                            <Building className={cn("w-4 h-4 text-muted-foreground", seniorMode && "w-5 h-5")} /> {job.company}
                          </span>
                          <span className="flex items-center gap-1.5 opacity-80">
                            <MapPin className={cn("w-4 h-4", seniorMode && "w-5 h-5")} /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 opacity-80">
                            <Briefcase className={cn("w-4 h-4", seniorMode && "w-5 h-5")} /> {job.type}
                          </span>
                        </div>
                      </div>
                      
                      <p className={cn("text-foreground/90 leading-relaxed font-medium mt-4", seniorMode && "text-xl leading-loose")}>
                        {job.description}
                      </p>

                      <div className="flex items-center gap-3 font-semibold text-primary pt-2">
                        <div className="h-2 flex-1 max-w-[200px] bg-primary/20 rounded-full overflow-hidden shadow-inner">
                          <div className={cn("h-full", job.match === 100 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-primary")} style={{ width: `${job.match}%` }} />
                        </div>
                        <span className={cn(seniorMode && "text-xl")}>{job.match}% de aderência do seu perfil</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto shrink-0 md:pl-6 md:border-l md:border-border/50">
                    <Button 
                      size={seniorMode ? "lg" : "default"}
                      className={cn(
                        "w-full h-14 text-base font-bold shadow-lg transition-all", 
                        seniorMode && "h-20 text-xl",
                        job.isSponsored && !job.applied && "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
                      )}
                      disabled={job.applied}
                      onClick={() => handleApply(job.id, job.isSponsored)}
                    >
                      {job.applied ? (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" /> Candidaturada Concluída
                        </>
                      ) : (
                        job.isSponsored ? "Candidatura VIP (1-Click)" : "Candidatura Fácil"
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      size={seniorMode ? "lg" : "default"}
                      className={cn("w-full gap-2 font-bold shadow-sm border-2", seniorMode && "h-16 text-lg")}
                      onClick={() => readJob(job)}
                      aria-label="Ouvir detalhes da vaga"
                    >
                      <Volume2 className={cn("w-5 h-5 text-accent", seniorMode && "h-6 w-6")} />
                      Narrar Vaga
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;
