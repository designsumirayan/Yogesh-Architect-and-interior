import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Our Team — Yogesh Architects & Interiors" },
      { name: "description", content: "Meet the talented architects, engineers, and designers behind Yogesh Architects." },
      { property: "og:title", content: "Our Team — Yogesh Architects & Interiors" },
      { property: "og:description", content: "Meet the brilliant minds driving our design excellence." },
      { property: "og:url", content: "/members" },
    ],
    links: [{ rel: "canonical", href: "/members" }],
  }),
  component: TeamPage,
});

type Member = {
  id: string;
  name: string;
  designation: string;
  image_url: string | null;
  bio: string | null;
  sort_order: number | null;
};

function TeamPage() {
  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["team_members_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members" as never)
        .select("id,name,designation,image_url,bio,sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Member[];
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title={<>Meet the <span className="gradient-text">creative minds.</span></>}
        subtitle="A dedicated collective of architects, engineers, and designers transforming visions into structural realities."
      />

      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {isLoading ? (
            <div className="text-center py-20 text-slate-soft">Loading team…</div>
          ) : members.length === 0 ? (
            <div className="text-center py-20 text-slate-soft">No team members added yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {members.map((member, i) => (
                <Reveal key={member.id} delay={i % 4}>
                  <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 transition-all duration-300 hover:shadow-xl hover:border-slate-300 h-full">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={`${member.name} — ${member.designation}`}
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-slate-400 text-4xl font-display">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-grow bg-white border-t border-slate-100">
                      <h3 className="text-lg font-bold text-blue-900 tracking-tight">{member.name}</h3>
                      <p className="mt-1 font-bold text-blue-900 tracking-wide uppercase text-xs opacity-90">
                        {member.designation}
                      </p>
                      {member.bio && (
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">{member.bio}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
