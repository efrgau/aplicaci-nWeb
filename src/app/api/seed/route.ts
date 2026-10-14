import { NextResponse } from "next/server";
import { seedDatabase } from "@/db/seed";
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    await seedDatabase();
    return NextResponse.json({ success: true, message: "Database seeded or already populated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
