import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, User, Search, LogOut, Briefcase, Bell, MessageSquare, Users, X, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Início",       icon: Home,          path: "/" },
  { label: "Minha rede",   icon: Users,         path: "/network" },
  { label: "Vagas",        icon: Briefcase,     path: "/jobs" },
  { label: "Mensagens",    icon: MessageSquare, path: "/messages" },
  { label: "Notificações", icon: Bell,          path: "/notifications" },
];

const AppLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const { seniorMode } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const initials = user?.email?.slice(0, 2).toUpperCase() || "PC";

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">

          {/* Logo + Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 group"
              aria-label="ProConnect - Página Inicial"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md group-hover:shadow-blue-500/40 transition-shadow">
                <span className="text-white font-black text-base font-[Space_Grotesk]">P</span>
              </div>
              <span className="hidden sm:block font-black text-foreground font-[Space_Grotesk] text-lg tracking-tight">
                Pro<span className="text-gradient">Connect</span>
              </span>
            </button>

            {/* Search — Desktop */}
            <div className="hidden md:flex relative ml-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Pesquisar profissionais, vagas..."
                className="w-60 pl-9 bg-muted/60 border-border/60 rounded-xl h-9 text-sm transition-all focus:w-80 focus:bg-background font-medium"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center h-full gap-1" role="navigation" aria-label="Navegação principal">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 px-4 h-full rounded-none border-b-2 transition-all duration-200 min-w-[64px] relative",
                    isActive
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30",
                    seniorMode && "min-w-[80px]"
                  )}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className={cn("h-5 w-5", seniorMode && "h-6 w-6", isActive && "text-primary")} />
                  <span className={cn("text-[11px] font-semibold hidden lg:block", seniorMode && "text-sm")}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 pl-3 border-l border-border/50">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-xl"
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* dvscodes badge */}
            {!seniorMode && (
              <div
                className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-full px-3 py-1 cursor-pointer hover:from-blue-600/20 hover:to-indigo-600/20 transition-all"
                onClick={() => navigate("/jobs")}
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-black text-blue-700 dark:text-blue-300">dvscodes</span>
              </div>
            )}

            {/* Profile Button */}
            <button
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors px-2"
              aria-label="Seu perfil"
            >
              <Avatar className={cn(
                "h-8 w-8 ring-2 ring-transparent hover:ring-primary/40 transition-all border border-border/60",
                seniorMode && "h-10 w-10"
              )}>
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className={cn("text-[10px] font-semibold hidden lg:flex items-center gap-0.5", seniorMode && "text-xs")}>
                Eu <span className="opacity-60 text-[8px]">▾</span>
              </span>
            </button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className={cn("h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors", seniorMode && "h-11 w-11")}
              aria-label="Sair da conta"
            >
              <LogOut className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
            </Button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-x-0 top-full bg-card/95 backdrop-blur-xl border-b border-border/60 p-3 flex gap-2 md:hidden shadow-xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  type="search"
                  placeholder="Pesquisar profissionais, vagas..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-9 rounded-xl h-11 font-medium"
                />
              </div>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-5 py-6">
        <Outlet />
      </main>

      {/* ── BOTTOM NAV (Mobile) ── */}
      <nav
        className="sticky bottom-0 z-50 border-t border-border/60 bg-card/90 backdrop-blur-xl md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        role="navigation"
        aria-label="Navegação mobile"
      >
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 min-w-[52px] relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground active:scale-90",
                  seniorMode && "px-4 py-2"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-bg"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                  />
                )}
                <item.icon className={cn("h-5 w-5 relative z-10", seniorMode && "h-6 w-6", isActive && "text-primary")} />
                <span className={cn("text-[10px] font-bold relative z-10", seniorMode && "text-xs")}>
                  {item.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
