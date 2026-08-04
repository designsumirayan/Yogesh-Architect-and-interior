import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { ImageUpload, ImageListUpload } from "@/components/admin/ImageUpload";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "url" | "date" | "select" | "image" | "image-list";
  placeholder?: string;
  options?: string[]; // for select
  required?: boolean;
  hideInList?: boolean;
};

export type Table = "services" | "projects" | "blogs" | "testimonials" | "faqs" | "gallery_images" | "videos";

type Row = Record<string, unknown> & { id: string };

interface Props {
  table: Table;
  title: string;
  subtitle?: string;
  fields: FieldDef[];
  listColumns: { name: string; label: string }[];
  orderBy?: { column: string; ascending: boolean };
  defaults?: Record<string, unknown>;
}

export function ResourceManager({ table, title, subtitle, fields, listColumns, orderBy, defaults }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      let q = supabase.from(table).select("*");
      if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (row: Partial<Row>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase.from(table) as any;
      if (row.id) {
        const { id, ...rest } = row;
        const { error } = await client.update(rest).eq("id", id as string);
        if (error) throw error;
      } else {
        const { error } = await client.insert(row);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      toast.success("Saved");
      setEditing(null);
      setCreating(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      toast.success("Deleted");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-soft">{subtitle}</p>}
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:-translate-y-0.5 transition-all"
        >
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      <div className="mt-8 rounded-2xl bg-white border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-widest text-slate-soft">
            <tr>
              {listColumns.map((c) => <th key={c.name} className="text-left p-3">{c.label}</th>)}
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={listColumns.length + 1} className="p-10 text-center text-slate-soft">Loading…</td></tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={listColumns.length + 1} className="p-10 text-center text-slate-soft">No entries yet. Click "New" to create one.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-secondary/50">
                {listColumns.map((c) => (
                  <td key={c.name} className="p-3 max-w-xs truncate">
                    {formatCell(r[c.name])}
                  </td>
                ))}
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(r)} className="text-slate-soft hover:text-primary px-2"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => { if (confirm("Delete this entry?")) del.mutate(r.id); }} className="text-slate-soft hover:text-destructive px-2"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <RecordDrawer
          row={editing ?? defaults ?? {}}
          fields={fields}
          isNew={creating}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(values) => save.mutate(editing ? { id: editing.id, ...values } : values)}
        />
      )}
    </div>
  );
}

function formatCell(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "boolean") return v ? "✓" : "—";
  if (Array.isArray(v)) return v.length ? `${v.length} items` : "—";
  if (typeof v === "object") return "—";
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).toLocaleDateString();
  return String(v);
}

function RecordDrawer({ row, fields, isNew, onClose, onSave }: {
  row: Record<string, unknown>;
  fields: FieldDef[];
  isNew: boolean;
  onClose: () => void;
  onSave: (values: Record<string, unknown>) => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    for (const f of fields) {
      const v = row[f.name];
      if (f.type === "boolean") init[f.name] = v ?? false;
      else if (f.type === "image-list") init[f.name] = Array.isArray(v) ? v : [];
      else if (f.type === "image") init[f.name] = typeof v === "string" ? v : "";
      else if (Array.isArray(v)) init[f.name] = v.join(", ");
      else init[f.name] = v ?? "";
    }
    return init;
  });

  function update(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      let v = values[f.name];
      if (f.type === "number") v = v === "" || v == null ? null : Number(v);
      else if (f.type === "boolean") v = Boolean(v);
      else if (f.type === "image-list") v = Array.isArray(v) ? v : [];
      else if (f.type === "image") v = typeof v === "string" && v ? v : null;
      else if (f.name === "tags" && typeof v === "string") {
        v = v.split(",").map((s) => s.trim()).filter(Boolean);
      } else if (f.name === "faqs" && typeof v === "string" && v) {
        try { v = JSON.parse(v); } catch { /* leave as string */ }
      } else if (typeof v === "string" && v.trim() === "") {
        v = null;
      }
      payload[f.name] = v;
    }
    onSave(payload);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end" onClick={onClose}>
      <form onSubmit={submit} className="w-full max-w-2xl h-full bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl">{isNew ? "New entry" : "Edit entry"}</h2>
          <button type="button" onClick={onClose} className="text-slate-soft hover:text-foreground">✕</button>
        </div>
        <div className="p-6 space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="text-xs uppercase tracking-widest text-slate-soft">
                {f.label}{f.required && <span className="text-primary"> *</span>}
              </label>
              {f.type === "image" ? (
                <ImageUpload value={values[f.name] as string | null} onChange={(url) => update(f.name, url ?? "")} />
              ) : f.type === "image-list" ? (
                <ImageListUpload value={values[f.name] as string[] | null} onChange={(urls) => update(f.name, urls)} />
              ) : f.type === "textarea" ? (
                <textarea
                  value={values[f.name] as string ?? ""}
                  onChange={(e) => update(f.name, e.target.value)}
                  rows={6}
                  required={f.required}
                  placeholder={f.placeholder}
                  className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-mono resize-y"
                />
              ) : f.type === "boolean" ? (
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!values[f.name]} onChange={(e) => update(f.name, e.target.checked)} /> Yes
                </label>
              ) : f.type === "select" ? (
                <select
                  value={values[f.name] as string ?? ""}
                  onChange={(e) => update(f.name, e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm"
                >
                  <option value="">—</option>
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type === "number" ? "number" : f.type === "date" ? "datetime-local" : f.type === "url" ? "url" : "text"}
                  value={values[f.name] as string ?? ""}
                  onChange={(e) => update(f.name, e.target.value)}
                  required={f.required}
                  placeholder={f.placeholder}
                  className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm"
                />
              )}
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 bg-white p-6 border-t border-border flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-5 py-2.5 text-sm">Cancel</button>
          <button type="submit" className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground">Save</button>
        </div>
      </form>
    </div>
  );
}
