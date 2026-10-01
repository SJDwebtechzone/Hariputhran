import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader2,
  AlertCircle,
  UserCheck,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { AdminLayout, type AdminUser } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);

  // Change Email State
  const [newEmail, setNewEmail] = useState("");
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
  const [showEmailCurrentPassword, setShowEmailCurrentPassword] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Helper to read current active storage and token
  const getAuthInfo = () => {
    const localToken = localStorage.getItem("hariputhran_token");
    if (localToken) {
      return { token: localToken, storage: localStorage };
    }
    const sessionToken = sessionStorage.getItem("hariputhran_token");
    if (sessionToken) {
      return { token: sessionToken, storage: sessionStorage };
    }
    return { token: null, storage: null };
  };

  const loadUserData = () => {
    const storedUserStr =
      localStorage.getItem("hariputhran_user") ||
      sessionStorage.getItem("hariputhran_user");

    if (storedUserStr) {
      try {
        setUser(JSON.parse(storedUserStr));
      } catch {
        setUser({ name: "Admin", email: "admin@hariputhran.com" });
      }
    } else {
      setUser({ name: "Admin", email: "admin@hariputhran.com" });
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // Password criteria checklist for Change Password
  const passwordChecks = useMemo(() => {
    return {
      minLength: newPassword.length >= 8,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/]/.test(newPassword),
      passwordsMatch: newPassword.length > 0 && newPassword === confirmPassword,
    };
  }, [newPassword, confirmPassword]);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (passwordChecks.minLength) score += 1;
    if (passwordChecks.hasUpper) score += 1;
    if (passwordChecks.hasLower) score += 1;
    if (passwordChecks.hasNumber) score += 1;
    if (passwordChecks.hasSpecial) score += 1;
    return score;
  }, [passwordChecks]);

  const strengthMeta = useMemo(() => {
    if (newPassword.length === 0) return { label: "", color: "bg-slate-200", textColor: "text-slate-400", percent: 0 };
    if (strengthScore <= 2) return { label: "Weak", color: "bg-red-500", textColor: "text-red-600", percent: 30 };
    if (strengthScore <= 4) return { label: "Moderate", color: "bg-amber-500", textColor: "text-amber-600", percent: 70 };
    return { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-600", percent: 100 };
  }, [newPassword, strengthScore]);

  const isPasswordValid =
    passwordChecks.minLength &&
    passwordChecks.hasUpper &&
    passwordChecks.hasLower &&
    passwordChecks.hasNumber &&
    passwordChecks.hasSpecial &&
    passwordChecks.passwordsMatch;

  // Handle Session Expiry (401)
  const handleUnauthorized = () => {
    localStorage.removeItem("hariputhran_token");
    localStorage.removeItem("hariputhran_user");
    sessionStorage.removeItem("hariputhran_token");
    sessionStorage.removeItem("hariputhran_user");
    toast.error("Session expired", {
      description: "Your session has expired. Please sign in again.",
    });
    navigate({ to: "/login", replace: true });
  };

  // 1. Submit Change Email
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    const { token, storage } = getAuthInfo();
    if (!token || !storage) {
      handleUnauthorized();
      return;
    }

    if (!newEmail || !emailCurrentPassword) {
      setEmailError("Please enter both the new email and your current password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
      setEmailError("Please enter a valid email format.");
      return;
    }

    setIsUpdatingEmail(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/change-email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newEmail: newEmail.trim(),
          currentPassword: emailCurrentPassword,
        }),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update email address.");
      }

      // Update stored session credentials
      if (data.token) {
        storage.setItem("hariputhran_token", data.token);
      }
      if (data.user) {
        storage.setItem("hariputhran_user", JSON.stringify(data.user));
        setUser(data.user);
      }

      // Dispatch global update event to sync layouts
      window.dispatchEvent(new Event("hariputhran_user_updated"));

      toast.success("Email updated successfully!", {
        description: `Your account email is now ${data.user?.email || newEmail.trim()}`,
      });

      // Clear form inputs
      setNewEmail("");
      setEmailCurrentPassword("");
    } catch (err: any) {
      const msg = err.message || "An error occurred while updating your email.";
      setEmailError(msg);
      toast.error("Update Failed", { description: msg });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  // 2. Submit Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    const { token } = getAuthInfo();
    if (!token) {
      handleUnauthorized();
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill out all password fields.");
      return;
    }

    if (!isPasswordValid) {
      setPasswordError("Please ensure your new password meets all security criteria.");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError("New password cannot be the same as your current password.");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update password.");
      }

      toast.success("Password updated successfully!", {
        description: "Your security credentials have been updated.",
      });

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.message || "An error occurred while changing your password.";
      setPasswordError(msg);
      toast.error("Password Update Failed", { description: msg });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const adminName = user?.name || "Administrator";
  const adminEmail = user?.email || "admin@hariputhran.com";

  return (
    <AdminLayout
      title="Account Settings"
      subtitle="Manage your profile email and security authentication credentials"
      activeNav="settings"
    >
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Card 1: Account Overview */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#082342] to-[#0284c7] font-mono text-xl font-bold text-white shadow-lg ring-4 ring-[#e6f3fb]">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-['Poppins',sans-serif] text-xl font-bold text-[#082342]">
                    {adminName}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                    <Sparkles className="size-3" />
                    Super Admin
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 font-mono">{adminEmail}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2 text-xs">
                <span className="text-slate-500">Access Level:</span>{" "}
                <b className="text-[#082342]">Full Operational Authority</b>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid for Change Email and Change Password */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Card 2: Change Email */}
          <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="grid size-10 place-items-center rounded-xl bg-sky-50 text-[#0284c7]">
                <Mail className="size-5" />
              </div>
              <div>
                <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#082342]">
                  Change Email Address
                </h3>
                <p className="text-xs text-slate-500">
                  Update the primary email used to sign in to the portal
                </p>
              </div>
            </div>

            <form onSubmit={handleChangeEmail} className="mt-6 flex-1 space-y-4">
              {emailError && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                  <div className="flex-1">{emailError}</div>
                </div>
              )}

              {/* Current Email Display */}
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Current Email
                </Label>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-700">
                  {adminEmail}
                </div>
              </div>

              {/* New Email */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="newEmail"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  New Email Address
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder="new-admin@hariputhran.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60 pl-10 text-sm text-slate-900 transition-colors focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20"
                  />
                </div>
              </div>

              {/* Current Password Confirmation */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="emailCurrentPassword"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Current Password (To Confirm)
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="emailCurrentPassword"
                    type={showEmailCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={emailCurrentPassword}
                    onChange={(e) => setEmailCurrentPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60 pl-10 pr-10 text-sm text-slate-900 transition-colors focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailCurrentPassword(!showEmailCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showEmailCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isUpdatingEmail || !newEmail || !emailCurrentPassword}
                  className="h-11 w-full rounded-xl bg-[#0284c7] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#0369a1] disabled:opacity-50"
                >
                  {isUpdatingEmail ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Updating Email...
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 size-4" />
                      UPDATE EMAIL ADDRESS
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Card 3: Change Password */}
          <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="grid size-10 place-items-center rounded-xl bg-orange-50 text-[#f97316]">
                <KeyRound className="size-5" />
              </div>
              <div>
                <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#082342]">
                  Change Password
                </h3>
                <p className="text-xs text-slate-500">
                  Update your security password for portal access
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="mt-6 flex-1 space-y-4">
              {passwordError && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                  <div className="flex-1">{passwordError}</div>
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="currentPassword"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60 pl-10 pr-10 text-sm text-slate-900 transition-colors focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="settingsNewPassword"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="settingsNewPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
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

              {/* Password Strength Indicator */}
              {newPassword.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Strength:</span>
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
                  htmlFor="settingsConfirmPassword"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="settingsConfirmPassword"
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
                  Password Requirements
                </div>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  <div className={`flex items-center gap-1.5 ${passwordChecks.minLength ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${passwordChecks.minLength ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    8+ characters
                  </div>

                  <div className={`flex items-center gap-1.5 ${passwordChecks.hasUpper ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${passwordChecks.hasUpper ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    Uppercase letter
                  </div>

                  <div className={`flex items-center gap-1.5 ${passwordChecks.hasLower ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${passwordChecks.hasLower ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    Lowercase letter
                  </div>

                  <div className={`flex items-center gap-1.5 ${passwordChecks.hasNumber ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${passwordChecks.hasNumber ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    Number (0-9)
                  </div>

                  <div className={`flex items-center gap-1.5 ${passwordChecks.hasSpecial ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${passwordChecks.hasSpecial ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    Special character
                  </div>

                  <div className={`flex items-center gap-1.5 ${passwordChecks.passwordsMatch ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    <span className={`grid size-3.5 place-items-center rounded-full ${passwordChecks.passwordsMatch ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    Passwords match
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isUpdatingPassword || !isPasswordValid || !currentPassword}
                  className="h-11 w-full rounded-xl bg-[#f97316] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#ea580c] disabled:opacity-50"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 size-4" />
                      UPDATE PASSWORD
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default SettingsPage;
