import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/service";

const servicePageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://hariputhranenterprises.com/service#service",
      "name": "Civil & Underground Infrastructure Services",
      "serviceType": "Underground Sewerage, Drainage & Pipeline Construction",
      "provider": {
        "@type": "GeneralContractor",
        "name": "Hariputhran Enterprises",
        "url": "https://hariputhranenterprises.com"
      },
      "areaServed": {
        "@type": "State",
        "name": "Tamil Nadu"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Infrastructure Works Catalog",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Underground Sewerage Works"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Drainage Works & Stormwater Systems"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pipeline Laying & Jointing"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Manhole Construction"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Chamber Construction"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Road Cutting & Restoration"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pumping Station Works"
            }
          }
        ]
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://hariputhranenterprises.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Services",
          "item": "https://hariputhranenterprises.com/service"
        }
      ]
    }
  ]
};

export const Route = createFileRoute("/service")({
  head: () => ({
    meta: [
      { title: "Infrastructure Services | Sewerage, Drainage & Pipeline Works Chennai" },
      {
        name: "description",
        content:
          "Explore our infrastructure services including sewerage works, drainage systems, pipeline laying, manhole construction and restoration projects.",
      },
      {
        property: "og:title",
        content: "Infrastructure Services | Sewerage, Drainage & Pipeline Works Chennai",
      },
      {
        property: "og:description",
        content:
          "Explore our infrastructure services including sewerage works, drainage systems, pipeline laying, manhole construction and restoration projects.",
      },
      { property: "og:url", content: "https://hariputhranenterprises.com/service" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://hariputhranenterprises.com/images/Service-banner.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Infrastructure Services | Sewerage, Drainage & Pipeline Works Chennai" },
      { name: "twitter:description", content: "Explore our infrastructure services including sewerage works, drainage systems, pipeline laying, manhole construction and restoration projects." },
      { name: "twitter:image", content: "https://hariputhranenterprises.com/images/Service-banner.png" },
    ],
    links: [
      { rel: "canonical", href: "https://hariputhranenterprises.com/service" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(servicePageSchema),
      },
    ],
  }),
  component: ServicePage,
});

