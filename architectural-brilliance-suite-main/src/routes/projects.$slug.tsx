import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/PageHero";
import { ArrowLeft, X } from "lucide-react";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Project — ${params.slug} | Yogesh Architects` },
      { name: "description", content: "Project details and gallery." },
    ],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="text-center py-32 text-slate-soft">Loading…</div>;
  if (!data) return (
    <div className="text-center py-32">
      <p className="text-slate-soft">Project not found.</p>
      <Link to="/projects" className="mt-4 inline-block text-primary underline">Back to projects</Link>
    </div>
  );

  const gallery: string[] = Array.isArray(data.gallery) ? (data.gallery as string[]) : [];

  return (
    <>
      <PageHero
        eyebrow={data.category ?? "Project"}
        title={<>{data.title}</>}
        subtitle={data.summary ?? ""}
      />

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-primary mb-8 hover:underline">
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>

          {data.cover_url && (
            <div className="rounded-3xl overflow-hidden bg-secondary mb-10">
              <img src={data.cover_url} alt={data.title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8 mb-12 text-sm">
            {data.location && <div><div className="text-slate-soft uppercase tracking-wider text-xs">Location</div><div className="mt-1 font-medium">{data.location}</div></div>}
            {data.year && <div><div className="text-slate-soft uppercase tracking-wider text-xs">Year</div><div className="mt-1 font-medium">{data.year}</div></div>}
            {data.client && <div><div className="text-slate-soft uppercase tracking-wider text-xs">Client</div><div className="mt-1 font-medium">{data.client}</div></div>}
          </div>

          {data.content && (
            <div className="prose prose-slate max-w-none whitespace-pre-wrap text-base leading-relaxed mb-12">
              {data.content}
            </div>
          )}

          {gallery.length > 0 && (
            <>
              <h2 className="font-display text-2xl mb-6">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((src, i) => (
                  <button key={i} onClick={() => setLightbox(src)} className="aspect-square overflow-hidden rounded-2xl bg-secondary group">
                    <img src={src} alt={`${data.title} ${i + 1}`} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </button>
                ))}
              </div>
            </>
          )}

          {data.video_url && (
            <div className="mt-12 aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe src={data.video_url.replace("watch?v=", "embed/")} className="w-full h-full" allowFullScreen title="Project video" />
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-white/10 text-white"><X /></button>
          <img src={lightbox} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </>
  );
}
