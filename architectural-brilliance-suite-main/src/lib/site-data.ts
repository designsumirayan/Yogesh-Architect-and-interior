import heroImg from "@/assets/hero-architecture.jpg";
import livingImg from "@/assets/interior-living.jpg";
import commercialImg from "@/assets/project-commercial.jpg";
import villaImg from "@/assets/project-villa.jpg";
import kitchenImg from "@/assets/project-kitchen.jpg";
import bedroomImg from "@/assets/project-bedroom.jpg";
import blueprintImg from "@/assets/about-blueprint.jpg";
import restaurantImg from "@/assets/project-restaurant.jpg";

export const IMG = {
  hero: heroImg,
  living: livingImg,
  commercial: commercialImg,
  villa: villaImg,
  kitchen: kitchenImg,
  bedroom: bedroomImg,
  blueprint: blueprintImg,
  restaurant: restaurantImg,
};

export const SERVICES = [
  {
    slug: "residential-architecture",
    title: "Residential Architecture",
    short: "Bespoke homes designed around your lifestyle, climate, and site.",
    icon: "🏠",
  },
  {
    slug: "commercial-architecture",
    title: "Commercial Architecture",
    short: "Workspaces, retail, and hospitality built for brand and function.",
    icon: "🏢",
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    short: "Refined interiors with materials, light, and proportion in harmony.",
    icon: "🛋️",
  },
  {
    slug: "house-planning",
    title: "House Planning",
    short: "Vastu-aware planning that balances flow, daylight, and privacy.",
    icon: "📐",
  },
  {
    slug: "2d-floor-plans",
    title: "2D Floor Plans",
    short: "Precise, construction-ready drawings with optimized circulation.",
    icon: "📄",
  },
  {
    slug: "3d-elevation",
    title: "3D Elevation",
    short: "Photoreal exterior visualizations to preview your dream facade.",
    icon: "🧱",
  },
  {
    slug: "modular-kitchen",
    title: "Modular Kitchen",
    short: "Ergonomic, premium modular kitchens crafted for daily delight.",
    icon: "🍳",
  },
  {
    slug: "false-ceiling",
    title: "False Ceiling Design",
    short: "Sculpted ceilings with integrated lighting and acoustic comfort.",
    icon: "💡",
  },
  {
    slug: "landscape-design",
    title: "Landscape Design",
    short: "Gardens, courtyards, and outdoor rooms that breathe with the home.",
    icon: "🌿",
  },
  {
    slug: "renovation",
    title: "Renovation",
    short: "Thoughtful renewal of existing spaces with minimal disruption.",
    icon: "🔨",
  },
  {
    slug: "construction-consultation",
    title: "Construction Consultation",
    short: "Expert guidance on materials, costs, contractors, and timelines.",
    icon: "📋",
  },
  {
    slug: "turnkey-projects",
    title: "Turnkey Projects",
    short: "Single-point delivery from concept to handover, fully managed.",
    icon: "🔑",
  },
] as const;

