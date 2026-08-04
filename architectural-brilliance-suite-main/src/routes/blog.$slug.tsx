import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/PageHero";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} | Yogesh Architects Journal` },
      { name: "description", content: "Article from the Yogesh Architects journal." },
    ],
  }),
  component: BlogDetail,
});

function BlogDetail() {
  const { slug } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="text-center py-32 text-slate-soft">Loading…</div>;
  if (!data)
    return (
      <div className="text-center py-32">
        <p className="text-slate-soft">Article not found.</p>
        <Link to="/blog" className="mt-4 inline-block text-primary underline">
          Back to journal
        </Link>
      </div>
    );

  const tags: string[] = Array.isArray(data.tags) ? (data.tags as string[]) : [];
  const date = data.published_at
    ? new Date(data.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <>
      <PageHero
        eyebrow={tags[0] ?? "Article"}
        title={<>{data.title}</>}
        subtitle={data.excerpt ?? ""}
      />

      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary mb-8 hover:underline">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-slate-soft mb-6">
            {data.author && <span>By {data.author}</span>}
            {date && <span>· {date}</span>}
            {tags.slice(1).map((t) => (
              <span key={t} className="text-primary">
                · {t}
              </span>
            ))}
          </div>

          {data.cover_url && (
            <div className="rounded-3xl overflow-hidden bg-secondary mb-10">
              <img src={data.cover_url} alt={data.title} className="w-full h-auto object-cover" />
            </div>
          )}

          {data.content && (
            <div className="prose prose-slate max-w-none whitespace-pre-wrap text-base leading-relaxed">
              {data.content}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
