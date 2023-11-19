"use client";
import { createContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

export interface ThemeContextProps {
  theme: Theme;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({
  children,
}: ThemeContextProviderProps) => {
  const getFromLocalStorage = (): Theme => {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem("theme");
      return (value as Theme) || "light";
    }
    return "light";
  };

  const [theme, setTheme] = useState<Theme>(() => {
    return getFromLocalStorage();
  });

  const toggle = (): void => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
