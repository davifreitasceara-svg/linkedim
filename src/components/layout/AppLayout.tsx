import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, User, Search, LogOut, Accessibility } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSeniorMode } from "@/contexts/SeniorModeContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Início", icon: Home, path: "/" },
  { label: "Buscar", icon: Search, path: "/search" },
  { label: "Perfil", icon: User, path: "/profile" },
];

const AppLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const { seniorMode, toggleSeniorMode } = useSeniorMode();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = user?.email?.slice(0, 2).toUpperCase() || "PC";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm font-[Space_Grotesk]">P</span>
            </div>
            {!seniorMode && (
              <span className="font-semibold text-foreground font-[Space_Grotesk] text-lg hidden sm:inline">
                ProConnect
              </span>
            )}
            {seniorMode && (
              <span className="font-bold text-foreground font-[Space_Grotesk] text-xl">
                ProConnect
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            {/* Senior Mode Toggle */}
            <div className="flex items-center gap-2">
              <Accessibility className={cn("h-4 w-4 text-muted-foreground", seniorMode && "h-5 w-5 text-primary")} />
              <Switch checked={seniorMode} onCheckedChange={toggleSeniorMode} />
            </div>

            <Avatar className={cn("h-8 w-8 cursor-pointer", seniorMode && "h-10 w-10")} onClick={() => navigate("/profile")}>
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="icon" onClick={signOut} className={cn(seniorMode && "h-12 w-12")}>
              <LogOut className={cn("h-4 w-4", seniorMode && "h-6 w-6")} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="sticky bottom-0 z-50 border-t bg-card/80 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                  seniorMode && "px-6 py-3"
                )}
              >
                <item.icon className={cn("h-5 w-5", seniorMode && "h-7 w-7")} />
                <span className={cn("text-xs font-medium", seniorMode && "text-sm font-semibold")}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar-like Bottom Bar */}
      <nav className="hidden md:flex fixed left-0 top-14 bottom-0 w-56 border-r bg-card flex-col p-4 gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted",
                seniorMode && "py-4 text-lg"
              )}
            >
              <item.icon className={cn("h-5 w-5", seniorMode && "h-6 w-6")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Offset for desktop sidebar */}
      <style>{`
        @media (min-width: 768px) {
          main { margin-left: 14rem; }
        }
      `}</style>
    </div>
  );
};

export default AppLayout;
