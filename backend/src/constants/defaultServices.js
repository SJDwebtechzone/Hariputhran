const ALLOWED_SERVICE_ICONS = [
  "Droplets",
  "Construction",
  "Wrench",
  "Hammer",
  "Pipette",
  "Waves",
  "Route",
  "HardHat",
  "Truck",
  "Building2",
  "ShieldCheck",
  "Layers3",
];

const DEFAULT_BUTTON_LINK = "/contact";

const DEFAULT_SERVICES = [
  {
    title: "Underground Utility Construction",
    description:
      "We design-build and execute sewerage networks, storm-water drains and pipelines with precise levels, quality materials and strict safety practices. Every line is built to carry flow reliably for decades.",
    features: [
      "Sewerage & Storm-Water Networks",
      "Water Supply & Utility Pipelines",
      "Deep Chamber & Manhole Construction",
      "Trench Excavation & Shoring",
    ],
    button_label: "Request a Quote",
    button_link: DEFAULT_BUTTON_LINK,
    icon_key: "Droplets",
    sort_order: 1,
    is_active: true,
  },
  {
    title: "Rehabilitation & Civil Restoration",
    description:
      "We revive ageing infrastructure and restore roads after excavation. Our crews and equipment keep disruption low, so public roads are back in service quickly and finished properly.",
    features: [
      "Sewer & Drain Rehabilitation",
      "Road Cutting & Restoration",
      "Pumping Station Works",
      "Supporting Civil Works",
    ],
    button_label: "Discuss Your Project",
    button_link: DEFAULT_BUTTON_LINK,
    icon_key: "Construction",
    sort_order: 2,
    is_active: true,
  },
];

module.exports = {
  ALLOWED_SERVICE_ICONS,
  ALLOWED_ICONS: ALLOWED_SERVICE_ICONS,
  DEFAULT_BUTTON_LINK,
  DEFAULT_SERVICES,
};
