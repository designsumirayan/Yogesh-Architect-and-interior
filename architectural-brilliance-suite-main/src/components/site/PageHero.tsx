import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
      <div className="absolute inset-0 -z-10 bg-[var(--gradient-soft)]" />
      <div className="absolute inset-0 -z-10 blueprint-grid opacity-50" />
      <div className="absolute -top-40 -right-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary-bright/15 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 -z-10 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />

      <div className="mx-auto max-w-5xl px-6 text-center">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-primary">
            <span className="h-1 w-1 rounded-full bg-primary" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-5 font-display text-4xl md:text-6xl font-semibold leading-[1.05] text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-soft leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
