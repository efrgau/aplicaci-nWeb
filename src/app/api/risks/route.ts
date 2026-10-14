import { NextResponse } from "next/server";
import { db } from "@/db";
import { riskMatrixGTC45 } from "@/db/schema";
import { eq } from "drizzle-orm";
import { initialRisks } from "@/db/seed";
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId") || "c1";

  try {
    let items = await db.select().from(riskMatrixGTC45).where(eq(riskMatrixGTC45.companyId, companyId));
    if (items.length === 0) {
      const defaults = initialRisks(companyId);
      await db.insert(riskMatrixGTC45).values(defaults);
      items = await db.select().from(riskMatrixGTC45).where(eq(riskMatrixGTC45.companyId, companyId));
    }
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: initialRisks(companyId) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyId, process, zone, activity, hazardCategory, hazardDetail, existingControls, deficiencyLevel, exposureLevel, consequenceLevel, proposedControls } = body;

    const nd = Number(deficiencyLevel) || 6;
    const ne = Number(exposureLevel) || 3;
    const nc = Number(consequenceLevel) || 25;
    const np = nd * ne;
    const nr = np * nc;

    let riskLevelLabel = "III (Aceptable)";
    if (nr >= 600) riskLevelLabel = "I (No Aceptable)";
    else if (nr >= 120) riskLevelLabel = "II (Aceptable con Control)";
    else if (nr < 40) riskLevelLabel = "IV (Aceptable)";

    const newRisk = {
      id: `${companyId}-risk-${Date.now()}`,
      companyId,
      process: process || "Operaciones",
      zone: zone || "Planta Principal",
      activity: activity || "Actividad Operativa",
      hazardCategory: hazardCategory || "Biomecánico",
      hazardDetail: hazardDetail || "Detalle del riesgo",
      existingControls: existingControls || "Controles básicos",
      deficiencyLevel: nd,
      exposureLevel: ne,
      probabilityLevel: np,
      consequenceLevel: nc,
      riskLevelLabel,
      riskScore: nr,
      proposedControls: proposedControls || "Controles recomendados",
      status: "Identificado",
    };

    await db.insert(riskMatrixGTC45).values(newRisk);
    return NextResponse.json({ success: true, data: newRisk });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, proposedControls } = body;

    const updateFields: any = {};
    if (status !== undefined) updateFields.status = status;
    if (proposedControls !== undefined) updateFields.proposedControls = proposedControls;

    await db.update(riskMatrixGTC45).set(updateFields).where(eq(riskMatrixGTC45.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
