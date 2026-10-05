import { Link } from "@tanstack/react-router";
import {
  MessageSquareText,
  Mail,
  Layers,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { OverviewData } from "@/types/dashboard";

interface OverviewStatCardsProps {
  data: OverviewData | null;
  loading: boolean;
  warnings?: string[];
}

export function OverviewStatCards({ data, loading, warnings = [] }: OverviewStatCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-28 rounded-md bg-slate-200" />
              <div className="size-10 rounded-xl bg-slate-100" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="h-9 w-14 rounded-md bg-slate-200" />
              <div className="h-5 w-20 rounded-md bg-slate-100" />
            </div>
            <div className="mt-2 h-3.5 w-40 rounded-md bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  const sr = data?.serviceRequests;
  const cm = data?.contactMessages;
  const s = data?.services;
  const enq = data?.enquiries;

  const srUnavailable = warnings.includes("service_requests") || !sr;
  const cmUnavailable = warnings.includes("contact_messages") || !cm;
  const sUnavailable = warnings.includes("services") || !s;
  const enqUnavailable = warnings.includes("enquiries") || !enq;

  // Change chip for enquiries
  const renderEnquiriesChangeChip = () => {
    if (enqUnavailable || enq.changePercent === null) {
      return (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
          <Minus className="mr-0.5 size-3" /> New
        </span>
      );
    }

    if (enq.changePercent > 0) {
      return (
        <span className="inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-600">
          <ArrowUpRight className="mr-0.5 size-3.5" />
          +{enq.changePercent}%
        </span>
      );
    }

    if (enq.changePercent < 0) {
      return (
        <span className="inline-flex items-center rounded-md bg-rose-50 px-1.5 py-0.5 text-[11px] font-bold text-rose-600">
          <ArrowDownRight className="mr-0.5 size-3.5" />
          {enq.changePercent}%
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
        0% vs last mo
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {/* Card 1: New Service Requests */}
      <Link
        to="/admin/service-requests"
        className="group block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-sky-300 hover:shadow-md cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#0284c7] transition-colors">
            New Service Requests
          </span>
          <div className="grid size-10 place-items-center rounded-xl bg-orange-50 text-[#f97316]">
            <MessageSquareText className="size-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-['Poppins',sans-serif] text-3xl font-extrabold text-[#082342]">
            {srUnavailable ? "—" : sr.unread}
          </span>
          {!srUnavailable && (
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 rounded-md px-1.5 py-0.5">
              +{sr.thisWeek} this week
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {srUnavailable ? "Section temporarily unavailable" : `${sr.total} requests received in total`}
        </p>
      </Link>

      {/* Card 2: Contact Messages */}
      <Link
        to="/admin/contact-messages"
        className="group block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-sky-300 hover:shadow-md cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#0284c7] transition-colors">
            Contact Messages
          </span>
          <div className="grid size-10 place-items-center rounded-xl bg-sky-50 text-[#0284c7]">
            <Mail className="size-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-['Poppins',sans-serif] text-3xl font-extrabold text-[#082342]">
            {cmUnavailable ? "—" : cm.unread}
          </span>
          {!cmUnavailable && (
            <span className="inline-flex items-center text-xs font-bold text-sky-700 bg-sky-50 rounded-md px-1.5 py-0.5">
              +{cm.thisWeek} this week
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {cmUnavailable ? "Section temporarily unavailable" : `${cm.total} messages received in total`}
        </p>
      </Link>

      {/* Card 3: Active Services */}
      <Link
        to="/admin/services"
        className="group block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-sky-300 hover:shadow-md cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#0284c7] transition-colors">
            Active Services
          </span>
          <div className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <Layers className="size-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-['Poppins',sans-serif] text-3xl font-extrabold text-[#082342]">
            {sUnavailable ? "—" : s.active}
          </span>
          {!sUnavailable && s.hidden > 0 && (
            <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
              {s.hidden} hidden
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {sUnavailable ? "Section temporarily unavailable" : "Published on the Services page"}
        </p>
      </Link>

      {/* Card 4: Enquiries This Month */}
      <a
        href="#recent-enquiries"
        className="group block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-sky-300 hover:shadow-md cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#0284c7] transition-colors">
            Enquiries This Month
          </span>
          <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="size-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-['Poppins',sans-serif] text-3xl font-extrabold text-[#082342]">
            {enqUnavailable ? "—" : enq.thisMonth}
          </span>
          {renderEnquiriesChangeChip()}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {enqUnavailable ? "Section temporarily unavailable" : "Service requests & contact messages"}
        </p>
      </a>
    </div>
  );
}
