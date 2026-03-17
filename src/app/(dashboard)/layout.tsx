import { SidebarNav } from "@/components/sidebar-nav";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen">
        <SidebarNav />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">{children}</main>
          <footer className="border-t border-slate-800 bg-slate-900 px-6 py-3">
            <p className="text-xs text-slate-500">
              &copy; 2026 Emil-Fischer-Gymnasium Schwarzheide &mdash;
              Biologielabor Modernisierung
            </p>
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}
