"use client";

import React, { useState } from "react";
import { Company, RiskItemGTC45, UserRole } from "@/types";
import {
  AlertTriangle,
  Plus,
  Filter,
  Shield,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface MatrizRiesgosViewProps {
  activeCompany: Company | null;
  risks: RiskItemGTC45[];
  role: UserRole;
  onOpenNewRiskModal: () => void;
  onUpdateRiskStatus: (id: string, status: "Identificado" | "En Mitigación" | "Controlado") => void;
}

export function MatrizRiesgosView({
  activeCompany,
  risks,
  role,
  onOpenNewRiskModal,
  onUpdateRiskStatus,
}: MatrizRiesgosViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("Todos");
  const [levelFilter, setLevelFilter] = useState<string>("Todos");

  const filteredRisks = risks.filter((r) => {
    if (categoryFilter !== "Todos" && r.hazardCategory !== categoryFilter) return false;
    if (levelFilter === "Nivel I" && !r.riskLevelLabel.includes("I (No Aceptable)")) return false;
    if (levelFilter === "Nivel II" && !r.riskLevelLabel.includes("II")) return false;
    if (levelFilter === "Nivel III/IV" && (r.riskLevelLabel.includes("I") || r.riskLevelLabel.includes("II"))) return false;
    return true;
  });

  const levelICount = risks.filter((r) => r.riskLevelLabel.includes("I (No Aceptable)")).length;
  const levelIICount = risks.filter((r) => r.riskLevelLabel.includes("II")).length;
  const inMitigationCount = risks.filter((r) => r.status === "En Mitigación").length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Guía Técnica Colombiana GTC 45 (2a Edición)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Matriz de Identificación de Peligros y Valoración de Riesgos
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Evaluación cualitativa y cuantitativa para <span className="text-white font-semibold">{activeCompany?.name}</span>
          </p>
        </div>

        <button
          onClick={onOpenNewRiskModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Peligro</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Riesgos Nivel I (No Aceptable)</p>
            <p className="text-2xl font-black text-rose-400 mt-1">{levelICount} Peligros</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Requiere intervención inmediata</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Riesgos Nivel II (Control Específico)</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{levelIICount} Peligros</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Aceptable con controles de ingeniería/EPP</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">En Proceso de Mitigación</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{inMitigationCount} Controles</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Planes de acción en ejecución</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-bold uppercase mr-1">Categoría:</span>
          {["Todos", "Biomecánico", "Condiciones de Seguridad", "Químico", "Psicosocial", "Físico"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Nivel Riesgo:</span>
          {["Todos", "Nivel I", "Nivel II", "Nivel III/IV"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                levelFilter === lvl
                  ? "bg-amber-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-4">Proceso / Zona</th>
                <th className="py-3 px-4">Clasificación Peligro</th>
                <th className="py-3 px-4">Peligro Identificado</th>
                <th className="py-3 px-4 text-center">ND × NE = NP</th>
                <th className="py-3 px-4 text-center">NC</th>
                <th className="py-3 px-4 text-center">Nivel de Riesgo (NR)</th>
                <th className="py-3 px-4">Controles Propuestos</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {filteredRisks.map((risk) => {
                const isLevelI = risk.riskLevelLabel.includes("I (No Aceptable)");
                const isLevelII = risk.riskLevelLabel.includes("II");
                return (
                  <tr key={risk.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-xs">{risk.process}</p>
                      <p className="text-[11px] text-slate-400">{risk.zone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-400 border border-emerald-500/20">
                        {risk.hazardCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-200">{risk.hazardDetail}</p>
                      <p className="text-[11px] text-slate-400 italic mt-0.5">
                        Ctrl actual: {risk.existingControls}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">
                      {risk.deficiencyLevel} × {risk.exposureLevel} = <span className="text-white">{risk.probabilityLevel}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">
                      {risk.consequenceLevel}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border ${
                          isLevelI
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                            : isLevelII
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/40"
                        }`}
                      >
                        {risk.riskLevelLabel} ({risk.riskScore})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs font-medium text-slate-300">
                      {risk.proposedControls}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center space-x-1">
                        {(["Identificado", "En Mitigación", "Controlado"] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => onUpdateRiskStatus(risk.id, st)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                              risk.status === st
                                ? st === "Controlado"
                                  ? "bg-emerald-600 text-white border-emerald-400"
                                  : st === "En Mitigación"
                                  ? "bg-amber-600 text-white border-amber-400"
                                  : "bg-rose-600 text-white border-rose-400"
                                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
