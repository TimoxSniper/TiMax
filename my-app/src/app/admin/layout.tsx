import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminProvider } from "@/contexts/admin-context";
import { ToastProvider } from "@/components/ui/toast";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <ToastProvider>
        <AdminLayout>{children}</AdminLayout>
      </ToastProvider>
    </AdminProvider>
  );
}
