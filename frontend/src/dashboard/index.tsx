import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Shield,
  Activity,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AdminLayout, type AdminUser } from "@/components/admin/AdminLayout";

// Sample infrastructural project data
const SAMPLE_PROJECTS = [
  {
    id: "PRJ-2026-01",
    name: "Municipal Underground Sewerage Network",
    client: "Chennai Metropolitan Water Supply",
    location: "Chennai Central",
    budget: "₹ 4.8 Cr",
    progress: 78,
    status: "In Progress",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    progressColor: "bg-[#0284c7]",
    updated: "2 hours ago",
  },
  {
    id: "PRJ-2026-02",
    name: "Stormwater Trunk Drainage Phase II",
    client: "SIPCOT Industrial Complex",
    location: "Kanchipuram District",
    budget: "₹ 2.4 Cr",
    progress: 92,
    status: "Under Review",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    progressColor: "bg-[#f97316]",
    updated: "Yesterday",
  },
  {
    id: "PRJ-2026-03",
    name: "Heavy Utility Pipeline & Valve Chambers",
    client: "State Highway Authority",
    location: "Outer Ring Road Extension",
    budget: "₹ 3.1 Cr",
    progress: 100,
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    progressColor: "bg-emerald-500",
    updated: "3 days ago",
  },
  {
    id: "PRJ-2026-04",
    name: "Pumping Station Civil Restoration",
    client: "Urban Development Corp",
    location: "North Chennai Zone",
    budget: "₹ 1.6 Cr",
    progress: 45,
    status: "In Progress",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    progressColor: "bg-[#0284c7]",
    updated: "5 days ago",
  },
  {
    id: "PRJ-2026-05",
    name: "Main Road Trench Cutting & Bitumen Paving",
    client: "Greater Chennai Corporation",
    location: "Anna Nagar West",
    budget: "₹ 85 Lakhs",
    progress: 20,
    status: "Scheduled",
    statusColor: "bg-slate-100 text-slate-700 border-slate-200",
    progressColor: "bg-slate-500",
    updated: "1 week ago",
  },
];

export function DashboardPage() {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const storedUserStr =
      localStorage.getItem("hariputhran_user") ||
      sessionStorage.getItem("hariputhran_user");

    if (storedUserStr) {
      try {
        const parsed = JSON.parse(storedUserStr);
        setUser(parsed);
      } catch {
        setUser({ name: "Admin", email: "admin@hariputhran.com" });
      }
    } else {
      setUser({ name: "Admin", email: "admin@hariputhran.com" });
    }
  }, []);

  const adminName = user?.name || "Administrator";

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Hariputhran Infrastructure & Civil Contracting Management"
      activeNav="dashboard"
    >
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#082342] via-[#0d3b66] to-[#0284c7] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full bg-[#f97316]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[11px] font-semibold text-[#38bdf8] backdrop-blur-sm">
              <Activity className="size-3.5" />
              Live Operational Overview
            </div>

            <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl font-extrabold tracking-tight sm:text-3xl">
              Welcome back, <span className="text-[#f97316]">{adminName}</span>
            </h2>

            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-slate-200 sm:text-sm">
              Track ongoing sewerage network projects, pipeline alignments, civil restoration tenders, and client handovers across Tamil Nadu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() =>
                toast.success("Sync Complete", {
                  description: "Project metrics refreshed with latest site telemetry.",
                })
              }
              variant="outline"
              className="h-10 rounded-full border-white/30 bg-white/10 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm hover:bg-white hover:text-[#082342]"
            >
              Sync Sites
            </Button>
            <Button
              asChild
              className="h-10 rounded-full bg-[#f97316] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 hover:bg-[#ea580c]"
            >
              <a href="#recent-projects">
                View Live Projects
                <ArrowUpRight className="ml-1.5 size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Four Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Active Projects */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Projects
            </span>
            <div className="grid size-10 place-items-center rounded-xl bg-sky-50 text-[#0284c7]">
              <Layers className="size-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-['Poppins',sans-serif] text-3xl font-extrabold text-[#082342]">
              12
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              <TrendingUp className="mr-0.5 size-3.5" />
              +2 this month
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            8 underground utilities, 4 civil restorations
          </p>
        </div>

        {/* Card 2: Completed */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Completed
            </span>
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-['Poppins',sans-serif] text-3xl font-extrabold text-[#082342]">
              48
            </span>
            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              100% Handed Over
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Verified zero-defect municipal handovers
          </p>
        </div>

        {/* Card 3: Pending Tasks */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Tasks
            </span>
            <div className="grid size-10 place-items-center rounded-xl bg-amber-50 text-[#f97316]">
              <Clock className="size-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-['Poppins',sans-serif] text-3xl font-extrabold text-[#082342]">
              7
            </span>
            <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
              3 High Priority
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Soil test reports & highway cutting permits
          </p>
        </div>

        {/* Card 4: Clients */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Clients
            </span>
            <div className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Building2 className="size-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-['Poppins',sans-serif] text-3xl font-extrabold text-[#082342]">
              24
            </span>
            <span className="text-xs font-bold text-slate-600">
              Municipal & Private
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Active contracts with government & developers
          </p>
        </div>
      </div>

      {/* Recent Projects Table Section */}
      <div id="recent-projects" className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-['Poppins',sans-serif] text-lg font-bold text-[#082342]">
              Recent Infrastructure Projects
            </h3>
            <p className="text-xs text-slate-500">
              Detailed progress, location alignments, and execution status (Sample Data)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[11px] font-semibold text-slate-600">
              <Shield className="size-3 text-[#0284c7]" />
              Internal Staff View
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/75 font-mono uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Project Details</th>
                <th className="px-6 py-3.5">Client & Location</th>
                <th className="px-6 py-3.5">Contract Value</th>
                <th className="px-6 py-3.5">Progress</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {SAMPLE_PROJECTS.map((project) => (
                <tr key={project.id} className="transition-colors hover:bg-slate-50/50">
                  {/* Project Details */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#082342] sm:text-sm">
                      {project.name}
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                      ID: {project.id} • Updated {project.updated}
                    </div>
                  </td>

                  {/* Client & Location */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{project.client}</div>
                    <div className="text-[11px] text-slate-500">{project.location}</div>
                  </td>

                  {/* Budget */}
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">
                    {project.budget}
                  </td>

                  {/* Progress */}
                  <td className="px-6 py-4 min-w-[150px]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${project.progressColor}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${project.statusColor}`}
                    >
                      {project.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        toast.info("Project Details", {
                          description: `Opening project management file for ${project.id}.`,
                        })
                      }
                      className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold text-[#0284c7] hover:border-[#0284c7] hover:bg-sky-50 transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DashboardPage;
