"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppLanguage = "en" | "ar";

type LanguageContextValue = {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "infogate:lang";

export function LanguageProvider({
  children,
  defaultLang = "en",
}: {
  children: React.ReactNode;
  defaultLang?: AppLanguage;
}) {
  const [lang, setLangState] = useState<AppLanguage>(() => {
    if (typeof window === "undefined") return defaultLang;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "ar" ? stored : defaultLang;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value = useMemo<LanguageContextValue>(() => {
    const setLang = (next: AppLanguage) => setLangState(next);
    const toggleLang = () => setLangState((prev) => (prev === "en" ? "ar" : "en"));
    return { lang, setLang, toggleLang };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
