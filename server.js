const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PORT = 4173;
const HOST = "0.0.0.0";
const ROOT = __dirname;
const SAVE_FILE = path.join(ROOT, "scores.json");
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function readSave() {
  try {
    return JSON.parse(fs.readFileSync(SAVE_FILE, "utf8"));
  } catch {
    return { highScores: {}, currentPlayer: "אופק", savedAt: null };
  }
}

function writeSave(save) {
  const current = readSave();
  const nextScores = { ...current.highScores };
  const incomingScores = save.highScores && typeof save.highScores === "object" ? save.highScores : {};

  Object.entries(incomingScores).forEach(([name, points]) => {
    const safeName = String(name).trim().replace(/\s+/g, " ").slice(0, 14) || "אופק";
    const safePoints = Number(points) || 0;
    nextScores[safeName] = Math.max(nextScores[safeName] || 0, Math.floor(safePoints));
  });

  const next = {
    highScores: nextScores,
    currentPlayer: String(save.currentPlayer || current.currentPlayer || "אופק")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 14) || "אופק",
    savedAt: new Date().toISOString(),
  };

  fs.writeFileSync(SAVE_FILE, JSON.stringify(next, null, 2), "utf8");
  return next;
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  response.end(JSON.stringify(value));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function serveFile(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(ROOT, requestedPath));

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    response.end(data);
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    });
    response.end();
    return;
  }

  if (request.url === "/api/save" && request.method === "GET") {
    sendJson(response, 200, readSave());
    return;
  }

  if (request.url === "/api/save" && request.method === "POST") {
    try {
      const body = await readRequestBody(request);
      sendJson(response, 200, writeSave(JSON.parse(body || "{}")));
    } catch {
      sendJson(response, 400, { error: "Could not save scores" });
    }
    return;
  }

  serveFile(request, response);
});

function getLanUrls() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((net) => net && net.family === "IPv4" && !net.internal)
    .map((net) => `http://${net.address}:${PORT}`);
}

server.listen(PORT, HOST, () => {
  console.log(`Ofek Race is running on this computer: http://127.0.0.1:${PORT}`);
  console.log("Open one of these on Android, using the same Wi-Fi:");
  getLanUrls().forEach((url) => console.log(`  ${url}`));
});
