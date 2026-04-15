import { AdminI18nProvider } from "@/components/admin/admin-i18n";
import { AdminAuthGuard } from "@/components/admin/auth-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminI18nProvider>
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </AdminI18nProvider>
  );
}

