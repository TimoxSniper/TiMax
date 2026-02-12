import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth/admin";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const admin = await isAdmin();

    return NextResponse.json({ isAdmin: admin });
  } catch (error) {
    logger.error("[Auth Admin Check API] Error:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
