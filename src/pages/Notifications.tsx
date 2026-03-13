import React, { useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal, Volume2, Sparkles, UserPlus, Heart, MessageCircle,
  Briefcase, Bell, CheckCheck, Eye, Trophy, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type NotifType = "connection" | "like" | "comment" | "job" | "view" | "mention" | "achievement";

interface Notif {
  id: number;
  type: NotifType;
  text: string;
  time: string;
  unread: boolean;
  initials: string;
  isVip?: boolean;
  actionLabel?: string;
  actionSecondary?: string;
}

const allNotifs: Notif[] = [
  { id: 1, type: "connection", text: "O recrutador da dvscodes visualizou seu perfil e enviou uma solicitação de conexão.", time: "10m", unread: true, initials: "dvs", isVip: true, actionLabel: "Aceitar", actionSecondary: "Ignorar" },
  { id: 2, type: "like", text: "Seu post sobre acessibilidade web foi curtido por Maria Silva e outras 32 pessoas.", time: "45m", unread: true, initials: "MS", actionLabel: "Ver post" },
  { id: 3, type: "comment", text: "João Santos comentou: 'Excelente artigo! Os 5 pontos de UX são essenciais.'", time: "1h", unread: true, initials: "JS", actionLabel: "Responder" },
  { id: 4, type: "job", text: "Nova vaga: Desenvolvedor Sênior React na Nubank — 100% remoto, salário premium.", time: "2h", unread: false, initials: "NU", actionLabel: "Ver vaga" },
  { id: 5, type: "view", text: "Você apareceu em 18 pesquisas de recrutadores nesta semana. Um recorde para seu perfil!", time: "4h", unread: false, initials: "P" },
  { id: 6, type: "connection", text: "Ana Lima, Product Manager no iFood, aceitou sua solicitação de conexão.", time: "Ontem", unread: false, initials: "AL", actionLabel: "Enviar mensagem" },
  { id: 7, type: "mention", text: "Mariana Costa mencionou você em um artigo sobre Design Inclusivo com 4.2k visualizações.", time: "Ontem", unread: false, initials: "MC", actionLabel: "Ver menção" },
  { id: 8, type: "achievement", text: "🏆 Conquista desbloqueada! Você entrou no Top 5% de perfis mais visitados essa semana.", time: "2 dias", unread: false, initials: "🏆", isVip: true },
  { id: 9, type: "job", text: "A Coca-Cola Brasil salvou seu perfil para a vaga de Engenheiro de Software Sênior.", time: "3 dias", unread: false, initials: "CC", actionLabel: "Ver detalhes" },
  { id: 10, type: "like", text: "Roberto Alves e outras 8 pessoas curtiram seu comentário sobre componentes acessíveis.", time: "4 dias", unread: false, initials: "RA", actionLabel: "Ver comentário" },
];

const typeIcon: Record<NotifType, React.ElementType> = {
  connection: UserPlus,
  like: Heart,
  comment: MessageCircle,
  job: Briefcase,
  view: Eye,
  mention: Zap,
  achievement: Trophy,
};

const typeColor: Record<NotifType, string> = {
  connection: "bg-green-500",
  like: "bg-rose-500",
  comment: "bg-blue-500",
  job: "bg-violet-500",
  view: "bg-orange-500",
  mention: "bg-yellow-500",
  achievement: "bg-amber-500",
};

const categories = ["Tudo", "Conexões", "Publicações", "Vagas", "Menções"];

const Notifications: React.FC = () => {
  const { seniorMode, highContrast } = useAccessibility();
  const { speak } = useTextToSpeech();
  const [notifs, setNotifs] = useState<Notif[]>(allNotifs);
  const [activeCategory, setActiveCategory] = useState("Tudo");

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  const dismissNotif = (id: number) => setNotifs(prev => prev.filter(n => n.id !== id));

  const filtered = notifs.filter(n => {
    if (activeCategory === "Tudo") return true;
    if (activeCategory === "Conexões") return n.type === "connection";
    if (activeCategory === "Publicações") return n.type === "like" || n.type === "comment";
    if (activeCategory === "Vagas") return n.type === "job";
    if (activeCategory === "Menções") return n.type === "mention";
    return true;
  });

  const unreadCount = notifs.filter(n => n.unread).length;

  const cardStyle = highContrast
    ? "border-2 border-primary bg-background shadow-none"
    : "border border-white/20 bg-card/60 backdrop-blur-xl shadow-xl shadow-black/5";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_300px] gap-5 max-w-7xl mx-auto pb-20">

      {/* ── LEFT SIDEBAR ── */}
      <Card className={cn("border-0 shadow-sm h-fit hidden lg:block sticky top-20 overflow-hidden", cardStyle)}>
        <div className="p-5 border-b border-border/50 bg-gradient-to-r from-blue-600/10 to-transparent">
          <h3 className={cn("font-black text-foreground font-[Space_Grotesk]", seniorMode ? "text-2xl" : "text-xl")}>
            Central de Avisos
          </h3>
        </div>
        <div className="p-4 space-y-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-xl font-semibold transition-all text-sm flex items-center justify-between",
                activeCategory === cat ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-muted/40"
              )}
            >
              <span>{cat}</span>
              {cat === "Tudo" && unreadCount > 0 && (
                <span className="bg-primary text-white text-[10px] font-black rounded-full px-1.5 py-0.5">{unreadCount}</span>
              )}
            </button>
          ))}
          <div className="border-t border-border/40 pt-3 mt-2">
            <p className={cn("text-primary font-bold hover:underline cursor-pointer transition-all hover:translate-x-1 inline-block", seniorMode && "text-base")}>
              Configurações
            </p>
          </div>
        </div>
      </Card>

      {/* ── MAIN CONTENT ── */}
      <Card className={cn("border-0 overflow-hidden", cardStyle)}>
        {/* Tabs */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/40">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.slice(0, 3).map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full font-bold whitespace-nowrap border-2",
                  activeCategory === cat && "bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white"
                )}
              >
                {cat}
                {cat === "Tudo" && unreadCount > 0 && (
                  <span className="ml-1 bg-white/30 rounded-full px-1.5 py-0.5 text-[10px]">{unreadCount}</span>
                )}
              </Button>
            ))}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-primary font-bold text-xs gap-1 hover:bg-primary/10 whitespace-nowrap" onClick={markAllRead}>
              <CheckCheck className="h-3.5 w-3.5" />
              {!seniorMode && "Marcar tudo lido"}
            </Button>
          )}
        </div>

        <div>
          <AnimatePresence>
            {filtered.map((not) => {
              const Icon = typeIcon[not.type];
              return (
                <motion.div
                  key={not.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  className={cn(
                    "flex items-start gap-4 p-5 border-b border-border/40 hover:bg-muted/30 transition-colors relative cursor-pointer group",
                    not.unread && !highContrast && "bg-blue-500/5",
                  )}
                >
                  {/* Unread bar */}
                  {not.unread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-md" />
                  )}

                  {/* Avatar */}
                  <div className="relative shrink-0 mt-0.5">
                    <Avatar className={cn("h-12 w-12", seniorMode && "h-14 w-14", not.isVip && "border-2 border-indigo-500")}>
                      <AvatarFallback className={cn("font-bold", not.isVip ? "bg-black text-white" : "bg-accent/15 text-accent font-semibold")}>
                        {not.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn("absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center border-2 border-background shadow", typeColor[not.type])}>
                      <Icon className="h-2.5 w-2.5 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-foreground font-medium leading-snug",
                      seniorMode ? "text-lg" : "text-sm",
                      not.unread && "font-bold",
                      not.isVip && "text-blue-600 dark:text-blue-400"
                    )}>
                      {not.text}
                    </p>
                    <p className={cn("text-muted-foreground mt-1 font-semibold", seniorMode ? "text-sm" : "text-xs", not.unread && "text-primary")}>
                      {not.time}
                    </p>
                    {not.actionLabel && (
                      <div className="flex gap-2 mt-2.5">
                        <Button size="sm" className="h-7 rounded-full font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:to-indigo-700">
                          {not.actionLabel}
                        </Button>
                        {not.actionSecondary && (
                          <Button size="sm" variant="outline" className="h-7 rounded-full font-bold text-xs border-2" onClick={() => dismissNotif(not.id)}>
                            {not.actionSecondary}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:bg-background">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full text-muted-foreground hover:text-primary hover:bg-background"
                      onClick={(e) => { e.stopPropagation(); speak(`Notificação: ${not.text}`); }}
                      aria-label="Ouvir"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">Nenhuma notificação aqui</p>
            </div>
          )}
        </div>
      </Card>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="hidden lg:block">
        <Card className={cn("overflow-hidden sticky top-20 border-0 shadow-lg text-center", cardStyle)}>
          <div className="h-24 bg-gradient-to-br from-blue-600 to-indigo-900 relative">
            <div className="absolute right-2 top-2 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Patrocínio
            </div>
          </div>
          <div className="p-6 pt-0 relative">
            <div className="mx-auto w-20 h-20 bg-black rounded-2xl border-4 border-card -mt-10 mb-4 flex items-center justify-center shadow-xl">
              <span className="text-white font-black text-2xl">dvs</span>
            </div>
            <h4 className={cn("font-black text-foreground font-[Space_Grotesk]", seniorMode ? "text-xl" : "text-lg")}>
              Carreiras Premium
            </h4>
            <p className={cn("text-muted-foreground font-medium mt-2 mb-4 leading-relaxed", seniorMode ? "text-base" : "text-sm")}>
              Seja notado antes de todos pelas equipes da <span className="font-bold text-blue-600 dark:text-blue-400">dvscodes</span>.
            </p>
            <div className="space-y-2 text-left mb-5">
              {["Perfil em destaque nos resultados", "Notificações prioritárias de vagas", "Badge VIP visível para recrutadores"].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg h-11">
              <Sparkles className="w-4 h-4 mr-2" />
              Ativar Modo VIP
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
