import { NextResponse } from "next/server";
import { db } from "@/db";
import { standards0312, companies } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { initialStandards } from "@/db/seed";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId") || "c1";

  try {
    let items = await db.select().from(standards0312).where(eq(standards0312.companyId, companyId));
    if (items.length === 0) {
      // Seed for this company if missing
      const defaults = initialStandards(companyId);
      await db.insert(standards0312).values(defaults);
      items = await db.select().from(standards0312).where(eq(standards0312.companyId, companyId));
    }
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: initialStandards(companyId) });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, companyId, status, observation, evidence } = body;

    if (!id || !companyId) {
      return NextResponse.json({ success: false, error: "Missing id or companyId" }, { status: 400 });
    }

    const updateFields: any = { updatedAt: new Date() };
    if (status !== undefined) updateFields.status = status;
    if (observation !== undefined) updateFields.observation = observation;
    if (evidence !== undefined) updateFields.evidence = evidence;

    await db.update(standards0312).set(updateFields).where(eq(standards0312.id, id));

    // Recalculate company compliance percentage
    const allStds = await db.select().from(standards0312).where(eq(standards0312.companyId, companyId));
    let totalWeight = 0;
    let achievedWeight = 0;

    allStds.forEach((item) => {
      if (item.status !== "No Aplica") {
        totalWeight += item.weight;
        if (item.status === "Cumple") {
          achievedWeight += item.weight;
        }
      }
    });

    const newScore = totalWeight > 0 ? Number(((achievedWeight / totalWeight) * 100).toFixed(1)) : 100;
    await db.update(companies).set({ complianceScore: newScore }).where(eq(companies.id, companyId));

    return NextResponse.json({ success: true, newComplianceScore: newScore });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
