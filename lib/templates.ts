import fs from "node:fs";
import path from "node:path";

export type TemplateFile = {
  name: string;
  slug: string;
  content: string;
};

export type TemplateGroup = {
  folder: string;
  slug: string;
  files: TemplateFile[];
};

export function slugify(value: string): string {
  return value
    .replace(/\.html$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTemplateGroups(): TemplateGroup[] {
  const templatesRoot = path.join(process.cwd(), "templates");

  const folders = fs
    .readdirSync(templatesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  return folders.map((folder) => {
    const folderPath = path.join(templatesRoot, folder);

    const files = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter(
        (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".html"),
      )
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b))
      .map((fileName) => ({
        name: fileName,
        slug: slugify(fileName),
        content: fs.readFileSync(path.join(folderPath, fileName), "utf-8"),
      }));

    return {
      folder,
      slug: slugify(folder),
      files,
    };
  });
}

export function findTemplateBySlugs(
  groups: TemplateGroup[],
  folderSlug: string,
  fileSlug: string,
): { group: TemplateGroup; file: TemplateFile } | null {
  const group = groups.find((item) => item.slug === folderSlug);

  if (!group) {
    return null;
  }

  const file = group.files.find((item) => item.slug === fileSlug);

  if (!file) {
    return null;
  }

  return { group, file };
}
