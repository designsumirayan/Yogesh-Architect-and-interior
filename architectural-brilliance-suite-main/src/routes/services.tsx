import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { ArrowUpRight, Plus } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Architecture, Interior Design, Turnkey | Yogesh Architects" },
      { name: "description", content: "Residential and commercial architecture, interior design, modular kitchens, 3D elevation, landscape, renovation, turnkey delivery — Lucknow." },
      { property: "og:title", content: "Services — Yogesh Architects & Interiors" },
      { property: "og:description", content: "Full-spectrum architecture and interior design services across Uttar Pradesh." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

type DBService = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null; 
  icon: string | null;
  banner_url: string | null;
};

type MappedService = {
  slug: string;
  title: string;
  short: string;
  content: string;
  icon: string;
  banner: string | null;
};

function ServicesPage() {
  // यह चेक करेगा कि क्या हम ठीक "/services" पर हैं (किसी चाइल्ड पर नहीं)
  const matchRoute = useMatchRoute();
  const isIndex = matchRoute({ to: "/services" });

  const { data, isLoading } = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, slug, title, summary, content, icon, banner_url") 
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as DBService[];
    },
  });

  const list: MappedService[] = (data ?? []).map((s) => ({ 
    slug: s.slug, 
    title: s.title, 
    short: s.summary ?? "", 
    content: s.content ?? "", 
    icon: s.icon ?? "✦", 
    banner: s.banner_url 
  }));

  return (
    <>
      {/* अगर यूज़र मेन सर्विसेज़ पेज पर है, तो ग्रिड दिखाएँ */}
      {isIndex && (
        <>
          <PageHero
            eyebrow="Services"
            title={<>Twelve disciplines. <span className="gradient-text">One design intent.</span></>}
            subtitle="From architecture to interiors and turnkey delivery — every service is offered with the same studio rigor."
          />

          <section className="relative py-12 md:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
              {list.length === 0 ? (
                <div className="text-center py-16 text-slate-soft">
                  {isLoading ? "Loading services…" : "No services published yet."}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
                  {list.map((s, i) => (
                    <Reveal key={s.slug} delay={i % 3}>
                      <Link
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        className="group flex flex-col w-full min-h-[350px] cursor-pointer rounded-3xl bg-white border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-10"
                      >
                        <article className="flex flex-col h-full w-full pointer-events-none flex-1">
                          {s.banner && (
                            <div className="relative w-full h-52 sm:h-64 shrink-0 bg-slate-100 overflow-hidden block pointer-events-none">
                              <img
                                src={s.banner}
                                alt={s.title}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              />
                            </div>
                          )}
                          
                          <div className="p-6 md:p-7 flex flex-col flex-grow relative bg-white pointer-events-none">
                            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-100 text-2xl border border-slate-200">
                              {s.icon}
                            </div>
                            
                            <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                              <Plus className="h-5 w-5 text-blue-900" />
                            </div>
                            
                            <h3 className="mt-6 font-bold text-xl text-slate-900">{s.title}</h3>
                            <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                              {s.short}
                            </p>
                            
                            <div className="mt-auto pt-6">
                              <span className="inline-flex w-max items-center gap-2 text-sm font-semibold text-blue-700">
                                Read details <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Footer CTA Section */}
          <section className="relative pb-12 md:pb-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10">
              <div className="relative overflow-hidden rounded-[2rem] bg-blue-900 p-8 md:p-14 text-white shadow-xl">
                <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl max-w-2xl text-white">
                  Not sure where to start? We'll help you frame the brief.
                </h2>
                <p className="mt-4 text-white/85 max-w-xl text-sm md:text-base">
                  A 30-minute discovery call to scope your project, timelines, and budget — no commitment.
                </p>
                <Link to="/contact" className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-bold text-blue-900 shadow-md hover:-translate-y-1 transition-transform">
                  Book a consultation
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Outlet: यह वह जगह है जहाँ TanStack Router आपके नए पेज (services/$slug.tsx) को रेंडर करेगा 
      */}
      <Outlet />
    </>
  );
}
