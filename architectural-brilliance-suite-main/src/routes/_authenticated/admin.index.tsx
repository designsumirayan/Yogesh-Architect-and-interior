import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Briefcase, FolderKanban, FileText, MessageSquareQuote, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function useCount(table: "leads" | "services" | "projects" | "blogs" | "testimonials" | "faqs") {
  return useQuery({
    queryKey: ["admin-count", table],
    queryFn: async () => {
      const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });
}

function Dashboard() {
  const leads = useCount("leads");
  const services = useCount("services");
  const projects = useCount("projects");
  const blogs = useCount("blogs");
  const testimonials = useCount("testimonials");
  const faqs = useCount("faqs");

  const newLeads = useQuery({
    queryKey: ["admin-new-leads"],
    queryFn: async () => {
      const { count } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");
      return count ?? 0;
    },
  });

  const recent = useQuery({
    queryKey: ["admin-recent-leads"],
    queryFn: async () => {
      const { data } = await supabase
        .from("leads")
        .select("id, name, email, project_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
  });

  const cards = [
    { label: "Leads", icon: Users, value: leads.data, accent: "text-primary" },
    { label: "New leads", icon: Users, value: newLeads.data, accent: "text-emerald-600" },
    { label: "Services", icon: Briefcase, value: services.data },
    { label: "Projects", icon: FolderKanban, value: projects.data },
    { label: "Blogs", icon: FileText, value: blogs.data },
    { label: "Testimonials", icon: MessageSquareQuote, value: testimonials.data },
    { label: "FAQs", icon: HelpCircle, value: faqs.data },
  ];

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-soft">An overview of your studio's content and pipeline.</p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white border border-border p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-slate-soft">{c.label}</span>
              <c.icon className={`h-4 w-4 ${c.accent ?? "text-slate-soft"}`} />
            </div>
            <div className="mt-3 text-3xl font-display gradient-text">{c.value ?? "—"}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-white border border-border shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg">Recent leads</h2>
        </div>
        <div className="divide-y divide-border">
          {(recent.data ?? []).length === 0 && (
            <p className="px-6 py-10 text-sm text-slate-soft text-center">No leads yet.</p>
          )}
          {recent.data?.map((l) => (
            <div key={l.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-medium text-sm">{l.name}</div>
                <div className="text-xs text-slate-soft">{l.email} · {l.project_type || "—"}</div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="rounded-full bg-accent px-2.5 py-1 font-medium text-primary">{l.status}</span>
                <span className="text-slate-soft">{new Date(l.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
