import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/contact";

const contactPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://hariputhranenterprises.com/contact#webpage",
      "url": "https://hariputhranenterprises.com/contact",
      "name": "Contact Hariputhran Enterprises | Chennai Infrastructure Contractor",
      "description": "Contact Hariputhran Enterprises for sewerage works, drainage projects, pipeline laying and civil infrastructure solutions in Chennai.",
      "breadcrumb": {
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
            "name": "Contact Us",
            "item": "https://hariputhranenterprises.com/contact"
          }
        ]
      },
      "mainEntity": {
        "@type": "LocalBusiness",
        "name": "Hariputhran Enterprises",
        "telephone": ["+917200333487", "+919003221019"],
        "email": "anand@hariputhranenterprises.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "2B, Annai Sandhiya Nagar, TVK Link Road, Kodungaiyur",
          "addressLocality": "Chennai",
          "addressRegion": "Tamil Nadu",
          "postalCode": "600118",
          "addressCountry": "IN"
        }
      }
    }
  ]
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Hariputhran Enterprises | Chennai Infrastructure Contractor" },
      {
        name: "description",
        content:
          "Contact Hariputhran Enterprises for sewerage works, drainage projects, pipeline laying and civil infrastructure solutions in Chennai.",
      },
      {
        property: "og:title",
        content: "Contact Hariputhran Enterprises | Chennai Infrastructure Contractor",
      },
      {
        property: "og:description",
        content:
          "Contact Hariputhran Enterprises for sewerage works, drainage projects, pipeline laying and civil infrastructure solutions in Chennai.",
      },
      { property: "og:url", content: "https://hariputhranenterprises.com/contact" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://hariputhranenterprises.com/images/contact/contact-us.jpeg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact Hariputhran Enterprises | Chennai Infrastructure Contractor" },
      { name: "twitter:description", content: "Contact Hariputhran Enterprises for sewerage works, drainage projects, pipeline laying and civil infrastructure solutions in Chennai." },
      { name: "twitter:image", content: "https://hariputhranenterprises.com/images/contact/contact-us.jpeg" },
    ],
    links: [
      { rel: "canonical", href: "https://hariputhranenterprises.com/contact" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(contactPageSchema),
      },
    ],
  }),
  component: ContactPage,
});