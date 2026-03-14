import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { seniorMode } = useAccessibility();

  // Redireciona após login OAuth (Google)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast({ title: "Conta criada!", description: "Verifique seu email para confirmar o cadastro." });
      }
    } catch (error: unknown) {
      let msg = (error as Error).message;
      if (msg === "Invalid login credentials") msg = "Email ou senha incorretos. Verifique seus dados.";
      else if (msg.includes("Email not confirmed")) msg = "Email não confirmado. Verifique sua caixa de entrada.";
      toast({ title: "Erro", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      // Dynamic Redirect URL to handle localhost and production (dvscodes AI logic)
      const currentOrigin = window.location.origin;
      const redirectURL = currentOrigin.includes("localhost") || currentOrigin.includes("127.0.0.1")
        ? `${currentOrigin}/`
        : `${currentOrigin}/`; // Can be customized for specific production subdomains if needed

      console.log("Iniciando Google Auth com redirect:", redirectURL);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectURL,
          // We removed prompt: "select_account" to avoid some browser popup blocking issues
          // If the user still has issues, advising them to check Supabase "Site URL" is key
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      console.error("Erro Crítico no Google Auth:", error);
      let desc = (error as Error).message;
      
      if (desc.includes("provider_not_enabled")) {
        desc = "O login com Google não está ativado no Supabase (Authentication -> Providers).";
      } else if (desc.includes("configuration_not_found")) {
        desc = "Client ID ou Secret do Google não configurados corretamente no Supabase.";
      } else if (desc.includes("redirect_uri_mismatch")) {
        desc = "Erro de Redirecionamento: Adicione a URL do site no whitelist do Google Console.";
      }
      
      toast({ 
        title: "Falha na Conexão Google", 
        description: desc, 
        variant: "destructive" 
      });
      setGoogleLoading(false);
    }
  };

  const handleMagicLogin = async () => {
    setLoading(true);
    try {
      // Create a dummy user session using an anonymous login or mock it
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        // Fallback: signUp with a throwaway email if anonymous is disabled
        const fakeEmail = `senior-dev-${Date.now()}@dvscodes.com`;
        const { error: signUpError } = await supabase.auth.signUp({
          email: fakeEmail,
          password: "dvscodes-magic-password-2026",
          options: { data: { full_name: "Visitante dvscodes" } }
        });
        
        if (signUpError) {
             throw new Error("Nem email/senha nem anônimo estão ativados no Supabase.");
        }
      }
      
      toast({
        title: "Acesso Mágico Concedido ✨",
        description: "Você entrou no modo de demonstração dvscodes.",
      });
      navigate("/");
    } catch (e: unknown) {
      toast({
        title: "Erro no Acesso Direto",
        description: "Para entrar confirme que Email/Senha estão ativos no seu Supabase (Authentication -> Providers).",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4">
      {/* Fundo decorativo animado */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header / Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/30"
          >
            <span className="text-white font-black text-3xl font-[Space_Grotesk]">P</span>
          </motion.div>
          <h1 className={cn("font-black text-foreground font-[Space_Grotesk]", seniorMode ? "text-4xl" : "text-3xl")}>
            ProConnect
          </h1>
          <p className={cn("text-muted-foreground mt-1 font-medium", seniorMode && "text-lg")}>
            Rede profissional{" "}
            <span className="text-blue-600 dark:text-blue-400 font-bold">2.0</span>
            {" "}— powered by{" "}
            <span className="font-black text-foreground">dvscodes</span>
          </p>
        </div>

        {/* Card Principal */}
        <Card className="border border-white/20 bg-card/70 backdrop-blur-2xl shadow-2xl shadow-black/10 overflow-hidden rounded-3xl">
          <CardContent className="p-7 space-y-5">
            {/* Toggle Entrar / Criar conta */}
            <div className="flex bg-muted/50 rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200",
                  seniorMode && "text-base py-3",
                  isLogin
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200",
                  seniorMode && "text-base py-3",
                  !isLogin
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Criar conta
              </button>
            </div>

            {/* Botão Google — Em Destaque */}
            <Button
              variant="outline"
              className={cn(
                "w-full gap-3 font-bold border-2 hover:bg-muted/50 transition-all rounded-2xl shadow-sm",
                seniorMode ? "h-16 text-lg" : "h-12 text-base"
              )}
              onClick={handleGoogleAuth}
              disabled={googleLoading}
              type="button"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {googleLoading ? "Conectando ao Google..." : "Continuar com Google"}
            </Button>

            {/* Separador */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-border/60 flex-1" />
              <span className="text-xs text-muted-foreground font-semibold">acesso bypass</span>
              <div className="h-px bg-border/60 flex-1" />
            </div>

            {/* Botão Magic Login */}
            <Button
              onClick={handleMagicLogin}
              disabled={loading || googleLoading}
              className={cn(
                "w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base transition-all rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              )}
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                   <Sparkles className="h-5 w-5" /> Acesso Direto Sem Google
                </span>
              )}
            </Button>

            {/* Separador 2 */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-border/60 flex-1" />
              <span className="text-xs text-muted-foreground font-semibold">ou use seu email</span>
              <div className="h-px bg-border/60 flex-1" />
            </div>

            {/* Formulário Email */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label className={cn("font-semibold", seniorMode && "text-lg")}>Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Seu nome"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={cn("pl-10 rounded-xl border-2", seniorMode && "h-14 text-lg")}
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label className={cn("font-semibold", seniorMode && "text-lg")}>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn("pl-10 rounded-xl border-2", seniorMode && "h-14 text-lg")}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={cn("font-semibold", seniorMode && "text-lg")}>Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn("pl-10 pr-12 rounded-xl border-2", seniorMode && "h-14 text-lg")}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className={cn(
                  "w-full font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 gap-2",
                  seniorMode ? "h-16 text-xl" : "h-12"
                )}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {isLogin ? "Entrar na plataforma" : "Criar minha conta"}
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </>
                )}
              </Button>
            </form>

            <p className={cn("text-center text-sm text-muted-foreground font-medium", seniorMode && "text-base")}>
              {isLogin ? "Não tem conta ainda? " : "Já tem uma conta? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline transition-all"
              >
                {isLogin ? "Cadastre-se grátis" : "Entrar agora"}
              </button>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground font-medium mt-6">
          ProConnect 2.0 © 2026 — powered by{" "}
          <span className="font-black text-foreground">dvscodes</span>{" "}
          ✦ Plataforma 100% acessível e inclusiva
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
