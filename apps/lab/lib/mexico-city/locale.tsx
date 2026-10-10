"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import spanish from "./ui.es.json";

export type Locale = "es" | "en";
type Values = Record<string, string | number>;
export function journalError(error: unknown, fallback: string) {
  return error instanceof Error && Object.hasOwn(spanish, error.message)
    ? error.message
    : fallback;
}
export function translate(locale: Locale, key: string, values: Values = {}) {
  const text =
    locale === "es" ? ((spanish as Record<string, string>)[key] ?? key) : key;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    String(values[name] ?? match),
  );
}
const LocaleContext = createContext({
  locale: "es" as Locale,
  setLocale: (locale: Locale) => {
    void locale;
  },
  t: (key: string, values?: Values) => translate("es", key, values),
});
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, changeLocale] = useState<Locale>("es");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("otra-vista-language-v1");
      if (saved === "en") queueMicrotask(() => changeLocale("en"));
    } catch {
      /* Spanish remains usable without storage. */
    }
  }, []);
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale === "es" ? "es-MX" : "en";
    return () => {
      document.documentElement.lang = previous;
    };
  }, [locale]);
  function setLocale(next: Locale) {
    changeLocale(next);
    try {
      localStorage.setItem("otra-vista-language-v1", next);
    } catch {
      /* Session choice still works. */
    }
  }
  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t: (key, values) => translate(locale, key, values),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}
export const useLocale = () => useContext(LocaleContext);
export function LanguageSwitch() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div className="ov-language" role="group" aria-label={t("Language")}>
      <button
        lang="es"
        aria-label="Español"
        aria-pressed={locale === "es"}
        onClick={() => setLocale("es")}
      >
        ES
      </button>
      <span aria-hidden="true">/</span>
      <button
        lang="en"
        aria-label="English"
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
    </div>
  );
}
