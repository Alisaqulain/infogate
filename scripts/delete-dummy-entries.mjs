/**
 * One-off: backup then delete test/dummy FormSubmission rows (+ registration uploads).
 * Usage: node scripts/delete-dummy-entries.mjs
 */
import dns from "dns";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

dns.setServers(["192.168.1.1", "8.8.8.8", "1.1.1.1"]);

const VALID_GOV_SLUGS = new Set([
  "muscat",
  "dhofar",
  "musandam",
  "al_buraimi",
  "ad_dakhiliyah",
  "north_al_batinah",
  "south_al_batinah",
  "north_ash_sharqiyah",
  "south_ash_sharqiyah",
  "ad_dhahirah",
  "al_wusta",
]);

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function isDummySubmission(doc) {
  const name = String(doc.name || "").trim();
  const email = String(doc.email || "").trim().toLowerCase();
  const phone = String(doc.phone || "").trim();
  const message = String(doc.message || "").trim().toLowerCase();
  const meta = doc.meta && typeof doc.meta === "object" ? doc.meta : {};

  if (doc.type === "contact") {
    if (email === "john.doe@example.com") return true;
    if (name.length <= 3) return true;
    return true;
  }

  if (doc.type === "registration") {
    const gov = typeof meta.governorate === "string" ? meta.governorate : "";
    const cr = String(meta.crNumber || "").trim();
    const trade = String(meta.tradeName || "").trim();
    const website = String(meta.website || message).toLowerCase();

    if (!VALID_GOV_SLUGS.has(gov)) return true;
    if (website.includes("localhost")) return true;
    if (!/^\+968[79]\d{7}$/.test(phone.replace(/\s/g, ""))) return true;
    if (name.length <= 4 || trade.length <= 3 || cr.length <= 4) return true;
    if (/^\+91/.test(phone)) return true;
    if (/^(fa|gfd|fds|fsd|da|ds|fsdfds)$/i.test(name)) return true;
  }

  return false;
}

loadEnvLocal();
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}

const uploadsRoot = path.join(process.cwd(), "uploads", "registrations");

await mongoose.connect(uri, { dbName: "infogate" });
const col = mongoose.connection.collection("formsubmissions");
const all = await col.find({}).toArray();

const toDelete = all.filter(isDummySubmission);
const backupPath = path.join(
  process.cwd(),
  "scripts",
  `formsubmissions-backup-${new Date().toISOString().slice(0, 10)}.json`
);
fs.writeFileSync(backupPath, JSON.stringify(toDelete, null, 2), "utf8");

const ids = toDelete.map((d) => d._id);
if (ids.length === 0) {
  console.log("No dummy submissions found.");
  await mongoose.disconnect();
  process.exit(0);
}

const result = await col.deleteMany({ _id: { $in: ids } });

for (const doc of toDelete) {
  const id = doc._id.toString();
  const dir = path.join(uploadsRoot, id);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log("Removed uploads:", id);
  }
}

console.log("Backup:", backupPath);
console.log("Deleted", result.deletedCount, "form submission(s):");
for (const doc of toDelete) {
  console.log(
    `  - ${doc._id} [${doc.type}] ${doc.name}${doc.email ? ` <${doc.email}>` : ""}`
  );
}

const remaining = await col.countDocuments();
console.log("Remaining form submissions:", remaining);

await mongoose.disconnect();
