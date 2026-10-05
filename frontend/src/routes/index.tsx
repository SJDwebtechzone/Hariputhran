import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/home";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "GeneralContractor"],
      "@id": "https://hariputhranenterprises.com/#organization",
      "name": "Hariputhran Enterprises",
      "legalName": "Hariputhran Enterprises",
      "url": "https://hariputhranenterprises.com",
      "logo": "https://hariputhranenterprises.com/logo.png",
      "image": "https://hariputhranenterprises.com/images/hero-baneer-const.png",
      "description": "Hariputhran Enterprises specializes in underground sewerage systems, drainage works, pipeline laying, manhole construction and road restoration projects across Chennai and Tamil Nadu.",
      "telephone": ["+917200333487", "+919003221019"],
      "email": "anand@hariputhranenterprises.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2B, Annai Sandhiya Nagar, TVK Link Road, Kodungaiyur",
        "addressLocality": "Chennai",
        "addressRegion": "Tamil Nadu",
        "postalCode": "600118",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 13.1274995,
        "longitude": 80.2630203
      },
      "hasMap": "https://www.google.com/maps/place/13%C2%B007'39.0%22N+80%C2%B015'46.9%22E/@13.1274995,80.2604454,17z/data=!3m1!4b1!4m4!3m3!8m2!3d13.1274995!4d80.2630203",
      "areaServed": [
        {
          "@type": "City",
          "name": "Chennai"
        },
        {
          "@type": "State",
          "name": "Tamil Nadu"
        }
      ],
      "knowsAbout": [
        "Underground Sewerage Works",
        "Stormwater Drainage Systems",
        "Pipeline Laying",
        "Manhole Construction",
        "Chamber Construction",
        "Road Cutting and Restoration",
        "Pumping Station Works"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://hariputhranenterprises.com/#website",
      "url": "https://hariputhranenterprises.com",
      "name": "Hariputhran Enterprises",
      "publisher": {
        "@id": "https://hariputhranenterprises.com/#organization"
      }
    }
  ]
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hariputhran Enterprises | Underground Sewerage & Drainage Contractor Chennai" },
      {
        name: "description",
        content:
          "Hariputhran Enterprises specializes in underground sewerage systems, drainage works, pipeline laying, manhole construction and road restoration projects across Chennai and Tamil Nadu.",
      },
      {
        property: "og:title",
        content: "Hariputhran Enterprises | Underground Sewerage & Drainage Contractor Chennai",
      },
      {
        property: "og:description",
        content:
          "Hariputhran Enterprises specializes in underground sewerage systems, drainage works, pipeline laying, manhole construction and road restoration projects across Chennai and Tamil Nadu.",
      },
      { property: "og:url", content: "https://hariputhranenterprises.com/" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://hariputhranenterprises.com/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Hariputhran Enterprises | Underground Sewerage & Drainage Contractor Chennai" },
      { name: "twitter:description", content: "Hariputhran Enterprises specializes in underground sewerage systems, drainage works, pipeline laying, manhole construction and road restoration projects across Chennai and Tamil Nadu." },
      { name: "twitter:image", content: "https://hariputhranenterprises.com/logo.png" },
    ],
    links: [
      { rel: "canonical", href: "https://hariputhranenterprises.com/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(localBusinessSchema),
      },
    ],
  }),
  component: HomePage,
});