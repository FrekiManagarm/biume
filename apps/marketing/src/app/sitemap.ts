import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://biume.com";
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          fr: `${baseUrl}`,
          "fr-FR": `${baseUrl}`,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${baseUrl}/about`,
          "fr-FR": `${baseUrl}/about`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          fr: `${baseUrl}/privacy`,
          "fr-FR": `${baseUrl}/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/cgu`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          fr: `${baseUrl}/cgu`,
          "fr-FR": `${baseUrl}/cgu`,
        },
      },
    },
  ];
}
