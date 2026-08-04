import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Book a Consultation | Yogesh Architects" },
      { name: "description", content: "Get in touch with Yogesh Architects & Interiors. Book a free 30-minute discovery call." },
      { property: "og:title", content: "Contact — Yogesh Architects & Interiors" },
      { property: "og:description", content: "Book a free 30-minute discovery call." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim() || null,
      location: String(fd.get("location") || "").trim() || null,
      project_type: String(fd.get("project_type") || "").trim() || null,
      message: String(fd.get("message") || "").trim() || null,
      source: "website",
    };
    if (!payload.name || !payload.email) {
      toast.error("Name and email are required");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert(payload);
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't submit. Please try again.");
      return;
    }
    setSent(true);
    toast.success("Thanks — we'll be in touch within a working day.");
  }


  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let's draw the <span className="gradient-text">first line.</span></>}
        subtitle="Tell us about your project. We'll respond within one working day and set up a 30-minute discovery call."
      />

      <section className="relative pb-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 grid lg:grid-cols-[1fr_1.2fr] gap-10">
          <Reveal>
            <div className="rounded-3xl bg-primary-deep text-white p-8 lg:p-10 h-full relative overflow-hidden">
              <div className="absolute inset-0 blueprint-grid opacity-[0.08]" aria-hidden />
              <div className="relative">
                <h2 className="font-display text-2xl">Studio</h2>
                <p className="mt-2 text-white/75 text-sm">Open Mon–Sat, 10am–7pm IST</p>

                <ul className="mt-10 space-y-6">
                  <li className="flex gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/20"><MapPin className="h-4 w-4" /></span>
                    <div className="text-sm">
                      <div className="text-xs uppercase tracking-widest text-white/60">Address</div>
                      <div className="mt-1">9/284, Opp. Central Bank of India,<br />CDRI Chowk, Jankipuram Extention, Lucknow</div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/20"><Phone className="h-4 w-4" /></span>
                    <div className="text-sm">
                      <div className="text-xs uppercase tracking-widest text-white/60">Phone</div>
                      <a href="tel:+917357734536" className="mt-1 block hover:text-white/80 transition-colors">+91 73577 34536</a>
                      <a href="tel:+919336483116" className="mt-1 block hover:text-white/80 transition-colors">+91 93364 83116</a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/20"><Mail className="h-4 w-4" /></span>
                    <div className="text-sm">
                      <div className="text-xs uppercase tracking-widest text-white/60">Email</div>
                      <a href="mailto:yarchitect02@gmail.com" className="mt-1 block hover:text-white/80 transition-colors">yarchitect02@gmail.com</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <form
              onSubmit={onSubmit}
              className="rounded-3xl bg-white border border-border p-8 lg:p-10 shadow-soft"
            >
              <h2 className="font-display text-2xl">Tell us about your project</h2>
              <p className="mt-2 text-sm text-slate-soft">All fields optional except name and email.</p>

              <div className="mt-7 grid sm:grid-cols-2 gap-4">
                <Field label="Full name" name="name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
                <Field label="Location" name="location" placeholder="e.g. Lucknow" />
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-slate-soft">Service of interest</label>
                  <select name="project_type" defaultValue="Residential Architecture" className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Residential Architecture</option>
                    <option>Commercial Architecture</option>
                    <option>Interior Design</option>
                    <option>Turnkey Project</option>
                    <option>Renovation</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-slate-soft">Your message</label>
                  <textarea name="message" rows={4} maxLength={5000} className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Site location, scope, timeline, budget range..." />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || sent}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft hover:-translate-y-0.5 transition-all disabled:opacity-60"
              >
                {sent ? "Thank you — we'll be in touch" : submitting ? "Sending…" : (<>Send message <Send className="h-4 w-4" /></>)}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-widest text-slate-soft">{label}{required && <span className="text-primary"> *</span>}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
