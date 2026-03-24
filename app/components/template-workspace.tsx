"use client";

import { useEffect, useMemo, useState } from "react";
import hljs from "highlight.js";
import type { TemplateGroup } from "@/lib/templates";

type TemplateWorkspaceProps = {
  groups: TemplateGroup[];
  selected?: {
    folderSlug: string;
    fileSlug: string;
  };
};

function buildPreviewDocument(snippet: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" />
  <style>
    body {
      margin: 0;
      background: #ffffff;
      color: #0f172a;
      font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      padding: 18px;
    }
  </style>
</head>
<body>
  ${snippet}
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}

function formatTemplateName(filename: string): string {
  return filename
    .replace(/\.html$/i, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function TemplateWorkspace({
  groups,
  selected,
}: TemplateWorkspaceProps) {
  const [activeSelection, setActiveSelection] = useState<
    TemplateWorkspaceProps["selected"]
  >(selected);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  useEffect(() => {
    setActiveSelection(selected);
  }, [selected]);

  useEffect(() => {
    function handlePopState(): void {
      const segments = window.location.pathname.split("/").filter(Boolean);

      if (segments.length === 2) {
        setActiveSelection({
          folderSlug: segments[0],
          fileSlug: segments[1],
        });
        return;
      }

      setActiveSelection(undefined);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const selectedTemplate = useMemo(() => {
    if (!groups.length) {
      return null;
    }

    if (activeSelection) {
      const selectedGroup = groups.find(
        (group) => group.slug === activeSelection.folderSlug,
      );
      const selectedFile = selectedGroup?.files.find(
        (file) => file.slug === activeSelection.fileSlug,
      );

      if (selectedGroup && selectedFile) {
        return {
          group: selectedGroup,
          file: selectedFile,
        };
      }
    }

    const fallbackGroup = groups[0];
    const fallbackFile = fallbackGroup?.files?.[0];

    if (!fallbackGroup || !fallbackFile) {
      return null;
    }

    return {
      group: fallbackGroup,
      file: fallbackFile,
    };
  }, [groups, activeSelection]);

  const code = selectedTemplate?.file.content ?? "";

  async function handleCopy(): Promise<void> {
    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }

    window.setTimeout(() => {
      setCopyState("idle");
    }, 1800);
  }

  function handleTemplateSelect(folderSlug: string, fileSlug: string): void {
    const href = `/${folderSlug}/${fileSlug}`;

    setActiveSelection({ folderSlug, fileSlug });
    window.history.pushState({}, "", href);
  }

  if (!selectedTemplate) {
    return (
      <main className="empty-state-shell">
        <div className="empty-state-card">
          <h1>No templates found</h1>
          <p>Add HTML files in the templates directory to get started.</p>
        </div>
      </main>
    );
  }

  const selectedPath = `/${selectedTemplate.group.slug}/${selectedTemplate.file.slug}`;

  return (
    <main className="workspace-shell">
      <aside className="template-library">
        <div className="library-header">
          <p className="library-kicker">Bootstrap Blocks</p>
          <h1>Template Library</h1>
          <p>Pick a block, preview instantly, then copy the code.</p>
        </div>

        <div
          className="library-groups"
          role="navigation"
          aria-label="Template categories"
        >
          {groups.map((group) => (
            <section className="library-group" key={group.slug}>
              <h2>{group.folder}</h2>
              <div className="library-list">
                {group.files.map((file) => {
                  const href = `/${group.slug}/${file.slug}`;
                  const isActive = href === selectedPath;

                  return (
                    <a
                      className={`template-link${isActive ? " is-active" : ""}`}
                      href={href}
                      key={file.slug}
                      onClick={(event) => {
                        event.preventDefault();
                        handleTemplateSelect(group.slug, file.slug);
                      }}
                    >
                      {formatTemplateName(file.name)}
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </aside>

      <section className="workspace-main">
        <header className="workspace-header">
          <div>
            <p className="workspace-kicker">Selected Block</p>
            <h2>
              {selectedTemplate.group.folder} / {formatTemplateName(selectedTemplate.file.name)}
            </h2>
          </div>
          <button className="copy-button" type="button" onClick={handleCopy}>
            {copyState === "copied"
              ? "Copied"
              : copyState === "error"
                ? "Copy failed"
                : "Copy code"}
          </button>
        </header>

        <div className="workspace-panels">
          <article className="panel">
            <div className="panel-title">Live Preview</div>
            <div className="preview-frame-wrap">
              <iframe
                className="preview-frame"
                srcDoc={buildPreviewDocument(code)}
                title={`${selectedTemplate.group.folder} ${selectedTemplate.file.name} preview`}
              />
            </div>
          </article>

          <article className="panel">
            <div className="panel-title">HTML Code</div>
            <pre className="code-block">
              <code
                dangerouslySetInnerHTML={{
                  __html: hljs.highlight(code, { language: "html" }).value,
                }}
              />
            </pre>
          </article>
        </div>
      </section>
    </main>
  );
}
