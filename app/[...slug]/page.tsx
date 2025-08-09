import Link from "next/link";
import fs from "node:fs";
import { notFound } from "next/navigation";

export default function Page({ params }: any) {
  // Expecting params.slug = [folder, file]
  if (!params.slug || params.slug.length !== 2) notFound();
  // Convert dashes to spaces for folder only, not file
  const [folderSlug, fileSlug] = params.slug;
  const folder = folderSlug.replace(/-/g, " ");
  const file = fileSlug; // keep dashes in file name

  let content = "";
  try {
    content = fs.readFileSync(`templates/${folder}/${file}.html`, "utf-8");
  } catch (e) {
    notFound();
  }

  // Sidebar logic (copied from homepage, but dashes for spaces in links)
  const templates = fs.readdirSync("templates").map((folder) => {
    const files = fs.readdirSync(`templates/${folder}`);
    return {
      folder,
      files: files.map((file) => ({
        name: file,
        content: fs.readFileSync(`templates/${folder}/${file}`, "utf-8"),
      })),
    };
  });

  const previewWidth = 240;
  const previewHeight = (previewWidth * 1080) / 1920;

  // Helper to convert spaces to dashes for URLs
  const toSlug = (str: string) =>
    str.replace(/\s+/g, "-").replace(/\.html$/, "");

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {/* sidebar */}
      <div
        style={{
          width: "300px",
          overflowY: "auto",
          flexShrink: 0,
          borderRight: "1px solid #eaeaea",
        }}
      >
        {templates.length > 0 ? (
          <ul className="p-4">
            {templates.map((template, index) => {
              return (
                <div style={{ marginBottom: "20px" }} key={index}>
                  <h5>{template?.folder}</h5>
                  {template?.files?.map((file, fileIndex) => {
                    return (
                      <div
                        key={fileIndex}
                        style={{
                          width: previewWidth,
                          height: previewHeight,
                          overflow: "hidden",
                          border: "1px solid #ccc",
                          marginBottom: "1rem",
                          cursor: "pointer",
                        }}
                      >
                        <Link
                          href={`/${toSlug(template.folder)}/${toSlug(
                            file.name
                          )}`}
                        >
                          <div
                            style={{
                              width: 1920,
                              height: 1080,
                              transform: `scale(${previewWidth / 1920})`,
                              transformOrigin: "top left",
                            }}
                            dangerouslySetInnerHTML={{ __html: file.content }}
                          ></div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </ul>
        ) : (
          <p className="p-4">No templates found.</p>
        )}
      </div>

      {/* content */}
      <div
        className="w-full overflow-y-scroll  flex flex-col items-center justify-center"
        style={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <div className="p-4 border-b w-full">
          <a href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </a>
          <span className="ml-2 text-gray-500">
            / {folder} / {file}.html
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">
            {folder} / {file}.html
          </h1>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}
