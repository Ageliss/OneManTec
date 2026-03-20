const http = require("node:http");
const { URL } = require("node:url");
const { createHttpApp } = require("./http-app.js");

function createHttpServer() {
  const app = createHttpApp();

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const body = await readJsonBody(req);
    const response = app.handleRoute({
      method: req.method,
      pathname: url.pathname,
      body,
    });

    res.writeHead(response.statusCode, response.headers);
    res.end(JSON.stringify(response.body, null, 2));
  });
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
  });
}

module.exports = {
  createHttpServer,
};
