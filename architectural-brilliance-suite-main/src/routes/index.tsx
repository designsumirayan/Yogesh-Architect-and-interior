import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  ArrowRight, ArrowUpRight, CheckCircle2, Compass, Ruler, PenTool,
  Building2, Sparkles, Quote, Play
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IMG, PROCESS } from "@/lib/site-data";
import { Reveal } from "@/components/site/Reveal";
import { useEffect, useRef, useState, useCallback } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yogesh Architects & Interiors — Architecture & Interior Design, Lucknow" },
      { name: "description", content: "Premium architecture and interior design studio in Lucknow. Residential, commercial, turnkey, modular kitchens, 3D elevations across Uttar Pradesh." },
      { property: "og:title", content: "Yogesh Architects & Interiors — Lucknow" },
      { property: "og:description", content: "Premium architecture and interior design studio in Lucknow." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

// ─────────────────────────────────────────────
// Animated Counter
// ─────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1800;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}{suffix}</>;
}

// ─────────────────────────────────────────────
// 3D Floating Cube (CSS 3D)
// ─────────────────────────────────────────────
function FloatingCube({ size = 60, color = "rgba(255,255,255,0.08)", delay = 0, top = "20%", left = "80%", speed = 20 }: {
  size?: number; color?: string; delay?: number; top?: string; left?: string; speed?: number;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ top, left, perspective: "600px", width: size, height: size }}
    >
      <motion.div
        style={{ width: size, height: size, transformStyle: "preserve-3d", position: "relative" }}
        animate={{ rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 180] }}
        transition={{ duration: speed, delay, repeat: Infinity, ease: "linear" }}
      >
        {/* 6 faces */}
        {[
          { transform: `translateZ(${size / 2}px)` },
          { transform: `translateZ(-${size / 2}px) rotateY(180deg)` },
          { transform: `translateY(-${size / 2}px) rotateX(90deg)` },
          { transform: `translateY(${size / 2}px) rotateX(-90deg)` },
          { transform: `translateX(-${size / 2}px) rotateY(-90deg)` },
          { transform: `translateX(${size / 2}px) rotateY(90deg)` },
        ].map((face, i) => (
          <div
            key={i}
            style={{
              position: "absolute", width: "100%", height: "100%",
              background: color,
              border: `1px solid rgba(255,255,255,0.15)`,
              backdropFilter: "blur(2px)",
              ...face,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3D Torus Ring (SVG based)
// ─────────────────────────────────────────────
function FloatingRing({ size = 120, delay = 0, top = "60%", left = "10%" }: {
  size?: number; delay?: number; top?: string; left?: string;
}) {
  return (
    <div className="absolute pointer-events-none" style={{ top, left }}>
      <motion.div
        animate={{ rotateY: [0, 360], rotateX: [20, 40, 20] }}
        transition={{ duration: 15, delay, repeat: Infinity, ease: "linear" }}
        style={{ perspective: "400px" }}
      >
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
          <ellipse cx="60" cy="60" rx="50" ry="50" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <ellipse cx="60" cy="60" rx="50" ry="20" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3" />
          <ellipse cx="60" cy="60" rx="30" ry="30" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <circle cx="60" cy="10" r="4" fill="rgba(255,255,255,0.3)" />
          <circle cx="110" cy="60" r="3" fill="rgba(255,255,255,0.2)" />
        </svg>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Particle Canvas Background
// ─────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const NUM = 60;
    type P = { x: number; y: number; vx: number; vy: number; r: number; opacity: number };
    const particles: P[] = Array.from({ length: NUM }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      }
      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.07 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />;
}

// ─────────────────────────────────────────────
// 3D Architectural Line Drawing
// ─────────────────────────────────────────────
function ArchitecturalWireframe() {
  return (
    <motion.div
      className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.svg
        width="580" height="580" viewBox="0 0 580 580"
        fill="none" xmlns="http://www.w3.org/2000/svg"
        animate={{ rotateY: [0, 5, 0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 30px rgba(255,255,255,0.08))" }}
      >
        {/* Building isometric wireframe */}
        {/* Ground floor */}
        <polygon points="290,420 130,340 130,240 290,320" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="rgba(255,255,255,0.03)" />
        <polygon points="290,420 450,340 450,240 290,320" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />
        <polygon points="130,240 290,160 450,240 290,320" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="rgba(255,255,255,0.05)" />

        {/* Second floor */}
        <polygon points="290,320 170,260 170,185 290,245" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="rgba(255,255,255,0.03)" />
        <polygon points="290,320 410,260 410,185 290,245" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />
        <polygon points="170,185 290,125 410,185 290,245" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="rgba(255,255,255,0.04)" />

        {/* Roof structure */}
        <polygon points="290,245 210,210 290,175 370,210" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="rgba(255,255,255,0.06)" />
        <line x1="290" y1="175" x2="290" y2="140" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="290" y1="140" x2="230" y2="175" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="290" y1="140" x2="350" y2="175" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

        {/* Windows */}
        {[[180, 270, 30, 35], [240, 290, 30, 35], [330, 290, 30, 35], [390, 270, 30, 35]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="rgba(255,255,255,0.05)" rx="2" />
        ))}

        {/* Grid lines */}
        {[0, 1, 2, 3].map(i => (
          <line key={i}
            x1={130 + i * 80} y1={240 - i * 20}
            x2={130 + i * 80} y2={340 - i * 20}
            stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="3 4"
          />
        ))}

        {/* Decorative measurement lines */}
        <line x1="100" y1="240" x2="100" y2="420" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <line x1="95" y1="240" x2="105" y2="240" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="95" y1="420" x2="105" y2="420" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <text x="85" y="335" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace" transform="rotate(-90, 85, 335)">H=12.5m</text>

        <line x1="130" y1="450" x2="450" y2="450" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <line x1="130" y1="445" x2="130" y2="455" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="450" y1="445" x2="450" y2="455" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <text x="275" y="468" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace" textAnchor="middle">W=24.0m</text>

        {/* Floating dots at corners */}
        {[[130, 240], [290, 160], [450, 240], [130, 340], [450, 340], [290, 420]].map(([cx, cy], i) => (
          <motion.circle key={i} cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.4)"
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}

        {/* Compass rose */}
        <g transform="translate(490, 100)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line key={angle}
              x1="0" y1="0"
              x2={Math.sin(angle * Math.PI / 180) * 18}
              y2={-Math.cos(angle * Math.PI / 180) * 18}
              stroke={angle === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}
              strokeWidth={angle === 0 ? 1.5 : 0.7}
            />
          ))}
          <circle cx="0" cy="0" r="22" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
          <text x="0" y="-25" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">N</text>
        </g>
      </motion.svg>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Magnetic Button
// ─────────────────────────────────────────────
function MagneticButton({ children, className, to, href, onClick }: {
  children: React.ReactNode; className?: string;
  to?: string; href?: string; onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({ x: (e.clientX - cx) * 0.25, y: (e.clientY - cy) * 0.25 });
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(false);
    setPos({ x: 0, y: 0 });
  }, []);

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y, scale: hovered ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative inline-flex cursor-pointer ${className ?? ""}`}
      onClick={onClick}
    >
      {/* Glow effect */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, transparent 70%)", filter: "blur(8px)" }}
          />
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  );

  if (to) return <Link to={to} className="inline-block">{inner}</Link>;
  if (href) return <a href={href} className="inline-block">{inner}</a>;
  return inner;
}

// ─────────────────────────────────────────────
// Glowing CTA Button
// ─────────────────────────────────────────────
function GlowButton({ children, className, to }: { children: React.ReactNode; className?: string; to?: string }) {
  const [hovered, setHovered] = useState(false);
  
  const content = (
    <>
      {/* Animated shimmer */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        animate={hovered ? { x: ["−100%", "200%"] } : { x: "−100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
          skewX: "-20deg",
        }}
      />
      {/* Pulse ring */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute inset-0 rounded-full border border-white/40"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
      {children}
    </>
  );

  const innerClasses = `relative overflow-hidden group ${className ?? ""}`;

  // Fixed Invalid DOM Nesting: if 'to' exists, wrap with Link instead of nested <button>
  if (to) {
    return (
      <Link to={to} className="inline-block">
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className={innerClasses}
        >
          {content}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={innerClasses}
    >
      {content}
    </motion.button>
  );
}

// ─────────────────────────────────────────────
// 3D Service Card
// ─────────────────────────────────────────────
function Card3D({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: cy * -10, y: cx * 10 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setRotate({ x: 0, y: 0 }); }}
      style={{ perspective: "800px" }}
    >
      <motion.div
        animate={{ rotateX: rotate.x, rotateY: rotate.y, scale: hovered ? 1.03 : 1, z: hovered ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}
        className={`relative ${className ?? ""}`}
      >
        {/* Shine overlay */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + rotate.y * 3}% ${50 + rotate.x * 3}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Scroll-parallax image
// ─────────────────────────────────────────────
function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.img src={src} alt={alt} style={{ y }} className="w-full h-full object-cover scale-110"
        loading="lazy" width={1600} height={1200} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
function Home() {
  const { data: services = [] } = useQuery({
    queryKey: ["home-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services").select("slug,title,summary,icon")
        .eq("published", true).order("display_order", { ascending: true }).limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: projects = [] } = useQuery({
    queryKey: ["home-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects").select("slug,title,category,location,year,cover_url,summary")
        .eq("published", true).order("created_at", { ascending: false }).limit(4);
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: testimonials = [] } = useQuery({
    queryKey: ["home-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials").select("id,name,role,message")
        .eq("published", true).order("display_order", { ascending: true }).limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: blogs = [] } = useQuery({
    queryKey: ["home-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs").select("slug,title,excerpt,cover_url,tags,published_at")
        .eq("published", true).order("published_at", { ascending: false, nullsFirst: false }).limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: faqs = [] } = useQuery({
    queryKey: ["home-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs").select("id,question,answer")
        .eq("published", true).order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] overflow-hidden">

        {/* Background image */}
        <img
          src={IMG.hero}
          alt="Modern villa designed by Yogesh Architects"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920} height={1280}
        />
        {/* Deep gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-deep/90 via-primary/60 to-primary-bright/25" />

        {/* Particle canvas */}
        <ParticleCanvas />

        {/* Blueprint grid */}
        <div className="absolute inset-0 blueprint-grid opacity-[0.10]" aria-hidden />

        {/* 3D Floating elements */}
        <FloatingCube size={70} delay={0} top="18%" left="5%" speed={22} />
        <FloatingCube size={40} delay={3} top="55%" left="8%" speed={18} color="rgba(255,255,255,0.06)" />
        <FloatingRing size={130} delay={1} top="12%" left="60%" />
        <FloatingRing size={80} delay={4} top="65%" left="55%" />
        <FloatingCube size={55} delay={6} top="75%" left="3%" speed={25} color="rgba(255,255,255,0.05)" />

        {/* 3D Architectural wireframe */}
        <ArchitecturalWireframe />

        {/* Hero content */}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-40 pb-20 lg:pt-48 lg:pb-32 min-h-[100svh] flex items-center">
          <div className="max-w-2xl lg:max-w-[52%] text-white">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-medium tracking-widest uppercase ring-1 ring-white/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              <span>Lucknow · Est. 2016</span>
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 font-display text-5xl md:text-7xl lg:text-[76px] leading-[1.02] font-medium"
            >
              Architecture that{" "}
              <motion.span
                className="italic font-normal relative inline-block"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #a5f3fc 40%, #ffffff 80%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                listens.
              </motion.span>
              <br />Interiors that{" "}
              <motion.span
                className="italic font-normal relative inline-block"
                animate={{ backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{
                  background: "linear-gradient(135deg, #a5f3fc 0%, #ffffff 50%, #bfdbfe 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                linger.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-7 max-w-xl text-lg text-white/85 leading-relaxed"
            >
              A Lucknow-based studio crafting residences, workplaces, and interiors across Uttar Pradesh — where every project begins with a conversation, not a template.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <GlowButton
                to="/contact"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-sm font-semibold text-primary shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-shadow hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]"
              >
                Book a consultation
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </GlowButton>

              <MagneticButton
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-7 py-4 text-sm font-medium text-white ring-1 ring-white/30 hover:bg-white/20 transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                View projects
              </MagneticButton>
            </motion.div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="glass-card rounded-2xl px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4"
              style={{ backdropFilter: "blur(20px)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              {[
                { v: 180, s: "+", l: "Projects delivered" },
                { v: 10, s: "+", l: "Years of practice" },
                { v: 18, s: "+", l: "Team of specialists" },
                { v: 20, s: "+", l: "Cities served" },
              ].map((it) => (
                <div key={it.l} className="text-center">
                  <div className="font-display text-3xl md:text-4xl text-white font-bold">
                    <Counter to={it.v} suffix={it.s} />
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-white/60">{it.l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="relative py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative">
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-3xl bg-accent -z-10" />
              <ParallaxImage
                src={IMG.blueprint}
                alt="Architect refining blueprints"
                className="rounded-3xl shadow-elegant w-full aspect-[4/3]"
              />
              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-6 -right-6 glass-card rounded-2xl px-5 py-4 max-w-[220px]"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ backdropFilter: "blur(16px)", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                <div className="text-xs uppercase tracking-widest text-slate-soft">Lucknow Studio</div>
                <div className="mt-1 font-display text-lg">Jankipuram extension</div>
              </motion.div>

              {/* 3D accent cube */}
              <div className="absolute -top-4 -right-4 pointer-events-none" style={{ perspective: "400px" }}>
                <motion.div
                  style={{ width: 40, height: 40, transformStyle: "preserve-3d" }}
                  animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} style={{
                      position: "absolute", width: "100%", height: "100%",
                      background: "rgba(var(--primary-rgb, 37,99,235), 0.15)",
                      border: "1px solid rgba(var(--primary-rgb, 37,99,235), 0.3)",
                      transform: [
                        "translateZ(20px)", "translateZ(-20px) rotateY(180deg)",
                        "translateY(-20px) rotateX(90deg)", "translateY(20px) rotateX(-90deg)",
                        "translateX(-20px) rotateY(-90deg)", "translateX(20px) rotateY(90deg)",
                      ][i],
                    }} />
                  ))}
                </motion.div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">The Studio</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              A practice built on <span className="gradient-text">restraint, rigor, and place.</span>
            </h2>
            <p className="mt-6 text-slate-soft leading-relaxed">
              Founded by Yogesh Shukla, our Lucknow studio brings over a decade of experience designing homes, workplaces, and hospitality spaces shaped by their context. We work in close collaboration with our clients — drawing, prototyping, and refining until the design feels inevitable.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Architecture, interiors, and turnkey delivery under one roof",
                "Climate-responsive, vastu-aware planning",
                "Material-first interiors with quiet, lasting detail",
                "Rigorous site supervision through handover",
              ].map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 text-sm text-foreground/85"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  {t}
                </motion.li>
              ))}
            </ul>
            <MagneticButton
              to="/about"
              className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
            >
              More about the studio <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="relative py-28 bg-[var(--gradient-blue-wash)] overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-40" aria-hidden />
        {/* 3D Background element */}
        <div className="absolute right-0 top-0 w-96 h-96 pointer-events-none opacity-20">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {[20, 40, 60, 80].map((r) => (
                <circle key={r} cx="100" cy="100" r={r} stroke="currentColor" strokeWidth="0.5" className="text-primary/30" />
              ))}
              {[0, 45, 90, 135].map((angle) => (
                <line key={angle}
                  x1="100" y1="100"
                  x2={100 + 95 * Math.cos(angle * Math.PI / 180)}
                  y2={100 + 95 * Math.sin(angle * Math.PI / 180)}
                  stroke="currentColor" strokeWidth="0.5" className="text-primary/30"
                />
              ))}
            </svg>
          </motion.div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Services</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              Full-spectrum design, end-to-end delivery.
            </h2>
            <p className="mt-5 text-slate-soft">From the first sketch to the final snag — twelve disciplines, one design intent.</p>
          </Reveal>

          {services.length > 0 && (
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i % 3}>
                <Card3D className="h-full">
                  {/* Fixed Link to use $slug and specific path parameters */}
                  <Link to="/services/$slug" params={{ slug: s.slug }} className="group block h-full rounded-3xl bg-white p-7 shadow-soft hover:shadow-elegant transition-shadow">
                    <motion.div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-2xl" whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                      {s.icon ?? "✦"}
                    </motion.div>
                    <h3 className="mt-5 font-display text-xl">{s.title}</h3>
                    <p className="mt-3 text-sm text-slate-soft leading-relaxed">{s.summary}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </Link>
                </Card3D>
              </Reveal>
            ))}
          </div>
          )}

          <div className="mt-12 text-center">
            <GlowButton
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-6 py-3 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              View all services <ArrowRight className="h-4 w-4" />
            </GlowButton>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="relative py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Selected Work</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight max-w-xl">
                Projects shaped by place and people.
              </h2>
            </Reveal>
            <MagneticButton to="/projects" className="text-sm font-medium text-primary inline-flex items-center gap-2 hover:gap-3 transition-all">
              All projects <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>

          {projects.length > 0 && (
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i % 2}>
                {/* Fixed Link to use $slug and proper routing parameters */}
                <Link to="/projects/$slug" params={{ slug: p.slug }} className="group block relative overflow-hidden rounded-3xl">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {p.cover_url && (
                      <motion.img
                        src={p.cover_url} alt={p.title}
                        className="h-full w-full object-cover"
                        loading="lazy" width={1600} height={1200}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary-deep/20 to-transparent" />
                  <motion.div className="absolute inset-0 rounded-3xl border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
                      {p.category && <span>{p.category}</span>}
                      {p.location && <><span>·</span><span>{p.location}</span></>}
                      {p.year && <><span>·</span><span>{p.year}</span></>}
                    </div>
                    <h3 className="mt-2 font-display text-2xl md:text-3xl">{p.title}</h3>
                    <p className="mt-2 text-sm text-white/75 max-w-md">{p.summary}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="relative py-28 bg-primary-deep text-white overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-[0.07]" aria-hidden />

        {/* 3D animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 h-[20rem] w-[20rem] rounded-full bg-primary-bright/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-[25rem] w-[25rem] rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />

        {/* Floating 3D cubes in dark section */}
        <FloatingCube size={50} delay={0} top="15%" left="90%" speed={20} color="rgba(255,255,255,0.04)" />
        <FloatingCube size={30} delay={5} top="70%" left="92%" speed={15} color="rgba(255,255,255,0.03)" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-primary-bright font-medium">Why choose us</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              We design the way you'd want to be designed for.
            </h2>
          </Reveal>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { Icon: Compass, t: "Context-driven", d: "Each design begins with a deep read of site, climate, and culture." },
              { Icon: Ruler, t: "Precision craft", d: "Detail-level documentation that respects builders' time on site." },
              { Icon: PenTool, t: "Material first", d: "Honest materials and finishes chosen to age beautifully." },
              { Icon: Building2, t: "Delivery rigor", d: "Transparent timelines, weekly reporting, and snag-free handover." },
            ].map(({ Icon, t, d }, i) => (
              <Reveal key={t} delay={i}>
                <Card3D className="h-full">
                  <motion.div
                    className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-7 h-full hover:bg-white/8 transition-colors"
                    whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="h-6 w-6 text-primary-bright" />
                    </motion.div>
                    <h3 className="mt-5 font-display text-xl">{t}</h3>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed">{d}</p>
                  </motion.div>
                </Card3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="relative py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Process</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight">A measured path from idea to keys.</h2>
          </Reveal>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-5 gap-5">
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i}>
                <motion.div
                  className="relative h-full rounded-2xl border border-border bg-white p-6 overflow-hidden"
                  whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Animated step number bg */}
                  <motion.div
                    className="absolute -top-4 -right-4 font-display text-8xl text-primary/5 font-bold select-none pointer-events-none"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
                  >
                    {p.step}
                  </motion.div>
                  <div className="font-display text-5xl text-primary-bright/40 relative z-10">{p.step}</div>
                  <h3 className="mt-2 font-display text-lg relative z-10">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-soft leading-relaxed relative z-10">{p.body}</p>

                  {/* Progress dot */}
                  {i < PROCESS.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-20 px-1">
                      <motion.div
                        className="h-2 w-2 rounded-full bg-primary-bright"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                      />
                    </div>
                  )}
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative py-28 bg-[var(--gradient-blue-wash)] overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Client Voices</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight">Quietly proud of the homes we've helped build.</h2>
          </Reveal>

          {testimonials.length > 0 && (
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i}>
                <Card3D className="h-full">
                  <figure className="h-full rounded-3xl bg-white p-8 shadow-soft">
                    <motion.div animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 4, delay: i, repeat: Infinity }}>
                      <Quote className="h-7 w-7 text-primary-bright" />
                    </motion.div>
                    <blockquote className="mt-5 text-foreground/85 leading-relaxed">"{t.message}"</blockquote>
                    <figcaption className="mt-6 pt-5 border-t border-border">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-sm text-slate-soft">{t.role}</div>
                    </figcaption>
                  </figure>
                </Card3D>
              </Reveal>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* ── BLOG ── */}
      <section className="relative py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Journal</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight">From the studio.</h2>
            </Reveal>
            <MagneticButton to="/blog" className="text-sm font-medium text-primary inline-flex items-center gap-2 hover:gap-3 transition-all">
              All articles <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>

          {blogs.length > 0 && (
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {blogs.map((b, i) => {
              const tag = Array.isArray(b.tags) && b.tags.length > 0 ? String(b.tags[0]) : "Article";
              const date = b.published_at ? new Date(b.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
              return (
              <Reveal key={b.slug} delay={i}>
                {/* Fixed Missing Link for Blogs */}
                <Link to="/blog/$slug" params={{ slug: b.slug }} className="block h-full group rounded-3xl overflow-hidden bg-white border border-border">
                  <motion.article className="h-full" whileHover={{ y: -8, boxShadow: "0 30px 80px rgba(0,0,0,0.12)" }} transition={{ type: "spring", stiffness: 300 }}>
                    <div className="aspect-[5/3] overflow-hidden bg-secondary">
                      {b.cover_url && (
                        <motion.img src={b.cover_url} alt={b.title} loading="lazy" width={1600} height={1200} className="h-full w-full object-cover" whileHover={{ scale: 1.08 }} transition={{ duration: 0.5 }} />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-slate-soft">
                        <span className="text-primary">{tag}</span>{date && <><span>·</span><span>{date}</span></>}
                      </div>
                      <h3 className="mt-3 font-display text-xl leading-snug">{b.title}</h3>
                      <p className="mt-2 text-sm text-slate-soft leading-relaxed">{b.excerpt}</p>
                    </div>
                  </motion.article>
                </Link>
              </Reveal>
              );
            })}
          </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative py-28 bg-secondary">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <Reveal className="text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">FAQs</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Good questions, frank answers.</h2>
          </Reveal>

          {faqs.length > 0 && (
          <div className="mt-12 space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.id} delay={i}>
                <motion.details className="group rounded-2xl bg-white border border-border p-6 open:shadow-soft transition-all" whileHover={{ scale: 1.01 }}>
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-6">
                    <h3 className="font-display text-lg">{f.question}</h3>
                    <motion.span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-primary" whileHover={{ rotate: 45, scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}>+</motion.span>
                  </summary>
                  <p className="mt-4 text-sm text-slate-soft leading-relaxed">{f.answer}</p>
                </motion.details>
              </Reveal>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[2rem] gradient-hero p-12 md:p-16 text-white">
            <div className="absolute inset-0 blueprint-grid opacity-[0.1]" aria-hidden />

            {/* 3D floating elements inside CTA */}
            <FloatingCube size={60} delay={0} top="10%" left="70%" speed={18} />
            <FloatingRing size={100} delay={2} top="50%" left="85%" />
            <FloatingCube size={35} delay={4} top="60%" left="65%" speed={14} color="rgba(255,255,255,0.1)" />

            {/* Animated gradient orb */}
            <motion.div
              className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <motion.h2
                  className="font-display text-3xl md:text-5xl leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Let's draw the first line, together.
                </motion.h2>
                <p className="mt-4 text-white/85 max-w-xl">Tell us about your site or space. We'll set up a 30-minute discovery call — no commitment, just clarity.</p>
              </div>
              <div className="flex md:justify-end gap-3 flex-wrap">
                <GlowButton
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_45px_rgba(255,255,255,0.5)] transition-shadow"
                >
                  Book consultation
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </GlowButton>

                <MagneticButton
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/30 px-6 py-3.5 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                >
                  Call studio
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
