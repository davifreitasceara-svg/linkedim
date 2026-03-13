import React, { useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Button } from "@/components/ui/button";
import { Settings, Type, Sunset, UserCircle, Volume2 } from "lucide-react";

const AccessibilityControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    fontSize, setFontSize, 
    highContrast, setHighContrast, 
    seniorMode, setSeniorMode,
    screenReaderMode, setScreenReaderMode 
  } = useAccessibility();

  const handleFontSizeCycle = () => {
    if (fontSize === "normal") setFontSize("large");
    else if (fontSize === "large") setFontSize("xlarge");
    else setFontSize("normal");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="bg-card border border-border p-4 rounded-xl shadow-xl flex flex-col gap-3 min-w-[200px] animate-in slide-in-from-bottom-5">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-primary" />
            Acessibilidade
          </h3>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-12 text-base gap-3"
            onClick={handleFontSizeCycle}
            aria-label="Alterar tamanho da letra"
          >
            <Type className="w-5 h-5" />
            Letra: {fontSize === "normal" ? "Normal" : fontSize === "large" ? "Grande" : "Extra Grande"}
          </Button>

          <Button 
            variant={highContrast ? "default" : "outline"} 
            className="w-full justify-start h-12 text-base gap-3"
            onClick={() => setHighContrast(!highContrast)}
            aria-label="Alternar modo de alto contraste"
          >
            <Sunset className="w-5 h-5" />
            Alto Contraste
          </Button>

          <Button 
            variant={seniorMode ? "default" : "outline"} 
            className="w-full justify-start h-12 text-base gap-3"
            onClick={() => setSeniorMode(!seniorMode)}
            aria-label="Alternar modo simplificado sênior"
          >
            <UserCircle className="w-5 h-5" />
            Modo Sênior
          </Button>

          <Button 
            variant={screenReaderMode ? "default" : "outline"} 
            className="w-full justify-start h-12 text-base gap-3"
            onClick={() => setScreenReaderMode(!screenReaderMode)}
            aria-label="Alternar leitura automática"
          >
            <Volume2 className="w-5 h-5" />
            Ler Textos
          </Button>
        </div>
      )}
      
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-4 focus:ring-ring"
        aria-label="Abrir menu de acessibilidade"
      >
        <span className="sr-only">Acessibilidade</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.884 8.648a1.5 1.5 0 1 1 2.14-2.143L14.4 10.9a1.5 1.5 0 0 1-2.14 2.143l-2.144-2.145Zm4.363 4.604a.75.75 0 0 1-.611.831c-1.896.22-3.834.22-5.73 0a.75.75 0 0 1 .458-1.428c1.693.196 3.421.196 5.114 0a.75.75 0 0 1 .769.597Z" clipRule="evenodd" />
        </svg>
      </Button>
    </div>
  );
};

export default AccessibilityControls;
