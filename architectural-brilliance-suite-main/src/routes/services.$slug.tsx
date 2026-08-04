import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/PageHero";
import { ArrowLeft, X } from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Service — ${params.slug} | Yogesh Architects` },
      { name: "description", content: "Service details." },
    ],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      // 1. Log the exact string to help with debugging
      console.log("Searching for slug:", slug);

      // 2. Decode the slug to handle any %20 spaces or URL characters
      const decodedSlug = decodeURIComponent(slug);

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .ilike("slug", decodedSlug) // 3. Use ilike instead of eq for case-insensitivity
        .eq("published", true)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="text-center py-32 text-slate-soft">Loading…</div>;
  
  if (!data) return (
    <div className="text-center py-32">
      <p className="text-slate-soft">Service not found.</p>
      <Link to="/services" className="mt-4 inline-block text-primary underline">Back to services</Link>
    </div>
  );

  const gallery: string[] = Array.isArray(data.gallery) ? (data.gallery as string[]) : [];
  const faqs: Array<{ q: string; a: string }> = Array.isArray(data.faqs) ? (data.faqs as Array<{ q: string; a: string }>) : [];

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={<>{data.title}</>}
        subtitle={data.summary ?? ""}
      />

      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-primary mb-8 hover:underline">
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>

          {data.banner_url && (
            <div className="rounded-3xl overflow-hidden bg-secondary mb-10">
              <img src={data.banner_url} alt={data.title} className="w-full h-auto object-cover" />
            </div>
          )}

          {data.content && (
            <div className="prose prose-slate max-w-none whitespace-pre-wrap text-base leading-relaxed mb-12">
              {data.content}
            </div>
          )}

          {gallery.length > 0 && (
            <>
              <h2 className="font-display text-2xl mb-6">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                {gallery.map((src, i) => (
                  <button key={i} onClick={() => setLightbox(src)} className="aspect-square overflow-hidden rounded-2xl bg-secondary group">
                    <img src={src} alt={`${data.title} ${i + 1}`} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </button>
                ))}
              </div>
            </>
          )}

          {faqs.length > 0 && (
            <>
              <h2 className="font-display text-2xl mb-6">FAQs</h2>
              <div className="space-y-4">
                {faqs.map((f, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-white p-6">
                    <h3 className="font-semibold text-slate-900">{f.q}</h3>
                    <p className="mt-2 text-slate-600 text-sm">{f.a}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-12">
            <Link to="/contact" className="inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-md hover:-translate-y-0.5 transition-all">
              Inquire about this service
            </Link>
          </div>
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
