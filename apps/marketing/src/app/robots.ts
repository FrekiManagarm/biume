import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://biume.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/blog", "/privacy", "/cgu"],
        disallow: [
          "/api/",
          "/dashboard/",
          "/forgot-password",
          "/reset-password",
          "/onboarding",
          "/transactions",
          "/_next/",
          "/admin/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
