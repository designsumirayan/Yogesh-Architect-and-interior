import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Aapka logo import
import yogeshLogo from "@/assets/yogesh Arc. & Int. New logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/gallery", label: "Gallery" },
  { to: "/members", label: "Members" },
  { to: "/blog", label: "Blog" },
  { to: "/videos", label: "Videos" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isStaff } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLight = scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        onLight
          ? "bg-white/85 backdrop-blur-xl shadow-[0_4px_24px_-12px_rgba(11,58,141,0.18)]"
          : "bg-gradient-to-b from-primary-deep/55 via-primary/20 to-transparent backdrop-blur-[2px]"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-2">
          
          {/* Logo & Brand Name Section */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <Link to="/" className="shrink-0 transition-transform hover:scale-105">
              <img 
                src={yogeshLogo} 
                alt="Logo" 
                className={`h-8 w-8 sm:h-9 sm:w-9 object-contain rounded-md ${
                  !onLight ? "brightness-0 invert" : ""
                }`} 
              />
            </Link>
            <Link to="/" className="flex flex-col justify-center shrink-0 min-w-0">
              <span className={`font-serif font-bold text-base sm:text-xl leading-tight truncate ${onLight ? "text-foreground" : "text-white"}`}>
                Yogesh Architects
              </span>
              <span className={`text-[9px] sm:text-[11px] tracking-[0.2em] font-medium uppercase truncate ${onLight ? "text-foreground/70" : "text-white/70"}`}>
                & INTERIORS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: onLight ? "text-primary" : "text-white" }}
                inactiveProps={{
                  className: onLight
                    ? "text-foreground/75 hover:text-primary"
                    : "text-white/85 hover:text-white",
                }}
                activeOptions={{ exact: item.to === "/" }}
                className="relative px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side Controls */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {user ? (
              <Link
                to={isStaff ? "/admin" : "/auth"}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                  onLight
                    ? "border-border bg-white hover:bg-accent text-foreground"
                    : "border-white/40 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <User className="h-4 w-4 shrink-0" /> {isStaff ? "Admin" : "Account"}
              </Link>
            ) : (
              <Link
                to="/auth"
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                  onLight
                    ? "border-border bg-white hover:bg-accent text-foreground"
                    : "border-white/40 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <User className="h-4 w-4 shrink-0" /> Sign in
              </Link>
            )}
            <Link
              to="/contact"
              className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant whitespace-nowrap ${
                onLight
                  ? "bg-primary text-primary-foreground"
                  : "bg-white text-primary"
              }`}
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile Right Side Controls (Fixed Layout & Menu Button Visibility) */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-1.5 shrink-0 main-menu-mobile">
            {user ? (
              <Link
                to={isStaff ? "/admin" : "/auth"}
                aria-label={isStaff ? "Admin" : "Account"}
                className={`grid h-8 w-8 place-items-center rounded-full border transition shrink-0 ${
                  onLight ? "border-border bg-white text-foreground" : "border-white/40 bg-white/10 text-white"
                }`}
              >
                <User className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                to="/auth"
                aria-label="Sign in"
                className={`grid h-8 w-8 place-items-center rounded-full border transition shrink-0 ${
                  onLight ? "border-border bg-white text-foreground" : "border-white/40 bg-white/10 text-white"
                }`}
              >
                <User className="h-3.5 w-3.5" />
              </Link>
            )}
            
            <Link
              to="/contact"
              className={`inline-flex items-center justify-center rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition whitespace-nowrap shrink-0 ${
                onLight ? "bg-primary text-primary-foreground" : "bg-white text-primary"
              }`}
            >
              Consult
            </Link>

            <button
              className={`grid h-9 w-9 place-items-center rounded-md shrink-0 transition-transform active:scale-95 ${
                onLight ? "text-foreground" : "text-white"
              }`}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-border">
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-primary bg-accent" }}
                inactiveProps={{ className: "text-foreground/80" }}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-3 py-2.5 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
