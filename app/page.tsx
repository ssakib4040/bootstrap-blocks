import TemplateWorkspace from "@/app/components/template-workspace";
import { getTemplateGroups } from "@/lib/templates";

export default function Home() {
  const groups = getTemplateGroups();

  return <TemplateWorkspace groups={groups} />;
}
