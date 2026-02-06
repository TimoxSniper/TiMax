import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Admin Dashboard",
  description: "TiMax Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side Admin Check
  const admin = await isAdmin();
  
  if (!admin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="pt-14 md:pt-0 md:pl-64">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
