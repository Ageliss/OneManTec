const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.join(__dirname, "src");
const port = Number(process.env.PORT ?? 3100);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
};

http
  .createServer((req, res) => {
    const requestPath = req.url === "/" ? "/index.html" : req.url;
    const filePath = path.join(rootDir, requestPath);

    if (!filePath.startsWith(rootDir) || !fs.existsSync(filePath)) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    const contentType = mimeTypes[extension] ?? "application/octet-stream";

    res.writeHead(200, { "content-type": contentType });
    res.end(fs.readFileSync(filePath));
  })
  .listen(port, () => {
    console.log(`web-portal listening on http://localhost:${port}`);
  });
