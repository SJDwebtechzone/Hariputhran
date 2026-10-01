import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Check,
  HardHat,
  Award,
  Landmark,
  Workflow,
  BadgeCheck,
  Coins,
  Lightbulb,
  Handshake,
  TrendingUp,
  FileCheck2,
} from "lucide-react";
import { PageFrame } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import {
  getRecentWorkImageSrc,
  handleRecentWorkImageError,
} from "@/utils/recentWorkImage";
import type { RecentWorkItem } from "@/types/recentWork";

/* =========================================================================
   CUSTOM ICONS MATCHING REFERENCE
   ========================================================================= */
function SewerageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m8 17 4 4 4-4" />
    </svg>
  );
}

function DrainageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function PipelineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 7h18" />
      <path d="M3 17h18" />
      <path d="M18 7v10" />
      <path d="M6 7v10" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ManholeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 22 22 22" />
      <path d="M12 11v4" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function ChamberIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function RehabilitationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m2 22 1-1h3l9-9" />
      <path d="M3 21v-3l9-9" />
      <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9" />
    </svg>
  );
}

function RoadCuttingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function PumpingStationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <circle cx="12" cy="9" r="2" />
    </svg>
  );
}

/* =========================================================================
   SECTION 1 — HERO SECTION
   ========================================================================= */
