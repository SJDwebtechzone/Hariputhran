import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Droplets,
  Gauge,
  HardHat,
  Layers3,
  Milestone,
  Pipette,
  Settings,
  ShieldCheck,
  Timer,
  Wrench,
  Construction,
} from "lucide-react";

import { PageFrame } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceRequestDialog } from "@/components/services/ServiceRequestDialog";
import type { ServiceItemData } from "@/types/service";

const API_BASE = ((import.meta.env["VITE_API_URL"] as string) || (import.meta.env.DEV ? "http://localhost:5000" : "")).replace(/\/+$/, "");

/* =========================================================================
   IMAGE PATH CONSTANTS (Centralized for easy updating)
   ========================================================================= */

const HERO_BG_IMAGE = "/images/Service-banner.png";
const FEATURED_LEFT_IMAGE = "/images/hero-baneer-const.png";
const FEATURED_ARCH_1 = "/images/os/os-sewerage.jpg";
const FEATURED_ARCH_2 = "/images/os/os-pipeline.jpg";
const CLOSING_BANNER_BG = "/images/service-closing-banner.png";
const CORE_GROUP_IMAGE_1 = "/images/Underground Utility Infrastructure.jpg";
const CORE_GROUP_IMAGE_2 = "/images/Civil & Infrastructure Works.jpg";

/* =========================================================================
   CORE SERVICES DATA (Exact 8 services preserved)
   ========================================================================= */

export const coreServicesData = [
  {
    id: "sewerage-works",
    number: "01",
    title: "Sewerage Works",
    description: "Complete underground sewer network construction and installation.",
    image: "/images/os/os-sewerage.jpg",
    icon: Droplets,
  },
  {
    id: "drainage-works",
    number: "02",
    title: "Drainage Works",
    description: "Stormwater drainage systems for a cleaner and safer environment.",
    image: "/images/os/os-drainage.jpg",
    icon: Layers3,
  },
  {
    id: "pipeline-laying",
    number: "03",
    title: "Pipeline Laying",
    description: "Safe and efficient pipeline installation for water, gas and utility networks.",
    image: "/images/os/os-pipeline.jpg",
    icon: Pipette,
  },
  {
    id: "manhole-construction",
    number: "04",
    title: "Manhole Construction",
    description: "Durable manholes for seamless network maintenance.",
    image: "/images/os/os-manhole.jpg",
    icon: Construction,
  },
  {
    id: "chamber-construction",
    number: "05",
    title: "Chamber Construction",
    description: "Custom chamber solutions for utility and drainage systems.",
    image: "/images/os/os-chamber.jpg",
    icon: Milestone,
  },
  {
    id: "rehabilitation-works",
    number: "06",
    title: "Rehabilitation Works",
    description: "Restoring and renewing existing infrastructure for longer life.",
    image: "/images/os/os-rehabilitation.jpg",
    icon: Wrench,
  },
  {
    id: "road-cutting-restoration",
    number: "07",
    title: "Road Cutting & Restoration",
    description: "Precision road cutting and high-quality surface restoration.",
    image: "/images/os/os-road.jpg",
    icon: HardHat,
  },
  {
    id: "pumping-station-works",
    number: "08",
    title: "Pumping Station Works",
    description: "Efficient pumping solutions for effective water management.",
    image: "/images/os/os-pump.jpg",
    icon: Timer,
  },
];

export const coreServiceGroups = [
  {
    number: "01",
    title: "Underground Utility Construction",
    description:
      "We design-build and execute sewerage networks, storm-water drains and pipelines with precise levels, quality materials and strict safety practices. Every line is built to carry flow reliably for decades.",
    items: [
      "Sewerage Network Works",
      "Storm-Water Drainage Systems",
      "Pipeline Laying & Jointing",
      "Manhole & Chamber Construction",
    ],
    ctaText: "Request a Quote",
    image: CORE_GROUP_IMAGE_1,
    icon: Droplets,
  },
  {
    number: "02",
    title: "Rehabilitation & Civil Restoration",
    description:
      "We revive ageing infrastructure and restore roads after excavation. Our crews and equipment keep disruption low, so public roads are back in service quickly and finished properly.",
    items: [
      "Sewer & Drain Rehabilitation",
      "Road Cutting & Restoration",
      "Pumping Station Works",
      "Supporting Civil Works",
    ],
    ctaText: "Discuss Your Project",
    image: CORE_GROUP_IMAGE_2,
    icon: Construction,
  },
];

