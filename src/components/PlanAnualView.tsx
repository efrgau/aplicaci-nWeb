"use client";

import React, { useState } from "react";
import { Company, AnnualPlanItem, UserRole } from "@/types";
import {
  CalendarRange,
  Plus,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  LayoutGrid,
  List,
  ChevronRight
} from "lucide-react";

interface PlanAnualViewProps {
  activeCompany: Company | null;
  annualPlan: AnnualPlanItem[];
  role: UserRole;
  onOpenNewTaskModal: () => void;
  onUpdateTaskStatus: (taskId: string, newStatus: "Pendiente" | "En Proceso" | "Completado") => void;
  onUpdateTaskProgress: (taskId: string, percentage: number) => void;
}

export function PlanAnualView({
  activeCompany,
  annualPlan,
  role,
  onOpenNewTaskModal,
  onUpdateTaskStatus,
  onUpdateTaskProgress,
}: PlanAnualViewProps) {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [phaseFilter, setPhaseFilter] = useState<string>("Todos");

  const filteredPlan = annualPlan.filter((t) => {
    if (phaseFilter !== "Todos" && t.phase !== phaseFilter) return false;
    return true;
  });

  const totalTasks = annualPlan.length;
  const completedTasks = annualPlan.filter((t) => t.status === "Completado").length;
  const inProgressTasks = annualPlan.filter((t) => t.status === "En Proceso").length;
  const globalProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalBudgetUSD = annualPlan.reduce((acc, cur) => acc + (cur.budgetUSD || 0), 0);

  const phases = ["Planear", "Hacer", "Verificar", "Actuar"] as const;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CalendarRange className="w-4 h-4" />
            <span>Cronograma de Actividades SG-SST</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Plan Anual de Trabajo 2025
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Estructura PHVA y asignación de recursos para <span className="text-white font-semibold">{activeCompany?.name}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "kanban" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewTaskModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Actividad</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase">Avance del Plan</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-emerald-400">{globalProgress}%</span>
            <span className="text-xs text-slate-400">({completedTasks} de {totalTasks} tareas)</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${globalProgress}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase">En Ejecución</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{inProgressTasks} Actividades</p>
          <p className="text-[11px] text-slate-400 mt-1">En curso durante este trimestre</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase">Presupuesto Asignado</p>
          <p className="text-2xl font-black text-white mt-1">${totalBudgetUSD.toLocaleString()} USD</p>
          <p className="text-[11px] text-slate-400 mt-1">Recursos aprobados por Gerencia</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase">Próximo Hito</p>
          <p className="text-sm font-bold text-emerald-400 mt-1 truncate">Auditoría de Cierre Res. 0312</p>
          <p className="text-[11px] text-slate-400 mt-1">Programado para Agosto</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
        <span className="text-xs text-slate-400 font-bold uppercase px-3">Filtrar Fase:</span>
        {["Todos", "Planear", "Hacer", "Verificar", "Actuar"].map((p) => (
          <button
            key={p}
            onClick={() => setPhaseFilter(p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              phaseFilter === p ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Fase</th>
                  <th className="py-3 px-4">Actividad del Plan</th>
                  <th className="py-3 px-4">Responsable</th>
                  <th className="py-3 px-4 text-center">Mes Programado</th>
                  <th className="py-3 px-4 text-center">Prioridad</th>
                  <th className="py-3 px-4 text-center">Progreso (%)</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs">
                {filteredPlan.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/20 text-[10px]">
                        {task.phase}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-extrabold text-white text-xs">{task.activityName}</p>
                      <p className="text-[11px] text-slate-400 italic mt-0.5">{task.observations || "Sin notas"}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {task.responsible}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-400">
                      {task.scheduledMonth}
                    </td>
                    <td className="py-3.5 px-4 text-center">
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
                    <td className="py-3.5 px-4 text-center w-36">
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          value={task.completionPercentage}
                          onChange={(e) => onUpdateTaskProgress(task.id, Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <span className="text-[11px] font-bold text-slate-300 w-8">{task.completionPercentage}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          task.status === "Completado"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : task.status === "En Proceso"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {task.status !== "Completado" ? (
                        <button
                          onClick={() => onUpdateTaskStatus(task.id, "Completado")}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all"
                        >
                          Marcar Listo
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-bold text-xs">✓ Finalizado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KANBAN VIEW */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((phase) => {
            const phaseTasks = annualPlan.filter((t) => t.phase === phase);
            return (
              <div key={phase} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>{phase}</span>
                    </h3>
                    <span className="text-xs bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
                      {phaseTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {phaseTasks.map((t) => (
                      <div key={t.id} className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl space-y-2">
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                            {t.scheduledMonth}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              t.priority === "Crítica" ? "bg-rose-500/20 text-rose-400" : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug">{t.activityName}</h4>
                        <p className="text-[11px] text-slate-400">Resp: {t.responsible}</p>

                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-bold">{t.completionPercentage}% Hecho</span>
                          <button
                            onClick={() =>
                              onUpdateTaskStatus(
                                t.id,
                                t.status === "Completado" ? "Pendiente" : "Completado"
                              )
                            }
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${
                              t.status === "Completado"
                                ? "bg-emerald-600 text-white border-emerald-400"
                                : "bg-slate-700 text-slate-300 border-slate-600 hover:text-white"
                            }`}
                          >
                            {t.status === "Completado" ? "Completado" : "Cambiar Estado"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
