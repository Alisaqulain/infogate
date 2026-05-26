"use client";

import React, { createContext, useContext, useMemo } from "react";

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
  | "downloadExcel"
  | "downloadPdf"
  | "downloadZip"
  | "delete"
  | "deleteSelected"
  | "confirmDeleteOne"
  | "confirmDeleteBulk"
  | "deleting"
  | "addEditDeleteServices"
  | "managePlans"
  | "createPosts"
  | "viewDeleteInquiries",
  string
>;

const DICT: AdminDict = {
  admin: "Admin",
  signedInAs: "Signed in as",
  checkingSession: "Checking session…",
  logout: "Logout",
  dashboard: "Dashboard",
  services: "Services",
  pricing: "Pricing",
  blog: "Blog",
  forms: "Registration Submissions",
  osusRegistrations: "Registration Submissions",
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
  noRegistrations: "No registration submissions yet.",
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
  downloadExcel: "Download Excel",
  downloadPdf: "Download PDF",
  downloadZip: "Download ZIP (Excel + all uploads)",
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
};

type AdminI18nContextValue = {
  dir: "ltr";
  t: (key: keyof AdminDict) => string;
};

const AdminI18nContext = createContext<AdminI18nContextValue | null>(null);

export function AdminI18nProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<AdminI18nContextValue>(
    () => ({
      dir: "ltr",
      t: (key) => DICT[key],
    }),
    []
  );

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

export function useAdminI18n() {
  const ctx = useContext(AdminI18nContext);
  if (!ctx) throw new Error("useAdminI18n must be used within AdminI18nProvider");
  return ctx;
}
