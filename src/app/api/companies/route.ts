import { NextResponse } from "next/server";
import { db } from "@/db";
import { companies, standards0312, riskMatrixGTC45, annualPlan, auditFindings, inspections } from "@/db/schema";
import { initialCompanies, initialStandards, initialRisks, initialAnnualPlan, initialAuditFindings, initialInspections, seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    let list = await db.select().from(companies);
    if (list.length === 0) {
      await seedDatabase();
      list = await db.select().from(companies);
    }
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    // Fallback to in-memory initialCompanies if db connection fails during static rendering
    return NextResponse.json({ success: true, data: initialCompanies });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newId = `c_${Date.now()}`;
    const newCompany = {
      id: newId,
      name: body.name || "Nueva Empresa S.A.S.",
      nit: body.nit || "900.000.000-0",
      riskLevel: body.riskLevel || "Riesgo III (Medio)",
      employeesCount: Number(body.employeesCount) || 25,
      minStandardsGroup: body.minStandardsGroup || "21 Estándares",
      city: body.city || "Bogotá D.C.",
      arl: body.arl || "Sura",
      auditorName: body.auditorName || "Ing. Carlos Rodríguez (Lic. SST)",
      complianceScore: 75.0,
    };

    await db.insert(companies).values(newCompany);
    await db.insert(standards0312).values(initialStandards(newId));
    await db.insert(riskMatrixGTC45).values(initialRisks(newId));
    await db.insert(annualPlan).values(initialAnnualPlan(newId));
    await db.insert(auditFindings).values(initialAuditFindings(newId));
    await db.insert(inspections).values(initialInspections(newId));

    return NextResponse.json({ success: true, data: newCompany });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
