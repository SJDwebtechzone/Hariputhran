import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  HardHat,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to sign in. Please check your credentials.");
      }

      // Save token and user info
      if (rememberMe) {
        localStorage.setItem("hariputhran_token", data.token);
        localStorage.setItem("hariputhran_user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("hariputhran_token", data.token);
        sessionStorage.setItem("hariputhran_user", JSON.stringify(data.user));
      }

      toast.success("Welcome back!", {
        description: `Signed in successfully as ${data.user?.name || "Admin"}`,
      });

      // Redirect to dashboard page
      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 600);
    } catch (err: any) {
      const msg = err.message || "Unable to connect to server. Please check your network.";
      setErrorMessage(msg);
      toast.error("Sign in failed", {
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
          to="/"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-300 transition-colors hover:text-[#f97316]"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          Back to Website
        </Link>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] font-medium text-slate-300 backdrop-blur-md">
          <ShieldCheck className="size-3.5 text-[#38bdf8]" />
          Secure Portal
        </div>
      </div>

      {/* Main Login Card */}
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]">
        {/* Header inside Card */}
        <div className="relative flex flex-col items-center border-b border-slate-100 bg-gradient-to-b from-[#f8fbff] to-white px-8 pb-6 pt-8 text-center">
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

          <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-[#0284c7]/20 bg-[#0284c7]/5 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[1.5px] text-[#0284c7]">
            <span className="size-1.5 rounded-full bg-[#0284c7]" />
            ADMIN PORTAL
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Sign in to access project operations and documentation
          </p>
        </div>

        {/* Card Body / Form */}
        <div className="p-8 text-slate-800">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-700">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address
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
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/60 pl-10 text-sm text-slate-900 transition-colors focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#0284c7] hover:text-[#082342] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/60 pl-10 pr-10 text-sm text-slate-900 transition-colors focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-slate-300 data-[state=checked]:bg-[#0284c7] data-[state=checked]:border-[#0284c7]"
              />
              <label
                htmlFor="remember"
                className="cursor-pointer text-xs font-medium text-slate-600 select-none"
              >
                Keep me signed in on this device
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-xl bg-[#f97316] font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] hover:bg-[#ea580c] active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  SIGN IN
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer info inside Card */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-8 py-4 text-center text-xs text-slate-500">
          Need portal credentials?{" "}
          <Link to="/contact" className="font-bold text-[#0284c7] hover:text-[#082342] hover:underline">
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

export default LoginPage;
