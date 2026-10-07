import { Link, useRouterState } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Menu, Phone, Twitter, X, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFooterServices } from "@/hooks/useFooterServices";
import { FloatingActionStack } from "@/components/FloatingActionStack";

const navItems = [
  { label: "Home", to: "/" as const },
  { label: "About", to: "/about" as const },
  { label: "Service", to: "/service" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string } = {}) {
  return (
    <Link to="/" className={`inline-flex items-center shrink-0 ${className ?? ""}`} aria-label="Hariputhran Enterprises home">
      <img
        src="/logo.png"
        alt="Hariputhran Enterprises Logo"
        width={1024}
        height={1024}
        decoding="async"
        className={`h-16 sm:h-[82px] w-auto object-contain transition-transform hover:scale-105 drop-shadow-md ${imgClassName ?? ""}`}
      />
    </Link>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-2 z-40 px-2 sm:top-4 sm:px-6">
      <div className="site-container relative flex h-20 sm:h-[100px] items-center justify-between gap-4 rounded-full border border-white/20 bg-gradient-to-r from-[#061e38]/90 via-[#0a284d]/92 to-[#061e38]/90 px-4 sm:px-8 shadow-[0_12px_40px_rgba(2,20,45,0.45),0_1px_3px_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-all duration-300">
        {/* Soft ambient gradient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#0284c7]/20 via-[#38bdf8]/10 to-[#f97316]/15 opacity-70" />

        {/* Left: Dedicated Logo Area */}
        <div className="flex shrink-0 items-center">
          <Logo imgClassName="h-[60px] min-[375px]:h-[66px] sm:h-[82px]" />
        </div>

        {/* Center: Desktop Navigation Pill Links */}
        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-[#0284c7] text-[#ffffff] shadow-md shadow-[#0284c7]/40"
                    : "text-[#ffffff] hover:text-[#f97316] hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="hidden rounded-full bg-[#f97316] px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-[#ea580c] hover:scale-[1.02] sm:inline-flex h-11"
          >
            <Link to="/contact">Get Started <span aria-hidden="true" className="ml-1">→</span></Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full text-white hover:bg-white/15 md:hidden flex items-center justify-center"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Deep Blue Glass Menu */}
      {menuOpen && (
        <nav
          className="site-container mt-2 grid gap-1.5 rounded-2xl border border-white/20 bg-gradient-to-b from-[#061e38]/98 via-[#0a284d]/98 to-[#061e38]/98 p-4 shadow-2xl backdrop-blur-2xl md:hidden"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive ? "bg-[#0284c7] text-[#ffffff] shadow-sm" : "text-[#ffffff] hover:text-[#f97316] hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Button
            asChild
            size="sm"
            className="mt-2 w-full rounded-xl bg-[#f97316] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/25 transition-all hover:bg-[#ea580c]"
          >
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Get Started →</Link>
          </Button>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { services, loading } = useFooterServices();

  return (
    <footer className="border-t border-[#0b63b6]/20 bg-[#083b6d] text-white">
      <div className="site-container grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-[1.3fr_0.9fr_1fr_1.2fr] gap-8 py-10 sm:gap-10 sm:py-14 md:py-16 md:items-start">
        {/* Brand column */}
        <div className="col-span-1 min-[360px]:col-span-2 md:col-span-1 space-y-4">
          <Link to="/" className="inline-flex items-center transition-transform hover:scale-105" aria-label="Hariputhran Enterprises home">
            <img
              src="/images/hariputhran-logo.png"
              alt="Hariputhran Enterprises Logo"
              className="h-12 sm:h-16 md:h-18 w-auto max-w-[240px] sm:max-w-[260px] object-contain"
            />
          </Link>
          <p className="max-w-xs text-xs sm:text-xs leading-relaxed text-white">
            Specialized civil &amp; underground utility infrastructure contractors delivering high-quality sewerage, drainage, pipeline, and road restoration works.
          </p>
          <div className="flex gap-2.5 pt-2">
            {[
              { Icon: Facebook, href: "#", label: "Facebook" },
              { Icon: Instagram, href: "#", label: "Instagram" },
              { Icon: Twitter, href: "#", label: "Twitter" },
              { Icon: Youtube, href: "#", label: "Youtube" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid size-8 place-items-center rounded-full bg-white/10 text-white transition-all hover:bg-[#f97316] hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#f97316]">Quick Links</p>
          <nav className="mt-4 flex flex-col space-y-1 sm:space-y-2 text-sm sm:text-xs font-medium text-white">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="min-h-[44px] sm:min-h-0 inline-flex items-center text-white transition-colors hover:text-[#f97316]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Services */}
        <div className="col-span-1">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#f97316]">Services</p>
          <nav className="mt-4 flex flex-col space-y-1 sm:space-y-2 text-sm sm:text-xs text-white">
            {loading ? (
              <div className="space-y-2.5 py-1" aria-busy="true" aria-label="Loading services">
                <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
              </div>
            ) : services.length === 0 ? (
              <Link
                to="/service"
                hash="core-services"
                className="min-h-[44px] sm:min-h-0 inline-flex items-center text-white hover:text-[#f97316] transition-colors"
              >
                All Services
              </Link>
            ) : (
              services.map((service, idx) => (
                service.id ? (
                  <Link
                    key={service.id || idx}
                    to="/service"
                    hash={`service-${service.id}`}
                    className="min-h-[44px] sm:min-h-0 inline-flex items-center text-white hover:text-[#f97316] transition-colors"
                  >
                    {service.title}
                  </Link>
                ) : (
                  <Link
                    key={idx}
                    to="/service"
                    className="min-h-[44px] sm:min-h-0 inline-flex items-center text-white hover:text-[#f97316] transition-colors"
                  >
                    {service.title}
                  </Link>
                )
              ))
            )}
          </nav>
        </div>

        {/* Contact Info */}
        <div className="col-span-1 min-[360px]:col-span-2 md:col-span-1">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#f97316]">Contact Info</p>
          <div className="mt-4 space-y-3.5 text-xs text-white">
            <div>
              <p className="font-bold text-white text-sm">Anand K</p>
              <p className="text-[11px] text-[#f97316] font-semibold">Proprietor</p>
              <p className="text-[10.5px] text-white">Chennai Metro Water - Registered Contractor</p>
            </div>
            {/* Phone Numbers on single line with one icon */}
            <div className="flex items-start gap-2.5">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[#f97316] mt-0.5">
                <Phone className="size-3" />
              </span>
              <div className="flex flex-wrap items-center gap-x-1.5 text-sm sm:text-xs text-white">
                <a
                  href="tel:+917200333487"
                  className="whitespace-nowrap transition-colors hover:text-[#f97316] min-h-[44px] sm:min-h-0 inline-flex items-center text-white"
                >
                  +91 72003 33487
                </a>
                <span className="text-white">/</span>
                <a
                  href="tel:+919003221019"
                  className="whitespace-nowrap transition-colors hover:text-[#f97316] min-h-[44px] sm:min-h-0 inline-flex items-center text-white"
                >
                  +91 90032 21019
                </a>
              </div>
            </div>
            {/* Email */}
            <a
              href="mailto:anand@hariputhranenterprises.com"
              className="flex items-center gap-2.5 transition-colors hover:text-[#f97316] min-h-[44px] sm:min-h-0 text-white"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[#f97316]">
                <Mail className="size-3" />
              </span>
              <span className="text-sm sm:text-xs break-all text-white">anand@hariputhranenterprises.com</span>
            </a>
            {/* Address */}
            <div className="flex items-start gap-2.5">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[#f97316] mt-0.5">
                <MapPin className="size-3" />
              </span>
              <span className="leading-relaxed text-sm sm:text-[11.5px] break-words text-white">
                2B, Annai Sandhiya Nagar, TVK Link Road, Kodungaiyur, Chennai - 600118
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-white/10 bg-[#06284b] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <div className="site-container flex flex-wrap justify-between gap-4 py-4 text-[11px] text-slate-400">
          <span>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://devspectra.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-white transition-colors focus-visible:outline-hidden focus-visible:underline"
            >
              DevSpectra
            </a>
            . All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingActionStack />
    </>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow"><span />{children}</p>;
}