"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { initAppKit } from "@/lib/wallet";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "trstit-theme";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  // Keep the wallet modal visually aligned with the app theme.
  try {
    const kit = initAppKit() as unknown as {
      setThemeMode?: (m: "light" | "dark") => void;
    } | null;
    kit?.setThemeMode?.(theme);
  } catch {
    /* AppKit may not be ready during SSR; ignored. */
  }
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [hasExplicit, setHasExplicit] = useState(false);

  // Resolve the real theme on mount (the pre-paint script already set the class).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const explicit = stored === "light" || stored === "dark";
    setHasExplicit(explicit);
    setThemeState(getInitialTheme());
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow system changes until the user makes an explicit choice.
  useEffect(() => {
    if (hasExplicit) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) =>
      setThemeState(e.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [hasExplicit]);

  const setTheme = useCallback((t: Theme) => {
    setHasExplicit(true);
    window.localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      setHasExplicit(true);
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Safe fallback so components never crash outside the provider.
    return { theme: "dark", toggleTheme: () => {}, setTheme: () => {} };
  }
  return ctx;
}

/**
 * Inline script injected before paint to set the theme class and avoid FOUC.
 */
export const themeNoFlashScript = `(function(){try{var k='${STORAGE_KEY}';var s=localStorage.getItem(k);var d=(s==='dark')||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
