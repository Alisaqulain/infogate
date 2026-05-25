/**
 * One-off: set admin login username (run from project root).
 * Usage: node scripts/set-admin-username.mjs infogateosus
 */
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const username = (process.argv[2] || "infogateosus").trim().toLowerCase();

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

loadEnvLocal();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI missing in .env.local");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  passwordHash: { type: String, required: true },
});

const Admin =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

await mongoose.connect(uri);
const admins = await Admin.find({}).lean();
if (admins.length === 0) {
  console.log("No admin users in database. First login will create:", username);
  await mongoose.disconnect();
  process.exit(0);
}

for (const doc of admins) {
  await Admin.updateOne({ _id: doc._id }, { $set: { username } });
  console.log("Updated admin", doc._id.toString(), "→ username:", username);
}

await mongoose.disconnect();
console.log("Done.");
