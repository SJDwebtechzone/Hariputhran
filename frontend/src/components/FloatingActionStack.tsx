import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp, Phone } from "lucide-react";

/* =========================================================================
   CONTACT CONFIGURATION (Single source of truth)
   Update this single variable to change the number for Call & WhatsApp
   ========================================================================= */
export const FLOATING_CONTACT_PHONE = "9840889432";
export const FLOATING_WHATSAPP_NUMBER = "91" + FLOATING_CONTACT_PHONE.replace(/\D/g, "");
export const FLOATING_WHATSAPP_DEFAULT_MESSAGE =
  "Hello Hariputhran Enterprises,\n\nI would like to know more about your services. Please contact me.\n\nThank you.";
export const FLOATING_WHATSAPP_LINK = `https://wa.me/${FLOATING_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  FLOATING_WHATSAPP_DEFAULT_MESSAGE
)}`;

/* =========================================================================
   OFFICIAL WHATSAPP ICON
   ========================================================================= */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className ?? "size-5"}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.405 3.595A11.895 11.895 0 0 0 12.003 0C5.385 0 .02 5.365.02 11.983c0 2.112.553 4.175 1.604 5.996L0 24l6.19-1.624a11.94 11.94 0 0 0 5.813 1.507h.005c6.618 0 11.983-5.365 11.983-11.983 0-3.203-1.247-6.214-3.586-8.305zm-8.402 18.283h-.004a9.92 9.92 0 0 1-5.056-1.39l-.363-.215-3.758.986 1.003-3.664-.236-.376a9.932 9.932 0 0 1-1.524-5.236c0-5.484 4.463-9.947 9.949-9.947a9.897 9.897 0 0 1 7.037 2.915 9.897 9.897 0 0 1 2.91 7.035c0 5.486-4.464 9.95-9.952 9.95zm5.456-7.45c-.299-.15-1.77-.874-2.044-.974-.274-.1-.473-.15-.672.15s-.772.973-.946 1.173c-.174.2-.349.225-.648.075-.3-.15-1.265-.466-2.41-1.487-.891-.795-1.493-1.777-1.667-2.076-.174-.3-.019-.462.13-.611.135-.134.3-.349.45-.523.149-.175.199-.299.299-.499.1-.2.05-.374-.025-.524-.075-.15-.673-1.622-.922-2.22-.242-.584-.488-.505-.672-.514-.174-.009-.374-.01-.573-.01-.2 0-.523.075-.797.374-.274.3-1.047 1.023-1.047 2.495 0 1.472 1.072 2.894 1.222 3.094.15.2 2.11 3.222 5.112 4.52 3.003 1.298 3.003.865 3.542.815.539-.05 1.77-.723 2.019-1.422.25-.698.25-1.297.175-1.422-.075-.125-.274-.2-.573-.35z"
      />
    </svg>
  );
}

/* =========================================================================
   FLOATING ACTION BUTTON STACK
   ========================================================================= */
export function FloatingActionStack() {
  const shouldReduceMotion = useReducedMotion();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <aside
      aria-label="Quick contact and page navigation actions"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 select-none print:hidden pointer-events-auto"
    >
      {/* 1. SCROLL TO TOP BUTTON (Appears when scrolled > 300px) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            key="scroll-to-top"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 20, scale: 0.85 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 15, scale: 0.85 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="group relative flex items-center"
          >
            {/* Desktop Tooltip */}
            <span
              role="tooltip"
              className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-[#0F172A]/95 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-xs transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 md:inline-block"
            >
              Scroll to Top
            </span>

            <button
              type="button"
              onClick={handleScrollToTop}
              aria-label="Scroll To Top"
              className="grid size-11 sm:size-12 place-items-center rounded-full bg-[#0F172A] text-white shadow-lg shadow-slate-900/25 transition-all duration-300 hover:bg-slate-800 hover:scale-105 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0284c7] focus-visible:ring-offset-2"
            >
              <ArrowUp className="size-5 stroke-[2.5] transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CALL BUTTON (100ms sequence delay entrance) */}
      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 20 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="group relative flex items-center"
      >
        {/* Desktop Tooltip */}
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-[#0F172A]/95 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-xs transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 md:inline-block"
        >
          Call Us
        </span>

        <a
          href={`tel:${FLOATING_CONTACT_PHONE}`}
          aria-label="Call Hariputhran Enterprises"
          className="grid size-11 sm:size-12 place-items-center rounded-full bg-[#0284c7] text-white shadow-[0_4px_16px_rgba(2,132,199,0.4)] transition-all duration-300 hover:bg-[#0369a1] hover:scale-105 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0284c7] focus-visible:ring-offset-2"
        >
          <Phone className="size-5 transition-transform duration-200 group-hover:scale-110" />
        </a>
      </motion.div>

      {/* 3. WHATSAPP BUTTON (200ms sequence delay entrance) */}
      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 20 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="group relative flex items-center"
      >
        {/* Desktop Tooltip */}
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-[#0F172A]/95 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-xs transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 md:inline-block"
        >
          WhatsApp Us
        </span>

        <a
          href={FLOATING_WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid size-11 sm:size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.4)] transition-all duration-300 hover:bg-[#20bd5a] hover:scale-105 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        >
          <WhatsAppIcon className="size-5.5 transition-transform duration-200 group-hover:scale-110" />
        </a>
      </motion.div>
    </aside>
  );
}

