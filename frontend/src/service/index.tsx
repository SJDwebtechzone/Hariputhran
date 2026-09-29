import { Link } from "@tanstack/react-router";
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
    title: "Construction & Infrastructure Services",
    description: "We provide complete underground utility solutions including sewerage systems, drainage networks, pipeline laying, manhole and chamber construction.",
    items: ["Sewerage Works", "Drainage Systems", "Pipeline Laying", "Manhole & Chamber Construction"],
    image: CORE_GROUP_IMAGE_1,
    icon: Droplets,
  },
  {
    number: "02",
    title: "Civil & Infrastructure Works",
    description: "We execute large-scale civil works and restoration projects with advanced equipment and a skilled team, ensuring durability and long-term performance.",
    items: ["Rehabilitation Works", "Road Cutting & Restoration", "Pumping Station Works", "Civil Construction Support"],
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
  return (
    <section className="relative min-h-[620px] sm:min-h-[660px] lg:min-h-[700px] overflow-hidden text-white flex items-center pt-20 sm:pt-24">
      {/* Background Image */}
      <img
        src={HERO_BG_IMAGE}
        alt="Hariputhran Infrastructure Services"
        className="absolute inset-0 size-full object-cover object-[70%_center]"
      />

      <div className="relative z-10 w-full px-6 pb-16 pt-32 sm:px-10 lg:px-[8%]">
        <div className="max-w-[540px]">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[2px] text-[#f97316] sm:text-sm">
            <span className="h-0.5 w-7 rounded-full bg-[#f97316]" />
            OUR SERVICES
          </div>

          {/* Heading (Exact 3 lines) */}
          <h1 className="mt-4 font-['Poppins',sans-serif] text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[46px]">
            Infrastructure
            <br />
            Services Built for
            <br />
            a <span className="text-[#f97316]">Stronger Tomorrow</span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-5 max-w-[500px] text-sm leading-relaxed text-slate-100 sm:text-base">
            From underground utilities to roads, drainage and pipeline networks,
            we deliver end-to-end infrastructure solutions with a focus on safety,
            quality and long-term performance.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Button
              asChild
              className="h-11 rounded-full bg-[#f97316] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:bg-[#ea580c]"
            >
              <a href="#services-overview">
                EXPLORE SERVICES
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border border-white/50 bg-transparent px-6 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#082342]"
            >
              <Link to="/contact">GET A QUOTE</Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 2: ServicesOverview ("Our Core Services", id="services-overview")
   ========================================================================= */

export function ServicesOverview() {
  return (
    <section id="services-overview" className="bg-gradient-to-b from-white to-[#f8fbff] py-16 lg:py-24">
      <div className="site-container">
        {/* Header, centered */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-['Poppins',sans-serif] text-2xl font-extrabold tracking-tight text-[#0284c7] sm:text-3xl md:text-4xl lg:text-[36px]">
            Core Services. <span className="text-[#082342]">One Reliable Partner.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            We focus on two key areas of infrastructure development, delivering end-to-end solutions with expertise and excellence.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {coreServiceGroups.map((group) => {
            const Icon = group.icon;

            return (
              <div
                key={group.number}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_18px_50px_-18px_rgba(2,132,199,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-18px_rgba(2,132,199,0.45)]"
              >
                {/* Image on top */}
                <div className="overflow-hidden">
                  <img
                    src={group.image}
                    alt={group.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Body */}
                <div className="relative flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:gap-5">
                  {/* Icon badge (left column) */}
                  <div className="relative z-10 -mt-7 grid size-14 shrink-0 place-items-center rounded-full bg-[#e6f3fb] text-[#0284c7] shadow-md ring-4 ring-white">
                    <Icon className="size-6" />
                  </div>

                  {/* Text column (right) */}
                  <div className="flex-1 pt-3">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#f97316]">
                      SERVICE {group.number}
                    </span>

                    <h3 className="mt-1 font-['Poppins',sans-serif] text-lg font-bold text-[#0284c7] lg:text-xl">
                      {group.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      {group.description}
                    </p>

                    {/* Checklist */}
                    <div className="mt-4 space-y-2">
                      {group.items.map((item) => (
                        <div key={item} className="flex items-center gap-2.5">
                          <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[#0284c7] text-white">
                            <Check className="size-3 stroke-[3]" />
                          </span>
                          <span className="text-xs font-medium text-slate-700 sm:text-[13px]">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Button */}
                    <div className="mt-5">
                      <Button
                        asChild
                        className="h-10 rounded-full bg-[#f97316] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:scale-[1.02] hover:bg-[#ea580c]"
                      >
                        <Link to="/contact">
                          EXPLORE SERVICE
                          <ArrowRight className="ml-1.5 size-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
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
   SECTION 3: FeaturedService ("Underground Utility Infrastructure")
   ========================================================================= */

export function FeaturedService() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="grid min-h-[360px] w-full lg:min-h-[420px] lg:grid-cols-[45%_55%]">
        {/* Left 45% Panel: Full-bleed dark photo with script overlay */}
        <div className="relative min-h-[320px] overflow-hidden bg-[#082342] lg:min-h-full">
          <img
            src={FEATURED_LEFT_IMAGE}
            alt="Underground utility infrastructure"
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent lg:bg-gradient-to-r lg:from-black/70 lg:via-black/30 lg:to-transparent" />

          {/* Handwritten Script Overlay (bottom-left) */}
          <div className="absolute bottom-8 left-8 z-10 -rotate-6">
            <p className="font-serif text-3xl font-normal italic leading-none text-white sm:text-4xl lg:text-5xl drop-shadow-lg">
              Built
              <br />
              Below.
              <br />
              <span className="text-[#f97316]">Designed</span>
              <br />
              <span className="text-[#f97316]">to Last.</span>
            </p>
            <div className="mt-2 h-1 w-24 rounded-full bg-[#f97316] -rotate-6 shadow" />
          </div>
        </div>

        {/* Right 55% Panel: Light gradient with text & staggered stadium photos */}
        <div className="relative flex items-center overflow-hidden bg-gradient-to-br from-white to-[#e6f3fb] p-8 lg:p-12">
          {/* Soft ambient blob */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[#0284c7]/10 blur-3xl" />

          <div className="relative z-10 grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Text Column (~60%) */}
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[2px] text-[#f97316]">
                <span className="h-0.5 w-6 bg-[#f97316]" />
                FEATURED SERVICE
              </div>

              <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                <span className="text-[#082342]">Underground Utility</span>
                <br />
                <span className="text-[#0284c7]">Infrastructure</span>
              </h2>

              <p className="mt-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                We specialize in designing and constructing underground utility systems that form the backbone of modern cities.
              </p>

              {/* 4-item checklist with orange filled circles */}
              <div className="mt-5 space-y-2.5">
                {[
                  "Sewer networks & treatment systems",
                  "Stormwater drainage systems",
                  "Water & utility pipelines",
                  "Chambers & manholes",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#f97316] text-white shadow-sm">
                      <Check className="size-3.5 stroke-[3]" />
                    </span>
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                variant="outline"
                className="mt-6 h-10 rounded-full border-[#0284c7] px-6 text-xs font-bold uppercase tracking-wider text-[#0284c7] transition-all hover:bg-[#0284c7] hover:text-white"
              >
                <Link to="/contact">
                  LEARN MORE
                  <ArrowRight className="ml-2 size-3.5" />
                </Link>
              </Button>
            </div>

            {/* Photo Cluster Column (~40%) */}
            <div className="relative hidden items-center justify-center sm:flex">
              <div className="relative flex items-center gap-3">
                {/* Left Arched Photo */}
                <div className="h-[280px] w-[115px] rotate-[3deg] overflow-hidden rounded-[2rem] border-4 border-white shadow-xl lg:h-[300px] lg:w-[125px]">
                  <img
                    src={FEATURED_ARCH_1}
                    alt="Sewerage construction"
                    className="size-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Right Arched Photo (staggered 40px higher) */}
                <div className="-mt-10 h-[280px] w-[115px] -rotate-[3deg] overflow-hidden rounded-[2rem] border-4 border-white shadow-xl lg:h-[300px] lg:w-[125px]">
                  <img
                    src={FEATURED_ARCH_2}
                    alt="Pipeline installation"
                    className="size-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION 4: WorkProcessSection (5-Step Approach)
   ========================================================================= */

export function WorkProcessSection() {
  return (
    <section className="relative overflow-hidden bg-white py-14 lg:py-16">
      {/* Light blue soft glow on the left behind header */}
      <div className="pointer-events-none absolute -left-20 top-1/2 size-80 -translate-y-1/2 rounded-full bg-[#0284c7]/5 blur-3xl" />

      <div className="site-container relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
          {/* Left Header (Left-aligned) */}
          <div className="max-w-sm">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[2px] text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              OUR APPROACH
            </div>

            <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl font-bold leading-tight tracking-tight text-[#082342] sm:text-3xl lg:text-[32px]">
              How We Deliver
              <br />
              <span className="text-[#0284c7]">Your Project</span>
            </h2>

            <p className="mt-3 text-xs leading-relaxed text-slate-500 sm:text-sm">
              A structured and transparent process to ensure quality, safety and on-time delivery.
            </p>
          </div>

          {/* Right 5-Step Flow */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:gap-2">
            {approachSteps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center text-center">
                    {/* Circle Icon Badge */}
                    <div className="grid size-16 place-items-center rounded-full bg-white shadow-[0_8px_24px_-8px_rgba(2,132,199,0.35)] ring-1 ring-[#0284c7]/15 transition-transform hover:scale-105 lg:size-[72px]">
                      <Icon className="size-7 text-[#0284c7]" />
                    </div>

                    {/* Step Number */}
                    <span className="mt-2.5 font-mono text-xs font-bold text-[#082342]">
                      {step.number}
                    </span>

                    {/* Title */}
                    <h3 className="mt-0.5 font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wide text-[#082342]">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-1.5 max-w-[140px] text-[11px] leading-relaxed text-slate-500">
                      {step.description}
                    </p>
                  </div>

                  {/* Desktop Chevron connector between steps */}
                  {idx < approachSteps.length - 1 && (
                    <div className="hidden px-2 lg:block">
                      <ChevronRight className="size-5 text-[#0284c7]/70" />
                    </div>
                  )}
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
   SECTION 5: WhyChooseUsSection (Dark Full-Width Band)
   ========================================================================= */

export function WhyChooseUsSection() {
  return null;
}

/* =========================================================================
   SECTION 5: ServiceClosingBanner (Full-Bleed Image CTA)
   ========================================================================= */

export function ServiceClosingBanner() {
  return (
    <section className="relative flex min-h-[280px] w-full items-center overflow-hidden bg-[#082342] text-white lg:min-h-[320px]">
      {/* Background Image */}
      <img
        src={CLOSING_BANNER_BG}
        alt="Infrastructure consultation"
        className="absolute inset-0 size-full object-cover object-center"
      />

      {/* Overlay Gradient: Left to right dark navy */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#082342]/95 via-[#082342]/70 to-[#082342]/30 lg:from-[#082342]/95 lg:via-[#082342]/60 lg:to-transparent" />

      <div className="site-container relative z-10 w-full py-10 lg:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[2px] text-[#f97316]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              LET&apos;S BUILD TOGETHER
            </div>

            <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Have an Infrastructure
              <br />
              <span className="text-[#f97316]">Project?</span>
            </h2>

            <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-200 sm:text-sm">
              Get in touch with our team for a consultation and let&apos;s build a stronger tomorrow.
            </p>

            <div className="mt-6">
              <Button
                asChild
                className="h-11 rounded-full bg-[#f97316] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:bg-[#ea580c]"
              >
                <Link to="/contact">
                  GET IN TOUCH
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Script Text (Desktop) */}
          <div className="hidden text-right lg:block -rotate-6">
            <p className="font-serif text-3xl font-normal italic leading-none text-white lg:text-4xl drop-shadow-lg">
              Stronger
              <br />
              Cities
              <br />
              <span className="text-[#f97316]">Together</span>
            </p>
            <div className="ml-auto mt-2 h-1 w-20 rounded-full bg-[#f97316] shadow" />
          </div>
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
      <FeaturedService />
      <WorkProcessSection />
      <ServiceClosingBanner />
    </PageFrame>
  );
}

export default ServicePage;
