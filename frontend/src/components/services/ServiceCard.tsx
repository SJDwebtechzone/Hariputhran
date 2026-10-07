import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServiceIcon } from "@/constants/serviceIcons";
import { getServiceImageSrc, getDefaultServiceImage } from "@/utils/serviceImage";
import type { ServiceItemData } from "@/types/service";

export type { ServiceItemData };

interface ServiceCardProps {
  service: Partial<ServiceItemData>;
  index: number;
  onRequestQuote?: (service: Partial<ServiceItemData>) => void;
  isHighlighted?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, onRequestQuote, isHighlighted }) => {
  const Icon = getServiceIcon(service.icon_key);
  const isPhotoLeft = index % 2 === 0;
  const serviceNumber = String(index + 1).padStart(2, "0");

  // Title split into two tones (last word in cyan accent)
  const rawTitle = (service.title || "").trim();
  const titleWords = rawTitle.split(" ").filter(Boolean);
  let mainWords = "";
  let lastWord = "";
  if (titleWords.length > 1) {
    lastWord = titleWords.pop() || "";
    mainWords = titleWords.join(" ");
  } else {
    mainWords = rawTitle;
    lastWord = "";
  }

  const imageSrc = getServiceImageSrc(service, index);
  const fallbackSrc = getDefaultServiceImage(index);

  const features = Array.isArray(service.features) ? service.features : [];
  const ctaLabel = (service.button_label || "Discuss Your Project").toUpperCase();
  const ctaLink = service.button_link || "/contact";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.dataset["hasFallback"]) {
      return;
    }
    target.dataset["hasFallback"] = "true";
    target.src = fallbackSrc;
  };

  return (
    <div className="group flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-stretch lg:gap-5 transition-all duration-300 hover:md:-translate-y-[6px]">
      {isPhotoLeft ? (
        <>
          {/* Photo (Left) */}
          <div className="relative h-[200px] min-[375px]:h-[230px] w-full overflow-hidden rounded-xl sm:h-[280px] sm:rounded-2xl lg:h-auto lg:w-[43%] lg:rounded-l-[24px] lg:rounded-r-none slant-photo-left">
            <img
              src={imageSrc}
              alt={service.title || "Core Service"}
              loading="lazy"
              onError={handleImageError}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>

          {/* Card (Right) */}
          <div className="relative flex-1 [filter:drop-shadow(0_20px_45px_rgba(10,60,120,0.09))]">
            <div className="relative h-full rounded-xl sm:rounded-2xl bg-white p-4.5 min-[375px]:p-5 sm:p-8 lg:rounded-r-[24px] lg:rounded-l-none lg:py-8 lg:pr-8 lg:pl-18 xl:pl-22 slant-card-right">
              <div className="flex flex-col justify-between h-full">
                {/* Header & Optional Icon Badge */}
                <div className="flex items-start gap-3.5 sm:gap-5">
                  {Icon && (
                    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[#FFFFFF] to-[#E0F1FC] text-[#0A8FD8] shadow-[0_8px_20px_rgba(10,143,216,0.22)] ring-4 ring-white sm:size-16 sm:rounded-full">
                      <Icon className="size-5 stroke-[2.2] sm:size-7" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[10px] min-[375px]:text-[11px] font-bold uppercase tracking-[0.16em] text-[#F97316]">
                      SERVICE {serviceNumber}
                    </span>

                    <h3 className="mt-0.5 sm:mt-1 font-['Poppins',sans-serif] text-lg min-[375px]:text-xl font-bold tracking-tight text-[#0B2A5B] sm:text-2xl lg:text-[23px] xl:text-[25px]">
                      {mainWords} {lastWord && <span className="text-[#0A9BE0]">{lastWord}</span>}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-2.5 sm:mt-3 text-xs leading-relaxed text-[#5B6B80] sm:text-[14px]">
                  {service.description}
                </p>

                {/* 2-Column Checklist */}
                {features.length > 0 && (
                  <div className="mt-3.5 sm:mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 sm:gap-y-2.5">
                    {features.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[#0A8FD8] text-white shadow-sm">
                          <Check className="size-2.5 stroke-[3.5]" />
                        </span>
                        <span className="text-xs font-semibold text-[#0B2A5B] sm:text-[13.5px]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <div className="mt-4 sm:mt-5">
                  {onRequestQuote ? (
                    <Button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={() => onRequestQuote(service)}
                      className="group h-10 w-full min-[480px]:w-auto justify-center rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F97316] px-7 text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_22px_-4px_rgba(249,115,22,0.42)] transition-all duration-300 hover:scale-[1.02] hover:from-[#ea6c00] hover:to-[#ea580c] hover:shadow-[0_14px_26px_-4px_rgba(249,115,22,0.52)] sm:h-11 sm:text-[12.5px] cursor-pointer"
                    >
                      {ctaLabel}
                      <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="group h-10 w-full min-[480px]:w-auto justify-center rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F97316] px-7 text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_22px_-4px_rgba(249,115,22,0.42)] transition-all duration-300 hover:scale-[1.02] hover:from-[#ea6c00] hover:to-[#ea580c] hover:shadow-[0_14px_26px_-4px_rgba(249,115,22,0.52)] sm:h-11 sm:text-[12.5px]"
                    >
                      {ctaLink.startsWith("http") ? (
                        <a href={ctaLink} target="_blank" rel="noopener noreferrer">
                          {ctaLabel}
                          <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                      ) : (
                        <Link to={ctaLink}>
                          {ctaLabel}
                          <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Card (Left) */}
          <div className="relative flex-1 [filter:drop-shadow(0_20px_45px_rgba(10,60,120,0.09))]">
            <div className="relative h-full rounded-xl sm:rounded-2xl bg-white p-4.5 min-[375px]:p-5 sm:p-8 lg:rounded-l-[24px] lg:rounded-r-none lg:py-8 lg:pl-8 lg:pr-18 xl:pr-22 slant-card-left">
              <div className="flex flex-col justify-between h-full">
                {/* Header & Optional Icon Badge */}
                <div className="flex items-start gap-3.5 sm:gap-5">
                  {Icon && (
                    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[#FFFFFF] to-[#E0F1FC] text-[#0A8FD8] shadow-[0_8px_20px_rgba(10,143,216,0.22)] ring-4 ring-white sm:size-16 sm:rounded-full">
                      <Icon className="size-5 stroke-[2.2] sm:size-7" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[10px] min-[375px]:text-[11px] font-bold uppercase tracking-[0.16em] text-[#F97316]">
                      SERVICE {serviceNumber}
                    </span>

                    <h3 className="mt-0.5 sm:mt-1 font-['Poppins',sans-serif] text-lg min-[375px]:text-xl font-bold tracking-tight text-[#0B2A5B] sm:text-2xl lg:text-[23px] xl:text-[25px]">
                      {mainWords} {lastWord && <span className="text-[#0A9BE0]">{lastWord}</span>}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-2.5 sm:mt-3 text-xs leading-relaxed text-[#5B6B80] sm:text-[14px]">
                  {service.description}
                </p>

                {/* 2-Column Checklist */}
                {features.length > 0 && (
                  <div className="mt-3.5 sm:mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 sm:gap-y-2.5">
                    {features.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[#0A8FD8] text-white shadow-sm">
                          <Check className="size-2.5 stroke-[3.5]" />
                        </span>
                        <span className="text-xs font-semibold text-[#0B2A5B] sm:text-[13.5px]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <div className="mt-4 sm:mt-5">
                  {onRequestQuote ? (
                    <Button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={() => onRequestQuote(service)}
                      className="group h-10 w-full min-[480px]:w-auto justify-center rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F97316] px-7 text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_22px_-4px_rgba(249,115,22,0.42)] transition-all duration-300 hover:scale-[1.02] hover:from-[#ea6c00] hover:to-[#ea580c] hover:shadow-[0_14px_26px_-4px_rgba(249,115,22,0.52)] sm:h-11 sm:text-[12.5px] cursor-pointer"
                    >
                      {ctaLabel}
                      <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="group h-10 w-full min-[480px]:w-auto justify-center rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F97316] px-7 text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_22px_-4px_rgba(249,115,22,0.42)] transition-all duration-300 hover:scale-[1.02] hover:from-[#ea6c00] hover:to-[#ea580c] hover:shadow-[0_14px_26px_-4px_rgba(249,115,22,0.52)] sm:h-11 sm:text-[12.5px]"
                    >
                      {ctaLink.startsWith("http") ? (
                        <a href={ctaLink} target="_blank" rel="noopener noreferrer">
                          {ctaLabel}
                          <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                      ) : (
                        <Link to={ctaLink}>
                          {ctaLabel}
                          <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Photo (Right) */}
          <div className="relative h-[250px] w-full overflow-hidden rounded-2xl sm:h-[280px] lg:h-auto lg:w-[43%] lg:rounded-r-[24px] lg:rounded-l-none slant-photo-right">
            <img
              src={imageSrc}
              alt={service.title || "Core Service"}
              loading="lazy"
              onError={handleImageError}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
        </>
      )}
    </div>
  );
};
