import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Architecture & Interiors | Yogesh Architects" },
      { name: "description", content: "A visual archive of completed architecture and interior projects." },
      { property: "og:title", content: "Gallery — Yogesh Architects & Interiors" },
      { property: "og:description", content: "A visual archive of completed projects." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [lightbox, setLightbox] = useState<{ src: string; caption?: string | null } | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("id, image_url, caption, alt_text")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const tiles = data ?? [];

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={<>A visual <span className="gradient-text">studio archive.</span></>}
        subtitle="Moments captured from our completed and in-progress work — from sketches to handover."
      />

      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {tiles.length === 0 ? (
            <div className="text-center py-20 text-slate-soft">{isLoading ? "Loading gallery…" : "No gallery images uploaded yet."}</div>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tiles.map((t, i) => (
              <Reveal key={i} delay={i % 4}>
                <button
                  type="button"
                  onClick={() => setLightbox({ src: t.image_url, caption: t.caption })}
                  className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-secondary block"
                >
                  <img
                    src={t.image_url}
                    alt={t.alt_text ?? t.caption ?? "Gallery image"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary-deep/0 group-hover:bg-primary-deep/40 transition-colors" />
                  {t.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white text-sm text-left opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-primary-deep/80 to-transparent">
                      {t.caption}
                    </div>
                  )}
                </button>
              </Reveal>
            ))}
          </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-white/10 text-white"><X /></button>
          <figure className="max-h-full max-w-6xl flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption ?? ""} className="max-h-[85vh] max-w-full object-contain rounded-lg" />
            {lightbox.caption && <figcaption className="text-white/80 text-sm text-center">{lightbox.caption}</figcaption>}
          </figure>
        </div>
      )}
    </>
  );
}