/* =========================================================================
   WORK PROCESS / APPROACH STEPS DATA
   ========================================================================= */

export const approachSteps = [
  {
    number: "01",
    title: "PLAN",
    description: "Understand your needs and create the right strategy.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "PREPARE",
    description: "Mobilise resources, permits and set up site operations.",
    icon: HardHat,
  },
  {
    number: "03",
    title: "EXECUTE",
    description: "Build with precision and follow best practices.",
    icon: Settings,
  },
  {
    number: "04",
    title: "INSPECT",
    description: "Ensure quality, safety and compliance at every stage.",
    icon: ShieldCheck,
  },
  {
    number: "05",
    title: "COMPLETE",
    description: "Deliver the project and provide long-term support.",
    icon: CheckCircle2,
  },
];

/* Legacy processSteps exported for backward compatibility */
export const processSteps = approachSteps;

/* Legacy recentProjects exported for backward compatibility */
export const recentProjects = [
  {
    title: "Municipal Sewerage Network",
    location: "Chennai Central",
    image: "/images/recents/recent-sewerage.jpg",
    scope: "12km underground main network",
  },
  {
    title: "Stormwater Trunk Drainage",
    location: "Kanchipuram Industrial Area",
    image: "/images/recents/recent-drainage.jpg",
    scope: "High-capacity surface drain line",
  },
  {
    title: "Heavy Utility Pipeline",
    location: "Outer Ring Road Extension",
    image: "/images/recents/recent-pipeline.jpg",
    scope: "800mm diameter water supply line",
  },
];

/* =========================================================================
   SECTION 1: ServicesHero
   ========================================================================= */

