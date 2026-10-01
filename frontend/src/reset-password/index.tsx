import { useState, useMemo } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  HardHat,
  AlertCircle,
  Loader2,
  CheckCircle2,
  KeyRound,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/reset-password" }) as { token?: string };
  const token = search?.token || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Real-time password criteria evaluation
  const checks = useMemo(() => {
    return {
      minLength: newPassword.length >= 8,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/]/.test(newPassword),
      passwordsMatch: newPassword.length > 0 && newPassword === confirmPassword,
    };
  }, [newPassword, confirmPassword]);

  // Score calculation for strength meter (0 - 5)
  const strengthScore = useMemo(() => {
    let score = 0;
    if (checks.minLength) score += 1;
    if (checks.hasUpper) score += 1;
    if (checks.hasLower) score += 1;
    if (checks.hasNumber) score += 1;
    if (checks.hasSpecial) score += 1;
    return score;
  }, [checks]);

  const strengthMeta = useMemo(() => {
    if (newPassword.length === 0) return { label: "", color: "bg-slate-200", textColor: "text-slate-400", percent: 0 };
    if (strengthScore <= 2) return { label: "Weak", color: "bg-red-500", textColor: "text-red-600", percent: 30 };
    if (strengthScore <= 4) return { label: "Moderate", color: "bg-amber-500", textColor: "text-amber-600", percent: 70 };
    return { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-600", percent: 100 };
  }, [newPassword, strengthScore]);

  const allPassed =
    checks.minLength &&
    checks.hasUpper &&
    checks.hasLower &&
    checks.hasNumber &&
    checks.hasSpecial &&
    checks.passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage("Missing password reset token. Please request a new reset link.");
      return;
    }

    if (!allPassed) {
      setErrorMessage("Please ensure your new password meets all security criteria below.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 400 && data.message?.toLowerCase().includes("expired")) {
          setIsExpired(true);
        }
        throw new Error(data.message || "Failed to reset password. Please try again.");
      }

      setIsSuccess(true);
      toast.success("Password reset successful!", {
        description: "Your password has been changed. Redirecting to sign in...",
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2000);
    } catch (err: any) {
      const msg = err.message || "An error occurred while resetting your password.";
      setErrorMessage(msg);
      toast.error("Reset Failed", {
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
          Secure Password Reset
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
            SET NEW PASSWORD
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Create a strong, unique password to secure your admin portal account
          </p>
        </div>

        {/* Card Body */}
        <div className="p-8 text-slate-800">
          {!token || isExpired ? (
            /* Missing or Expired Token State */
            <div className="space-y-6 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/50">
                <XCircle className="size-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-['Poppins',sans-serif] text-lg font-bold text-[#082342]">
                  {isExpired ? "Reset Link Expired" : "Invalid Reset Link"}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {isExpired
                    ? "This password reset link has expired or has already been used. Please request a fresh link."
                    : "The reset link is invalid or incomplete. Please request a new password reset link."}
                </p>
              </div>

              <Button
                asChild
                className="h-11 w-full rounded-xl bg-[#f97316] font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 hover:bg-[#ea580c]"
              >
                <Link to="/forgot-password">
                  REQUEST A NEW LINK
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          ) : isSuccess ? (
            /* Success State */
            <div className="space-y-6 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                <CheckCircle2 className="size-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-['Poppins',sans-serif] text-lg font-bold text-[#082342]">
                  Password Reset Complete!
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Your new password has been applied. Redirecting you to the admin sign-in page...
                </p>
              </div>

              <Button
                asChild
                className="h-11 w-full rounded-xl bg-[#082342] font-bold uppercase tracking-wider text-white hover:bg-[#0b2d55]"
              >
                <Link to="/login">
                  SIGN IN NOW
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-700">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                  <div className="flex-1 leading-relaxed">{errorMessage}</div>
                </div>
              )}

              {/* New Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="newPassword"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoFocus
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60 pl-10 pr-10 text-sm text-slate-900 transition-colors focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Strength Indicator */}
              {newPassword.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Password Strength:</span>
                    <span className={`font-bold ${strengthMeta.textColor}`}>
                      {strengthMeta.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full transition-all duration-300 ${strengthMeta.color}`}
                      style={{ width: `${strengthMeta.percent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60 pl-10 pr-10 text-sm text-slate-900 transition-colors focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Live Criteria Checklist */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 space-y-2 text-[11px]">
                <div className="font-bold text-slate-600 mb-1 uppercase tracking-wider text-[10px]">
                  Security Requirements
                </div>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  <div className={`flex items-center gap-1.5 ${checks.minLength ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${checks.minLength ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    8+ characters
                  </div>

                  <div className={`flex items-center gap-1.5 ${checks.hasUpper ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${checks.hasUpper ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    One uppercase letter
                  </div>

                  <div className={`flex items-center gap-1.5 ${checks.hasLower ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${checks.hasLower ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    One lowercase letter
                  </div>

                  <div className={`flex items-center gap-1.5 ${checks.hasNumber ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${checks.hasNumber ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    One number (0-9)
                  </div>

                  <div className={`flex items-center gap-1.5 ${checks.hasSpecial ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${checks.hasSpecial ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    One special character
                  </div>

                  <div className={`flex items-center gap-1.5 ${checks.passwordsMatch ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${checks.passwordsMatch ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    Passwords match
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !allPassed}
                className="h-11 w-full rounded-xl bg-[#f97316] font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] hover:bg-[#ea580c] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    SET NEW PASSWORD
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Footer info */}
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

export default ResetPasswordPage;
