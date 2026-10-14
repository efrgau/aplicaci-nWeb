"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface NewFindingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    auditCode: string;
    findingType: "No Conformidad Mayor" | "No Conformidad Menor" | "Oportunidad de Mejora" | "Conformidad";
    standardCode: string;
    description: string;
    rootCause: string;
    correctiveAction: string;
    responsible: string;
    dueDate: string;
  }) => void;
}

export function NewFindingModal({ isOpen, onClose, onSubmit }: NewFindingModalProps) {
  const [auditCode, setAuditCode] = useState("AUD-2025-01");
  const [findingType, setFindingType] = useState<"No Conformidad Mayor" | "No Conformidad Menor" | "Oportunidad de Mejora" | "Conformidad">("No Conformidad Menor");
  const [standardCode, setStandardCode] = useState("Res 0312 - 2.1.1");
  const [description, setDescription] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [responsible, setResponsible] = useState("Líder de Área");
  const [dueDate, setDueDate] = useState("2025-06-30");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({
      auditCode,
      findingType,
      standardCode,
      description,
      rootCause: rootCause || "Por determinar en reunión de análisis",
      correctiveAction: correctiveAction || "Implementación inmediata de control",
      responsible,
      dueDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-lg text-white">Registrar Hallazgo de Auditoría</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Código Auditoría</label>
              <input
                type="text"
                value={auditCode}
                onChange={(e) => setAuditCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Tipo de Hallazgo</label>
              <select
                value={findingType}
                onChange={(e: any) => setFindingType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="No Conformidad Mayor">No Conformidad Mayor</option>
                <option value="No Conformidad Menor">No Conformidad Menor</option>
                <option value="Oportunidad de Mejora">Oportunidad de Mejora</option>
                <option value="Conformidad">Conformidad</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Estándar Afectado / Referencia</label>
            <input
              type="text"
              value={standardCode}
              onChange={(e) => setStandardCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Descripción del Hallazgo</label>
            <textarea
              required
              rows={2}
              placeholder="Ej. Incumplimiento en la actualización de las fichas de datos de seguridad (SGA)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Análisis Causa Raíz (5 Porqués)</label>
            <input
              type="text"
              placeholder="Ej. Falta de procedimiento estandarizado en la recepción de insumos"
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Plan de Acción Correctiva / Preventiva (CAPA)</label>
            <input
              type="text"
              placeholder="Ej. Capacitar al personal de compras y actualizar la carpeta SGA"
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Responsable</label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Fecha Línea de Cierre</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg"
            >
              Guardar Hallazgo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
