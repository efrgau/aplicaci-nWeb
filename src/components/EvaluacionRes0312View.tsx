"use client";

import React, { useState } from "react";
import { Company, Standard0312, UserRole } from "@/types";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  FileText,
  Save,
  ShieldAlert,
  BarChart3,
  Award
} from "lucide-react";

interface EvaluacionRes0312ViewProps {
  activeCompany: Company | null;
  standards: Standard0312[];
  role: UserRole;
  onUpdateStandardStatus: (
    id: string,
    status: "Cumple" | "No Cumple" | "No Aplica",
    observation?: string,
    evidence?: string
  ) => void;
}

export function EvaluacionRes0312View({
  activeCompany,
  standards,
  role,
  onUpdateStandardStatus,
}: EvaluacionRes0312ViewProps) {
  const [phaseFilter, setPhaseFilter] = useState<string>("Todos");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editObservation, setEditingObservation] = useState<string>("");
  const [editEvidence, setEditingEvidence] = useState<string>("");

  const filteredStandards = standards.filter((s) => {
    if (phaseFilter !== "Todos" && s.phase !== phaseFilter) return false;
    if (statusFilter !== "Todos" && s.status !== statusFilter) return false;
    return true;
  });

  // Calculate totals
  const totalItems = standards.length;
  const cumpleCount = standards.filter((s) => s.status === "Cumple").length;
  const noCumpleCount = standards.filter((s) => s.status === "No Cumple").length;
  const noAplicaCount = standards.filter((s) => s.status === "No Aplica").length;

  const totalWeight = standards.reduce(
    (acc, cur) => (cur.status !== "No Aplica" ? acc + cur.weight : acc),
    0
  );
  const achievedWeight = standards.reduce(
    (acc, cur) => (cur.status === "Cumple" ? acc + cur.weight : acc),
    0
  );
  const score = totalWeight > 0 ? ((achievedWeight / totalWeight) * 100).toFixed(1) : "100.0";

  const handleStartEdit = (std: Standard0312) => {
    setEditingId(std.id);
    setEditingObservation(std.observation || "");
    setEditingEvidence(std.evidence || "");
  };

  const handleSaveEdit = (std: Standard0312) => {
    onUpdateStandardStatus(std.id, std.status, editObservation, editEvidence);
    setEditingId(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ClipboardCheck className="w-4 h-4" />
            <span>Resolución 0312 de 2019 • Estándares Mínimos</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Evaluación Inicial del SG-SST
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Autoevaluación y veredicto de auditoría para <span className="text-white font-semibold">{activeCompany?.name}</span> ({activeCompany?.minStandardsGroup})
          </p>
        </div>

        {/* Global Compliance Widget */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg border border-emerald-500/30">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black text-emerald-400">{score}%</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                {Number(score) >= 80 ? "ACEPTABLE" : Number(score) >= 60 ? "MODERADO" : "CRÍTICO"}
              </span>
            </div>
            <p className="text-xs text-slate-400">Puntaje obtenido / 100% total</p>
          </div>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            {totalItems}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Total Ítems</p>
            <p className="text-sm font-bold text-white">100% Estándares</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            {cumpleCount}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Cumplen</p>
            <p className="text-sm font-bold text-emerald-400">{cumpleCount} ítems</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
            {noCumpleCount}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">No Cumplen</p>
            <p className="text-sm font-bold text-rose-400">{noCumpleCount} ítems</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
            {noAplicaCount}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">No Aplica</p>
            <p className="text-sm font-bold text-slate-300">{noAplicaCount} ítems</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold uppercase">
            <Filter className="w-4 h-4" />
            <span>Fase PHVA:</span>
          </div>
          {["Todos", "Planear", "Hacer", "Verificar", "Actuar"].map((phase) => (
            <button
              key={phase}
              onClick={() => setPhaseFilter(phase)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                phaseFilter === phase
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {phase}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Estado:</span>
          {["Todos", "Cumple", "No Cumple", "No Aplica"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? "bg-teal-600 text-white shadow"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Standards Interactive Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-4">Ítem</th>
                <th className="py-3 px-4">Fase</th>
                <th className="py-3 px-4">Categoría / Estándar</th>
                <th className="py-3 px-4 text-center">Peso (%)</th>
                <th className="py-3 px-4 text-center">Estado Auditoría</th>
                <th className="py-3 px-4">Evidencia / Observación</th>
                {role === "SuperAdmin" && <th className="py-3 px-4 text-right">Acción</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {filteredStandards.map((std) => {
                const isEditing = editingId === std.id;
                return (
                  <tr key={std.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {std.itemNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-bold text-[10px]">
                        {std.phase}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">{std.category}</p>
                      <p className="font-semibold text-white mt-0.5 text-xs">{std.description}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-300">
                      {std.weight}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {(["Cumple", "No Cumple", "No Aplica"] as const).map((st) => (
                          <button
                            key={st}
                            disabled={role !== "SuperAdmin"}
                            onClick={() => onUpdateStandardStatus(std.id, st)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all border ${
                              std.status === st
                                ? st === "Cumple"
                                  ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950/40"
                                  : st === "No Cumple"
                                  ? "bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-950/40"
                                  : "bg-slate-700 text-white border-slate-500"
                                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Evidencia (ej. Carta firmada)"
                            value={editEvidence}
                            onChange={(e) => setEditingEvidence(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Observación del auditor"
                            value={editObservation}
                            onChange={(e) => setEditingObservation(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-[11px] text-slate-300 truncate">
                            <span className="font-semibold text-slate-400">Evidencia:</span>{" "}
                            {std.evidence || "Sin adjuntar"}
                          </p>
                          <p className="text-[11px] text-slate-400 italic truncate">
                            {std.observation || "Sin observaciones"}
                          </p>
                        </div>
                      )}
                    </td>
                    {role === "SuperAdmin" && (
                      <td className="py-3.5 px-4 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(std)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(std)}
                            className="text-xs text-slate-400 hover:text-white font-semibold underline"
                          >
                            Editar
                          </button>
                        )}
                      </td>
                    )}
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
