export type UserRole = "SuperAdmin" | "ClienteAdmin";

export interface Company {
  id: string;
  name: string;
  nit: string;
  riskLevel: string;
  employeesCount: number;
  minStandardsGroup: string;
  city: string;
  arl: string;
  auditorName: string;
  complianceScore: number;
}

export interface Standard0312 {
  id: string;
  companyId: string;
  itemNumber: string;
  phase: "Planear" | "Hacer" | "Verificar" | "Actuar";
  category: string;
  description: string;
  weight: number;
  status: "Cumple" | "No Cumple" | "No Aplica";
  evidence?: string | null;
  observation?: string | null;
  updatedAt?: string | Date;
}

export interface RiskItemGTC45 {
  id: string;
  companyId: string;
  process: string;
  zone: string;
  activity: string;
  hazardCategory: string;
  hazardDetail: string;
  existingControls: string;
  deficiencyLevel: number;
  exposureLevel: number;
  probabilityLevel: number;
  consequenceLevel: number;
  riskLevelLabel: string;
  riskScore: number;
  proposedControls: string;
  status: "Identificado" | "En Mitigación" | "Controlado";
}

export interface AnnualPlanItem {
  id: string;
  companyId: string;
  phase: "Planear" | "Hacer" | "Verificar" | "Actuar";
  activityName: string;
  responsible: string;
  priority: "Alta" | "Media" | "Baja" | "Crítica";
  scheduledMonth: string;
  status: "Pendiente" | "En Proceso" | "Completado";
  completionPercentage: number;
  budgetUSD: number;
  observations?: string | null;
}

export interface AuditFinding {
  id: string;
  companyId: string;
  auditCode: string;
  findingType: "No Conformidad Mayor" | "No Conformidad Menor" | "Oportunidad de Mejora" | "Conformidad";
  standardCode: string;
  description: string;
  rootCause: string;
  correctiveAction: string;
  responsible: string;
  dueDate: string;
  status: "Abierto" | "En Gestión" | "Cerrado";
}

export interface InspectionItem {
  id: string;
  companyId: string;
  title: string;
  inspector: string;
  date: string;
  status: string;
  findingsCount: number;
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  rating: number;
  city: string;
  distance: string;
  hourlyRateUSD: number;
  avatar: string;
  availability: string;
}
