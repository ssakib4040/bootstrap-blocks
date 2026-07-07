import TemplateWorkspace from "@/app/components/template-workspace";
import { findTemplateBySlugs, getTemplateGroups } from "@/lib/templates";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

function formatName(filename: string): string {
  return filename
    .replace(/\.html$/i, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  if (!resolvedParams?.slug || resolvedParams.slug.length !== 2) {
    return {};
  }

  const [folderSlug, fileSlug] = resolvedParams.slug;
  const groups = getTemplateGroups();
  const match = findTemplateBySlugs(groups, folderSlug, fileSlug);

  if (!match) {
    return {};
  }

  const folderName = formatName(match.group.folder);
  const fileName = formatName(match.file.name);
  const title = `${folderName} ${fileName} | Bootstrap Blocks`;
  const description = `Free Bootstrap 5 ${folderName.toLowerCase()} block: ${fileName}. Copy and paste into your Bootstrap project. Browse 120+ free Bootstrap UI blocks.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Bootstrap Blocks",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `/${folderSlug}/${fileSlug}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;

  if (!resolvedParams?.slug || resolvedParams.slug.length !== 2) {
    notFound();
  }

  const [folderSlug, fileSlug] = resolvedParams.slug;
  const groups = getTemplateGroups();
  const match = findTemplateBySlugs(groups, folderSlug, fileSlug);

  if (!match) {
    notFound();
  }

  return (
    <TemplateWorkspace groups={groups} selected={{ folderSlug, fileSlug }} />
  );
}
