"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

export function LocaleHtml() {
  const locale = useLocale();

  useEffect(() => {
    const isAr = locale === "ar";
    document.documentElement.lang = locale;
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.body.classList.toggle("font-arabic", isAr);
  }, [locale]);

  return null;
}

