import { NextResponse } from "next/server";
import { db } from "@/db";
import { auditFindings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { initialAuditFindings } from "@/db/seed";
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId") || "c1";

  try {
    let items = await db.select().from(auditFindings).where(eq(auditFindings.companyId, companyId));
    if (items.length === 0) {
      const defaults = initialAuditFindings(companyId);
      await db.insert(auditFindings).values(defaults);
      items = await db.select().from(auditFindings).where(eq(auditFindings.companyId, companyId));
    }
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: initialAuditFindings(companyId) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyId, auditCode, findingType, standardCode, description, rootCause, correctiveAction, responsible, dueDate } = body;

    const newFinding = {
      id: `${companyId}-find-${Date.now()}`,
      companyId,
      auditCode: auditCode || "AUD-2025-01",
      findingType: findingType || "No Conformidad Menor",
      standardCode: standardCode || "Res 0312",
      description: description || "Hallazgo registrado durante auditoría.",
      rootCause: rootCause || "Por determinar",
      correctiveAction: correctiveAction || "Acción inmediata de control",
      responsible: responsible || "Líder de Área",
      dueDate: dueDate || "2025-05-30",
      status: "Abierto",
    };

    await db.insert(auditFindings).values(newFinding);
    return NextResponse.json({ success: true, data: newFinding });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    await db.update(auditFindings).set({ status }).where(eq(auditFindings.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
