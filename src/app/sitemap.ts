import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://iotcoe-expothon.saveetha.com";
  const now = new Date();

  const routes = [
    "",
    "/about",
    "/expothon",
    "/register",
    "/registration-status",
    "/updates",
    "/gallery",
    "/showcase",
    "/contact",
    "/privacy",
    "/terms",
    "/code-of-conduct",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/updates" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/register" || route === "/expothon" ? 0.9 : 0.7,
  }));
}
