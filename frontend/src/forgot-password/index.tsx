import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Mail,
  ShieldCheck,
  HardHat,
  AlertCircle,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Countdown timer for resend cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.trim()) {
      setErrorMessage("Please enter your admin email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Please enter a valid email address format.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.status === 429) {
        throw new Error(
          data.message || "Too many password reset requests. Please try again in 15 minutes."
        );
      }

      if (!response.ok && !data.success) {
        throw new Error(data.message || "Failed to process password reset request.");
      }

      setIsSubmitted(true);
      setCooldown(60); // 60 seconds cooldown
      toast.success("Reset link sent!", {
        description: "Please check your email inbox for instructions.",
      });
    } catch (err: any) {
      const msg = err.message || "Unable to connect to server. Please try again later.";
      setErrorMessage(msg);
      toast.error("Request Failed", {
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-center bg-gradient-to-br from-[#082342] via-[#0a2f57] to-[#082342] px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-24 top-0 size-[450px] rounded-full bg-[#0284c7]/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-[450px] rounded-full bg-[#f97316]/15 blur-[100px]" />

      {/* Top Header Bar */}
      <div className="mx-auto mb-8 flex w-full max-w-md items-center justify-between">
        <Link
          to="/login"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-300 transition-colors hover:text-[#f97316]"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          Back to Sign In
        </Link>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] font-medium text-slate-300 backdrop-blur-md">
          <ShieldCheck className="size-3.5 text-[#38bdf8]" />
          Password Recovery
        </div>
      </div>

      {/* Main Card */}
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]">
        {/* Header inside Card */}
        <div className="relative border-b border-slate-100 bg-gradient-to-b from-[#f8fbff] to-white px-8 pb-6 pt-8 text-center">
          {/* Official Company Logo */}
          <Link
            to="/"
            className="inline-flex items-center justify-center transition-transform hover:scale-105"
            aria-label="Hariputhran Enterprises Home"
          >
            <img
              src="/logo.png"
              alt="Hariputhran Enterprises Logo"
              className="h-12 sm:h-14 w-auto max-w-[210px] object-contain"
            />
          </Link>

          <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-[#0284c7]/20 bg-[#0284c7]/5 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[1.5px] text-[#0284c7]">
            <span className="size-1.5 rounded-full bg-[#0284c7]" />
            PASSWORD RECOVERY
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {isSubmitted
              ? "Password reset instructions dispatched"
              : "Enter your registered admin email to receive a secure reset link"}
          </p>
        </div>

        {/* Card Body */}
        <div className="p-8 text-slate-800">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-700">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {isSubmitted ? (
            /* Success confirmation view */
            <div className="space-y-6 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                <CheckCircle2 className="size-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-['Poppins',sans-serif] text-lg font-bold text-[#082342]">
                  Check your email
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  If an account exists for <b className="text-slate-900">{email}</b>, we have sent a reset link. It is valid for <b>15 minutes</b>.
                </p>
              </div>

              <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4 text-xs text-[#0369a1] text-left">
                💡 <b>Tip:</b> Don't see the email? Check your Spam or Junk folder, or request another link below once the timer expires.
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isLoading || cooldown > 0}
                  variant="outline"
                  className="h-11 w-full rounded-xl border-slate-200 font-bold uppercase tracking-wider text-[#0284c7] hover:bg-sky-50 hover:text-[#082342]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Sending...
                    </>
                  ) : cooldown > 0 ? (
                    <>
                      <RefreshCw className="mr-2 size-4 animate-spin" />
                      Resend in {cooldown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 size-4" />
                      Resend Reset Link
                    </>
                  )}
                </Button>

                <Button
                  asChild
                  className="h-11 w-full rounded-xl bg-[#082342] font-bold uppercase tracking-wider text-white hover:bg-[#0b2d55]"
                >
                  <Link to="/login">
                    Return to Sign In
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            /* Email Input Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Admin Email Address
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@hariputhran.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60 pl-10 text-sm text-slate-900 transition-colors focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-xl bg-[#f97316] font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] hover:bg-[#ea580c] active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  <>
                    SEND RESET LINK
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-500 hover:text-[#0284c7] hover:underline"
                >
                  Remembered your password? Sign in
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Footer info inside Card */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-8 py-4 text-center text-xs text-slate-500">
          Need portal assistance?{" "}
          <Link
            to="/contact"
            className="font-bold text-[#0284c7] hover:text-[#082342] hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </div>

      {/* Page bottom copyright */}
      <div className="mt-8 text-center font-mono text-xs text-slate-400">
        © {new Date().getFullYear()} Hariputhran Enterprises. All rights reserved.
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
