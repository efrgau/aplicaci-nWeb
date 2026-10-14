"use client";

import React, { useState } from "react";
import { Building2, X } from "lucide-react";

interface NewCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    nit: string;
    riskLevel: string;
    employeesCount: number;
    minStandardsGroup: string;
    city: string;
    arl: string;
    auditorName: string;
  }) => void;
}

export function NewCompanyModal({ isOpen, onClose, onSubmit }: NewCompanyModalProps) {
  const [name, setName] = useState("");
  const [nit, setNit] = useState("");
  const [riskLevel, setRiskLevel] = useState("Riesgo III (Medio)");
  const [employeesCount, setEmployeesCount] = useState(25);
  const [minStandardsGroup, setMinStandardsGroup] = useState("21 Estándares (11 a 50 Trab.)");
  const [city, setCity] = useState("Bogotá D.C.");
  const [arl, setArl] = useState("Sura");
  const [auditorName, setAuditorName] = useState("Ing. Carlos Rodríguez (Lic. SST 4589)");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      nit: nit || "900.000.000-0",
      riskLevel,
      employeesCount: Number(employeesCount) || 10,
      minStandardsGroup,
      city,
      arl,
      auditorName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-lg text-white">Registrar Empresa Cliente</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Razón Social / Nombre Comercial</label>
            <input
              type="text"
              required
              placeholder="Ej. Constructora Andina S.A.S."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">NIT</label>
              <input
                type="text"
                placeholder="Ej. 901.888.777-3"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Ciudad Principal</label>
              <input
                type="text"
                placeholder="Ej. Medellín"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Clase de Riesgo ARL</label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Riesgo I (Mínimo)">Riesgo I (Mínimo)</option>
                <option value="Riesgo II (Bajo)">Riesgo II (Bajo)</option>
                <option value="Riesgo III (Medio)">Riesgo III (Medio)</option>
                <option value="Riesgo IV (Alto)">Riesgo IV (Alto)</option>
                <option value="Riesgo V (Máximo)">Riesgo V (Máximo)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Número de Trabajadores</label>
              <input
                type="number"
                value={employeesCount}
                onChange={(e) => setEmployeesCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Grupo de Estándares (Res 0312)</label>
              <select
                value={minStandardsGroup}
                onChange={(e) => setMinStandardsGroup(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="7 Estándares (<=10 Trab. R. I-III)">7 Estándares (10 o menos trab)</option>
                <option value="21 Estándares (11 a 50 Trab.)">21 Estándares (11 a 50 trab)</option>
                <option value="60 Estándares (>50 Trab. o Riesgo IV/V)">60 Estándares (&gt;50 o Riesgo IV/V)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">ARL Asignada</label>
              <input
                type="text"
                value={arl}
                onChange={(e) => setArl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Auditor Asignado (Alianza Auditores)</label>
            <input
              type="text"
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg"
            >
              Crear Empresa Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
