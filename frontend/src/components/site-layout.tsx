import { Link, useRouterState } from "@tanstack/react-router";
import { Droplets, Facebook, Instagram, Mail, MapPin, Menu, Phone, Twitter, X, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { label: "Home", to: "/" as const },
  { label: "About", to: "/about" as const },
  { label: "Service", to: "/service" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string } = {}) {
  return (
    <Link to="/" className={`inline-flex items-center ${className ?? ""}`} aria-label="Hariputhran Enterprises home">
      <img
        src="/logo.png"
        alt="Hariputhran Enterprises Logo"
        className={`h-12 sm:h-14 w-auto max-w-[200px] object-contain transition-transform hover:scale-105 ${imgClassName ?? ""}`}
      />
    </Link>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-2 z-40 px-2 sm:top-4 sm:px-6">
      <div className="site-container relative flex h-14 items-center justify-between gap-3 rounded-full border border-white/70 bg-white/80 px-3.5 shadow-[0_8px_32px_0_rgba(31,114,255,0.10)] backdrop-blur-xl transition-all duration-300 sm:h-18 sm:gap-4 sm:px-6 dark:border-white/10 dark:bg-card/75">
        {/* Soft water ambient gradient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand-soft/40 via-surface-blue/30 to-brand-soft/30 opacity-70" />

        <div className="flex shrink-0 items-center">
          <Logo imgClassName="h-8 min-[375px]:h-9 sm:h-11" />
        </div>

        {/* Center Desktop Navigation Pill Links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-brand text-white shadow-sm shadow-brand/30"
                    : "text-foreground/80 hover:bg-brand-soft/70 hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="hidden rounded-full bg-[#f97316] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#ea580c] hover:scale-[1.02] sm:inline-flex"
          >
            <Link to="/contact">Get Started <span aria-hidden="true" className="ml-1">→</span></Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full text-foreground hover:bg-brand-soft/50 md:hidden flex items-center justify-center"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Water Glass Card Menu */}
      {menuOpen && (
        <nav
          className="site-container mt-2 grid gap-1 rounded-2xl border border-white/70 bg-white/95 p-3 shadow-xl backdrop-blur-2xl md:hidden dark:border-white/10 dark:bg-card/95"
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
                  isActive ? "bg-brand text-white" : "text-foreground/80 hover:bg-brand-soft/70 hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Button
            asChild
            size="sm"
            className="mt-2 w-full rounded-xl bg-[#f97316] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#ea580c]"
          >
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Get Started →</Link>
          </Button>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#0b63b6]/20 bg-[#083b6d] text-white">
      <div className="site-container grid gap-8 py-10 sm:gap-10 sm:py-14 md:grid-cols-[1.3fr_0.9fr_1fr_1.2fr] md:py-16 md:items-start">
        {/* Brand column */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center transition-transform hover:scale-105" aria-label="Hariputhran Enterprises home">
            <img
              src="/images/hariputhran-logo.png"
              alt="Hariputhran Enterprises Logo"
              className="h-12 sm:h-16 md:h-18 w-auto max-w-[240px] sm:max-w-[260px] object-contain"
            />
          </Link>
          <p className="max-w-xs text-xs leading-relaxed text-slate-300">
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
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#f97316]">Quick Links</p>
          <nav className="mt-4 flex flex-col space-y-2.5 text-xs font-medium text-slate-300">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="transition-colors hover:text-[#f97316]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Services */}
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#f97316]">Services</p>
          <nav className="mt-4 flex flex-col space-y-2 text-xs text-slate-300">
            <Link to="/service" className="hover:text-[#f97316] transition-colors">Sewerage Works</Link>
            <Link to="/service" className="hover:text-[#f97316] transition-colors">Drainage Works</Link>
            <Link to="/service" className="hover:text-[#f97316] transition-colors">Pipeline Installation</Link>
            <Link to="/service" className="hover:text-[#f97316] transition-colors">Manhole Construction</Link>
            <Link to="/service" className="hover:text-[#f97316] transition-colors">Chamber Works</Link>
            <Link to="/service" className="hover:text-[#f97316] transition-colors">Road Restoration</Link>
          </nav>
        </div>

        {/* Contact Info */}
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#f97316]">Contact Info</p>
          <div className="mt-4 space-y-3.5 text-xs text-slate-300">
            <div>
              <p className="font-bold text-white text-sm">Anand K B.Sc.</p>
              <p className="text-[11px] text-[#f97316] font-semibold">Proprietor</p>
              <p className="text-[10.5px] text-slate-400">Chennai Metro Water - Registered Contractor</p>
            </div>
            <div className="space-y-1.5">
              <a
                href="tel:+917200333487"
                className="flex items-center gap-2.5 transition-colors hover:text-[#f97316]"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[#f97316]">
                  <Phone className="size-3" />
                </span>
                <span>+91 72003 33487</span>
              </a>
              <a
                href="tel:+919003221019"
                className="flex items-center gap-2.5 transition-colors hover:text-[#f97316]"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[#f97316]">
                  <Phone className="size-3" />
                </span>
                <span>+91 90032 21019</span>
              </a>
            </div>
            <a
              href="mailto:anand@hariputhranenterprises.com"
              className="flex items-center gap-2.5 transition-colors hover:text-[#f97316]"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[#f97316]">
                <Mail className="size-3" />
              </span>
              <span className="break-all">anand@hariputhranenterprises.com</span>
            </a>
            <div className="flex items-start gap-2.5">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[#f97316] mt-0.5">
                <MapPin className="size-3" />
              </span>
              <span className="leading-relaxed text-[11.5px]">
                2B, Annai Sandhiya Nagar, TVK Link Road, Kodungaiyur, Chennai - 600118
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-white/10 bg-[#06284b]">
        <div className="site-container flex flex-wrap justify-between gap-4 py-4 text-[11px] text-slate-400">
          <span>© 2026 Hariputhran Enterprises. All rights reserved.</span>
          <span className="space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms &amp; Conditions</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function PageFrame({ children }: { children: React.ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow"><span />{children}</p>;
}