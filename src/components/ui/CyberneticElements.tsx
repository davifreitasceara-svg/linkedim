import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * NeuralBackground: A futuristic background with connecting nodes and data streams.
 */
export const NeuralBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background pointer-events-none">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Floating Data Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%", 
            opacity: 0 
          }}
          animate={{ 
            y: ["0%", "100%"],
            opacity: [0, 0.2, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-[1px] h-20 bg-gradient-to-b from-transparent via-primary/50 to-transparent"
        />
      ))}

      {/* Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
    </div>
  );
};

/**
 * HologramCard: A card with a scanning light effect and glassmorphism.
 */
export const HologramCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={cn("relative group overflow-hidden rounded-3xl border border-primary/20 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:border-primary/40", className)}>
      {/* Scanning Line */}
      <motion.div
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none z-10"
      />
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />
      
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

/**
 * ScannerEffect: A visual scan overlay for images or avatars.
 */
export const ScannerEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-[2px] bg-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-30"
      />
      <div className="absolute inset-0 bg-primary/5 opacity-10 animate-pulse" />
    </div>
  );
};
