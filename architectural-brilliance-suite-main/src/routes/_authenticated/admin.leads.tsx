import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, LayoutGrid, List } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsPage,
});

type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";
const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  project_type: string | null;
  budget: string | null;
  location: string | null;
  message: string | null;
  status: LeadStatus;
  notes: string | null;
  follow_up_at: string | null;
  created_at: string;
};

function LeadsPage() {
  const qc = useQueryClient();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [selected, setSelected] = useState<Lead | null>(null);

  const { data: leads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Status updated");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateLead = useMutation({
    mutationFn: async (patch: Partial<Lead> & { id: string }) => {
      const { id, ...rest } = patch;
      const { error } = await supabase.from("leads").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead updated");
      setSelected(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted");
      setSelected(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Leads</h1>
          <p className="mt-1 text-sm text-slate-soft">{leads.length} total · {leads.filter((l) => l.status === "new").length} new</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value as LeadStatus | "all")} className="rounded-lg border border-border bg-white px-3 py-2 text-sm">
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="rounded-lg border border-border bg-white p-1 flex">
            <button onClick={() => setView("kanban")} className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 ${view === "kanban" ? "bg-primary text-white" : ""}`}>
              <LayoutGrid className="h-3.5 w-3.5" /> Kanban
            </button>
            <button onClick={() => setView("list")} className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 ${view === "list" ? "bg-primary text-white" : ""}`}>
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {STATUSES.map((status) => {
            const items = leads.filter((l) => l.status === status);
            return (
              <div key={status} className="rounded-2xl bg-white border border-border p-3 min-h-[300px]">
                <div className="flex items-center justify-between px-2 py-1">
                  <h3 className="text-xs uppercase tracking-widest text-slate-soft">{status}</h3>
                  <span className="text-xs text-slate-soft">{items.length}</span>
                </div>
                <div className="mt-2 space-y-2">
                  {items.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setSelected(l)}
                      className="w-full text-left rounded-xl border border-border p-3 hover:border-primary/40 hover:shadow-soft transition-all"
                    >
                      <div className="font-medium text-sm">{l.name}</div>
                      <div className="text-xs text-slate-soft truncate">{l.email}</div>
                      {l.project_type && <div className="mt-1 text-xs text-primary">{l.project_type}</div>}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl bg-white border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-widest text-slate-soft">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Project</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-secondary/50 cursor-pointer" onClick={() => setSelected(l)}>
                  <td className="p-3 font-medium">{l.name}</td>
                  <td className="p-3 text-slate-soft">{l.email}</td>
                  <td className="p-3">{l.project_type || "—"}</td>
                  <td className="p-3">
                    <select
                      value={l.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateStatus.mutate({ id: l.id, status: e.target.value as LeadStatus })}
                      className="rounded-md border border-border bg-white px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-slate-soft">{new Date(l.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm("Delete this lead?")) deleteLead.mutate(l.id); }}
                      className="text-slate-soft hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-slate-soft">No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onSave={(patch) => updateLead.mutate({ id: selected.id, ...patch })}
          onDelete={() => { if (confirm("Delete this lead?")) deleteLead.mutate(selected.id); }}
        />
      )}
    </div>
  );
}

function LeadDrawer({ lead, onClose, onSave, onDelete }: {
  lead: Lead;
  onClose: () => void;
  onSave: (patch: Partial<Lead>) => void;
  onDelete: () => void;
}) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [followUp, setFollowUp] = useState(lead.follow_up_at?.slice(0, 16) ?? "");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end" onClick={onClose}>
      <div className="w-full max-w-lg h-full bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl">{lead.name}</h2>
            <p className="text-sm text-slate-soft">{lead.email}</p>
          </div>
          <button onClick={onClose} className="text-slate-soft hover:text-foreground">✕</button>
        </div>
        <div className="p-6 space-y-5 text-sm">
          <Info label="Phone" value={lead.phone} />
          <Info label="Project type" value={lead.project_type} />
          <Info label="Budget" value={lead.budget} />
          <Info label="Location" value={lead.location} />
          <Info label="Message" value={lead.message} />
          <Info label="Submitted" value={new Date(lead.created_at).toLocaleString()} />

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-soft">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)} className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-2.5">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-soft">Follow-up date</label>
            <input type="datetime-local" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-2.5" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-soft">Internal notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-2.5 resize-none" />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button onClick={onDelete} className="text-sm text-destructive hover:underline">Delete lead</button>
            <button
              onClick={() => onSave({ status, notes, follow_up_at: followUp ? new Date(followUp).toISOString() : null })}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-slate-soft">{label}</div>
      <div className="mt-1 whitespace-pre-wrap">{value}</div>
    </div>
  );
}
