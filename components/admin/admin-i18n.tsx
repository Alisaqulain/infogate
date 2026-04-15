"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type AdminLang = "en" | "ar";

type AdminDict = Record<
  | "admin"
  | "signedInAs"
  | "checkingSession"
  | "logout"
  | "dashboard"
  | "services"
  | "pricing"
  | "blog"
  | "forms"
  | "addEditDeleteServices"
  | "managePlans"
  | "createPosts"
  | "viewDeleteInquiries"
  | "language",
  string
>;

type AdminI18nContextValue = {
  lang: AdminLang;
  dir: "ltr" | "rtl";
  setLang: (lang: AdminLang) => void;
  t: (key: keyof AdminDict) => string;
};

const STORAGE_KEY = "infogate:admin-lang";

const EN: AdminDict = {
  admin: "Admin",
  signedInAs: "Signed in as",
  checkingSession: "Checking session…",
  logout: "Logout",
  dashboard: "Dashboard",
  services: "Services",
  pricing: "Pricing",
  blog: "Blog",
  forms: "Form submissions",
  addEditDeleteServices: "Add, edit, delete services",
  managePlans: "Manage plans and featured tier",
  createPosts: "Create posts with rich editor",
  viewDeleteInquiries: "View and delete inquiries",
  language: "Language",
};

const AR: AdminDict = {
  admin: "لوحة الإدارة",
  signedInAs: "تم تسجيل الدخول باسم",
  checkingSession: "جارٍ التحقق من الجلسة…",
  logout: "تسجيل الخروج",
  dashboard: "الرئيسية",
  services: "الخدمات",
  pricing: "الأسعار",
  blog: "المدونة",
  forms: "رسائل النماذج",
  addEditDeleteServices: "إضافة/تعديل/حذف الخدمات",
  managePlans: "إدارة الباقات وتحديد الباقة المميزة",
  createPosts: "إنشاء مقالات بمحرر متقدم",
  viewDeleteInquiries: "عرض الرسائل وحذفها",
  language: "اللغة",
};

const AdminI18nContext = createContext<AdminI18nContextValue | null>(null);

export function AdminI18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "ar" ? stored : "en";
  });

  const value = useMemo<AdminI18nContextValue>(() => {
    const setLang = (next: AdminLang) => {
      setLangState(next);
      window.localStorage.setItem(STORAGE_KEY, next);
    };
    const dir = lang === "ar" ? "rtl" : "ltr";
    const dict = lang === "ar" ? AR : EN;
    const t = (key: keyof AdminDict) => dict[key];
    return { lang, dir, setLang, t };
  }, [lang]);

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

export function useAdminI18n() {
  const ctx = useContext(AdminI18nContext);
  if (!ctx) throw new Error("useAdminI18n must be used within AdminI18nProvider");
  return ctx;
}

