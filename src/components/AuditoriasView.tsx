"use client";

import React, { useState } from "react";
import { Company, AuditFinding, UserRole } from "@/types";
import {
  Search,
  Plus,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck,
  User
} from "lucide-react";

interface AuditoriasViewProps {
  activeCompany: Company | null;
  findings: AuditFinding[];
  role: UserRole;
  onOpenNewFindingModal: () => void;
  onUpdateFindingStatus: (id: string, status: "Abierto" | "En Gestión" | "Cerrado") => void;
}

export function AuditoriasView({
  activeCompany,
  findings,
  role,
  onOpenNewFindingModal,
  onUpdateFindingStatus,
}: AuditoriasViewProps) {
  const [typeFilter, setTypeFilter] = useState<string>("Todos");

  const filteredFindings = findings.filter((f) => {
    if (typeFilter !== "Todos" && f.findingType !== typeFilter) return false;
    return true;
  });

  const ncMayorCount = findings.filter((f) => f.findingType === "No Conformidad Mayor").length;
  const ncMenorCount = findings.filter((f) => f.findingType === "No Conformidad Menor").length;
  const openCount = findings.filter((f) => f.status === "Abierto" || f.status === "En Gestión").length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Search className="w-4 h-4" />
            <span>Auditorías & Gestión de No Conformidades (CAPA)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Hallazgos e Informe de Auditoría
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Registro de planes de acción correctiva y preventiva para <span className="text-white font-semibold">{activeCompany?.name}</span>
          </p>
        </div>

        <button
          onClick={onOpenNewFindingModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Hallazgo</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">No Conformidades Mayores</p>
            <p className="text-xl font-black text-rose-400">{ncMayorCount} Hallazgos</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">No Conformidades Menores</p>
            <p className="text-xl font-black text-amber-400">{ncMenorCount} Hallazgos</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Abiertos / En Gestión</p>
            <p className="text-xl font-black text-emerald-400">{openCount} En Proceso</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex items-center space-x-2">
        <span className="text-xs text-slate-400 font-bold uppercase px-3">Filtrar Tipo:</span>
        {["Todos", "No Conformidad Mayor", "No Conformidad Menor", "Oportunidad de Mejora"].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === t ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Findings List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-4">Código / Estándar</th>
                <th className="py-3 px-4">Tipo Hallazgo</th>
                <th className="py-3 px-4">Descripción del Hallazgo</th>
                <th className="py-3 px-4">Causa Raíz & Acción Correctiva (CAPA)</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Vencimiento</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {filteredFindings.map((finding) => (
                <tr key={finding.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    <p className="text-white font-bold">{finding.auditCode}</p>
                    <p className="text-[11px] text-slate-400">{finding.standardCode}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        finding.findingType === "No Conformidad Mayor"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : finding.findingType === "No Conformidad Menor"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                      }`}
                    >
                      {finding.findingType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs font-semibold text-slate-200">
                    {finding.description}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-slate-300">
                    <p className="text-[11px] font-semibold text-slate-400">Causa: {finding.rootCause}</p>
                    <p className="text-[11px] font-bold text-emerald-400 mt-0.5">Acción: {finding.correctiveAction}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {finding.responsible}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-center">
                    {finding.dueDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center space-x-1">
                      {(["Abierto", "En Gestión", "Cerrado"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => onUpdateFindingStatus(finding.id, st)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                            finding.status === st
                              ? st === "Cerrado"
                                ? "bg-emerald-600 text-white border-emerald-400"
                                : st === "En Gestión"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
