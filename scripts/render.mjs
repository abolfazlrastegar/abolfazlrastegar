import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = resolve(root, "preview");

const marked = new Marked({ gfm: true, breaks: false });
marked.use(gfmHeadingId());

const source = readFileSync(resolve(root, "README.md"), "utf8");
const body = marked.parse(source);

const cssPath = resolve(
  root,
  "node_modules",
  "github-markdown-css",
  "github-markdown.css",
);
const css = readFileSync(cssPath, "utf8");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Profile README preview</title>
  <style>${css}</style>
  <style>
    body { margin: 0; background: #0d1117; }
    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 45px;
    }
    @media (max-width: 767px) { .markdown-body { padding: 15px; } }
  </style>
</head>
<body>
  <article class="markdown-body" data-color-mode="dark" data-dark-theme="dark">
${body}
  </article>
</body>
</html>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "index.html"), html, "utf8");
console.log(`Rendered README.md -> ${resolve(outDir, "index.html")} (${body.length} bytes of HTML)`);
