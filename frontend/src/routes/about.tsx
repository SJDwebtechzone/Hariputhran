import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/about";

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://hariputhranenterprises.com/about#webpage",
      "url": "https://hariputhranenterprises.com/about",
      "name": "About Hariputhran Enterprises | Civil Infrastructure Experts",
      "description": "Learn about Hariputhran Enterprises, a trusted Chennai-based infrastructure contractor delivering sewerage, drainage and utility pipeline solutions.",
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
            "name": "About Us",
            "item": "https://hariputhranenterprises.com/about"
          }
        ]
      },
      "mainEntity": {
        "@type": "Organization",
        "name": "Hariputhran Enterprises",
        "url": "https://hariputhranenterprises.com"
      }
    }
  ]
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Hariputhran Enterprises | Civil Infrastructure Experts" },
      {
        name: "description",
        content:
          "Learn about Hariputhran Enterprises, a trusted Chennai-based infrastructure contractor delivering sewerage, drainage and utility pipeline solutions.",
      },
      {
        property: "og:title",
        content: "About Hariputhran Enterprises | Civil Infrastructure Experts",
      },
      {
        property: "og:description",
        content:
          "Learn about Hariputhran Enterprises, a trusted Chennai-based infrastructure contractor delivering sewerage, drainage and utility pipeline solutions.",
      },
      { property: "og:url", content: "https://hariputhranenterprises.com/about" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://hariputhranenterprises.com/images/about/abouthariputhran.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About Hariputhran Enterprises | Civil Infrastructure Experts" },
      { name: "twitter:description", content: "Learn about Hariputhran Enterprises, a trusted Chennai-based infrastructure contractor delivering sewerage, drainage and utility pipeline solutions." },
      { name: "twitter:image", content: "https://hariputhranenterprises.com/images/about/abouthariputhran.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://hariputhranenterprises.com/about" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(aboutPageSchema),
      },
    ],
  }),
  component: AboutPage,
});