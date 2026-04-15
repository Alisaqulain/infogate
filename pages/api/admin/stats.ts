import type { NextApiRequest, NextApiResponse } from "next";
import { withAdminGuard } from "@/lib/adminAuth";
import { dbConnect } from "@/lib/db";
import { Service } from "@/models/Service";
import { Blog } from "@/models/Blog";
import { FormSubmission } from "@/models/FormSubmission";

export default withAdminGuard(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();
  const [services, blogs, inquiries] = await Promise.all([
    Service.countDocuments(),
    Blog.countDocuments(),
    FormSubmission.countDocuments(),
  ]);

  return res.status(200).json({ ok: true, services, blogs, inquiries });
});
