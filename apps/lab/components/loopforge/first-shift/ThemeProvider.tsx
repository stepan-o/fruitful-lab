"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  DEFAULT_RECIPE,
  THEME_STORAGE_KEY,
  parseRecipe,
  prepareTheme,
  recipeFromQuery,
  theme,
  themeFiles,
  type ThemeRecipe,
} from "@/lib/loopforge/first-shift/themes";

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
function materials(
  recipe: ThemeRecipe,
  files: ReturnType<typeof themeFiles>,
): CSSProperties {
  const palette = theme(recipe.shell);
  return {
    ...Object.fromEntries(
      Object.entries(files).map(([id, file]) => [
        `--${id}`,
        `url("${file.src}")`,
      ]),
    ),
    "--brass": palette.accent,
    "--cyan": palette.signal,
    "--theme-surface": palette.surface,
    "--frame-slice": "22% 17%",
    "--control-slice": "24% 18%",
    "--monitor-inset": {
      baseline: "10% 11% 14% 13%",
      "field-instrument": "12% 15% 16% 15%",
      "broadcast-desk": "11% 13% 13% 13%",
      "foundry-switchboard": "18% 15% 24% 15%",
      "submarine-watch": "18% 14% 19% 14%",
      "neural-diagnostics": "11% 15% 18% 15%",
    }[recipe.shell],
    "--face-inset": {
      baseline: "12% 21% 27% 21%",
      "field-instrument": "14% 20% 28% 20%",
      "broadcast-desk": "15% 20% 28% 20%",
      "foundry-switchboard": "10% 22% 32% 22%",
      "submarine-watch": "14% 21% 28% 21%",
      "neural-diagnostics": "12% 24% 28% 24%",
    }[recipe.shell],
  } as CSSProperties;
}
export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => ({
    recipe: DEFAULT_RECIPE,
    style: materials(DEFAULT_RECIPE, themeFiles(DEFAULT_RECIPE, true)),
  }));
  const [loading, setLoading] = useState(true),
    [message, setMessage] = useState("Preparing console equipment…"),
    [error, setError] = useState(false);
  const generation = useRef(0);
  const apply = useCallback(async (input: ThemeRecipe) => {
    const recipe = parseRecipe(input);
    const request = ++generation.current;
    setLoading(true);
    setError(false);
    setMessage(`Loading ${theme(recipe.shell).name}…`);
    try {
      const files = await prepareTheme(
        recipe,
        window.matchMedia("(max-width: 900px)").matches,
      );
      if (request !== generation.current) return;
      setState({ recipe, style: materials(recipe, files) });
      setMessage(
        recipe.shell === recipe.controls
          ? `${theme(recipe.shell).name} applied.`
          : "Mixed equipment applied.",
      );
      try {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(recipe));
      } catch {
        /* Session preference still works. */
      }
    } catch {
      if (request !== generation.current) return;
      setError(true);
      setMessage(
        "Equipment could not load. Your previous theme and shift are intact. Select a theme to retry.",
      );
    } finally {
      if (request === generation.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    let preference = DEFAULT_RECIPE;
    try {
      preference = parseRecipe(
        JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) ?? "null"),
      );
    } catch {
      /* Invalid or unavailable storage uses the default. */
    }
    void apply(recipeFromQuery(window.location.search) ?? preference);
    // This is a request-generation counter, not a DOM ref: invalidate all loads on teardown.
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      generation.current++;
    };
  }, [apply]);
  return (
    <ThemeContext.Provider value={{ ...state, loading, message, error, apply }}>
      {children}
    </ThemeContext.Provider>
  );
}
