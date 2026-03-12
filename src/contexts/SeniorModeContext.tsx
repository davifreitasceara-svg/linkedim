import React, { createContext, useContext, useState, useEffect } from "react";

interface SeniorModeContextType {
  seniorMode: boolean;
  toggleSeniorMode: () => void;
}

const SeniorModeContext = createContext<SeniorModeContextType>({
  seniorMode: false,
  toggleSeniorMode: () => {},
});

export const useSeniorMode = () => useContext(SeniorModeContext);

export const SeniorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seniorMode, setSeniorMode] = useState(() => {
    return localStorage.getItem("seniorMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("seniorMode", String(seniorMode));
    if (seniorMode) {
      document.documentElement.classList.add("senior-mode");
    } else {
      document.documentElement.classList.remove("senior-mode");
    }
  }, [seniorMode]);

  const toggleSeniorMode = () => setSeniorMode((prev) => !prev);

  return (
    <SeniorModeContext.Provider value={{ seniorMode, toggleSeniorMode }}>
      {children}
    </SeniorModeContext.Provider>
  );
};
