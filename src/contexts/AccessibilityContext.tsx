import React, { createContext, useContext, useState, useEffect } from "react";

type FontSize = "normal" | "large" | "xlarge";

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  seniorMode: boolean;
  setSeniorMode: (mode: boolean) => void;
  screenReaderMode: boolean;
  setScreenReaderMode: (mode: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem("a11y_fontSize") as FontSize) || "normal";
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("a11y_highContrast") === "true";
  });
  const [seniorMode, setSeniorMode] = useState(() => {
    return localStorage.getItem("seniorMode") === "true"; // keep compat with old key if any
  });
  const [screenReaderMode, setScreenReaderMode] = useState(() => {
    return localStorage.getItem("a11y_screenReader") === "true";
  });

  useEffect(() => {
    localStorage.setItem("a11y_fontSize", fontSize);
    localStorage.setItem("a11y_highContrast", String(highContrast));
    localStorage.setItem("seniorMode", String(seniorMode));
    localStorage.setItem("a11y_screenReader", String(screenReaderMode));

    const root = document.documentElement;

    // Font size classes
    root.classList.remove("text-size-normal", "text-size-large", "text-size-xlarge");
    root.classList.add(`text-size-${fontSize}`);

    // High contrast class
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    
    // Senior mode toggles both scale and some spacing overrides
    if (seniorMode) {
      root.classList.add("senior-mode");
    } else {
      root.classList.remove("senior-mode");
    }

  }, [fontSize, highContrast, seniorMode]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        seniorMode,
        setSeniorMode,
        screenReaderMode,
        setScreenReaderMode,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};
