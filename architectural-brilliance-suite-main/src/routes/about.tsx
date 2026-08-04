import { createFileRoute, Link } from "@tanstack/react-router";
import { IMG, PROCESS } from "@/lib/site-data";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight } from "lucide-react";

// Import the uploaded image from the assets folder
import founderImg from "@/assets/yogesharch.jpeg"; 

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Studio — Yogesh Architect & Interiors" },
      { name: "description", content: "Founded by Yogesh Kumar Shukla in Lucknow, our studio designs context-driven architecture and interiors across Uttar Pradesh." },
      { property: "og:title", content: "About the Studio — Yogesh Architect & Interiors" },
      { property: "og:description", content: "Context-driven architecture and interiors in Lucknow, Uttar Pradesh." },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: IMG.blueprint },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={<>A studio that <span className="gradient-text">draws by hand,</span> builds by heart.</>}
        subtitle="Founded in Lucknow, our practice has grown into a multidisciplinary studio of architects, interior designers, and project managers — united by a quiet belief that good design is patient design."
      />

      {/* Founder Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            {/* Space for Yogesh's Image */}
            <img 
              src={founderImg} 
              alt="Mr. Yogesh Kumar Shukla, Founder" 
              width={1200} 
              height={1500} 
              loading="lazy" 
              className="rounded-3xl shadow-elegant w-full aspect-[4/5] object-cover" 
            />
          </Reveal>

          <Reveal delay={1}>
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Founder & Visionary</span>
            <h2 className="mt-3 font-display text-4xl leading-tight">Yogesh Kumar Shukla</h2>
            <p className="mt-2 text-slate-soft">Principal Architect &amp; Interior Designer</p>

            <div className="mt-6 space-y-5 text-foreground/85 leading-relaxed">
              <p>
                Mr. Yogesh Kumar Shukla is the driving force behind Yogesh Architect & Interiors. With extensive professional expertise in architecture, interior design, and turnkey project execution, he has established himself as a trusted and innovative leader in the industry.
              </p>
              <p>
                He operates on the core belief that architecture extends far beyond mere construction; it is the art of creating environments that inspire and elevate the quality of life. By merging deep technical knowledge with a meticulous eye for detail, he ensures that every project—whether residential or commercial—is executed with uncompromising precision and excellence.
              </p>
              <p>
                Under his stewardship, the firm has successfully delivered a diverse portfolio of projects across Lucknow and beyond. Guided by a steadfast commitment to transparency, on-time delivery, and forward-thinking innovation, his vision remains simple yet powerful: to craft enduring spaces that tell unique stories, reflect distinct individuality, and stand the test of time.
              </p>
            </div>

            {/* Studio Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["10+", "Years"],
                ["180+", "Projects"],
                ["18+", "Team"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-accent p-5 text-center">
                  <div className="font-display text-3xl gradient-text">{v}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-slate-soft">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-24 bg-[var(--gradient-blue-wash)]">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Values</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Four principles. Every project.</h2>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {[
              { t: "Listen first", d: "We spend more time understanding than presenting. The brief is always co-authored with our clients." },
              { t: "Design for time", d: "We choose finishes and details that age gracefully into the building, rather than falling out of fashion." },
              { t: "Respect the build", d: "Drawings should serve the people who build them — they must be clear, complete, and deeply considered." },
              { t: "Stay accountable", d: "We ensure weekly updates, transparent budgets, and a steadfast commitment to quality even after handover." },
            ].map((v) => (
              <Reveal key={v.t}>
                <div className="rounded-2xl bg-white p-7 shadow-soft h-full">
                  <h3 className="font-display text-xl">{v.t}</h3>
                  <p className="mt-3 text-sm text-slate-soft leading-relaxed">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Process</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">How a project unfolds.</h2>
          </Reveal>

          <div className="mt-12 space-y-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i}>
                <div className="grid md:grid-cols-[120px_1fr] gap-6 rounded-2xl border border-border bg-white p-7">
                  <div className="font-display text-5xl text-primary-bright/50">{p.step}</div>
                  <div>
                    <h3 className="font-display text-xl">{p.title}</h3>
                    <p className="mt-2 text-sm text-slate-soft leading-relaxed max-w-2xl">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-soft hover:-translate-y-0.5 transition-all">
              Start a project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
