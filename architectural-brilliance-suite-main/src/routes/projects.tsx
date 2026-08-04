import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Architecture & Interior Portfolio | Yogesh Architects" },
      { name: "description", content: "Selected residential, commercial, and interior projects across Lucknow and Uttar Pradesh." },
      { property: "og:title", content: "Projects — Yogesh Architects & Interiors" },
      { property: "og:description", content: "Selected work — residences, workplaces, and interiors." },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsPage,
});

type Item = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string | number;
  image: string;
  summary: string;
};

function ProjectsPage() {
  // यह चेक करेगा कि हम ठीक "/projects" पर हैं या उसके किसी अंदरूनी पेज पर
  const matchRoute = useMatchRoute();
  const isIndex = matchRoute({ to: "/projects" });

  const { data, isLoading } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("slug, title, category, location, year, cover_url, summary")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const items: Item[] = useMemo(
    () =>
      (data ?? []).map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category ?? "Project",
        location: p.location ?? "",
        year: p.year ?? "",
        image: p.cover_url ?? "",
        summary: p.summary ?? "",
      })),
    [data],
  );

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const [filter, setFilter] = useState<string>("All");
  const list = filter === "All" ? items : items.filter((p) => p.category === filter);

  return (
    <>
      {/* अगर यूज़र मेन प्रोजेक्ट्स पेज पर है, तभी यह ग्रिड लिस्टिंग दिखेगी */}
      {isIndex && (
        <>
          <PageHero
            
            eyebrow="Portfolio"
            title={<>Projects that <span className="gradient-text">earn their place.</span></>}
            subtitle="A selection of homes, workplaces, and interiors completed across Uttar Pradesh."
          />

          <section className="relative pb-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              {items.length === 0 ? (
                <div className="text-center py-20 text-slate-soft">
                  {isLoading ? "Loading projects…" : "No projects published yet."}
                </div>
              ) : (
                <>
                  {/* Category Filter Buttons */}
                  <div className="flex justify-center flex-wrap gap-2 mb-12 w-full">
                    {categories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFilter(c)}
                        className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                          filter === c
                            ? "bg-primary text-primary-foreground shadow-soft"
                            : "bg-white border border-border text-foreground/70 hover:border-primary hover:text-primary"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  {/* Grid System */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((p, i) => (
                      <Reveal key={p.slug} delay={i % 3}>
                        <Link 
                          to="/projects/$slug" 
                          params={{ slug: p.slug }} 
                          className="block group relative overflow-hidden rounded-3xl bg-white border border-border h-full cursor-pointer z-10"
                        >
                          <article className="relative h-full w-full pointer-events-none">
                            <div className="aspect-[4/5] overflow-hidden bg-secondary w-full">
                              {p.image && (
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  loading="lazy"
                                  width={1600}
                                  height={1200}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              )}
                            </div>
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/0 to-transparent pointer-events-none" />
                            
                            {/* Text Metadata */}
                            <div className="absolute inset-x-0 bottom-0 p-6 text-white pointer-events-none">
                              <div className="text-[11px] uppercase tracking-[0.2em] text-white/75">
                                {p.category}{p.location && ` · ${p.location}`}{p.year && ` · ${p.year}`}
                              </div>
                              <h3 className="mt-2 font-display text-2xl leading-tight">{p.title}</h3>
                              <p className="mt-2 text-sm text-white/80">{p.summary}</p>
                            </div>
                          </article>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </>
      )}

      {/* Outlet: यहाँ पर आपका चाइल्ड पेज (projects/$slug.tsx) सही से रेंडर होगा */}
      <Outlet />
    </>
  );
}
