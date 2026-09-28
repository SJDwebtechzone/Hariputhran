import { Mail, MapPin, Phone } from "lucide-react";
import { Eyebrow, PageFrame } from "@/components/site-layout";
import { Button } from "@/components/ui/button";

export function ContactPage() {
  return (
    <PageFrame>
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20">
        <div className="site-container grid items-center gap-10 md:grid-cols-[.9fr_1.1fr]">
          <div className="min-w-0">
            <Eyebrow>Contact Us</Eyebrow>
            <h1 className="mt-5 text-[2.65rem] font-semibold leading-[1.08] sm:text-5xl md:text-6xl">
              We’d Love to<br /><span className="text-brand">Hear From You</span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
              Have a question, tender requirement, or need civil engineering consultation? Our team is here to help. Get in touch with us and we’ll respond as soon as possible.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-[11px] sm:flex sm:gap-8 sm:text-xs">
              <span className="flex min-w-0 items-center gap-3">
                <Phone className="size-5 shrink-0 text-brand" />
                <b>Call Us<br />+91 98765 43210</b>
              </span>
              <span className="flex min-w-0 items-center gap-3">
                <Mail className="size-5 shrink-0 text-brand" />
                <b className="min-w-0 break-all sm:break-normal">Email Us<br />info@hariputhran.co.in</b>
              </span>
            </div>
          </div>
          <div className="relative min-w-0">
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
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 sm:py-20">
        <div className="site-container grid min-w-0 overflow-hidden rounded-lg bg-surface-blue shadow-sm lg:grid-cols-[.8fr_1.2fr]">
          <div className="min-w-0 p-6 sm:p-8 md:p-12">
            <Eyebrow>Send Us a Message</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Let’s Talk<br />About <span className="text-brand">Infrastructure</span>
            </h2>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Fill out the form and we’ll get back to you within 24 hours.
            </p>
            <div className="mt-10 space-y-5 text-xs text-muted-foreground">
              <p className="flex gap-3"><Mail className="size-4 shrink-0 text-brand" />info@hariputhran.co.in</p>
              <p className="flex gap-3"><Phone className="size-4 shrink-0 text-brand" />+91 98765 43210</p>
              <p className="flex gap-3"><MapPin className="size-4 shrink-0 text-brand" />Chennai, Tamil Nadu, India</p>
            </div>
          </div>
          <form className="m-3 grid min-w-0 gap-5 rounded-lg bg-background p-5 sm:m-4 sm:p-7 md:m-7 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
            {["Your Name *", "Email Address *", "Phone Number"].map((label) => (
              <label key={label} className={`min-w-0 ${label === "Phone Number" ? "md:col-span-2" : ""}`}>
                <span className="mb-2 block text-xs font-medium">{label}</span>
                <input
                  className="h-11 w-full min-w-0 rounded-md border border-border px-4 text-sm outline-none focus:border-brand"
                  placeholder={`Enter ${label.replace(" *", "").toLowerCase()}`}
                />
              </label>
            ))}
            <label className="min-w-0 md:col-span-2">
              <span className="mb-2 block text-xs font-medium">Select Subject</span>
              <select className="h-11 w-full min-w-0 rounded-md border border-border bg-background px-4 text-sm text-muted-foreground">
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
            </label>
            <label className="min-w-0 md:col-span-2">
              <span className="mb-2 block text-xs font-medium">Your Message *</span>
              <textarea
                className="min-h-28 w-full min-w-0 rounded-md border border-border p-4 text-sm outline-none focus:border-brand"
                placeholder="Type your message here..."
              />
            </label>
            <Button variant="brand" className="justify-self-start">Send Message →</Button>
          </form>
        </div>
      </section>

      <section className="pb-20">
        <div className="site-container grid gap-10 md:grid-cols-2">
          <div>
            <Eyebrow>Our Locations</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold">Our Offices</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Visit us at one of our locations or get in touch for more details.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-8 text-xs leading-6">
              <p><b>Head Office</b><br />Hariputhran Enterprises,<br />Chennai – 600039, Tamil Nadu</p>
              <p><b>Operations Depot</b><br />Project Field Depot,<br />North Chennai Zone, Tamil Nadu</p>
            </div>
          </div>
          <div className="relative min-h-64 overflow-hidden rounded-xl border border-border shadow-sm">
            <iframe
              title="Hariputhran Enterprises Location - Chennai, Tamil Nadu"
              src="https://maps.google.com/maps?q=Chennai%2C%20Tamil%20Nadu&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="h-full min-h-[300px] w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
