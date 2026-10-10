import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
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
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Subtle scroll parallax: maximum ~50-60px movement, moves slower than scroll
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0px", "0px"] : ["0px", "55px"]
  );

  return (
    <section
      ref={heroRef}
      className="relative min-h-[500px] sm:min-h-[660px] lg:min-h-[700px] overflow-hidden bg-[#0a2342] pt-20 pb-8 sm:pt-24 sm:pb-12 text-white flex flex-col justify-between max-sm:aspect-[1983/793] max-sm:min-h-0 max-sm:h-auto max-sm:pt-0 max-sm:pb-0 mt-[104px] sm:mt-[132px] md:mt-0 max-md:!mt-[82px] max-md:sm:!mt-[92px] max-sm:overflow-hidden"
    >
      {/* Fixed Background Image Container */}
      <motion.div
        style={{ y: backgroundY }}
        initial={
          shouldReduceMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: 0.95, scale: 1.06 }
        }
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <img
          src="/images/hero-baneer-const.png"
          alt="Underground sewer pipeline installation, excavator and workers on site"
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover object-center pointer-events-none select-none"
        />
      </motion.div>

      {/* Main Content Area (Vertically centered) */}
      <div className="site-container relative z-10 flex flex-1 flex-col justify-center py-6 sm:py-10 lg:py-12 max-sm:py-0 max-sm:h-full max-sm:justify-center">
        <div className="max-w-[560px] min-h-[320px] sm:min-h-[440px] flex flex-col justify-center items-center sm:items-start text-center sm:text-left max-sm:min-h-0 max-sm:max-w-[39vw] max-sm:items-start max-sm:text-left">
          {/* =========================================================
              BRAND LOGO HERO (Permanent Static Display)
              ========================================================= */}
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.94 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="will-change-transform flex flex-col justify-center items-center sm:items-start max-sm:items-start"
          >
            {/* Large Company Logo as the only visible element */}
            <img
              src="/logo.png"
              alt="Hariputhran Enterprises - Underground Sewerage & Infrastructure Contractor Chennai"
              className="w-[225px] min-[375px]:w-[250px] sm:w-[280px] lg:w-[305px] xl:w-[315px] h-auto object-contain drop-shadow-2xl max-sm:w-[21vw]"
            />

            {/* Semantic H1 for Search Engines & Accessibility */}
            <h1 className="sr-only">
              Underground Sewerage &amp; Infrastructure Solutions in Chennai
            </h1>

            {/*
              // =======================================================
              // Future Hero Content (Currently Disabled)
              // Heading, Subheading, Description, Tagline, Service
              // Highlights, and CTA Buttons preserved below for future
              // easy reactivation without rebuilding the section.
              // =======================================================

              // Eyebrow / Tagline:
              // <div className="mt-4 inline-flex items-center gap-2.5 font-mono text-sm sm:text-base lg:text-[17px] font-bold uppercase tracking-[2px] text-[#f97316]">
              //   <span className="h-[3px] w-7 bg-[#f97316] rounded-full" />
              //   UNDERGROUND INFRASTRUCTURE SOLUTIONS
              // </div>

              // Main Heading:
              // <h1 className="mt-3 font-['Poppins',sans-serif] text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[46px] leading-[1.12]">
              //   Building the <br />
              //   Infrastructure <br />
              //   Beneath <span className="text-[#f97316]">Every City</span>
              // </h1>

              // Description:
              // <p className="mt-4 max-w-[500px] text-sm sm:text-base lg:text-[17px] leading-relaxed text-slate-100">
              //   We specialize in underground sewerage, drainage, pipeline and civil works, creating a cleaner, safer and better tomorrow.
              // </p>

              // CTA Buttons:
              // <div className="mt-6 flex flex-wrap items-center gap-3.5">
              //   <Button
              //     asChild
              //     className="h-10 rounded-full bg-[#f97316] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#ea580c] hover:scale-[1.02]"
              //   >
              //     <Link to="/service">
              //       Our Services <ArrowRight className="ml-1.5 size-4" />
              //     </Link>
              //   </Button>
              //   <Button
              //     asChild
              //     variant="outline"
              //     className="h-10 rounded-full border-white/50 bg-transparent px-6 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs transition-all hover:bg-white hover:text-[#082342]"
              //   >
              //     <a href="#projects">View Projects</a>
              //   </Button>
              // </div>

              // Service Highlights:
              // <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:text-sm text-slate-200">
              //   <div>• Underground Sewerage Networks</div>
              //   <div>• Stormwater Drainage Systems</div>
              //   <div>• Civil Utility Pipelines</div>
              //   <div>• Road Restoration Projects</div>
              // </div>
            */}
          </motion.div>
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-[#F5FAFF] py-12 sm:py-16 lg:py-24 overflow-hidden" id="services">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] lg:gap-10 xl:gap-12 lg:items-start">
          {/* Left Side Header */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 font-mono text-sm sm:text-base lg:text-[17px] font-bold uppercase tracking-wider text-[#0284c7] will-change-transform"
            >
              <span className="h-[3px] w-7 bg-[#f97316] rounded-full" />
              OUR SERVICES
            </motion.div>
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
              className="mt-3 font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#082342] sm:text-3xl lg:text-[36px] leading-tight will-change-transform"
            >
              Comprehensive Infrastructure Solutions
            </motion.h2>
            <motion.p
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
              className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 text-left sm:text-justify hyphens-auto will-change-transform"
            >
              From underground sewerage networks to road restoration, we deliver end-to-end civil engineering services with precision and expertise.
            </motion.p>
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.3, ease: "easeOut" }}
              className="mt-6 sm:mt-7 will-change-transform"
            >
              <Button
                asChild
                className="h-11 w-full min-[480px]:w-auto justify-center rounded-full bg-[#082342] px-7 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#0284c7]"
              >
                <Link to="/service">
                  Explore All Services <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Side 8 Service Cards (Staggered 80ms increments) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4.5">
            {servicesData.map((item, index) => {
              const Icon = item.icon;
              const delay = index * 0.08;
              return (
                <motion.div
                  key={item.title}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 25, scale: 0.97 }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay, ease: "easeOut" }}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(2,132,199,0.05)] transition-all duration-300 hover:md:-translate-y-[5px] hover:border-[#f97316]/50 hover:shadow-xl will-change-transform"
                >
                  {/* Top Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      width={400}
                      height={250}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
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
                </motion.div>
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative border-t border-sky-100/70 bg-[#F5FAFF] py-12 sm:py-16 lg:py-24 overflow-hidden">
      {/* Decorative clean city blueprint skyline on right background */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-full w-1/2 opacity-25 bg-[radial-gradient(#0284c7_0.75px,transparent_0.75px)] [background-size:16px_16px]" />

      <div className="site-container relative z-10">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left: Image Side (Split reveal: translateX(-35px) -> 0, duration 0.8s) */}
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: -35 }
            }
            whileInView={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, x: 0 }
            }
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none will-change-transform"
          >
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-1.5 sm:p-2 shadow-xl">
              <img
                src="/images/why-choose-us.jpg"
                alt="Brick manhole construction and underground civil works execution"
                loading="lazy"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg sm:rounded-xl object-contain"
              />
              <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 rounded-full bg-[#082342]/85 px-3 py-1 sm:px-4 sm:py-1.5 font-mono text-[11px] sm:text-xs font-semibold text-white shadow backdrop-blur-xs">
                Our Work in Action
              </div>
            </div>
          </motion.div>

          {/* Right: Content Side (Split reveal: translateX(35px) -> 0, duration 0.8s, delay 0.15s) */}
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: 35 }
            }
            whileInView={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, x: 0 }
            }
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="space-y-5 sm:space-y-6 will-change-transform"
          >
            <div className="inline-flex items-center gap-2.5 font-mono text-sm sm:text-base lg:text-[17px] font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-[3px] w-7 bg-[#f97316] rounded-full" />
              WHY CHOOSE US
            </div>

            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#082342] sm:text-3xl lg:text-[38px] leading-tight">
              Trusted Partner for <br />
              Lasting Infrastructure
            </h2>

            <p className="text-sm sm:text-base lg:text-[16px] leading-relaxed text-slate-600 max-md:text-justify max-md:[text-align-last:left] max-md:[text-justify:inter-word]">
              We bring experience, technology and a dedicated team to deliver high-quality civil works that meet municipal and client standards.
            </p>

            {/* Bullets: Staggered delays: 0.30s, 0.40s, 0.50s, 0.60s */}
            <div className="space-y-3 sm:space-y-3.5 pt-1">
              {[
                { title: "Skilled & Experienced Workforce", delay: 0.3 },
                { title: "Use of Quality Materials", delay: 0.4 },
                { title: "Adherence to Safety Standards", delay: 0.5 },
                { title: "Timely Project Completion", delay: 0.6 },
              ].map((point) => (
                <motion.div
                  key={point.title}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 15 }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: point.delay, ease: "easeOut" }}
                  className="flex items-center gap-3 sm:gap-3.5 will-change-transform"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#f97316]/15 text-[#f97316]">
                    <Check className="size-4 stroke-[3]" />
                  </span>
                  <span className="text-xs min-[375px]:text-sm sm:text-base font-semibold text-slate-800">
                    {point.title}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Brand Statement: Animate entire line together: opacity: 0 -> 1, scale: 0.98 -> 1, duration: 0.7s */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.98 }
              }
              whileInView={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1 }
              }
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
              className="pt-2 text-center sm:text-right will-change-transform"
            >
              <p className="font-serif italic text-xs sm:text-sm text-[#0284c7]">
                Cleaner Cities • Healthier Communities • Stronger Future
              </p>
            </motion.div>
          </motion.div>
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
  const shouldReduceMotion = useReducedMotion();
  const [items, setItems] = useState<RecentWorkItem[]>([]);
  const [sectionActive, setSectionActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollerRef.current) return;
    const el = scrollerRef.current;
    const children = Array.from(el.children) as HTMLElement[];
    if (!children.length) return;
    const scrollerCenter = el.scrollLeft + el.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(scrollerCenter - childCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    });
    setActiveIndex(closestIndex);
  };

  const scrollToCard = (index: number) => {
    if (!scrollerRef.current) return;
    const children = Array.from(scrollerRef.current.children) as HTMLElement[];
    const target = children[index];
    if (target) {
      target.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadRecentWorks() {
      try {
        const rawApiUrl = ((import.meta.env["VITE_API_URL"] as string) || "").replace(/\/$/, "");
        const res = await fetch(`${rawApiUrl}/api/recent-works`, {
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (!res.ok) {
          console.warn("Recent Works: using fallback content, API status:", res.status);
          if (isMounted) setFetchFailed(true);
          return;
        }
        const json = await res.json();
        if (isMounted) {
          if (json.sectionActive === false) {
            setSectionActive(false);
          } else {
            setSectionActive(true);
          }

          if (json.success && Array.isArray(json.data)) {
            // Sort by position 1..4
            const sorted = [...json.data].sort((a, b) => (a.position || a.id) - (b.position || b.id));
            setItems(sorted);
            setFetchFailed(false);
          } else {
            setFetchFailed(true);
          }
        }
      } catch (err) {
        console.warn("Recent Works: using fallback content", err);
        if (isMounted) setFetchFailed(true);
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

  // If section is toggled off or has 0 active cards, do not render the whole Recent Works section
  if (!loading && !fetchFailed && (!sectionActive || items.length === 0)) {
    return null;
  }

  const renderedCount = loading
    ? 4
    : !fetchFailed && items.length > 0
    ? items.length
    : projectsData.length;

  return (
    <section className="bg-[#F5FAFF] py-12 sm:py-16 lg:py-24 pb-14 sm:pb-16 md:pb-16 lg:pb-24 overflow-hidden border-t border-sky-100/70" id="projects">
      <div className="site-container">
        {/* Header */}
        <div>
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 font-mono text-sm sm:text-base lg:text-[17px] font-bold uppercase tracking-wider text-[#0284c7] will-change-transform"
          >
            <span className="h-[3px] w-7 bg-[#f97316] rounded-full" />
            OUR PROJECTS
          </motion.div>
          <motion.h2
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            className="mt-2 font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#082342] sm:text-3xl lg:text-[36px] will-change-transform"
          >
            Recent Works
          </motion.h2>
        </div>

        {/* Responsive Container: Horizontal Scroller with snap on mobile (<md), Grid on desktop (>=md) */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          role="region"
          aria-label="Recent works, swipe horizontally"
          tabIndex={0}
          className="mt-8 sm:mt-10 flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain gap-4 -mx-4 px-4 sm:-mx-6 sm:px-6 scroll-px-4 sm:scroll-px-6 pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0284c7] rounded-xl md:mt-10 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5 md:mx-0 md:px-0 md:pb-0 md:pt-0 md:overflow-visible md:snap-none md:scroll-px-0 md:ring-0 md:focus-visible:ring-0"
        >
          {loading ? (
            /* Loading Skeletons */
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[82%] min-[480px]:w-[70%] shrink-0 snap-start md:w-auto md:shrink md:snap-none flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(2,132,199,0.05)] animate-pulse"
              >
                <div className="aspect-[4/3] w-full bg-slate-100" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3.5 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            ))
          ) : !fetchFailed && items.length > 0 ? (
            /* Dynamic API Cards */
            items.map((project, idx) => {
              const delay = idx * 0.1;
              return (
                <motion.div
                  key={project.id}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 30 }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay, ease: "easeOut" }}
                  className="w-[82%] min-[480px]:w-[70%] shrink-0 snap-start md:w-auto md:shrink md:snap-none group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(2,132,199,0.05)] transition-all duration-300 hover:md:-translate-y-1 hover:shadow-xl will-change-transform"
                >
                  {/* Image Container with entrance scale: 1.04 -> 1, hover: scale 1.05 */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <motion.img
                      initial={
                        shouldReduceMotion
                          ? { scale: 1 }
                          : { scale: 1.04 }
                      }
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.8, delay, ease: "easeOut" }}
                      src={getRecentWorkImageSrc(project)}
                      alt={project.title}
                      loading="lazy"
                      width={600}
                      height={450}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => handleRecentWorkImageError(e, project.position || project.id)}
                    />
                  </div>

                  {/* Title & Location */}
                  <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
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
                </motion.div>
              );
            })
          ) : (
            /* Fallback Static Cards */
            projectsData.map((project, idx) => {
              const delay = idx * 0.1;
              return (
                <motion.div
                  key={project.title}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 30 }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay, ease: "easeOut" }}
                  className="w-[82%] min-[480px]:w-[70%] shrink-0 snap-start md:w-auto md:shrink md:snap-none group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(2,132,199,0.05)] transition-all duration-300 hover:md:-translate-y-1 hover:shadow-xl will-change-transform"
                >
                  {/* Image Container with entrance scale: 1.04 -> 1, hover: scale 1.05 */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <motion.img
                      initial={
                        shouldReduceMotion
                          ? { scale: 1 }
                          : { scale: 1.04 }
                      }
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.8, delay, ease: "easeOut" }}
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      width={600}
                      height={450}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => handleRecentWorkImageError(e, idx + 1)}
                    />
                  </div>

                  {/* Title & Location */}
                  <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
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
                </motion.div>
              );
            })
          )}
        </div>

        {/* Mobile Pagination Dots */}
        {renderedCount > 1 && (
          <div
            className="mt-6 flex items-center justify-center gap-1 md:hidden"
            aria-label="Project carousel pagination"
          >
            {Array.from({ length: renderedCount }).map((_, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToCard(idx)}
                  aria-label={`Show project ${idx + 1} of ${renderedCount}`}
                  aria-current={isActive ? "true" : undefined}
                  className="flex size-11 items-center justify-center rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0284c7] touch-manipulation"
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-6 bg-[#0284c7]"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
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
    const io = new IntersectionObserver((entries) => {
      if (entries[0]) setInView(entries[0].isIntersecting);
    }, { threshold: 0.25 });
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
    <section ref={sectionRef} className="bg-gradient-to-b from-[#F5FAFF] to-[#E0F1FC] py-12 sm:py-16 lg:py-24 border-t border-sky-100/70">
      <div className="site-container">
        {/* Header */}
        <div className="inline-flex items-center gap-2.5 font-mono text-sm sm:text-base lg:text-[17px] font-bold uppercase tracking-[2px] text-[#0375be]">
          <span className="h-[3px] w-7 bg-gradient-to-r from-[#fa6c16] to-[#d41a1b] rounded-full" />
          KEY STRENGTHS
        </div>
        <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl min-[375px]:text-3xl font-bold leading-[1.1] tracking-tight text-slate-800 sm:text-4xl lg:text-[44px]">
          Why Agencies &amp; Teams <br />
          Picks{" "}
          <span className="bg-gradient-to-r from-[#fa6c16] to-[#d41a1b] bg-clip-text text-transparent">
            HARIPUTHRAN.
          </span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">
          Ten disciplines that compound into reliable infrastructure delivery — on time, on spec, on budget.
        </p>

        {/* Cards */}
        <div
          className="mt-8 sm:mt-10 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4"
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
                className="group relative min-h-[155px] sm:min-h-[175px] cursor-pointer overflow-hidden rounded-xl border border-[#b5dff4] bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(3,117,190,0.06)] outline-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[active=true]:-translate-y-1 data-[active=true]:border-[#fa6c16]/60 data-[active=true]:shadow-[0_18px_40px_-12px_rgba(3,117,190,0.35)]"
              >
                {/* Image reveal layer: wipes up from the bottom when active */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[active=true]:[clip-path:inset(0_0_0_0)]"
                >
                  <img
                    src={item.image}
                    alt={`${item.title} - Hariputhran Enterprises key strengths`}
                    loading="lazy"
                    decoding="async"
                    className="size-full scale-110 object-cover transition-transform duration-700 ease-out group-data-[active=true]:scale-100"
                  />
                  {/* Overlay keeps text readable over the photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-[#0375be]/25" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <span className="grid size-9 sm:size-10 place-items-center rounded-lg bg-[#e6f3fb] text-[#0375be] transition-all duration-500 group-data-[active=true]:-rotate-6 group-data-[active=true]:scale-110 group-data-[active=true]:bg-gradient-to-br group-data-[active=true]:from-[#fa6c16] group-data-[active=true]:to-[#d41a1b] group-data-[active=true]:text-white group-data-[active=true]:shadow-[0_8px_20px_rgba(250,108,22,0.45)]">
                    <Icon className="size-4.5 sm:size-5" />
                  </span>
                  <h3 className="mt-3 sm:mt-4 text-sm sm:text-[15px] font-bold leading-snug text-slate-800 transition-colors duration-300 group-data-[active=true]:text-[#ffb26b]">
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
    <section className="bg-[#F5FAFF] py-12 sm:py-16 lg:py-20 border-t border-sky-100/70">
      <div className="site-container">
        <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-lg lg:grid lg:grid-cols-[1.1fr_1.5fr_1fr] lg:items-center">
          {/* Left: Engineering & Consultation Photo */}
          <div className="relative h-48 sm:h-64 lg:h-full lg:min-h-[220px] bg-slate-100">
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
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              LET'S BUILD TOGETHER
            </div>
            <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#082342] sm:text-3xl leading-tight">
              Need a Reliable Partner <br />for Your Project?
            </h2>
                          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 text-justify sm:text-left">
              Get in touch with us for expert consultation and customized solutions for your infrastructure needs.
            </p>
          </div>

          {/* Right: Contact Button & Details */}
          <div className="border-t border-slate-100 p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-8 flex flex-col justify-center gap-4">
            <Button
              asChild
              className="h-11 w-full min-[480px]:w-auto justify-center rounded-full bg-[#f97316] px-7 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#ea580c] hover:scale-[1.02]"
            >
              <Link to="/contact">
                Contact Us <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <div className="space-y-2 text-xs sm:text-[13px] font-medium text-slate-700">
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-[#0284c7] shrink-0" />
                <div className="flex flex-wrap gap-x-2">
                  <a href="tel:+917200333487" className="hover:text-[#f97316] transition-colors">+91 72003 33487</a>
                  <span>/</span>
                  <a href="tel:+919003221019" className="hover:text-[#f97316] transition-colors">+91 90032 21019</a>
                </div>
              </div>
              <p className="flex items-center gap-2.5">
                <Mail className="size-4 text-[#0284c7] shrink-0" />
                <a href="mailto:anand@hariputhranenterprises.com" className="hover:text-[#f97316] transition-colors break-all">
                  anand@hariputhranenterprises.com
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin className="size-4 text-[#0284c7] shrink-0" />
                <span>Kodungaiyur, Chennai - 600118</span>
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
      <div className="bg-[#F5FAFF] min-h-screen">
        <HomeHero />
        <ServicesSection />
        <WhyChooseUs />
        <ProjectsSection />
        <StrengthsSection />
        <ContactCTA />
      </div>
    </PageFrame>
  );
}
