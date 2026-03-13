import { useEffect, useCallback } from "react";

export const useTextToSpeech = () => {
  const speak = useCallback((text: string) => {
    // Cancela qualquer fala anterior
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Tenta encontrar uma voz em português
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(voice => voice.lang.includes("pt-BR") || voice.lang.includes("pt"));
    
    if (ptVoice) {
      utterance.voice = ptVoice;
    }
    
    utterance.rate = 1.0; // Velocidade normal
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  // Limpa ao desmontar e garante evento de vozes
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { speak, stop };
};
