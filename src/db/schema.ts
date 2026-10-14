import { pgTable, text, integer, real, timestamp, uuid } from "drizzle-orm/pg-core";

// 1. Client Companies (Tenants)
export const companies = pgTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nit: text("nit").notNull(),
  riskLevel: text("risk_level").notNull(), // I, II, III, IV, V
  employeesCount: integer("employees_count").notNull(),
  minStandardsGroup: text("min_standards_group").notNull(), // "7 Estándares", "21 Estándares", "60 Estándares"
  city: text("city").notNull(),
  arl: text("arl").notNull(),
  auditorName: text("auditor_name").notNull(),
  complianceScore: real("compliance_score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Res 0312 Minimum Standards (Evaluación Inicial)
export const standards0312 = pgTable("standards_0312", {
  id: text("id").primaryKey(),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: 'cascade' }),
  itemNumber: text("item_number").notNull(), // e.g. "1.1.1"
  phase: text("phase").notNull(), // "Planear", "Hacer", "Verificar", "Actuar"
  category: text("category").notNull(), // "Recursos", "Gestión Integral", etc.
  description: text("description").notNull(),
  weight: real("weight").notNull(),
  status: text("status").notNull(), // "Cumple", "No Cumple", "No Aplica"
  evidence: text("evidence"),
  observation: text("observation"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Matriz de Riesgos GTC 45
export const riskMatrixGTC45 = pgTable("risk_matrix_gtc45", {
  id: text("id").primaryKey(),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: 'cascade' }),
  process: text("process").notNull(),
  zone: text("zone").notNull(),
  activity: text("activity").notNull(),
  hazardCategory: text("hazard_category").notNull(), // Biológico, Físico, Químico, Psicosocial, Biomecánico, Condiciones de Seguridad, Fenómenos Naturales
  hazardDetail: text("hazard_detail").notNull(),
  existingControls: text("existing_controls").notNull(),
  deficiencyLevel: integer("deficiency_level").notNull(), // ND: 2, 6, 10
  exposureLevel: integer("exposure_level").notNull(), // NE: 1, 2, 3, 4
  probabilityLevel: integer("probability_level").notNull(), // NP = ND x NE
  consequenceLevel: integer("consequence_level").notNull(), // NC: 10, 25, 60, 100
  riskLevelLabel: text("risk_level_label").notNull(), // "I (No Aceptable)", "II", "III", "IV"
  riskScore: integer("risk_score").notNull(), // NR = NP x NC
  proposedControls: text("proposed_controls").notNull(),
  status: text("status").notNull(), // "Identificado", "En Mitigación", "Controlado"
});

// 4. Plan Anual de Trabajo (PHVA)
export const annualPlan = pgTable("annual_plan", {
  id: text("id").primaryKey(),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: 'cascade' }),
  phase: text("phase").notNull(), // "Planear", "Hacer", "Verificar", "Actuar"
  activityName: text("activity_name").notNull(),
  responsible: text("responsible").notNull(),
  priority: text("priority").notNull(), // "Alta", "Media", "Baja", "Crítica"
  scheduledMonth: text("scheduled_month").notNull(), // Ene, Feb, ...
  status: text("status").notNull(), // "Pendiente", "En Proceso", "Completado"
  completionPercentage: integer("completion_percentage").notNull().default(0),
  budgetUSD: integer("budget_usd").notNull().default(0),
  observations: text("observations"),
});

// 5. Auditorías y Hallazgos
export const auditFindings = pgTable("audit_findings", {
  id: text("id").primaryKey(),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: 'cascade' }),
  auditCode: text("audit_code").notNull(),
  findingType: text("finding_type").notNull(), // "No Conformidad Mayor", "No Conformidad Menor", "Oportunidad de Mejora", "Conformidad"
  standardCode: text("standard_code").notNull(),
  description: text("description").notNull(),
  rootCause: text("root_cause").notNull(),
  correctiveAction: text("corrective_action").notNull(),
  responsible: text("responsible").notNull(),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull(), // "Abierto", "En Gestión", "Cerrado"
});

// 6. Inspecciones de Seguridad
export const inspections = pgTable("inspections", {
  id: text("id").primaryKey(),
  companyId: text("company_id").notNull().references(() => companies.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  inspector: text("inspector").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(),
  findingsCount: integer("findings_count").notNull().default(0),
});

// 7. Red de Especialistas SST (Móvil / Cotizaciones)
export const specialists = pgTable("specialists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  rating: real("rating").notNull(),
  city: text("city").notNull(),
  distance: text("distance").notNull(),
  hourlyRateUSD: integer("hourly_rate_usd").notNull(),
  avatar: text("avatar").notNull(),
  availability: text("availability").notNull(),
});
