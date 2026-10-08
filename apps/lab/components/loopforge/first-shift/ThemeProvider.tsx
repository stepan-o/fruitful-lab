"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { DEFAULT_RECIPE, THEME_STORAGE_KEY, parseRecipe, prepareTheme, recipeFromQuery, theme, themeFiles, type ThemeRecipe } from "@/lib/loopforge/first-shift/themes";

type ThemeContextValue = {
  recipe: ThemeRecipe;
  style: CSSProperties;
  loading: boolean;
  message: string;
  error: boolean;
  apply: (recipe: ThemeRecipe) => Promise<void>;
};
const ThemeContext = createContext<ThemeContextValue | null>(null);
export const useConsoleTheme = () => useContext(ThemeContext);
function materials(recipe: ThemeRecipe, files: ReturnType<typeof themeFiles>): CSSProperties {
  const palette = theme(recipe.shell);
  return {
    ...Object.fromEntries(Object.entries(files).map(([id, file]) => [`--${id}`, `url("${file.src}")`])),
    "--brass": palette.accent, "--cyan": palette.signal, "--theme-surface": palette.surface,
    "--frame-slice": "22% 17%", "--control-slice": "24% 18%",
  } as CSSProperties;
}
export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => ({
    recipe: DEFAULT_RECIPE, style: materials(DEFAULT_RECIPE, themeFiles(DEFAULT_RECIPE, true)),
  }));
  const [loading, setLoading] = useState(true), [message, setMessage] = useState("Preparing console equipment…"), [error, setError] = useState(false);
  const generation = useRef(0);
  const apply = useCallback(async (input: ThemeRecipe) => {
    const recipe = parseRecipe(input);
    const request = ++generation.current;
    setLoading(true); setError(false); setMessage(`Loading ${theme(recipe.shell).name}…`);
    try {
      const files = await prepareTheme(recipe, window.matchMedia("(max-width: 760px)").matches);
      if (request !== generation.current) return;
      setState({ recipe, style: materials(recipe, files) });
      setMessage(recipe.shell === recipe.controls ? `${theme(recipe.shell).name} applied.` : "Mixed equipment applied.");
      try { localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(recipe)); } catch { /* Session preference still works. */ }
    } catch {
      if (request !== generation.current) return;
      setError(true); setMessage("Equipment could not load. Your previous theme and shift are intact. Select a theme to retry.");
    } finally {
      if (request === generation.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    let preference = DEFAULT_RECIPE;
    try { preference = parseRecipe(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) ?? "null")); } catch { /* Invalid or unavailable storage uses the default. */ }
    void apply(recipeFromQuery(window.location.search) ?? preference);
    // This is a request-generation counter, not a DOM ref: invalidate all loads on teardown.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { generation.current++; };
  }, [apply]);
  return <ThemeContext.Provider value={{ ...state, loading, message, error, apply }}>{children}</ThemeContext.Provider>;
}
