import { getTemplateGroups } from "@/lib/templates";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://bootstrap-blocks.vercel.app";
  const groups = getTemplateGroups();

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const group of groups) {
    for (const file of group.files) {
      entries.push({
        url: `${baseUrl}/${group.slug}/${file.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
