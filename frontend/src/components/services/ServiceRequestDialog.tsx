import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Phone,
  Mail,
  User,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateServiceRequestPayload, CreateServiceRequestResponse } from "@/types/serviceRequests";

interface ServiceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId?: number | string | null;
  serviceName: string;
}

export function ServiceRequestDialog({
  open,
  onOpenChange,
  serviceId,
  serviceName,
}: ServiceRequestDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    phone: string;
    serviceName: string;
  } | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus lock and ESC key handling
  useEffect(() => {
    if (!open) {
      // Reset form states when closed
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setWebsite("");
      setFieldErrors({});
      setGeneralError(null);
      setIsSuccess(false);
      setSubmittedData(null);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = "hidden";

    // Auto-focus name field on desktop
    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const validateClientSide = (): boolean => {
    const errs: Record<string, string> = {};

    const cleanName = name.trim();
    if (!cleanName) {
      errs.name = "Please enter your full name.";
    } else if (cleanName.length < 2) {
      errs.name = "Full name must be at least 2 characters.";
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!cleanEmail) {
      errs.email = "Please enter your email address.";
    } else if (!emailRegex.test(cleanEmail) || cleanEmail.includes("..")) {
      errs.email = "Please enter a valid email address (e.g. name@domain.com).";
    }

    // Phone: only digits, 10 chars, starting with 6-9
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) {
      errs.phone = "Please enter your 10-digit mobile number.";
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = "Please enter a valid 10-digit Indian mobile number starting with 6-9.";
    }

    if (message.length > 1000) {
      errs.message = "Message must not exceed 1000 characters.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateClientSide()) {
      return;
    }

    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const rawApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const payload: CreateServiceRequestPayload = {
        serviceId: serviceId || null,
        serviceName,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message.trim() || undefined,
        website: website || undefined,
      };

      const response = await fetch(`${rawApiUrl}/api/service-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data: CreateServiceRequestResponse = await response.json().catch(() => {
        throw new Error(`Server returned unexpected format (${response.status})`);
      });

      if (response.status === 429) {
        setGeneralError("Too many requests. Please try again later.");
        return;
      }

      if (!response.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setGeneralError(data.message || "Failed to submit your request. Please check details and try again.");
        return;
      }

      // Success
      setSubmittedData({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.replace(/\D/g, ""),
        serviceName: data.data?.serviceName || serviceName,
      });
      setIsSuccess(true);
    } catch (err: any) {
      if (err.name === "AbortError") {
        setGeneralError("Request timed out. Please check your network connection and try again.");
      } else {
        setGeneralError("We could not send your request. Please check your connection and try again.");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const firstName = submittedData?.name.split(" ")[0] || name.trim().split(" ")[0] || "there";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-quote-title"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
    >
      {/* Backdrop */}
      <div
        onClick={() => !loading && onOpenChange(false)}
        className="fixed inset-0 bg-[#082342]/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Dialog Box */}
      <div
        ref={dialogRef}
        className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/20 bg-white shadow-2xl sm:max-w-lg sm:rounded-[28px] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="relative border-b border-slate-100 bg-gradient-to-r from-[#082342] to-[#0d3b66] px-6 py-5 text-white sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#f97316]">
                <span className="size-1.5 rounded-full bg-[#f97316]" />
                REQUEST A QUOTE
              </div>
              <h2
                id="request-quote-title"
                className="mt-1 font-['Poppins',sans-serif] text-xl font-bold tracking-tight sm:text-2xl"
              >
                Tell us about your project
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              aria-label="Close dialog"
              className="rounded-full bg-white/10 p-2 text-slate-300 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-50"
            >
              <X className="size-5" />
            </button>
          </div>

          <p className="mt-1 text-xs text-slate-200">
            Submit your requirements for fast technical consultation & transparent pricing.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {isSuccess ? (
            /* Thank You State */
            <div className="flex flex-col items-center text-center py-4">
              <div className="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-md ring-8 ring-emerald-50">
                <CheckCircle2 className="size-9 stroke-[2.5]" />
              </div>

              <h3 className="mt-5 font-['Poppins',sans-serif] text-xl font-extrabold text-[#082342] sm:text-2xl">
                Thank you! We have received your {submittedData?.serviceName || serviceName} request.
              </h3>

              <div className="mt-4 max-w-md rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-xs leading-relaxed text-[#082342] text-left">
                <p>
                  Hi <strong>{firstName}</strong>, we have received your request.
                </p>
                <p className="mt-2">
                  We will also email a confirmation to{" "}
                  <strong className="text-[#0284c7]">{submittedData?.email}</strong>, and our engineering team will contact you shortly on{" "}
                  <strong>+91 {submittedData?.phone}</strong>.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="mt-7 h-11 w-full rounded-full bg-[#082342] font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0284c7]"
              >
                CLOSE
              </Button>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error Alert */}
              {generalError && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                  <div className="leading-relaxed">{generalError}</div>
                </div>
              )}

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

              {/* 1. Locked Service Requirement */}
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Service Requirement
                </label>
                <div className="relative mt-1.5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100/90 px-3.5 py-2.5 text-xs text-slate-800">
                  <div className="flex items-center gap-2 font-semibold text-[#082342] truncate">
                    <Lock className="size-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{serviceName}</span>
                  </div>
                  <span className="rounded-md bg-[#0284c7]/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0284c7] shrink-0">
                    Selected
                  </span>
                </div>
              </div>

              {/* 2. Full Name */}
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3.5 top-3 size-4 text-slate-400" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="name"
                    maxLength={100}
                    autoComplete="name"
                    className={`w-full rounded-xl border bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 outline-none transition focus:bg-white focus:ring-2 ${
                      fieldErrors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-[#0284c7] focus:ring-[#0284c7]/20"
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors.name}</p>
                )}
              </div>

              {/* 3. Email Address */}
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3.5 top-3 size-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="@gmail.com"
                    maxLength={255}
                    autoComplete="email"
                    inputMode="email"
                    className={`w-full rounded-xl border bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 outline-none transition focus:bg-white focus:ring-2 ${
                      fieldErrors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-[#0284c7] focus:ring-[#0284c7]/20"
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              {/* 4. Mobile Number */}
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5 flex items-center">
                  <div className="absolute left-3 flex items-center gap-1.5 text-slate-500 font-mono text-xs font-bold pointer-events-none">
                    <Phone className="size-3.5 text-slate-400" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      // Only allow digits up to 10
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(val);
                    }}
                    placeholder="98765 43210"
                    inputMode="tel"
                    maxLength={10}
                    className={`w-full rounded-xl border bg-slate-50/50 pl-16 pr-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 outline-none transition focus:bg-white focus:ring-2 ${
                      fieldErrors.phone
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-[#0284c7] focus:ring-[#0284c7]/20"
                    }`}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors.phone}</p>
                )}
              </div>

              {/* 5. Message / Project Details (Optional) */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Project Details / Location <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className="font-mono text-[10px] text-slate-400">
                    {message.length}/1000
                  </span>
                </div>
                <div className="relative mt-1.5">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                    placeholder="Briefly describe site location, pipeline length, or project scope..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none transition focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20 resize-none"
                  />
                </div>
                {fieldErrors.message && (
                  <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="group h-11 w-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F97316] font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_22px_-4px_rgba(249,115,22,0.42)] transition-all duration-300 hover:from-[#ea6c00] hover:to-[#ea580c] hover:shadow-[0_14px_26px_-4px_rgba(249,115,22,0.52)] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      SEND REQUEST
                      <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>

              {/* Trust Line */}
              <p className="text-center font-sans text-[11px] text-slate-400 pt-1">
                Your details are used only to respond to your request.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