export function ServicesHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[500px] sm:min-h-[660px] lg:min-h-[700px] overflow-hidden bg-[#0a2342] pt-20 pb-8 sm:pt-24 sm:pb-12 text-white flex flex-col justify-between max-sm:aspect-[1923/818] max-sm:min-h-0 max-sm:h-auto max-sm:pt-0 max-sm:pb-0 mt-[104px] sm:mt-[132px] md:mt-0 max-md:!mt-[82px] max-md:sm:!mt-[92px] max-sm:overflow-hidden">
      {/* Background Image with scale entrance 1.06 -> 1 */}
      <motion.div
        initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 size-full will-change-transform"
      >
        <img
          src={HERO_BG_IMAGE}
          alt="Hariputhran Infrastructure Services"
          className="size-full object-cover object-[70%_center]"
        />
      </motion.div>

      {/* Main Content Area (Vertically centered and aligned matching Home Hero) */}
      <div className="site-container relative z-10 flex flex-1 flex-col justify-center py-6 sm:py-10 lg:py-12 max-sm:py-0 max-sm:h-full max-sm:justify-center">
        <div className="max-w-[560px] min-h-[340px] sm:min-h-[440px] flex flex-col justify-center max-sm:min-h-0 max-sm:max-w-[42vw]">
          <div className="will-change-transform -mt-4 sm:-mt-10 lg:-mt-14 max-sm:-mt-[3.89vw]">
            {/* Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 font-mono text-xs sm:text-base lg:text-[17px] font-bold uppercase tracking-[2px] text-[#f97316] will-change-transform max-sm:text-[1.18vw] max-sm:gap-[0.69vw] max-sm:tracking-[0.14vw]"
            >
              <span className="h-[3px] w-7 bg-[#f97316] rounded-full max-sm:h-[0.21vw] max-sm:w-[1.94vw]" />
              OUR SERVICES
            </motion.div>

            {/* Heading (Exact 3 lines, matched visual weight to Home Hero) */}
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              className="mt-3 font-['Poppins',sans-serif] text-2xl min-[375px]:text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[44px] will-change-transform max-sm:mt-[0.83vw] max-sm:text-[3.06vw] max-sm:leading-[1.15] max-sm:tracking-tight"
            >
              Comprehensive <br />
              Infrastructure <br />
              <span className="text-[#f97316]">Services</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="mt-3 sm:mt-4 max-w-[500px] text-xs min-[375px]:text-sm sm:text-base lg:text-[17px] leading-relaxed text-slate-100 will-change-transform max-sm:mt-[1.11vw] max-sm:max-w-[38vw] max-sm:text-[1.5vw] max-sm:leading-[1.4]"
            >
              From underground utilities to roads, drainage and pipeline networks,
              we deliver end-to-end infrastructure solutions with a focus on safety,
              quality and long-term performance.
            </motion.p>

            {/* Action Buttons */}
            <div className="mt-5 sm:mt-6 flex flex-col min-[390px]:flex-row items-stretch min-[390px]:items-center gap-3 sm:gap-3.5 max-sm:mt-[0.7vw] max-sm:flex-row max-sm:items-center max-sm:gap-[0.97vw]">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.65, ease: "easeOut" }}
                className="will-change-transform"
              >
                <Button
                  asChild
                  className="h-10 w-full min-[390px]:w-auto justify-center rounded-full bg-[#f97316] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:scale-[1.02] hover:bg-[#ea580c] max-sm:h-[2.78vw] max-sm:w-auto max-sm:px-[1.67vw] max-sm:text-[0.83vw] max-sm:tracking-[0.08vw] max-sm:whitespace-nowrap"
                >
                  <a href="#services-overview">
                    EXPLORE SERVICES
                    <ArrowRight className="ml-1.5 size-4 max-sm:ml-[0.4vw] max-sm:size-[1.11vw]" />
                  </a>
                </Button>
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.75, ease: "easeOut" }}
                className="will-change-transform"
              >
                <Button
                  asChild
                  variant="outline"
                  className="h-10 w-full min-[390px]:w-auto justify-center rounded-full border-white/50 bg-transparent px-6 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs transition-all hover:bg-white hover:text-[#082342] max-sm:h-[2.78vw] max-sm:w-auto max-sm:px-[1.67vw] max-sm:text-[0.83vw] max-sm:tracking-[0.08vw] max-sm:whitespace-nowrap"
                >
                  <Link to="/contact">GET A QUOTE</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 2: ServicesOverview ("Our Core Services", id="services-overview")
   ========================================================================= */

const FALLBACK_CORE_SERVICES: ServiceItemData[] = [
  {
    id: 1,
    title: "Underground Utility Construction",
    description:
      "We design-build and execute sewerage networks, storm-water drains and pipelines with precise levels, quality materials and strict safety practices. Every line is built to carry flow reliably for decades.",
    features: [
      "Sewerage & Storm-Water Networks",
      "Water Supply & Utility Pipelines",
      "Deep Chamber & Manhole Construction",
      "Trench Excavation & Shoring",
    ],
    button_label: "Request a Quote",
    button_link: "/contact",
    icon_key: "Droplets",
    image_url: CORE_GROUP_IMAGE_1,
    has_image: true,
    sort_order: 1,
    is_active: true,
  },
  {
    id: 2,
    title: "Rehabilitation & Civil Restoration",
    description:
      "We revive ageing infrastructure and restore roads after excavation. Our crews and equipment keep disruption low, so public roads are back in service quickly and finished properly.",
    features: [
      "Sewer & Drain Rehabilitation",
      "Road Cutting & Restoration",
      "Pumping Station Works",
      "Supporting Civil Works",
    ],
    button_label: "Discuss Your Project",
    button_link: "/contact",
    icon_key: "Construction",
    image_url: CORE_GROUP_IMAGE_2,
    has_image: true,
    sort_order: 2,
    is_active: true,
  },
];

