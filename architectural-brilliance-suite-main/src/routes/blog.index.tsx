import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";

// FIXED: Updated the route path to include the trailing slash
export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Journal — Architecture & Interior Notes | Yogesh Architects" },
      { name: "description", content: "Essays, project notes, and thinking from the Yogesh Architects studio." },
      { property: "og:title", content: "Journal — Yogesh Architects & Interiors" },
      { property: "og:description", content: "Essays and project notes from the studio." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("slug, title, excerpt, cover_url, tags, published_at, created_at")
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const posts = (data ?? []).map((b) => ({
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt ?? "",
    image: b.cover_url ?? "",
    tag: Array.isArray(b.tags) && b.tags.length > 0 ? String(b.tags[0]) : "Article",
    date: b.published_at ? new Date(b.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "",
  }));

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title={<>Notes from the <span className="gradient-text">drawing board.</span></>}
        subtitle="Essays on architecture, interiors, materials, and the craft of building well in Lucknow."
      />

      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-soft">
              {isLoading ? "Loading articles…" : "No articles published yet."}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((b, i) => (
                <Reveal key={b.slug} delay={i}>
                  <Link to="/blog/$slug" params={{ slug: b.slug }} className="block h-full">
                    <article className="group h-full rounded-3xl overflow-hidden bg-white border border-border hover:shadow-elegant transition-all">
                      <div className="aspect-[5/3] overflow-hidden bg-secondary">
                        {b.image && (
                          <img src={b.image} alt={b.title} loading="lazy" width={1600} height={1200} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        )}
                      </div>
                      <div className="p-7">
                        <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-slate-soft">
                          <span className="text-primary">{b.tag}</span>{b.date && <><span>·</span><span>{b.date}</span></>}
                        </div>
                        <h3 className="mt-3 font-display text-xl leading-snug">{b.title}</h3>
                        <p className="mt-2 text-sm text-slate-soft leading-relaxed">{b.excerpt}</p>
                      </div>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
