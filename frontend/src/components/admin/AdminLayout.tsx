import { useState, useEffect, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  HardHat,
  LayoutDashboard,
  FolderGit2,
  FileText,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Bell,
  Plus,
  Shield,
  Layers3,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { useServiceRequestNotifications } from "@/hooks/useServiceRequestNotifications";
import { toast } from "sonner";

export interface AdminUser {
  id?: string | number;
  name?: string;
  email?: string;
}

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  activeNav?: string;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "services", label: "Services", href: "/admin/services", icon: Layers3 },
  { id: "recent-works", label: "Recent Works", href: "/admin/recent-works", icon: FolderGit2 },
  { id: "service-requests", label: "Service Requests", href: "/admin/service-requests", icon: MessageSquareText },
  { id: "documents", label: "Documents", href: "#", icon: FileText, count: 34 },
  { id: "clients", label: "Clients", href: "#", icon: Users, count: 24 },
  { id: "settings", label: "Settings", href: "/settings", icon: SettingsIcon },
];

export function AdminLayout({
  children,
  title = "Admin Portal",
  subtitle = "Hariputhran Infrastructure & Civil Contracting Management",
  activeNav,
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [user, setUser] = useState<AdminUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { unreadCount } = useServiceRequestNotifications();

  const loadUser = () => {
    const token =
      localStorage.getItem("hariputhran_token") ||
      sessionStorage.getItem("hariputhran_token");

    if (!token) {
      navigate({ to: "/login", replace: true });
      return;
    }

    const storedUserStr =
      localStorage.getItem("hariputhran_user") ||
      sessionStorage.getItem("hariputhran_user");

    if (storedUserStr) {
      try {
        const parsed = JSON.parse(storedUserStr);
        setUser(parsed);
      } catch {
        setUser({ name: "Admin", email: "admin@hariputhran.com" });
      }
    } else {
      setUser({ name: "Admin", email: "admin@hariputhran.com" });
    }

    setIsReady(true);
  };

  useEffect(() => {
    loadUser();

    const handleUserUpdate = () => {
      loadUser();
    };

    window.addEventListener("hariputhran_user_updated", handleUserUpdate);
    window.addEventListener("storage", handleUserUpdate);

    return () => {
      window.removeEventListener("hariputhran_user_updated", handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
    };
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("hariputhran_token");
    localStorage.removeItem("hariputhran_user");
    sessionStorage.removeItem("hariputhran_token");
    sessionStorage.removeItem("hariputhran_user");

    toast.success("Signed out successfully", {
      description: "You have been logged out of the admin portal.",
    });

    navigate({ to: "/login", replace: true });
  };

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#082342]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-4 border-white/20 border-t-[#f97316]" />
          <p className="font-mono text-xs text-slate-300">Loading portal...</p>
        </div>
      </div>
    );
  }

  const adminName = user?.name || "Administrator";
  const adminEmail = user?.email || "admin@hariputhran.com";

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#082342] text-slate-200 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="flex h-24 items-center justify-between border-b border-white/10 px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-3.5 transition-transform hover:scale-105"
            aria-label="Hariputhran Admin Dashboard"
          >
            <img
              src="/images/hariputhran-logo.png"
              alt="Hariputhran Enterprises"
              className="h-13 sm:h-14 w-auto object-contain shrink-0"
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + "/logo.png") {
                  e.currentTarget.src = "/logo.png";
                }
              }}
            />
            <div className="flex flex-col">
              <span className="font-['Poppins',sans-serif] text-sm font-extrabold tracking-tight text-white leading-tight">
                HARIPUTHRAN
              </span>
              <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-[#38bdf8]">
                Admin Operations
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <div className="px-3 pb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            // Determine active state based on explicit prop or current pathname
            const isActive = activeNav
              ? activeNav === item.id
              : (item.href === "/dashboard" && currentPath === "/dashboard") ||
                (item.href === "/admin/services" && currentPath.startsWith("/admin/services")) ||
                (item.href === "/admin/recent-works" && currentPath.startsWith("/admin/recent-works")) ||
                (item.href === "/admin/service-requests" && currentPath.startsWith("/admin/service-requests")) ||
                (item.href === "/settings" && currentPath === "/settings");

            const isLink = item.href !== "#";
            const displayCount = item.id === "service-requests" ? (unreadCount > 0 ? (unreadCount > 99 ? "99+" : unreadCount) : null) : item.count;

            const itemContent = (
              <>
                <div className="flex items-center gap-3">
                  <Icon
                    className={`size-4 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {displayCount && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.id === "service-requests"
                        ? "bg-[#f97316] text-white"
                        : isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-slate-300 group-hover:bg-white/15"
                    }`}
                  >
                    {displayCount}
                  </span>
                )}
              </>
            );

            const className = `group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
              isActive
                ? "bg-[#0284c7] text-white shadow-md shadow-sky-900/30"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`;

            if (isLink) {
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={className}
                >
                  {itemContent}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  toast.info(item.label, {
                    description: `${item.label} management module is scheduled for next release.`,
                  });
                  setMobileMenuOpen(false);
                }}
                className={className}
              >
                {itemContent}
              </button>
            );
          })}

          <div className="pt-6">
            <div className="px-3 pb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System Status
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs">
              <div className="flex items-center gap-2 font-semibold text-white">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                PostgreSQL Connected
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                DB: Hariputhiran • API: Active
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Footer / User Info & Sign Out */}
        <div className="border-t border-white/10 p-4">
          <Link
            to="/settings"
            className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10 group"
          >
            <div className="grid size-9 place-items-center rounded-lg bg-[#0284c7] font-mono text-sm font-bold text-white shadow">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                {adminName}
              </div>
              <div className="truncate text-[11px] text-slate-400">{adminEmail}</div>
            </div>
          </Link>

          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full justify-center gap-2 border-white/20 bg-transparent text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="size-6" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Poppins',sans-serif] text-xl font-extrabold tracking-tight text-[#082342] sm:text-2xl">
                  {title}
                </h1>
                <span className="hidden rounded-md bg-[#e6f3fb] px-2 py-0.5 font-mono text-[11px] font-bold text-[#0284c7] sm:inline-block">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action: New Project */}
            <Button
              onClick={() =>
                toast.info("Create Project", {
                  description: "Project creation modal feature ready in next phase.",
                })
              }
              className="hidden h-9 items-center gap-1.5 rounded-full bg-[#f97316] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#ea580c] sm:flex"
            >
              <Plus className="size-3.5" />
              New Project
            </Button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Avatar Pill */}
            <Link
              to="/settings"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 shadow-sm hover:bg-slate-100 transition-colors"
            >
              <div className="grid size-7 place-items-center rounded-full bg-[#082342] font-mono text-xs font-bold text-white">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-xs font-bold text-slate-700 md:inline-block">
                {adminName}
              </span>
            </Link>
          </div>
        </header>

        {/* Dashboard / Settings Body */}
        <main className="flex-1 space-y-8 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
