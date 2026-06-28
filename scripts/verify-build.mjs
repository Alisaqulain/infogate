import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), ".next", "static", "chunks", "app");
const localeDir = path.join(root, "[locale]");

const required = [
  path.join(localeDir, "registration", "osus"),
  path.join(localeDir, "contact"),
  path.join(localeDir, "services"),
];

let ok = true;

for (const dir of required) {
  if (!fs.existsSync(dir)) {
    console.error(`[verify-build] Missing chunk directory: ${dir}`);
    ok = false;
    continue;
  }
  const js = fs.readdirSync(dir).filter((f) => f.endsWith(".js"));
  if (js.length === 0) {
    console.error(`[verify-build] No JS chunks in: ${dir}`);
    ok = false;
  } else {
    console.log(`[verify-build] OK ${dir.replace(process.cwd(), ".")} (${js.join(", ")})`);
  }
}

if (!ok) {
  console.error(
    "[verify-build] Build incomplete — redeploy the full .next folder before starting the server."
  );
  process.exit(1);
}

console.log("[verify-build] Critical page chunks present.");
