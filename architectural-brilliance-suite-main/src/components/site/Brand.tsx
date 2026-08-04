import { Link } from "@tanstack/react-router";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Yogesh Architects & Interiors — Home">
      <span
        className={`relative grid h-11 w-11 place-items-center rounded-lg ${
          light ? "bg-white/15 ring-1 ring-white/30" : "bg-primary"
        } transition-transform group-hover:scale-105`}
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
          <path d="M4 26 L16 6 L28 26 Z" fill="none" stroke={light ? "white" : "white"} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M10 22 L16 12 L22 22" fill="none" stroke={light ? "white" : "white"} strokeWidth="1.6" strokeLinejoin="round" opacity="0.7" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={`block font-display text-[15px] font-semibold ${light ? "text-white" : "text-foreground"}`}>
          Yogesh Architects
        </span>
        <span className={`block text-[11px] tracking-[0.18em] uppercase ${light ? "text-white/70" : "text-slate-soft"}`}>
          &amp; Interiors
        </span>
      </span>
    </Link>
  );
}
