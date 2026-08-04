import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

export async function uploadImage(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  // Bucket is private — use a long-lived signed URL (50 years).
  const { data, error: e2 } = await supabase.storage
    .from("media")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 50);
  if (e2) throw e2;
  return data.signedUrl;
}

export function ImageUpload({
  value,
  onChange,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-2">
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-32 w-auto rounded-xl border border-border object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-white border border-border shadow-soft text-slate-soft hover:text-destructive"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-3 cursor-pointer rounded-xl border-2 border-dashed border-border bg-secondary px-4 py-6 text-sm text-slate-soft hover:border-primary hover:text-primary transition-colors">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span>{busy ? "Uploading…" : "Click to upload image"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}

export function ImageListUpload({
  value,
  onChange,
}: {
  value: string[] | null | undefined;
  onChange: (urls: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const list = Array.isArray(value) ? value : [];

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const f of Array.from(files)) {
        uploaded.push(await uploadImage(f));
      }
      onChange([...list, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-2 space-y-3">
      {list.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {list.map((url, i) => (
            <div key={url + i} className="relative group">
              <img src={url} alt="" className="h-24 w-full rounded-lg border border-border object-cover" />
              <button
                type="button"
                onClick={() => onChange(list.filter((_, j) => j !== i))}
                className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-white border border-border shadow-soft text-slate-soft hover:text-destructive"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="flex items-center gap-3 cursor-pointer rounded-xl border-2 border-dashed border-border bg-secondary px-4 py-5 text-sm text-slate-soft hover:border-primary hover:text-primary transition-colors">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        <span>{busy ? "Uploading…" : "Click to upload images (multiple allowed)"}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={busy}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}
