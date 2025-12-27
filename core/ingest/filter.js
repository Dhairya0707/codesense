const path = require("path");

const ROLE_RULES = [
  { role: "config", match: (p) => p.endsWith("package.json") },

  {
    role: "entry",
    match: (p) =>
      p.endsWith("index.js") || p.endsWith("app.js") || p.endsWith("server.js"),
  },

  {
    role: "route",
    match: (p) => p.includes("/routes/") || p.includes("route"),
  },
  {
    role: "controller",
    match: (p) => p.includes("/controllers/") || p.includes("controller"),
  },
  { role: "service", match: (p) => p.includes("/services/") },

  {
    role: "model",
    match: (p) =>
      p.includes("/models/") || p.includes("models") || p.includes("db"),
  },
];

const blockedExts = [
  ".css",
  ".md",
  ".scss",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".ico",
  ".html",
];

const allowedExts = [".js", ".json", ".mjs", ".cjs"];

function filter(paths) {
  const results = [];

  for (const files of paths) {
    const name = files.toLowerCase();
    const ext = path.extname(name);

    if (blockedExts.includes(ext)) continue;
    if (!allowedExts.includes(ext)) continue;

    let role = "logic";

    for (const rule of ROLE_RULES) {
      if (rule.match(name)) {
        role = rule.role;
        break;
      }
    }

    results.push({ path: files, role });
  }

  return results;
}
module.exports = filter;
