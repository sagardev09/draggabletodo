"use client";
import React, { useContext, useState, useEffect, ReactNode } from "react";
import { ThemeContext, ThemeContextProps } from "../context/ThemeContext";

interface ThemeProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps): JSX.Element | null {
  const [mount, setMount] = useState<boolean>(false);
  const context = useContext(ThemeContext);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!context) {
    // Optional: Handle the case when ThemeContext is undefined.
    return null;
  }

  const { theme } = context as ThemeContextProps;

  if (mount) {
    return <div className={theme}>{children}</div>;
  }

  return null;
}

export default ThemeProvider;
