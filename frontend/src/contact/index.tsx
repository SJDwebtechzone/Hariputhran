import { useState, type FormEvent } from "react";
import { CheckCircle2, ExternalLink, Loader2, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow, PageFrame } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { submitContactMessage } from "@/admin-contact-messages/api";

export function ContactPage() {
  const shouldReduceMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Choose a subject");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot field

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (!cleanName || cleanName.length < 2 || cleanName.length > 100) {
      errors["name"] = "Please enter your name (2-100 characters).";
    }

    if (!cleanEmail) {
      errors["email"] = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors["email"] = "Please enter a valid email address.";
    }

    if (phone.trim().length > 0) {
      const cleanPhoneDigits = phone.replace(/\D/g, "");
      if (!/^[6-9]\d{9}$/.test(cleanPhoneDigits)) {
        errors["phone"] = "Please enter a valid 10-digit Indian mobile number starting with 6-9.";
      }
    }

    if (!cleanMessage || cleanMessage.length < 5 || cleanMessage.length > 2000) {
      errors["message"] = "Please enter a message between 5 and 2000 characters.";
    }


    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: cleanName,
        email: cleanEmail,
        phone: phone.trim() || undefined,
        subject: subject !== "Choose a subject" ? subject : undefined,
        message: cleanMessage,
        website: website.trim() || undefined,
      };

      const res = await submitContactMessage(payload);

      if (!res.success) {
        if (res.errors) {
          setFieldErrors(res.errors);
        }
        setGeneralError(res.message || "Failed to send message. Please check the fields.");
        return;
      }

      setSubmittedData({ name: cleanName, email: cleanEmail });
      setIsSuccess(true);
    } catch (err: any) {
      setGeneralError(err.message || "Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSubject("Choose a subject");
    setMessage("");
    setWebsite("");
    setFieldErrors({});
    setGeneralError(null);
    setIsSuccess(false);
    setSubmittedData(null);
  };

  return (
    <PageFrame>
      {/* SECTION 1 — CONTACT HERO */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20">
        <div className="site-container grid items-center gap-10 md:grid-cols-[.9fr_1.1fr]">
          <div className="min-w-0">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="will-change-transform"
            >
              <Eyebrow>Contact Us</Eyebrow>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="mt-5 text-[2.65rem] font-semibold leading-[1.08] sm:text-5xl md:text-6xl will-change-transform"
            >
              Get In Touch <br /><span className="text-brand">With Our Team</span>
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="mt-6 max-w-md text-sm leading-7 text-muted-foreground will-change-transform"
            >
              Have a question, tender requirement, or need civil engineering consultation? Our team is here to help. Get in touch with us and we’ll respond as soon as possible.
            </motion.p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] sm:gap-6 sm:text-xs">
              <motion.a
                href="tel:+917200333487"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.25, ease: "easeOut" }}
                className="flex min-w-0 items-center gap-3 hover:text-brand transition-colors will-change-transform"
              >
                <Phone className="size-5 shrink-0 text-brand" />
                <span>
                  <b className="block text-foreground">Call Us</b>
                  <span className="text-muted-foreground">+91 72003 33487 / +91 90032 21019</span>
                </span>
              </motion.a>

              <motion.a
                href="mailto:anand@hariputhranenterprises.com"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
                className="flex min-w-0 items-center gap-3 hover:text-brand transition-colors will-change-transform"
              >
                <Mail className="size-5 shrink-0 text-brand" />
                <span>
                  <b className="block text-foreground">Email Us</b>
                  <span className="text-muted-foreground break-all">anand@hariputhranenterprises.com</span>
                </span>
              </motion.a>
            </div>
          </div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative min-w-0 will-change-transform"
          >
            <span className="absolute -left-4 top-0 size-4 rounded-full bg-accent sm:size-5" />
            <img
              src="/images/contact/contact-us.jpeg"
              alt="Hariputhran Enterprises civil engineering consultation"
              width={1504}
              height={1104}
              fetchPriority="high"
              decoding="async"
              className="blob-image aspect-[1.25] w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 sm:py-20 overflow-hidden">
        <div className="site-container grid min-w-0 overflow-hidden rounded-lg bg-surface-blue shadow-sm lg:grid-cols-[.8fr_1.2fr]">
          <div className="min-w-0 p-6 sm:p-8 md:p-12">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="will-change-transform"
            >
              <Eyebrow>Send Us a Message</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Let’s Talk<br />About <span className="text-brand">Infrastructure</span>
              </h2>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                Fill out the form and we’ll get back to you within 24 hours.
              </p>
            </motion.div>

            {/* Contact Information Cards (Staggered translateX: 20px -> 0) */}
            <div className="mt-8 space-y-4 text-xs text-muted-foreground">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
                className="rounded-lg bg-white/70 p-3.5 border border-slate-100 shadow-xs dark:bg-card/50"
              >
                <p className="font-bold text-slate-900 text-sm">Anand K B.Sc.</p>
                <p className="text-[11px] text-brand font-semibold">Proprietor</p>
                <p className="text-[10.5px] text-slate-500">Chennai Metro Water - Registered Contractor</p>
              </motion.div>

              {[
                {
                  Icon: Phone,
                  content: (
                    <div className="flex flex-col gap-0.5">
                      <a href="tel:+917200333487" className="hover:text-brand transition-colors">+91 72003 33487</a>
                      <a href="tel:+919003221019" className="hover:text-brand transition-colors">+91 90032 21019</a>
                    </div>
                  ),
                  delay: 0.1,
                },
                {
                  Icon: Mail,
                  content: (
                    <a href="mailto:anand@hariputhranenterprises.com" className="hover:text-brand transition-colors break-all">
                      anand@hariputhranenterprises.com
                    </a>
                  ),
                  delay: 0.2,
                },
                {
                  Icon: MapPin,
                  content: (
                    <span className="leading-relaxed">
                      2B, Annai Sandhiya Nagar, TVK Link Road, Kodungaiyur, Chennai - 600118
                    </span>
                  ),
                  delay: 0.3,
                },
              ].map(({ Icon, content, delay }, index) => (
                <motion.div
                  key={index}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay, ease: "easeOut" }}
                  className="flex items-start gap-3 will-change-transform"
                >
                  <Icon className="size-4 shrink-0 text-brand mt-0.5" />
                  <div>{content}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {isSuccess ? (
            /* Thank You State */
            <div className="m-3 flex flex-col items-center justify-center rounded-lg bg-background p-6 sm:m-4 sm:p-10 md:m-7 text-center">
              <div className="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-md ring-8 ring-emerald-50 mb-4">
                <CheckCircle2 className="size-9 stroke-[2.5]" />
              </div>

              <h3 className="font-['Poppins',sans-serif] text-2xl font-bold text-[#082342] sm:text-3xl">
                Thank you, {submittedData?.name.split(" ")[0]}!
              </h3>

              <div className="mt-4 max-w-md rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-xs sm:text-sm leading-relaxed text-[#082342] text-left">
                <p>
                  We have received your message and sent a confirmation to{" "}
                  <strong className="text-[#0284c7]">{submittedData?.email}</strong>.
                </p>
                <p className="mt-2 text-slate-600">
                  Our team will review your inquiry and get back to you within 24 hours.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleResetForm}
                className="mt-6 h-11 rounded-full bg-[#082342] px-7 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0284c7] transition-all"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            /* Contact Form */
            <form
              className="m-3 grid min-w-0 gap-5 rounded-lg bg-background p-5 sm:m-4 sm:p-7 md:m-7 md:grid-cols-2"
              onSubmit={handleSubmit}
            >
              {/* Honeypot field (hidden from real users) */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden pointer-events-none absolute -left-[9999px]"
              />

              {/* General error alert */}
              {generalError && (
                <div className="md:col-span-2 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                  <div className="leading-relaxed">{generalError}</div>
                </div>
              )}

              {/* Field 1: Name */}
              <motion.label
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0, ease: "easeOut" }}
                className="min-w-0 will-change-transform"
              >
                <span className="mb-2 block text-xs font-medium">
                  Your Name <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`h-11 w-full min-w-0 rounded-md border bg-background px-4 text-sm outline-none transition focus:border-brand ${
                    fieldErrors["name"] ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                  placeholder="Enter your name"
                />
                {fieldErrors["name"] && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors["name"]}</p>
                )}
              </motion.label>

              {/* Field 2: Email */}
              <motion.label
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.07, ease: "easeOut" }}
                className="min-w-0 will-change-transform"
              >
                <span className="mb-2 block text-xs font-medium">
                  Email Address <span className="text-red-500">*</span>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-11 w-full min-w-0 rounded-md border bg-background px-4 text-sm outline-none transition focus:border-brand ${
                    fieldErrors["email"] ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                  placeholder="Enter email address"
                />
                {fieldErrors["email"] && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors["email"]}</p>
                )}
              </motion.label>

              {/* Field 3: Phone */}
              <motion.label
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.14, ease: "easeOut" }}
                className="min-w-0 md:col-span-2 will-change-transform"
              >
                <span className="mb-2 block text-xs font-medium">Phone Number</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`h-11 w-full min-w-0 rounded-md border bg-background px-4 text-sm outline-none transition focus:border-brand ${
                    fieldErrors["phone"] ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                  placeholder="Enter phone number"
                />
                {fieldErrors["phone"] && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors["phone"]}</p>
                )}
              </motion.label>

              {/* Field 4: Subject */}
              <motion.label
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.21, ease: "easeOut" }}
                className="min-w-0 md:col-span-2 will-change-transform"
              >
                <span className="mb-2 block text-xs font-medium">Select Subject</span>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-11 w-full min-w-0 rounded-md border border-border bg-background px-4 text-sm text-foreground"
                >
                  <option>Choose a subject</option>
                  <option>Underground Sewerage Works</option>
                  <option>Stormwater Drainage Systems</option>
                  <option>Pipeline Installation &amp; Laying</option>
                  <option>Manhole &amp; Chamber Construction</option>
                  <option>Rehabilitation &amp; Upgradation Works</option>
                  <option>Road Cutting &amp; Restoration</option>
                  <option>Pumping Station Works</option>
                  <option>Government Tender &amp; Project Inquiry</option>
                </select>
              </motion.label>

              {/* Field 5: Message */}
              <motion.label
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.28, ease: "easeOut" }}
                className="min-w-0 md:col-span-2 will-change-transform"
              >
                <span className="mb-2 block text-xs font-medium">
                  Your Message <span className="text-red-500">*</span>
                </span>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`min-h-28 w-full min-w-0 rounded-md border bg-background p-4 text-sm outline-none transition focus:border-brand ${
                    fieldErrors["message"] ? "border-red-400 bg-red-50/20" : "border-border"
                  }`}
                  placeholder="Type your message here..."
                />
                {fieldErrors["message"] && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors["message"]}</p>
                )}
              </motion.label>


              {/* Submit Button */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.35, ease: "easeOut" }}
                className="justify-self-start will-change-transform"
              >
                <Button variant="brand" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Message →"
                  )}
                </Button>
              </motion.div>
            </form>
          )}
        </div>
      </section>

      {/* SECTION 3 — LOCATIONS & MAP */}
      <section className="pb-20 overflow-hidden">
        <div className="site-container grid gap-10 md:grid-cols-2 items-center">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="will-change-transform"
          >
            <Eyebrow>Our Locations</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold">Our Offices</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Visit us at one of our locations or get in touch for more details.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-6">
              <div className="rounded-xl border border-slate-100 bg-surface-blue/50 p-4">
                <p className="font-bold text-slate-900 text-sm">Head Office</p>
                <p className="text-[#f97316] font-semibold text-[11.5px] mt-0.5">Hariputhran Enterprises</p>
                <p className="text-slate-600 mt-1">
                  2B, Annai Sandhiya Nagar,<br />
                  TVK Link Road, Kodungaiyur,<br />
                  Chennai - 600118, Tamil Nadu
                </p>
                <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <p><b>Proprietor:</b> Anand K B.Sc.</p>
                  <p>Chennai Metro Water - Registered Contractor</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-surface-blue/50 p-4 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">Direct Contact</p>
                  <p className="text-[#0284c7] font-semibold text-[11.5px] mt-0.5">Quick Project Inquiries</p>
                  <p className="text-slate-600 mt-1 space-y-1">
                    <span className="block"><b>Phone:</b> +91 72003 33487 / 90032 21019</span>
                    <span className="block"><b>Email:</b> anand@hariputhranenterprises.com</span>
                    <span className="block"><b>Web:</b> www.hariputhranenterprises.com</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Google Map (Official Hariputhran Enterprises Location: 13.1274995, 80.2630203) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="group relative min-h-[320px] sm:min-h-[360px] overflow-hidden rounded-xl border border-border shadow-sm will-change-transform"
          >
            <iframe
              title="Hariputhran Enterprises Official Location - 2B, Annai Sandhiya Nagar, TVK Link Road, Kodungaiyur, Chennai"
              src="https://maps.google.com/maps?q=13.1274995,80.2630203&hl=en&z=17&output=embed"
              className="h-full min-h-[320px] sm:min-h-[360px] w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Get Directions Floating Action Button */}
            <div className="absolute bottom-3.5 right-3.5 z-10">
              <Button
                asChild
                size="sm"
                className="rounded-full bg-[#0a2342] text-white shadow-lg backdrop-blur-md transition-all hover:bg-[#f97316] hover:scale-[1.03] text-xs font-bold uppercase tracking-wider"
              >
                <a
                  href="https://www.google.com/maps/place/13%C2%B007'39.0%22N+80%C2%B015'46.9%22E/@13.1274995,80.2604454,17z/data=!3m1!4b1!4m4!3m3!8m2!3d13.1274995!4d80.2630203"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2"
                >
                  <Navigation className="size-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="size-3 opacity-70" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageFrame>
  );
}
