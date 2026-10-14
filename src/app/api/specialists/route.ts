import { NextResponse } from "next/server";
import { db } from "@/db";
import { specialists } from "@/db/schema";
import { initialSpecialists } from "@/db/seed";

export async function GET() {
  try {
    let list = await db.select().from(specialists);
    if (list.length === 0) {
      await db.insert(specialists).values(initialSpecialists);
      list = await db.select().from(specialists);
    }
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: initialSpecialists });
  }
}