export function HomeHero() {
  return (
    <section className="relative min-h-[620px] sm:min-h-[660px] lg:min-h-[700px] overflow-hidden bg-[#0a2342] pt-20 sm:pt-24 text-white flex flex-col justify-between">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-baneer-const.png"
          alt="Underground sewer pipeline installation, excavator and workers on site"
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover object-center"
        />
      </div>

      {/* Main Content Area */}
      <div className="site-container relative z-10 flex flex-1 flex-col justify-center py-6 sm:py-10 lg:py-12">
        <div className="max-w-[540px]">
          {/* Small Eyebrow Label with Orange Accent Bar */}
          <div className="inline-flex items-center gap-2.5 font-mono text-sm sm:text-base lg:text-[17px] font-bold uppercase tracking-[2px] text-[#f97316]">
            <span className="h-[3px] w-7 bg-[#f97316] rounded-full" />
            UNDERGROUND INFRASTRUCTURE SOLUTIONS
          </div>

          {/* Main Heading */}
          <h1 className="mt-3 font-['Poppins',sans-serif] text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[46px] leading-[1.12]">
            Building the <br />
            Infrastructure <br />
            Beneath <span className="text-[#f97316]">Every City</span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-[500px] text-sm sm:text-base lg:text-[17px] leading-relaxed text-slate-100">
            We specialize in underground sewerage, drainage, pipeline and civil works, creating a cleaner, safer and better tomorrow.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <Button
              asChild
              className="h-10 rounded-full bg-[#f97316] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#ea580c] hover:scale-[1.02]"
            >
              <Link to="/service">
                Our Services <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-full border-white/50 bg-transparent px-6 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs transition-all hover:bg-white hover:text-[#082342]"
            >
              <a href="#projects">View Projects</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 2 — SERVICES (Matching Reference 2-column Grid)
   ========================================================================= */
export const servicesData = [
  {
    icon: SewerageIcon,
    title: "Sewerage Works",
    desc: "Underground sewer line installation & repair",
    image: "/images/os/os-sewerage.jpg",
  },
  {
    icon: DrainageIcon,
    title: "Drainage Works",
    desc: "Storm water & surface drainage systems",
    image: "/images/os/os-drainage.jpg",
  },
  {
    icon: PipelineIcon,
    title: "Pipeline Laying",
    desc: "Water, sewer & utility pipeline networks",
    image: "/images/os/os-pipeline.jpg",
  },
  {
    icon: ManholeIcon,
    title: "Manhole Construction",
    desc: "Inspection & maintenance manholes",
    image: "/images/os/os-manhole.jpg",
  },
  {
    icon: ChamberIcon,
    title: "Chamber Construction",
    desc: "Connection & junction chambers",
    image: "/images/os/os-chamber.jpg",
  },
  {
    icon: RehabilitationIcon,
    title: "Rehabilitation Works",
    desc: "Existing line repair & upgradation",
    image: "/images/os/os-rehabilitation.jpg",
  },
  {
    icon: RoadCuttingIcon,
    title: "Road Cutting & Restoration",
    desc: "Safe cutting & road reinstatement",
    image: "/images/os/os-road.jpg",
  },
  {
    icon: PumpingStationIcon,
    title: "Pumping Station Works",
    desc: "Sewage pumping station installation",
    image: "/images/os/os-pump.jpg",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-white py-16 lg:py-24" id="services">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] lg:gap-10 xl:gap-12 lg:items-start">
          {/* Left Side Header */}
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              OUR SERVICES
            </div>
            <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#082342] sm:text-3xl lg:text-[36px] leading-tight">
              Comprehensive Infrastructure Solutions
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
              From underground sewerage networks to road restoration, we deliver end-to-end civil engineering services with precision and expertise.
            </p>
            <div className="mt-7">
              <Button
                asChild
                className="h-11 rounded-full bg-[#082342] px-7 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#0284c7]"
              >
                <Link to="/service">
                  Explore All Services <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Side 8 Service Cards (4x2 grid style) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4.5">
            {servicesData.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-[#f8fbff] shadow-[0_2px_10px_rgba(2,132,199,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#f97316]/50 hover:bg-white hover:shadow-lg"
                >
                  {/* Top Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      width={400}
                      height={250}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2.5 right-2.5 grid size-8 place-items-center rounded-lg bg-white/95 text-[#0284c7] shadow-sm transition-all group-hover:bg-[#f97316] group-hover:text-white">
                      <Icon className="size-4" />
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col justify-between p-4 text-left">
                    <div>
                      <h3 className="text-sm sm:text-[15px] font-bold text-[#082342] group-hover:text-[#0284c7] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 3 — WHY CHOOSE US (With Skyline graphic / Water in Action)
   ========================================================================= */
export function WhyChooseUs() {
  return (
    <section className="relative border-t border-slate-100 bg-[#f8fbff] py-16 lg:py-24 overflow-hidden">
      {/* Decorative clean city blueprint skyline on right background */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-full w-1/2 opacity-25 bg-[radial-gradient(#0284c7_0.75px,transparent_0.75px)] [background-size:16px_16px]" />

      <div className="site-container relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left: Circular Brick Manhole Photo */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <img
                src="/images/why-choose-us.jpg"
                alt="Brick manhole construction and underground civil works execution"
                loading="lazy"
                width={800}
                height={600}
                className="w-full h-auto rounded-xl object-contain"
              />
              <div className="absolute bottom-5 right-5 rounded-full bg-[#082342]/85 px-4 py-1.5 font-mono text-xs font-semibold text-white shadow backdrop-blur-xs">
                Our Work in Action
              </div>
            </div>
          </div>

          {/* Right: Content & Checklist & Banner note */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              WHY CHOOSE US
            </div>

            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#082342] sm:text-3xl lg:text-[38px] leading-tight">
              Trusted Partner for <br />
              Lasting Infrastructure
            </h2>

            <p className="text-sm sm:text-base lg:text-[16px] leading-relaxed text-slate-600">
              We bring experience, technology and a dedicated team to deliver high-quality civil works that meet municipal and client standards.
            </p>

            <div className="space-y-3.5 pt-1">
              {[
                "Skilled & Experienced Workforce",
                "Use of Quality Materials",
                "Adherence to Safety Standards",
                "Timely Project Completion",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3.5">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#f97316]/15 text-[#f97316]">
                    <Check className="size-4 stroke-[3]" />
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-slate-800">{point}</span>
                </div>
              ))}
            </div>

            {/* Handwritten callout note like reference */}
            <div className="pt-2 text-right">
              <p className="font-serif italic text-xs sm:text-sm text-[#0284c7]">
                Cleaner Cities • Healthier Communities • Stronger Future
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 4 — RECENT PROJECTS (4 High-Quality Cards in Row)
   ========================================================================= */
export const projectsData = [
  {
    title: "Sewer Manhole Construction",
    category: "Underground Infrastructure",
    location: "Kaveri Nagar, Chennai",
    image: "/images/recents/sewer.jpg",
  },
  {
    title: "Manhole Chamber Works",
    category: "Utility Chambers",
    location: "Avvai Nagar, Chennai",
    image: "/images/recents/manhole.jpg",
  },
  {
    title: "Pipeline Laying",
    category: "Sewer & Water Mains",
    location: "Kodungaiyur, Chennai",
    image: "/images/recents/pipeline.jpg",
  },
  {
    title: "Road Restoration",
    category: "Civil Reinstatement",
    location: "Soliman Colony, Vyasarpadi",
    image: "/images/recents/road.jpg",
  },
];

export function ProjectsSection() {
  const [items, setItems] = useState<RecentWorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadRecentWorks() {
      try {
        const rawApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
        const res = await fetch(`${rawApiUrl}/api/recent-works`, {
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (!res.ok) {
          console.warn("Recent Works: using fallback content, API status:", res.status);
          return;
        }
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
          // Sort by position 1..4
          const sorted = [...json.data].sort((a, b) => (a.position || a.id) - (b.position || b.id));
          setItems(sorted);
        }
      } catch (err) {
        console.warn("Recent Works: using fallback content", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRecentWorks();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-16 lg:py-24" id="projects">
      <div className="site-container">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              OUR PROJECTS
            </div>
            <h2 className="mt-2 font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#082342] sm:text-3xl lg:text-[36px]">
              Recent Works
            </h2>
          </div>
          <Link
            to="/service"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7] hover:text-[#f97316] transition-colors"
          >
            View All Projects <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            /* Loading Skeletons */
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_2px_10px_rgba(2,132,199,0.04)] animate-pulse"
              >
                <div className="aspect-[4/3] w-full bg-slate-100" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3.5 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            ))
          ) : items.length > 0 ? (
            /* Dynamic API Cards */
            items.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_2px_10px_rgba(2,132,199,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={getRecentWorkImageSrc(project)}
                    alt={project.title}
                    loading="lazy"
                    width={600}
                    height={450}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => handleRecentWorkImageError(e, project.position || project.id)}
                  />
                </div>

                {/* Title & Location */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#082342] group-hover:text-[#0284c7] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs sm:text-[13px] text-slate-600">
                      <MapPin className="size-3.5 text-[#0284c7] shrink-0" />
                      {project.location}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Fallback Static Cards */
            projectsData.map((project, idx) => (
              <div
                key={project.title}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_2px_10px_rgba(2,132,199,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    width={600}
                    height={450}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => handleRecentWorkImageError(e, idx + 1)}
                  />
                </div>

                {/* Title & Location */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#082342] group-hover:text-[#0284c7] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs sm:text-[13px] text-slate-600">
                      <MapPin className="size-3.5 text-[#0284c7] shrink-0" />
                      {project.location}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 5 — KEY STRENGTHS (image reveal on hover + auto hover)
   ========================================================================= */
export const strengthsData = [
  { icon: Landmark, title: "Government Project Expertise", desc: "Expertise in complex government tenders.", image: "/images/key-strengths/Government.png" },
  { icon: Workflow, title: "Efficient Project Management", desc: "Strategic planning and execution.", image: "/images/key-strengths/efficient.jpg" },
  { icon: Users, title: "Skilled Workforce", desc: "Professional and dedicated team.", image: "/images/key-strengths/Skilled.jpg" },
  { icon: BadgeCheck, title: "Quality Assurance", desc: "Uncompromising quality standards.", image: "/images/key-strengths/quality.jpg" },
  { icon: Coins, title: "Cost Efficiency", desc: "Maximum value through optimisation.", image: "/images/key-strengths/cost.jpg" },
  { icon: HardHat, title: "On-Ground Expertise", desc: "Decades of field knowledge.", image: "/images/key-strengths/onground.jpg" },
  { icon: Lightbulb, title: "Visionary Leadership", desc: "Guided by industry veterans.", image: "/images/key-strengths/visionary.jpg" },
  { icon: Handshake, title: "Client Relationship", desc: "Transparency and trust-based.", image: "/images/key-strengths/client.jpg" },
  { icon: TrendingUp, title: "Scalability", desc: "Ready for large-scale projects.", image: "/images/key-strengths/scalability.jpg" },
  { icon: FileCheck2, title: "Compliance", desc: "Ethical and documented practices.", image: "/images/key-strengths/Compliance.jpg" },
];

const AUTO_MS = 2600; // time each card stays highlighted in auto mode

export function StrengthsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(null); // user hover / focus
  const [auto, setAuto] = useState(0); // card highlighted automatically
  const [inView, setInView] = useState(false);

  // Only run the auto highlight while the section is on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto hover: cycle through the cards; pauses while the user hovers one
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!inView || hovered !== null || reduce) return;
    const id = setInterval(() => setAuto((i) => (i + 1) % strengthsData.length), AUTO_MS);
    return () => clearInterval(id);
  }, [inView, hovered]);

  const active = hovered ?? (inView ? auto : null);

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-white to-[#eaf6fd] py-16 lg:py-24">
      <div className="site-container">
        {/* Header */}
        <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-[2px] text-[#0375be]">
          <span className="h-0.5 w-6 bg-gradient-to-r from-[#fa6c16] to-[#d41a1b]" />
          KEY STRENGTHS
        </div>
        <h2 className="mt-3 font-['Poppins',sans-serif] text-3xl font-bold leading-[1.1] tracking-tight text-slate-800 sm:text-4xl lg:text-[44px]">
          Why agencies &amp; teams <br />
          pick{" "}
          <span className="bg-gradient-to-r from-[#fa6c16] to-[#d41a1b] bg-clip-text text-transparent">
            HARIPUTHRAN.
          </span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">
          Ten disciplines that compound into reliable infrastructure delivery — on time, on spec, on budget.
        </p>

        {/* Cards */}
        <div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
          onMouseLeave={() => setHovered(null)}
        >
          {strengthsData.map((item, i) => {
            const Icon = item.icon;
            const isActive = active === i;
            return (
              <div
                key={item.title}
                tabIndex={0}
                data-active={isActive}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className="group relative min-h-[175px] cursor-pointer overflow-hidden rounded-xl border border-[#b5dff4] bg-white p-5 shadow-[0_2px_10px_rgba(3,117,190,0.06)] outline-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[active=true]:-translate-y-1 data-[active=true]:border-[#fa6c16]/60 data-[active=true]:shadow-[0_18px_40px_-12px_rgba(3,117,190,0.35)]"
              >
                {/* Image reveal layer: wipes up from the bottom when active */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[active=true]:[clip-path:inset(0_0_0_0)]"
                >
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full scale-110 object-cover transition-transform duration-700 ease-out group-data-[active=true]:scale-100"
                  />
                  {/* Overlay keeps text readable over the photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-[#0375be]/25" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <span className="grid size-10 place-items-center rounded-lg bg-[#e6f3fb] text-[#0375be] transition-all duration-500 group-data-[active=true]:-rotate-6 group-data-[active=true]:scale-110 group-data-[active=true]:bg-gradient-to-br group-data-[active=true]:from-[#fa6c16] group-data-[active=true]:to-[#d41a1b] group-data-[active=true]:text-white group-data-[active=true]:shadow-[0_8px_20px_rgba(250,108,22,0.45)]">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-sm sm:text-[15px] font-bold leading-snug text-slate-800 transition-colors duration-300 group-data-[active=true]:text-[#ffb26b]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-slate-600 transition-colors duration-300 group-data-[active=true]:text-white/95">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 6 — CALL TO ACTION
   ========================================================================= */
export function ContactCTA() {
  return (
    <section className="bg-[#f8fbff] py-16 lg:py-20">
      <div className="site-container">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg lg:grid lg:grid-cols-[1.1fr_1.5fr_1fr] lg:items-center">
          {/* Left: Engineering & Consultation Photo */}
          <div className="relative h-full min-h-[220px] bg-slate-100">
            <img
              src="/images/contact.png"
              alt="Hariputhran Enterprises engineering consultation and infrastructure solutions"
              loading="lazy"
              width={800}
              height={600}
              className="size-full object-cover"
            />
          </div>

          {/* Center: Headline & Copy */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              LET'S BUILD TOGETHER
            </div>
            <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#082342] sm:text-3xl leading-tight">
              Need a Reliable Partner <br />for Your Project?
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
              Get in touch with us for expert consultation and customized solutions for your infrastructure needs.
            </p>
          </div>

          {/* Right: Contact Button & Details */}
          <div className="border-t border-slate-100 p-6 lg:border-l lg:border-t-0 lg:p-8 flex flex-col justify-center gap-4">
            <Button
              asChild
              className="h-11 rounded-full bg-[#f97316] px-7 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#ea580c] hover:scale-[1.02]"
            >
              <Link to="/contact">
                Contact Us <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <div className="space-y-2.5 text-xs sm:text-[13px] font-medium text-slate-700">
              <p className="flex items-center gap-2.5">
                <Phone className="size-4 text-[#0284c7] shrink-0" /> +91 98765 43210
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="size-4 text-[#0284c7] shrink-0" /> info@hariputhran.co.in
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin className="size-4 text-[#0284c7] shrink-0" /> Chennai, Tamil Nadu
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   HOME PAGE EXPORT
   ========================================================================= */
export function HomePage() {
  return (
    <PageFrame>
      <HomeHero />
      <ServicesSection />
      <WhyChooseUs />
      <ProjectsSection />
      <StrengthsSection />
      <ContactCTA />
    </PageFrame>
  );
}
