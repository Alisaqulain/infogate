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
  | "osusRegistrations"
  | "osusRegistrationsDesc"
  | "totalSubmissions"
  | "selected"
  | "exportAllExcel"
  | "exportAllPdf"
  | "exportSelectedExcel"
  | "exportSelectedPdf"
  | "bulkActions"
  | "refresh"
  | "selectAll"
  | "submitted"
  | "company"
  | "mobile"
  | "governorate"
  | "sector"
  | "actions"
  | "loading"
  | "noRegistrations"
  | "view"
  | "hide"
  | "established"
  | "sectorOther"
  | "profileFile"
  | "crFile"
  | "riyadaFile"
  | "fileNotStored"
  | "openPdf"
  | "delete"
  | "deleteSelected"
  | "confirmDeleteOne"
  | "confirmDeleteBulk"
  | "deleting"
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
  forms: "Osus registrations",
  osusRegistrations: "Registration submissions",
  osusRegistrationsDesc:
    "Data from /registration/osus — export to Excel or PDF, including bulk downloads for selected rows.",
  totalSubmissions: "Total",
  selected: "Selected",
  exportAllExcel: "Download all (Excel)",
  exportAllPdf: "Download all (PDF)",
  exportSelectedExcel: "Selected → Excel",
  exportSelectedPdf: "Selected → PDF",
  bulkActions: "Bulk actions",
  refresh: "Refresh",
  selectAll: "Select all",
  submitted: "Submitted",
  company: "Company",
  mobile: "Mobile",
  governorate: "Governorate",
  sector: "Sector",
  actions: "Actions",
  loading: "Loading…",
  noRegistrations: "No Osus registrations yet.",
  view: "Details",
  hide: "Hide",
  established: "Established",
  sectorOther: "Sector (other)",
  profileFile: "Company profile",
  crFile: "Commercial registration",
  riyadaFile: "Riyada card",
  fileNotStored:
    "File not on server (submit a new registration to store uploads).",
  openPdf: "Open PDF in new tab",
  delete: "Delete",
  deleteSelected: "Delete selected",
  confirmDeleteOne:
    "Delete this registration permanently? This cannot be undone.",
  confirmDeleteBulk:
    "Delete all selected registrations permanently? This cannot be undone.",
  deleting: "Deleting…",
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
  forms: "تسجيلات أسس",
  osusRegistrations: "طلبات التسجيل",
  osusRegistrationsDesc:
    "بيانات /registration/osus — تصدير Excel أو PDF، بما في ذلك التحميل الجماعي للصفوف المحددة.",
  totalSubmissions: "الإجمالي",
  selected: "المحدد",
  exportAllExcel: "تحميل الكل (Excel)",
  exportAllPdf: "تحميل الكل (PDF)",
  exportSelectedExcel: "المحدد → Excel",
  exportSelectedPdf: "المحدد → PDF",
  bulkActions: "إجراءات جماعية",
  refresh: "تحديث",
  selectAll: "تحديد الكل",
  submitted: "تاريخ الإرسال",
  company: "الشركة",
  mobile: "الجوال",
  governorate: "المحافظة",
  sector: "القطاع",
  actions: "إجراءات",
  loading: "جارٍ التحميل…",
  noRegistrations: "لا توجد تسجيلات أسس بعد.",
  view: "تفاصيل",
  hide: "إخفاء",
  established: "تاريخ التأسيس",
  sectorOther: "قطاع (أخرى)",
  profileFile: "ملف الشركة",
  crFile: "السجل التجاري",
  riyadaFile: "بطاقة ريادة",
  fileNotStored:
    "الملف غير موجود على الخادم (أرسل تسجيلاً جديداً لحفظ المرفقات).",
  openPdf: "فتح PDF في تبويب جديد",
  delete: "حذف",
  deleteSelected: "حذف المحدد",
  confirmDeleteOne: "حذف هذا التسجيل نهائياً؟ لا يمكن التراجع.",
  confirmDeleteBulk: "حذف جميع التسجيلات المحددة نهائياً؟ لا يمكن التراجع.",
  deleting: "جارٍ الحذف…",
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

