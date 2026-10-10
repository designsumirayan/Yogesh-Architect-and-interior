import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
// Import your custom logo asset
import logoImg from "@/assets/yogesh Arc. & Int. New logo.png";

// Custom SVG component for the X logo
const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Footer() {
  const socialLinks = [
    { icon: Instagram, href: "#" }, // Placeholder for Instagram if needed
    { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61560011151428&mibextid=ZbWKwL" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/yogesh-shukla-69a580281" },
    { icon: Youtube, href: "https://youtube.com/@ar.yogeshshukla8797?si=_9fe8zgwN95yPQRg" },
    { icon: XIcon, href: "https://x.com/yogeshshuk79097" },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden bg-primary-deep text-white">
      <div className="absolute inset-0 blueprint-grid opacity-[0.07]" aria-hidden />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-bright/30 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <img 
              src={logoImg} 
              alt="Yogesh Architects & Interiors Logo" 
              // Added brightness-0 invert in case your original logo is dark and needs to be white on this dark footer. Remove those two classes if your logo is already properly colored.
              className="h-14 w-auto object-contain max-w-[240px] brightness-0 invert" 
            />
            <p className="mt-5 text-sm leading-relaxed text-white/70 max-w-xs">
              Crafting timeless architecture and refined interiors across Lucknow and Uttar Pradesh — where vision meets precision.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition hover:bg-white/20"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-base mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              {[
                ["/about", "About Studio"],
                ["/services", "Services"],
                ["/projects", "Projects"],
                ["/gallery", "Gallery"],
                ["/blog", "Journal"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to as string} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              {[
                "Residential Architecture",
                "Commercial Architecture",
                "Interior Design",
                "Turnkey Projects",
                "3D Elevation",
                "Modular Kitchen",
              ].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base mb-4">Get in touch</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary-bright" />
                <span>9/283, Opp. Central Bank of India, <br />CDRI Chowk, Jankipuram Extension, Lucknow</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-primary-bright" />
                <div>
                  <a href="tel:+917357734536" className="block hover:text-white">+91 7357734536</a>
                  <a href="tel:+919336483116" className="block hover:text-white">+91 9336483116</a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 shrink-0 mt-0.5 text-primary-bright" />
                <a href="mailto:yarchitect02@gmail.com" className="hover:text-white">yarchitect02@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Yogesh Architects &amp; Interiors. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-white/55">
          Designed &amp; Managed by{" "}
          <a
            href="https://sumirayandesign.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white/85 hover:text-primary-bright transition-colors"
          >
            Sumirayan Design
          </a>
        </div>
      </div>
    </footer>
  );
}
