import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    const state = mongoose.connection.readyState; // 1 = connected
    return NextResponse.json({
      ok: state === 1,
      readyState: state,
      db: mongoose.connection.name || null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, readyState: mongoose.connection.readyState ?? 0, error: message },
      { status: 500 }
    );
  }
}

