import nodemailer from "nodemailer";

function getEnv(name: string) {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

export type AdminNotificationInput = {
  subject: string;
  text: string;
};

export async function sendAdminNotification(input: AdminNotificationInput) {
  const user = getEnv("SMTP_USER");
  const pass = getEnv("SMTP_PASS");
  const from = getEnv("SMTP_FROM") ?? user;
  const to = getEnv("ADMIN_NOTIFY_EMAIL") ?? "infogate010490@gmail.com";

  if (!user || !pass || !from || !to) {
    return { ok: false as const, reason: "SMTP not configured" };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: input.subject,
    text: input.text,
  });

  return { ok: true as const };
}

