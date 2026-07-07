import TemplateWorkspace from "@/app/components/template-workspace";
import { getTemplateGroups } from "@/lib/templates";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bootstrap Blocks | Free Bootstrap 5 UI Blocks",
  description:
    "Browse 120+ free Bootstrap 5 HTML blocks. Navbars, hero sections, cards, footers, pricing tables, and more. Copy and paste into your Bootstrap project.",
  openGraph: {
    title: "Bootstrap Blocks | Free Bootstrap 5 UI Blocks",
    description:
      "Browse 120+ free Bootstrap 5 HTML blocks. Navbars, hero sections, cards, footers, pricing tables, and more.",
    type: "website",
    siteName: "Bootstrap Blocks",
  },
  twitter: {
    card: "summary",
    title: "Bootstrap Blocks | Free Bootstrap 5 UI Blocks",
    description:
      "Browse 120+ free Bootstrap 5 HTML blocks. Navbars, hero sections, cards, footers, pricing tables, and more.",
  },
};

export default function Home() {
  const groups = getTemplateGroups();

  return <TemplateWorkspace groups={groups} />;
}
