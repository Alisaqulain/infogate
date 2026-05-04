import type { Metadata } from "next";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `System check — ${SITE_NAME}`,
  robots: "noindex, nofollow",
};

const READY_LABEL: Record<number, string> = {
  0: "Disconnected",
  1: "Connected",
  2: "Connecting",
  3: "Disconnecting",
};

export default async function CheckPage() {
  let ok = false;
  let readyState = 0;
  let dbName: string | null = null;
  let errorMessage: string | null = null;

  try {
    await dbConnect();
    readyState = mongoose.connection.readyState;
    ok = readyState === 1;
    dbName = mongoose.connection.name || null;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Unknown error";
    readyState = mongoose.connection.readyState ?? 0;
  }

  const statusLabel = READY_LABEL[readyState] ?? `State ${readyState}`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-16 text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
      >
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-cyan-300/90">
          Internal
        </p>
        <h1 className="mt-2 text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Database check
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          {SITE_NAME} · MongoDB connection status
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <span className="text-sm font-semibold text-slate-300">Status</span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                ok
                  ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40"
                  : "bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/40"
              }`}
            >
              {ok ? "Healthy" : "Issue"}
            </span>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Connection</dt>
              <dd className="font-mono text-slate-200">{statusLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">readyState</dt>
              <dd className="font-mono text-slate-200">{readyState}</dd>
            </div>
            {dbName != null && (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Database</dt>
                <dd className="max-w-[60%] truncate text-right font-mono text-cyan-200">
                  {dbName}
                </dd>
              </div>
            )}
            {errorMessage && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-rose-100">
                <p className="text-xs font-bold uppercase text-rose-300/90">
                  Error
                </p>
                <p className="mt-1 break-words text-sm leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            )}
          </dl>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          JSON:{" "}
          <a
            href="/api/check"
            className="font-mono text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
          >
            /api/check
          </a>
        </p>
      </div>
    </main>
  );
}
