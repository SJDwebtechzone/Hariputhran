import { Eye, Leaf, ShieldCheck, Target, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow, PageFrame } from "@/components/site-layout";

export function AboutPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <PageFrame>
      {/* SECTION 1 — HERO */}
      <section className="pt-[104px] pb-12 sm:pt-[132px] sm:pb-16 md:pt-28 md:pb-16 lg:pt-32 lg:pb-20 max-md:!pt-[82px] max-md:sm:!pt-[92px] overflow-hidden">
        <div className="site-container grid items-center gap-8 sm:gap-10 lg:gap-14 md:grid-cols-2">
          <div className="min-w-0">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-[2px] text-[#0284c7] will-change-transform"
            >
              <span className="h-0.5 w-6 bg-[#f97316]" />
              ABOUT HARIPUTHRAN ENTERPRISES
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-3 sm:mt-4 font-['Poppins',sans-serif] text-2xl min-[375px]:text-3xl font-bold tracking-tight text-[#082342] sm:text-4xl lg:text-5xl leading-tight will-change-transform"
            >
              Infrastructure Built <br />
              <span className="text-[#f97316]">With Precision</span>
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="mt-4 sm:mt-5 max-w-lg text-xs min-[375px]:text-sm sm:text-base lg:text-[17px] leading-relaxed text-slate-600 text-justify will-change-transform"
            >
              We believe reliable underground utilities and civil infrastructure are more than construction projects — they are the vital foundation for healthier communities, public safety, and sustainable urban progress.
            </motion.p>
          </div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-100 shadow-xl will-change-transform"
          >
            <img
              src="/images/about/abouthariputhran.jpg"
              alt="Infrastructure planning and civil engineering precision"
              width={1200}
              height={900}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/3] w-full min-w-0 object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — OUR STORY (Split Reveal: Left Image -40px, Right Content 40px) */}
      <section className="pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        <div className="site-container grid items-center gap-8 sm:gap-10 lg:gap-14 md:grid-cols-2">
          {/* Left Image */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-100 shadow-lg will-change-transform"
          >
            <img
              src="/images/about/our-story.jpg"
              alt="Hariputhran Enterprises infrastructure engineering execution"
              loading="lazy"
              width={1408}
              height={1008}
              className="aspect-[4/3] w-full object-cover"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="will-change-transform"
          >
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              OUR STORY
            </div>
            <h2 className="mt-2.5 sm:mt-3 font-['Poppins',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#082342] leading-tight">
              Infrastructure, Built<br />With Precision.
            </h2>
            <p className="mt-3.5 sm:mt-4 text-xs min-[375px]:text-sm sm:text-base leading-relaxed text-slate-600 text-justify">
              <strong className="font-semibold text-[#f97316]">Hariputhran Enterprises</strong> was founded with an unyielding commitment: to engineer and construct resilient <strong className="font-semibold text-[#0284c7]">underground sewerage networks</strong>, stormwater drainage systems, and civil utility pipelines that stand the test of time.
            </p>
            <p className="mt-2.5 sm:mt-3 text-xs min-[375px]:text-sm sm:text-base leading-relaxed text-slate-600 text-justify">
              From detailed site surveys and heavy excavation to <strong className="font-semibold text-[#0284c7]">precision pipe laying</strong>, manhole chamber casting, and <strong className="font-semibold text-[#0284c7]">complete road restoration</strong>, we deliver end-to-end municipal and commercial infrastructure solutions with uncompromising quality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — WHAT DRIVES US (MISSION & VISION) */}
      <section className="bg-surface-blue py-12 sm:py-16 overflow-hidden">
        <div className="site-container">
          <Eyebrow>What Drives Us</Eyebrow>
          <div className="mt-6 sm:mt-8 grid gap-6 sm:gap-8 md:grid-cols-2">
            <motion.article
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 25, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
              className="flex gap-4 sm:gap-6 rounded-xl sm:rounded-2xl bg-white p-5 sm:p-8 border border-slate-200/80 shadow-sm md:border-r md:border-slate-200 will-change-transform"
            >
              <span className="text-4xl sm:text-6xl font-extralight text-[#0B78E3]/30 shrink-0">01</span>
              <div>
                <h3 className="font-['Poppins',sans-serif] text-lg sm:text-2xl font-bold text-[#082342]">Our Mission</h3>
                <div className="mt-3 sm:mt-4 flex gap-3 sm:gap-3.5">
                  <Target className="size-5 text-[#f97316] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 text-justify">
                    To deliver resilient underground sewerage, drainage networks, and pipeline infrastructure through advanced engineering methods, strict safety compliance, and uncompromising construction quality.
                  </p>
                </div>
              </div>
            </motion.article>

            <motion.article
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 25, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="flex gap-4 sm:gap-6 rounded-xl sm:rounded-2xl bg-white p-5 sm:p-8 border border-slate-200/80 shadow-sm will-change-transform"
            >
              <span className="text-4xl sm:text-6xl font-extralight text-[#0B78E3]/30 shrink-0">02</span>
              <div>
                <h3 className="font-['Poppins',sans-serif] text-lg sm:text-2xl font-bold text-[#082342]">Our Vision</h3>
                <div className="mt-3 sm:mt-4 flex gap-3 sm:gap-3.5">
                  <Eye className="size-5 text-[#0B78E3] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 text-justify">
                    To be the premier civil engineering and municipal utility contractor, recognized for transformative infrastructure execution, technical excellence, and sustainable community impact.
                  </p>
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* SECTION 4 — OUR VALUES */}
      <section className="py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="site-container grid gap-8 sm:gap-10 lg:gap-14 md:grid-cols-[.8fr_1.5fr]">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="will-change-transform"
          >
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              OUR VALUES
            </div>
            <h2 className="mt-2.5 sm:mt-3 font-['Poppins',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#082342] leading-tight">
              The Principles<br />Behind Every Project.
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
            {[
              { Icon: ShieldCheck, title: "Engineered for Durability", copy: "Quality begins at every stage of trenching, piping, and chamber casting." },
              { Icon: Users, title: "Safety & People First", copy: "We protect our workforce and communities with rigorous on-site protocols." },
              { Icon: Leaf, title: "Sustainable Growth", copy: "Building durable municipal networks that safeguard public health and urban ecosystems." },
              { Icon: Target, title: "Always Improving", copy: "We continuously refine our machinery, engineering techniques, and delivery timelines." },
            ].map(({ Icon, title, copy }, i) => (
              <motion.article
                key={title}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
                className="rounded-xl border border-slate-200 bg-white p-4.5 sm:p-7 shadow-sm transition-all duration-300 hover:md:-translate-y-1 hover:border-[#0B78E3]/40 hover:shadow-md will-change-transform"
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-mono text-sm sm:text-base font-bold text-[#0B78E3]">0{i + 1}</span>
                  <div className="grid size-8 sm:size-9 place-items-center rounded-lg bg-orange-50 text-[#f97316]">
                    <Icon className="size-4 sm:size-4.5" />
                  </div>
                </div>
                <h3 className="mt-3 sm:mt-4 text-xs min-[375px]:text-sm sm:text-base font-bold uppercase tracking-wider text-[#082342] leading-snug">{title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 text-justify">{copy}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — OUR APPROACH (Process Flow Cards with Staggered 120ms reveal) */}
      <section className="grid md:grid-cols-2 border-t border-slate-200 overflow-hidden">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative min-h-[260px] sm:min-h-[440px] bg-slate-100 will-change-transform"
        >
          <img
            src="/images/about/Infrastructure.png"
            alt="Infrastructure construction precision and pipeline installation"
            loading="lazy"
            width={1504}
            height={1008}
            className="size-full object-cover"
          />
        </motion.div>

        <div className="bg-surface-blue p-6 sm:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="will-change-transform"
          >
            <Eyebrow>Our Approach</Eyebrow>
            <h2 className="mt-3 sm:mt-4 font-['Poppins',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#082342] leading-tight">
              Every Pipeline.<br />Carefully Considered.
            </h2>
          </motion.div>

          <ol className="mt-6 sm:mt-8 space-y-3.5 sm:space-y-5">
            {[
              "Survey & Planning — Comprehensive underground utility mapping and geotechnical assessment.",
              "Excavation & Laying — Precision trenching, laser-guided pipe laying, and robust jointing.",
              "Quality Testing — Hydrostatic pressure testing, leak detection, and compaction verification.",
              "Restoration & Handover — Complete road reinstatement, backfilling, and seamless commissioning.",
            ].map((item, i) => {
              const [title, desc] = item.split(" — ");
              const delay = i * 0.12; // 0ms, 120ms, 240ms, 360ms
              return (
                <motion.li
                  key={item}
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
                  className="flex items-start gap-3 sm:gap-4 text-xs sm:text-sm text-slate-700 rounded-lg p-2 sm:p-2.5 transition-transform duration-300 hover:md:-translate-y-[4px] will-change-transform"
                >
                  <span className="grid size-6 sm:size-7 shrink-0 place-items-center rounded-full bg-[#0B78E3]/15 text-[11px] sm:text-xs font-bold text-[#0B78E3] mt-0.5">
                    0{i + 1}
                  </span>
                  <div className="text-justify">
                    <strong className="font-semibold text-[#082342]">{title}</strong> — <span>{desc}</span>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>
    </PageFrame>
  );
}
