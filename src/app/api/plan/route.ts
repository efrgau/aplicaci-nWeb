import { NextResponse } from "next/server";
import { db } from "@/db";
import { annualPlan } from "@/db/schema";
import { eq } from "drizzle-orm";
import { initialAnnualPlan } from "@/db/seed";
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId") || "c1";

  try {
    let items = await db.select().from(annualPlan).where(eq(annualPlan.companyId, companyId));
    if (items.length === 0) {
      const defaults = initialAnnualPlan(companyId);
      await db.insert(annualPlan).values(defaults);
      items = await db.select().from(annualPlan).where(eq(annualPlan.companyId, companyId));
    }
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: initialAnnualPlan(companyId) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyId, phase, activityName, responsible, priority, scheduledMonth, budgetUSD } = body;

    const newTask = {
      id: `${companyId}-plan-${Date.now()}`,
      companyId,
      phase: phase || "Planear",
      activityName: activityName || "Nueva Actividad SST",
      responsible: responsible || "Responsable SST",
      priority: priority || "Media",
      scheduledMonth: scheduledMonth || "May",
      status: "Pendiente",
      completionPercentage: 0,
      budgetUSD: Number(budgetUSD) || 500,
      observations: "Registrado en el plan anual",
    };

    await db.insert(annualPlan).values(newTask);
    return NextResponse.json({ success: true, data: newTask });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, completionPercentage } = body;

    const updateFields: any = {};
    if (status !== undefined) updateFields.status = status;
    if (completionPercentage !== undefined) {
      updateFields.completionPercentage = Number(completionPercentage);
      if (Number(completionPercentage) === 100) {
        updateFields.status = "Completado";
      } else if (Number(completionPercentage) > 0) {
        updateFields.status = "En Proceso";
      }
    }

    await db.update(annualPlan).set(updateFields).where(eq(annualPlan.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