export const PROJECTS = [
  {
    slug: "serene-villa-gomti",
    title: "Serene Villa, Gomti Nagar",
    category: "Residential",
    location: "Lucknow",
    year: "2024",
    image: IMG.villa,
    summary: "A 6,200 sq.ft. private residence with cascading volumes and a reflective pool court.",
  },
  {
    slug: "corporate-tower-hazratganj",
    title: "Corporate Tower, Hazratganj",
    category: "Commercial",
    location: "Lucknow",
    year: "2024",
    image: IMG.commercial,
    summary: "A 9-storey ‘A-grade’ office tower clad in fritted glass with shaded sky-lobbies.",
  },
  {
    slug: "skyline-penthouse",
    title: "Skyline Penthouse",
    category: "Interior",
    location: "Lucknow",
    year: "2023",
    image: IMG.living,
    summary: "Double-height living with a curated palette of marble, oak, and lapis blue.",
  },
  {
    slug: "walnut-modular-kitchen",
    title: "Walnut Modular Kitchen",
    category: "Interior",
    location: "Indira Nagar",
    year: "2024",
    image: IMG.kitchen,
    summary: "Handle-less walnut cabinetry, Calacatta island, and integrated appliances.",
  },
  {
    slug: "azure-master-suite",
    title: "Azure Master Suite",
    category: "Interior",
    location: "Aliganj",
    year: "2023",
    image: IMG.bedroom,
    summary: "Quiet luxury master bedroom in soft blues, with a custom wall-paneled headboard.",
  },
  {
    slug: "indigo-bistro",
    title: "Indigo Bistro",
    category: "Commercial",
    location: "Kanpur",
    year: "2024",
    image: IMG.restaurant,
    summary: "Hospitality interior pairing teak warmth with a signature indigo geometry.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Rohan Mehrotra",
    role: "Homeowner, Gomti Nagar",
    quote:
      "Yogesh and his team translated a loose vision into a home that feels effortlessly ours. Every detail — from daylight to door handles — was considered.",
  },
  {
    name: "Aanya Verma",
    role: "Director, Verma Holdings",
    quote:
      "Our headquarters was delivered on time, on budget, and on brand. Their planning rigor and material curation are exceptional.",
  },
  {
    name: "Dr. Sameer Khan",
    role: "Clinic Owner, Hazratganj",
    quote:
      "A turnkey experience in the truest sense. They handled architecture, interiors, and execution while we focused on patients.",
  },
];

export const PROCESS = [
  { step: "01", title: "Discovery", body: "We listen — to site, brief, budget, and the way you live or work." },
  { step: "02", title: "Concept", body: "Sketches, massing studies, and mood boards converge into a clear design intent." },
  { step: "03", title: "Design", body: "Layered drawings, 3D elevations, and material palettes refined with you." },
  { step: "04", title: "Build", body: "Construction documentation, vendor coordination, and rigorous site supervision." },
  { step: "05", title: "Handover", body: "Snag-free delivery, walkthroughs, and a one-year care commitment." },
];

export const FAQS = [
  {
    q: "What areas do you serve?",
    a: "We are based in Lucknow and undertake projects across Uttar Pradesh — including Kanpur, Varanasi, Prayagraj, and Noida — with select pan-India commissions.",
  },
  {
    q: "Do you offer turnkey delivery?",
    a: "Yes. We offer a complete turnkey service covering architecture, interiors, MEP coordination, vendor management, and site supervision through handover.",
  },
  {
    q: "How are fees structured?",
    a: "Design fees are typically a percentage of project cost or a per-sq.ft. rate, depending on scope. We share a transparent fee proposal after the discovery call.",
  },
  {
    q: "How long does a typical home take?",
    a: "A 4,000–6,000 sq.ft. residence usually takes 10–14 months from concept to handover, with design taking ~3 months and construction the remainder.",
  },
  {
    q: "Can you work with my existing contractor?",
    a: "Absolutely. We collaborate with your contractor, or recommend a vetted partner from our network if preferred.",
  },
];

export const BLOG = [
  {
    slug: "designing-for-lucknow-climate",
    title: "Designing for Lucknow’s Climate: Light, Shade, and Air",
    excerpt: "How passive strategies — courtyards, jaalis, and orientation — keep homes cool without over-relying on HVAC.",
    date: "March 12, 2025",
    image: IMG.villa,
    tag: "Architecture",
  },
  {
    slug: "modular-kitchen-buyers-guide",
    title: "A Buyer’s Guide to Modular Kitchens",
    excerpt: "From carcass quality to hinge brands — what actually matters when you invest in a modular kitchen.",
    date: "February 28, 2025",
    image: IMG.kitchen,
    tag: "Interiors",
  },
  {
    slug: "quiet-luxury-interiors",
    title: "Quiet Luxury: Designing Interiors that Whisper",
    excerpt: "A material-first approach to interiors that age beautifully and reward closer looking.",
    date: "February 4, 2025",
    image: IMG.bedroom,
    tag: "Interiors",
  },
];
