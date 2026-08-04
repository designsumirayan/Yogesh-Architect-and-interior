import { Outlet, createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderKanban,
  FileText,
  MessageSquareQuote,
  HelpCircle,
  Image as ImageIcon,
  Video,
  UserSquare2,
  LogOut,
  Home,
} from "lucide-react";

// Import the new logo based on the provided screenshot reference
import yogeshLogo from "@/assets/yogesh Arc. & Int. New logo.png";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/leads", label: "Leads (CRM)", icon: Users },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/blogs", label: "Blogs", icon: FileText },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/videos", label: "Videos", icon: Video },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/members", label: "Team Members", icon: UserSquare2 },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
];

function AdminLayout() {
  const { user, isStaff, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-slate-soft">
        Loading…
      </div>
    );
  }

  if (!isStaff) {
    return (
      <main className="min-h-screen bg-secondary grid place-items-center px-6">
        <div className="max-w-md w-full rounded-3xl bg-white border border-border p-10 text-center shadow-soft">
          <h1 className="font-display text-2xl">Access restricted</h1>
          <p className="mt-3 text-sm text-slate-soft">
            Your account ({user?.email}) is signed in, but doesn't have admin or editor access.
            Ask an existing studio admin to grant you a role.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              Back to site
            </Link>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/auth" }); }}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-border">
        <div className="px-6 py-6 border-b border-border">
          
          {/* New Logo Implementation */}
          <Link to="/" className="flex items-center gap-2 mb-3">
            <img 
              src={yogeshLogo} 
              alt="Logo" 
              className="h-8 w-8 object-contain rounded-md" 
            />
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-serif font-bold text-base leading-tight truncate text-foreground">
                Yogesh Architects
              </span>
              <span className="text-[9px] tracking-[0.2em] font-medium uppercase truncate text-foreground/70">
                & INTERIORS
              </span>
            </div>
          </Link>
          
          <p className="mt-2 text-[11px] uppercase tracking-widest text-slate-soft">Studio Admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-foreground/75 hover:bg-accent"
                }`}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground/75 hover:bg-accent">
            <Home className="h-4 w-4" /> View site
          </Link>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/auth" }); }}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground/75 hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
