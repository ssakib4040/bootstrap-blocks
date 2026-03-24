import TemplateWorkspace from "@/app/components/template-workspace";
import { findTemplateBySlugs, getTemplateGroups } from "@/lib/templates";
import { notFound } from "next/navigation";

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
