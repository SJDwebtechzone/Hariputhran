import { Eye, Leaf, ShieldCheck, Target, Users } from "lucide-react";
import { Eyebrow, PageFrame } from "@/components/site-layout";

export function AboutPage() {
  return (
    <PageFrame>
      {/* SECTION 1 — HERO */}
      <section className="pt-32 sm:pt-36 pb-16 sm:pb-20">
        <div className="site-container grid items-center gap-10 lg:gap-14 md:grid-cols-2">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-[2px] text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              ABOUT HARIPUTHRAN ENTERPRISES
            </div>
            <h1 className="mt-4 font-['Poppins',sans-serif] text-3xl font-bold tracking-tight text-[#082342] sm:text-4xl lg:text-5xl leading-tight">
              Building Strong.<br />
              <span className="text-[#f97316]">A Foundation</span><br />
              Beyond Engineering.
            </h1>
            <p className="mt-5 max-w-lg text-sm sm:text-base lg:text-[17px] leading-relaxed text-slate-600 text-justify">
              We believe reliable underground utilities and civil infrastructure are more than construction projects — they are the vital foundation for healthier communities, public safety, and sustainable urban progress.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl">
            <img
              src="/images/about/abouthariputhran.jpg"
              alt="Infrastructure planning and civil engineering precision"
              width={1200}
              height={900}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/3] w-full min-w-0 object-cover"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2 — OUR STORY */}
      <section className="pb-16 sm:pb-20">
        <div className="site-container grid items-center gap-10 lg:gap-14 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-lg">
            <img
              src="/images/about/our-story.jpg"
              alt="Hariputhran Enterprises infrastructure engineering execution"
              loading="lazy"
              width={1408}
              height={1008}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              OUR STORY
            </div>
            <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#082342] leading-tight">
              Infrastructure, Built<br />With Precision.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 text-justify">
              Hariputhran Enterprises was founded with an unyielding commitment: to engineer and construct resilient underground sewerage networks, stormwater drainage systems, and civil utility pipelines that stand the test of time.
            </p>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 text-justify">
              From detailed site surveys and heavy excavation to precision pipe laying, manhole chamber casting, and complete road restoration, we deliver end-to-end municipal and commercial infrastructure solutions with uncompromising quality.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHAT DRIVES US (MISSION & VISION) */}
      <section className="bg-surface-blue py-16">
        <div className="site-container">
          <Eyebrow>What Drives Us</Eyebrow>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <article className="flex gap-6 rounded-2xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-sm md:border-r md:border-slate-200">
              <span className="text-5xl sm:text-6xl font-extralight text-[#0B78E3]/30 shrink-0">01</span>
              <div>
                <h3 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#082342]">Our Mission</h3>
                <div className="mt-4 flex gap-3.5">
                  <Target className="size-5 text-[#f97316] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    To deliver resilient underground sewerage, drainage networks, and pipeline infrastructure through advanced engineering methods, strict safety compliance, and uncompromising construction quality.
                  </p>
                </div>
              </div>
            </article>
            <article className="flex gap-6 rounded-2xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <span className="text-5xl sm:text-6xl font-extralight text-[#0B78E3]/30 shrink-0">02</span>
              <div>
                <h3 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-[#082342]">Our Vision</h3>
                <div className="mt-4 flex gap-3.5">
                  <Eye className="size-5 text-[#0B78E3] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    To be the premier civil engineering and municipal utility contractor, recognized for transformative infrastructure execution, technical excellence, and sustainable community impact.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 4 — OUR VALUES */}
      <section className="py-16 sm:py-20">
        <div className="site-container grid gap-10 lg:gap-14 md:grid-cols-[.8fr_1.5fr]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              OUR VALUES
            </div>
            <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#082342] leading-tight">
              The Principles<br />Behind Every Project.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { Icon: ShieldCheck, title: "Engineered for Durability", copy: "Quality begins at every stage of trenching, piping, and chamber casting." },
              { Icon: Users, title: "Safety & People First", copy: "We protect our workforce and communities with rigorous on-site protocols." },
              { Icon: Leaf, title: "Sustainable Growth", copy: "Building durable municipal networks that safeguard public health and urban ecosystems." },
              { Icon: Target, title: "Always Improving", copy: "We continuously refine our machinery, engineering techniques, and delivery timelines." },
            ].map(({ Icon, title, copy }, i) => (
              <article key={title} className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition-all hover:border-[#0B78E3]/40 hover:shadow-md">
                <div className="flex items-center gap-3.5">
                  <span className="font-mono text-base font-bold text-[#0B78E3]">0{i + 1}</span>
                  <div className="grid size-9 place-items-center rounded-lg bg-orange-50 text-[#f97316]">
                    <Icon className="size-4.5" />
                  </div>
                </div>
                <h3 className="mt-4 text-sm sm:text-base font-bold uppercase tracking-wider text-[#082342] leading-snug">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — OUR APPROACH */}
      <section className="grid md:grid-cols-2 border-t border-slate-200">
        <div className="relative min-h-[360px] sm:min-h-[440px] bg-slate-100">
          <img
            src="/images/about/Infrastructure.png"
            alt="Infrastructure construction precision and pipeline installation"
            loading="lazy"
            width={1504}
            height={1008}
            className="size-full object-cover"
          />
        </div>
        <div className="bg-surface-blue p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <Eyebrow>Our Approach</Eyebrow>
          <h2 className="mt-4 font-['Poppins',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#082342] leading-tight">
            Every Pipeline.<br />Carefully Considered.
          </h2>
          <ol className="mt-8 space-y-4 sm:space-y-5">
            {[
              "Survey & Planning — Comprehensive underground utility mapping and geotechnical assessment.",
              "Excavation & Laying — Precision trenching, laser-guided pipe laying, and robust jointing.",
              "Quality Testing — Hydrostatic pressure testing, leak detection, and compaction verification.",
              "Restoration & Handover — Complete road reinstatement, backfilling, and seamless commissioning.",
            ].map((item, i) => {
              const [title, desc] = item.split(" — ");
              return (
                <li key={item} className="flex items-start gap-4 text-xs sm:text-sm text-slate-700">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#0B78E3]/15 text-xs font-bold text-[#0B78E3] mt-0.5">
                    0{i + 1}
                  </span>
                  <div>
                    <strong className="font-semibold text-[#082342]">{title}</strong> — <span>{desc}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </PageFrame>
  );
}