export function ServicesOverview() {
  const shouldReduceMotion = useReducedMotion();
  const hash = useRouterState({ select: (s) => s.location.hash });
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const [services, setServices] = useState<ServiceItemData[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [quoteModal, setQuoteModal] = useState<{
    open: boolean;
    serviceId: number | string | null;
    serviceName: string;
  }>({
    open: false,
    serviceId: null,
    serviceName: "",
  });

  const handleRequestQuote = (service: Partial<ServiceItemData>) => {
    setQuoteModal({
      open: true,
      serviceId: service.id || null,
      serviceName: service.title || "Core Infrastructure Service",
    });
  };

  useEffect(() => {
    let isMounted = true;
    async function loadDynamicServices() {
      try {
        const res = await fetch(`${API_BASE}/api/services`, {
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (!res.ok) {
          const reason = `HTTP status ${res.status}`;
          console.warn("Core Services: using fallback content", reason);
          if (isMounted) {
            setServices(FALLBACK_CORE_SERVICES);
            setLoading(false);
          }
          return;
        }
        const data = await res.json();
        if (isMounted) {
          if (data && data.success && Array.isArray(data.data)) {
            setServices(data.data);
          } else {
            console.warn("Core Services: using fallback content", "Invalid JSON payload structure");
            setServices(FALLBACK_CORE_SERVICES);
          }
          setLoading(false);
        }
      } catch (err: any) {
        console.warn("Core Services: using fallback content", err?.message || err);
        if (isMounted) {
          setServices(FALLBACK_CORE_SERVICES);
          setLoading(false);
        }
      }
    }

    loadDynamicServices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Hash anchor scrolling and temporary highlight effect
  useEffect(() => {
    if (!hash) return;
    const cleanHash = hash.replace(/^#/, "");
    if (!cleanHash) return;

    let pollTimer: ReturnType<typeof setTimeout> | null = null;
    let highlightTimer: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds retry loop

    const checkAndScroll = () => {
      const el = document.getElementById(cleanHash);
      if (el) {
        el.scrollIntoView({
          behavior: shouldReduceMotion ? "auto" : "smooth",
          block: "start",
        });
        if (cleanHash.startsWith("service-")) {
          setHighlightedId(cleanHash);
          highlightTimer = setTimeout(() => {
            setHighlightedId(null);
          }, 2500);
        }
      } else if (attempts < maxAttempts) {
        attempts++;
        pollTimer = setTimeout(checkAndScroll, 100);
      }
    };

    checkAndScroll();

    return () => {
      if (pollTimer) clearTimeout(pollTimer);
      if (highlightTimer) clearTimeout(highlightTimer);
    };
  }, [hash, services, shouldReduceMotion]);

  return (
    <section
      id="core-services"
      className="relative overflow-hidden bg-[#F5FAFF] py-12 sm:py-20 lg:py-28 scroll-mt-[110px]"
    >
      <div id="services-overview" className="scroll-mt-[110px]" />
      <style>{`
        @media (min-width: 1024px) {
          .slant-photo-left {
            clip-path: polygon(0 0, 100% 0, calc(100% - 65px) 100%, 0 100%);
          }
          .slant-card-right {
            clip-path: polygon(65px 0, 100% 0, 100% 100%, 0 100%);
          }
          .slant-card-left {
            clip-path: polygon(0 0, 100% 0, calc(100% - 65px) 100%, 0 100%);
          }
          .slant-photo-right {
            clip-path: polygon(65px 0, 100% 0, 100% 100%, 0 100%);
          }
        }
      `}</style>

      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Left Edge Wave Lines */}
        <svg
          className="absolute -left-12 top-1/4 h-[500px] w-48 text-[#0A9BE0]/10"
          viewBox="0 0 200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-50 50C30 150 70 200 -20 350C-80 450 40 520 100 580"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M-30 20C50 120 90 170 0 320C-60 420 60 490 120 550"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M-10 -10C70 90 110 140 20 290C-40 390 80 460 140 520"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M10 -40C90 60 130 110 40 260C-20 360 100 430 160 490"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>

        {/* Right Edge Wave Lines */}
        <svg
          className="absolute -right-12 bottom-1/4 h-[500px] w-48 text-[#0A9BE0]/10"
          viewBox="0 0 200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M250 50C170 150 130 200 220 350C280 450 160 520 100 580"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M230 20C150 120 110 170 200 320C260 420 140 490 80 550"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M210 -10C130 90 90 140 180 290C240 390 120 460 60 520"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>

        {/* Soft Translucent Light-Blue Rounded Diamonds */}
        <div className="absolute -right-16 top-16 size-80 rotate-45 rounded-[60px] bg-gradient-to-br from-[#0A9BE0]/8 to-transparent blur-2xl" />
        <div className="absolute -left-16 bottom-16 size-80 rotate-45 rounded-[60px] bg-gradient-to-tr from-[#0A9BE0]/8 to-transparent blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px] px-3 sm:px-6 lg:px-8">
        {/* Header, centered */}
        <div className="mx-auto max-w-5xl text-center">
          {/* Eyebrow Pill Badge with Fading Side Lines */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex items-center justify-center gap-3 will-change-transform"
          >
            <span className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#0A8FD8]" />
            <span className="inline-flex items-center rounded-full bg-[#E0F1FC] px-4 py-1 sm:px-5 sm:py-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#0A8FD8] shadow-sm">
              OUR CORE SERVICES
            </span>
            <span className="h-[2px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#0A8FD8]" />
          </motion.div>

          <motion.h2
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-3 sm:mt-4 font-['Poppins',sans-serif] text-2xl min-[375px]:text-3xl font-extrabold tracking-tight text-[#0B2A5B] sm:text-3xl md:text-4xl lg:text-[42px] leading-tight will-change-transform md:whitespace-nowrap"
          >
            Core Services. <span className="text-[#0A9BE0]">Built for a Better Tomorrow.</span>
          </motion.h2>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-3 sm:mt-4 max-w-[740px] text-xs sm:text-sm leading-[1.6] text-[#5B6B80] text-justify sm:text-[16px] will-change-transform"
          >
            From laying the first pipe to restoring the road above it,{" "}
            <strong className="font-bold text-[#0B2A5B]">Hariputhran</strong> delivers
            complete underground infrastructure solutions for municipal bodies, contractors
            and  developers.
          </motion.p>
        </div>

        {/* Dynamic Service Rows or Empty State */}
        {loading ? (
          <div className="mt-10 space-y-6 sm:mt-14 sm:space-y-8" aria-busy="true" aria-label="Loading core services">
            <div className="h-64 rounded-2xl bg-white/60 p-8 shadow-xs animate-pulse border border-slate-100" />
          </div>
        ) : !services || services.length === 0 ? (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-10 sm:mt-14 mx-auto max-w-2xl rounded-2xl bg-white p-8 sm:p-12 text-center shadow-[0_10px_35px_rgba(10,60,120,0.06)] border border-slate-100"
          >
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#E0F1FC] text-[#0A8FD8] shadow-sm mb-5">
              <Construction className="size-7" />
            </div>
            <h3 className="font-['Poppins',sans-serif] text-xl min-[375px]:text-2xl font-bold tracking-tight text-[#0B2A5B] sm:text-2xl">
              Our service list is being updated
            </h3>
            <p className="mt-3 max-w-md mx-auto text-xs sm:text-sm leading-relaxed text-[#5B6B80]">
              Please contact us and our team will be happy to help with your requirement.
            </p>
            <div className="mt-6 sm:mt-8">
              <Button
                asChild
                className="h-11 rounded-full bg-[#f97316] px-8 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#ea580c] hover:scale-[1.02]"
              >
                <Link to="/contact">
                  CONTACT US
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="mt-10 space-y-8 sm:mt-14 sm:space-y-10 lg:mt-16 lg:space-y-12">
            {services.map((service, index) => {
              const cardId = service.id ? `service-${service.id}` : undefined;
              const isTargetHighlighted = cardId && (highlightedId === cardId || highlightedId === String(service.id));

              return (
                <motion.div
                  key={service.id || index}
                  id={cardId}
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
                  transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
                  className={`scroll-mt-[110px] rounded-2xl will-change-transform transition-all duration-500 ${
                    isTargetHighlighted
                      ? "ring-4 ring-[#F97316] ring-offset-4 ring-offset-[#F5FAFF] shadow-2xl scale-[1.01]"
                      : ""
                  }`}
                >
                  <ServiceCard
                    service={service}
                    index={index}
                    onRequestQuote={handleRequestQuote}
                    isHighlighted={Boolean(isTargetHighlighted)}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quote Request Modal */}
      <ServiceRequestDialog
        open={quoteModal.open}
        onOpenChange={(open) => setQuoteModal((prev) => ({ ...prev, open }))}
        serviceId={quoteModal.serviceId}
        serviceName={quoteModal.serviceName}
      />
    </section>
  );
}

/* =========================================================================
   SECTION 3: FeaturedService ("Underground Utility Infrastructure")
   ========================================================================= */

export function FeaturedService() {
  return null;
}

/* =========================================================================
   SECTION 4: WorkProcessSection (5-Step Approach)
   ========================================================================= */

export function WorkProcessSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-14 lg:py-16 max-md:overflow-x-clip">
      {/* Light blue soft glow on the left behind header */}
      <div className="pointer-events-none absolute -left-20 top-1/2 size-80 -translate-y-1/2 rounded-full bg-[#0284c7]/5 blur-3xl" />

      <div className="site-container relative z-10">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
          {/* Left Header (Left-aligned) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-sm will-change-transform"
          >
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[2px] text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              OUR APPROACH
            </div>

            <h2 className="mt-2.5 sm:mt-3 font-['Poppins',sans-serif] text-2xl font-bold leading-tight tracking-tight text-[#082342] sm:text-3xl lg:text-[32px]">
              How We Deliver
              <br />
              <span className="text-[#0284c7]">Your Project</span>
            </h2>

            <p className="mt-2.5 sm:mt-3 text-xs leading-relaxed text-slate-500 text-justify sm:text-sm">
              A structured and transparent process to ensure quality, safety and on-time delivery.
            </p>
          </motion.div>

          {/* Right 5-Step Flow */}
          <div className="relative max-md:-mx-4 max-md:min-w-0 max-md:overflow-visible">
            <div
              role="region"
              aria-label="Our approach steps"
              tabIndex={0}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:gap-2 max-md:flex max-md:flex-row max-md:flex-nowrap max-md:overflow-x-auto max-md:overflow-y-visible max-md:snap-x max-md:snap-proximity max-md:gap-4 max-md:w-full max-md:min-w-0 max-md:max-w-full max-md:overscroll-x-contain max-md:scroll-smooth max-md:px-4 max-md:scroll-px-4 max-md:touch-pan-x max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden max-md:after:content-[''] max-md:after:shrink-0 max-md:after:w-px"
            >
              {approachSteps.map((step, idx) => {
                const Icon = step.icon;
                const delay = idx * 0.1; // 0ms, 100ms, 200ms, 300ms, 400ms

                return (
                  <motion.div
                    key={step.number}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 20, scale: 0.97 }
                    }
                    whileInView={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, scale: 1 }
                    }
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, delay, ease: "easeOut" }}
                    className="flex items-center will-change-transform max-md:w-[44vw] max-md:min-w-[150px] max-md:max-w-[190px] max-md:shrink-0 max-md:grow-0 max-md:snap-start"
                  >
                    <div className="flex flex-col items-center text-center w-full">
                      {/* Circle Icon Badge */}
                      <div className="grid size-14 place-items-center rounded-full bg-white shadow-[0_8px_24px_-8px_rgba(2,132,199,0.35)] ring-1 ring-[#0284c7]/15 transition-transform duration-300 hover:scale-105 sm:size-16 lg:size-[72px]">
                        <Icon className="size-6 sm:size-7 text-[#0284c7]" />
                      </div>

                      {/* Step Number */}
                      <span className="mt-2 sm:mt-2.5 font-mono text-[11px] sm:text-xs font-bold text-[#082342]">
                        {step.number}
                      </span>

                      {/* Title */}
                      <h3 className="mt-0.5 font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wide text-[#082342]">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-1 max-w-[140px] text-[10.5px] sm:text-[11px] leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>

                    {/* Desktop Chevron connector between steps */}
                    {idx < approachSteps.length - 1 && (
                      <div className="hidden px-2 lg:block max-md:block max-md:shrink-0">
                        <ChevronRight className="size-5 text-[#0284c7]/70 max-md:size-4" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 5: WhyChooseUsSection (Dark Full-Width Band)
   ========================================================================= */

export function WhyChooseUsSection() {
  return null;
}

/* =========================================================================
   SECTION 5: ServiceClosingBanner (Full-Bleed Image CTA)
   ========================================================================= */

export function ServiceClosingBanner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[260px] sm:min-h-[280px] w-full items-center overflow-hidden bg-[#082342] text-white lg:min-h-[320px]">
      {/* Background Image with scale 1.05 -> 1 */}
      <motion.div
        initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="absolute inset-0 size-full will-change-transform"
      >
        <img
          src={CLOSING_BANNER_BG}
          alt="Infrastructure consultation"
          className="size-full object-cover object-center"
        />
      </motion.div>

      {/* Overlay Gradient: Left to right dark navy */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#082342]/95 via-[#082342]/70 to-[#082342]/30 lg:from-[#082342]/95 lg:via-[#082342]/60 lg:to-transparent" />

      <div className="site-container relative z-10 w-full py-8 sm:py-10 lg:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Content (translateX: -15px -> 0) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl will-change-transform"
          >
            <div className="inline-flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[2px] text-[#f97316]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              LET&apos;S BUILD TOGETHER
            </div>

            <h2 className="mt-2.5 sm:mt-3 font-['Poppins',sans-serif] text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Have an Infrastructure
              <br />
              <span className="text-[#f97316]">Project?</span>
            </h2>

            <p className="mt-2.5 sm:mt-3 max-w-md text-xs leading-relaxed text-slate-200 text-justify sm:text-sm">
              Get in touch with our team for a consultation and let&apos;s build a stronger tomorrow.
            </p>

            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mt-5 sm:mt-6 will-change-transform max-md:self-start"
            >
              <Button
                asChild
                className="h-11 w-auto justify-center rounded-full bg-[#f97316] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:bg-[#ea580c]"
              >
                <Link to="/contact">
                  GET IN TOUCH
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Script Text (Desktop) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hidden text-right lg:block -rotate-6 will-change-transform"
          >
            <p className="font-serif text-3xl font-normal italic leading-none text-white lg:text-4xl drop-shadow-lg">
              Stronger
              <br />
              Cities
              <br />
              <span className="text-[#f97316]">Together</span>
            </p>
            <div className="ml-auto mt-2 h-1 w-20 rounded-full bg-[#f97316] shadow" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* Legacy components preserved for backwards compatibility */
export function ProjectShowcase() {
  return null;
}

export function StatsSection() {
  return null;
}

export function ContactCTASection() {
  return null;
}

/* =========================================================================
   SERVICES PAGE EXPORT
   ========================================================================= */

export function ServicePage() {
  return (
    <PageFrame>
      <ServicesHero />
      <ServicesOverview />
      <WorkProcessSection />
      <ServiceClosingBanner />
    </PageFrame>
  );
}

export default ServicePage;

