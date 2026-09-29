import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, "..");
const distDir = path.join(frontendDir, "dist");
const outputPublicDir = path.join(frontendDir, ".output/public");

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// If .output/public exists, copy everything into dist to ensure completeness
if (fs.existsSync(outputPublicDir)) {
  fs.cpSync(outputPublicDir, distDir, { recursive: true, force: true });
}

// Also ensure public static files (images, favicon, logo) are in dist
const publicDir = path.join(frontendDir, "public");
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true, force: true });
}

const targetDirs = [distDir, outputPublicDir].filter((d) => fs.existsSync(d));

for (const targetDir of targetDirs) {
  const assetsDir = path.join(targetDir, "assets");
  let cssFile = "";
  let jsFile = "";

  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css")) || "";
    jsFile = files.find((f) => f.startsWith("index-") && f.endsWith(".js")) || "";
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hariputhran Enterprises | Infrastructure & Civil Contractors</title>
    <meta name="description" content="Hariputhran Enterprises - Infrastructure & Civil Contractors delivering excellence in underground utilities, pipelines, and civil construction." />
    <link rel="icon" href="/favicon.png" type="image/png" />
    <link rel="shortcut icon" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    ${jsFile ? `<script type="module" src="/assets/${jsFile}"></script>` : ""}
  </body>
</html>
`;

  fs.writeFileSync(path.join(targetDir, "index.html"), htmlContent);

  const redirectsContent = `/*    /index.html    200
`;
  fs.writeFileSync(path.join(targetDir, "_redirects"), redirectsContent);
}

console.log("Postbuild completed: generated index.html & _redirects in dist and .output/public.");
