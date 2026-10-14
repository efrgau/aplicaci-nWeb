"use client";

import React from "react";
import { Company, Standard0312, RiskItemGTC45, AnnualPlanItem, UserRole } from "@/types";
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Calendar,
  ChevronRight,
  Plus
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

interface DashboardViewProps {
  companies: Company[];
  activeCompany: Company | null;
  standards: Standard0312[];
  risks: RiskItemGTC45[];
  annualPlan: AnnualPlanItem[];
  role: UserRole;
  setActiveCompany: (c: Company) => void;
  setActiveTab: (tab: any) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: "Pendiente" | "En Proceso" | "Completado") => void;
  onOpenNewTaskModal: () => void;
}

export function DashboardView({
  companies,
  activeCompany,
  standards,
  risks,
  annualPlan,
  role,
  setActiveCompany,
  setActiveTab,
  onUpdateTaskStatus,
  onOpenNewTaskModal,
}: DashboardViewProps) {
  // Calculations
  const complianceScore = activeCompany?.complianceScore || 0;

  // PHVA Breakdown calculation
  const phaseStats = React.useMemo(() => {
    const phases = ["Planear", "Hacer", "Verificar", "Actuar"];
    return phases.map((phase) => {
      const items = standards.filter((s) => s.phase === phase);
      if (items.length === 0) return { name: phase, total: 0, cumple: 0, percentage: 0 };
      const totalWeight = items.reduce((acc, cur) => (cur.status !== "No Aplica" ? acc + cur.weight : acc), 0);
      const doneWeight = items.reduce((acc, cur) => (cur.status === "Cumple" ? acc + cur.weight : acc), 0);
      const pct = totalWeight > 0 ? Math.round((doneWeight / totalWeight) * 100) : 100;
      return {
        name: phase,
        total: items.length,
        cumple: items.filter((s) => s.status === "Cumple").length,
        percentage: pct,
      };
    });
  }, [standards]);

  // Donut chart colors
  const PHVA_COLORS: Record<string, string> = {
    Planear: "#3B82F6", // Blue
    Hacer: "#10B981",   // Emerald
    Verificar: "#F59E0B", // Amber
    Actuar: "#8B5CF6",   // Purple
  };

  const donutData = phaseStats.map((p) => ({
    name: p.name,
    value: p.percentage,
    color: PHVA_COLORS[p.name] || "#3B82F6",
  }));

  const pendingTasks = annualPlan.filter((t) => t.status !== "Completado");
  const criticalRisks = risks.filter((r) => r.riskLevelLabel.includes("I (No Aceptable)") || r.riskScore >= 400);
  const monthlyInspectionsCount = 4; // Mock 4 monthly inspections

  return (
    <div className="space-[#0F172A] text-slate-100 p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                {role === "SuperAdmin" ? "Panel Auditoría Alianza Auditores" : "Panel de Control Cliente"}
              </span>
              <span className="text-slate-400 text-xs">• Resolución 0312 de 2019</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
              {activeCompany?.name || "Empresa Cliente"}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              NIT: <span className="text-slate-200 font-semibold">{activeCompany?.nit}</span> | Clase de Riesgo:{" "}
              <span className="text-emerald-400 font-semibold">{activeCompany?.riskLevel}</span> | {activeCompany?.minStandardsGroup}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab("evaluacion")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center space-x-2 transition-all"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Evaluar Estándares</span>
            </button>
            <button
              onClick={() => setActiveTab("matriz")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-2 transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Ver Matriz GTC 45</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: % Cumplimiento Global */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              % Cumplimiento Global
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{complianceScore}%</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                complianceScore >= 80
                  ? "bg-emerald-500/20 text-emerald-400"
                  : complianceScore >= 60
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {complianceScore >= 80 ? "ACEPTABLE" : complianceScore >= 60 ? "MODERADO" : "CRÍTICO"}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                complianceScore >= 80
                  ? "bg-emerald-500"
                  : complianceScore >= 60
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${complianceScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Basado en Res. 0312 ({standards.filter((s) => s.status === "Cumple").length} de {standards.length} ítems cumplidos)
          </p>
        </div>

        {/* KPI 2: Tareas Pendientes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tareas Pendientes
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{pendingTasks.length}</span>
            <span className="text-xs text-slate-400">de {annualPlan.length} programadas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center space-x-1">
            <span className="text-amber-400 font-semibold">
              {annualPlan.filter((t) => t.status === "En Proceso").length} en proceso
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">
              {annualPlan.filter((t) => t.status === "Completado").length} listas
            </span>
          </p>
        </div>

        {/* KPI 3: Riesgos Críticos */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Riesgos Críticos (Nivel I)
            </span>
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{criticalRisks.length}</span>
            <span className="text-xs font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">
              GTC 45 High
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            {risks.length} peligros totales registrados en matriz
          </p>
        </div>

        {/* KPI 4: Inspecciones del Mes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Inspecciones del Mes
            </span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{monthlyInspectionsCount}</span>
            <span className="text-xs font-semibold text-emerald-400">100% Ejecutadas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            EPP, Extintores, Alturas y Primeros Auxilios
          </p>
        </div>
      </div>

      {/* CHARTS & SUMMARY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DONUT CHART: Nivel de cumplimiento por Fase PHVA */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Cumplimiento por Fase PHVA</h3>
                <p className="text-xs text-slate-400">Planear, Hacer, Verificar y Actuar</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Res. 0312
              </span>
            </div>

            <div className="h-64 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F172A" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#FFF",
                    }}
                    formatter={(val: any) => [`${val}%`, "Cumplimiento"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Central text badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white">{complianceScore}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">PHVA Global</span>
              </div>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 mt-2">
            {phaseStats.map((item) => (
              <div key={item.name} className="flex items-center space-x-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: PHVA_COLORS[item.name] }}
                />
                <div className="truncate text-xs">
                  <span className="font-bold text-slate-200">{item.name}</span>
                  <div className="text-[11px] text-slate-400">
                    {item.percentage}% ({item.cumple}/{item.total} ítems)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRÓXIMAS ACTIVIDADES DEL PLAN DE TRABAJO */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Próximas Actividades del Plan de Trabajo</h3>
                <p className="text-xs text-slate-400">Cronograma de tareas prioritarias para la empresa</p>
              </div>
              <button
                onClick={onOpenNewTaskModal}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Actividad</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    <th className="py-2.5 px-3">Actividad</th>
                    <th className="py-2.5 px-3">Fase</th>
                    <th className="py-2.5 px-3">Responsable</th>
                    <th className="py-2.5 px-3">Mes</th>
                    <th className="py-2.5 px-3">Prioridad</th>
                    <th className="py-2.5 px-3">Estado</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {annualPlan.slice(0, 5).map((task) => (
                    <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white max-w-[200px] truncate">
                        {task.activityName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {task.phase}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 truncate max-w-[140px]">
                        {task.responsible}
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-400">
                        {task.scheduledMonth}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            task.priority === "Crítica"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                              : task.priority === "Alta"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            task.status === "Completado"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : task.status === "En Proceso"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {task.status !== "Completado" ? (
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, "Completado")}
                            className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline text-[11px]"
                          >
                            Completar
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">✓ Listo</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end">
            <button
              onClick={() => setActiveTab("plan")}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Ver Plan Anual Completo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SUPERADMIN EXECUTIVE OVERVIEW (When logged in as SuperAdmin) */}
      {role === "SuperAdmin" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Consola de Auditoría Multi-Empresa</h3>
              </div>
              <p className="text-xs text-slate-400">
                Resumen de las {companies.length} empresas cliente gestionadas por Alianza Auditores
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {companies.map((comp) => {
              const isCurrent = activeCompany?.id === comp.id;
              return (
                <div
                  key={comp.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/40"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white truncate max-w-[170px]">{comp.name}</h4>
                      <p className="text-xs text-slate-400">{comp.city} • NIT {comp.nit}</p>
                    </div>
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                        comp.complianceScore >= 80
                          ? "bg-emerald-500/20 text-emerald-400"
                          : comp.complianceScore >= 60
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {comp.complianceScore}%
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-slate-400 space-y-1">
                    <p>Nivel de Riesgo: <span className="text-slate-200 font-semibold">{comp.riskLevel}</span></p>
                    <p>Auditor: <span className="text-slate-200 font-semibold">{comp.auditorName}</span></p>
                  </div>

                  <button
                    onClick={() => setActiveCompany(comp)}
                    className={`mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                      isCurrent
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    <span>{isCurrent ? "Empresa Activa" : "Auditar Esta Empresa"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
