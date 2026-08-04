import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos — Yogesh Architects & Interiors" },
      {
        name: "description",
        content:
          "Watch project walkthroughs, design insights and studio films from Yogesh Architects & Interiors.",
      },
      { property: "og:title", content: "Videos — Yogesh Architects & Interiors" },
      {
        property: "og:description",
        content: "Project films, walkthroughs and studio insights.",
      },
    ],
  }),
  component: VideosPage,
});

type Video = {
  id: string;
  title: string;
  youtube_url: string;
  description: string | null;
};

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => ["embed", "shorts", "live"].includes(p));
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return null;
  } catch {
    return null;
  }
}

function VideosPage() {
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("id,title,youtube_url,description")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Video[];
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Watch"
        title={<>Videos & <span className="text-primary">Walkthroughs</span></>}
        subtitle="Step inside our completed projects, design conversations and studio films."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6">
          {isLoading && (
            <p className="text-center text-slate-soft">Loading videos…</p>
          )}
          {!isLoading && videos.length === 0 && (
            <div className="mx-auto max-w-lg text-center rounded-3xl bg-white border border-border p-12 shadow-soft">
              <h2 className="font-display text-2xl">No videos yet</h2>
              <p className="mt-3 text-sm text-slate-soft">
                New films and project walkthroughs will appear here soon.
              </p>
            </div>
          )}
          {videos.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((v) => {
                const vid = extractYouTubeId(v.youtube_url);
                return (
                  <Reveal key={v.id}>
                    <article className="group rounded-3xl overflow-hidden bg-white border border-border shadow-soft hover:shadow-elegant transition-shadow">
                      <div className="relative aspect-video bg-black">
                        {vid ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${vid}`}
                            title={v.title}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                          />
                        ) : (
                          <a
                            href={v.youtube_url}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute inset-0 grid place-items-center text-white text-sm"
                          >
                            Open video ↗
                          </a>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-lg leading-snug">{v.title}</h3>
                        {v.description && (
                          <p className="mt-2 text-sm text-slate-soft leading-relaxed line-clamp-3">
                            {v.description}
                          </p>
                        )}
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
