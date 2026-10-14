"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface NewRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    process: string;
    zone: string;
    activity: string;
    hazardCategory: string;
    hazardDetail: string;
    existingControls: string;
    deficiencyLevel: number;
    exposureLevel: number;
    consequenceLevel: number;
    proposedControls: string;
  }) => void;
}

export function NewRiskModal({ isOpen, onClose, onSubmit }: NewRiskModalProps) {
  const [process, setProcess] = useState("Operaciones");
  const [zone, setZone] = useState("Bodega / Planta");
  const [activity, setActivity] = useState("Cargue y descargue");
  const [hazardCategory, setHazardCategory] = useState("Biomecánico");
  const [hazardDetail, setHazardDetail] = useState("");
  const [existingControls, setExistingControls] = useState("Capacitación y uso de EPP");
  const [deficiencyLevel, setDeficiencyLevel] = useState(6);
  const [exposureLevel, setExposureLevel] = useState(3);
  const [consequenceLevel, setConsequenceLevel] = useState(25);
  const [proposedControls, setProposedControls] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hazardDetail.trim()) return;
    onSubmit({
      process,
      zone,
      activity,
      hazardCategory,
      hazardDetail,
      existingControls,
      deficiencyLevel: Number(deficiencyLevel),
      exposureLevel: Number(exposureLevel),
      consequenceLevel: Number(consequenceLevel),
      proposedControls: proposedControls || "Acondicionamiento ergonómico y controles de ingeniería",
    });
    onClose();
  };

  const calculatedNP = Number(deficiencyLevel) * Number(exposureLevel);
  const calculatedNR = calculatedNP * Number(consequenceLevel);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-lg text-white">Identificar Peligro GTC 45</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Proceso</label>
              <input
                type="text"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Zona / Lugar</label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Clasificación de Peligro</label>
              <select
                value={hazardCategory}
                onChange={(e) => setHazardCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Biomecánico">Biomecánico</option>
                <option value="Condiciones de Seguridad">Condiciones de Seguridad</option>
                <option value="Químico">Químico</option>
                <option value="Psicosocial">Psicosocial</option>
                <option value="Físico">Físico</option>
                <option value="Biológico">Biológico</option>
                <option value="Fenómenos Naturales">Fenómenos Naturales</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Actividad Específica</label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Descripción del Peligro Identificado</label>
            <textarea
              required
              rows={2}
              placeholder="Ej. Exposición a trabajo en alturas > 1.5m en andamios no certificados"
              value={hazardDetail}
              onChange={(e) => setHazardDetail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          {/* Calculadora GTC 45 */}
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-3">
            <span className="font-extrabold text-amber-400 block uppercase tracking-wider text-[10px]">
              Calculadora de Riesgo (ND × NE = NP | NP × NC = NR)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400">Nivel Deficiencia (ND)</label>
                <select
                  value={deficiencyLevel}
                  onChange={(e) => setDeficiencyLevel(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                >
                  <option value={10}>Muy Alto (10)</option>
                  <option value={6}>Alto (6)</option>
                  <option value={2}>Bajo (2)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400">Nivel Exposición (NE)</label>
                <select
                  value={exposureLevel}
                  onChange={(e) => setExposureLevel(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                >
                  <option value={4}>Continua (4)</option>
                  <option value={3}>Frecuente (3)</option>
                  <option value={2}>Ocasional (2)</option>
                  <option value={1}>Esporádica (1)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400">Consecuencia (NC)</label>
                <select
                  value={consequenceLevel}
                  onChange={(e) => setConsequenceLevel(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                >
                  <option value={100}>Mortal / Catastrófico (100)</option>
                  <option value={60}>Muy Grave (60)</option>
                  <option value={25}>Grave (25)</option>
                  <option value={10}>Leve (10)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400">Puntaje Probabilidad (NP): <strong className="text-white">{calculatedNP}</strong></span>
              <span className="text-slate-400">Nivel Riesgo Score (NR): <strong className="text-amber-400 text-sm font-black">{calculatedNR}</strong></span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Medidas de Intervención / Controles Propuestos</label>
            <input
              type="text"
              placeholder="Ej. Línea de vida certificada + permiso de trabajo digital"
              value={proposedControls}
              onChange={(e) => setProposedControls(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
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
              Guardar Peligro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
