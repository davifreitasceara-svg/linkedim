import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, User, Search, LogOut, Briefcase, Bell, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Início", icon: Home, path: "/" },
  { label: "Minha rede", icon: User, path: "/network" },
  { label: "Vagas", icon: Briefcase, path: "/jobs" },
  { label: "Mensagens", icon: MessageSquare, path: "/messages" },
  { label: "Notificações", icon: Bell, path: "/notifications" },
];

const AppLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const { seniorMode } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = user?.email?.slice(0, 2).toUpperCase() || "PC";

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F2EF] dark:bg-background">
      {/* Top Header - LinkedIn Style */}
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          
          {/* Logo & Search */}
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/")} className="flex items-center" aria-label="Página Inicial">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
            </button>
            <div className="hidden md:flex relative ml-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquisar"
                className="w-64 pl-9 bg-muted border-0 h-9 transition-all focus:w-80"
              />
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center h-full gap-2 sm:gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center h-full border-b-2 px-1 transition-colors min-w-[60px]",
                    isActive
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                    seniorMode && "px-2"
                  )}
                  aria-label={item.label}
                >
                  <item.icon className={cn("h-5 w-5 mb-0.5", seniorMode && "h-6 w-6")} />
                  <span className={cn("text-[11px] hidden lg:block", seniorMode && "text-sm font-semibold")}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4 border-l pl-2 md:pl-4 border-border/50">
            <button 
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Acessar seu perfil"
            >
              <Avatar className={cn("h-6 w-6 mb-0.5", seniorMode && "h-8 w-8")}>
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className={cn("text-[11px] hidden lg:flex items-center gap-1", seniorMode && "text-sm font-semibold")}>
                Eu <span className="text-[8px] opacity-70">▼</span>
              </span>
            </button>

            <Button variant="ghost" size="icon" onClick={signOut} className={cn(seniorMode && "h-10 w-10")} aria-label="Sair da conta">
              <LogOut className={cn("h-4 w-4", seniorMode && "h-5 w-5")} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="sticky bottom-0 z-50 border-t bg-card md:hidden">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground",
                  seniorMode && "px-4 py-2"
                )}
              >
                <item.icon className={cn("h-5 w-5", seniorMode && "h-6 w-6")} />
                <span className={cn("text-[10px]", seniorMode && "text-xs")}>
                  {item.label}
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
