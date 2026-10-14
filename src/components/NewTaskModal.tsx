"use client";

import React, { useState } from "react";
import { CalendarRange, X } from "lucide-react";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    phase: "Planear" | "Hacer" | "Verificar" | "Actuar";
    activityName: string;
    responsible: string;
    priority: "Alta" | "Media" | "Baja" | "Crítica";
    scheduledMonth: string;
    budgetUSD: number;
  }) => void;
}

export function NewTaskModal({ isOpen, onClose, onSubmit }: NewTaskModalProps) {
  const [phase, setPhase] = useState<"Planear" | "Hacer" | "Verificar" | "Actuar">("Hacer");
  const [activityName, setActivityName] = useState("");
  const [responsible, setResponsible] = useState("Líder SST");
  const [priority, setPriority] = useState<"Alta" | "Media" | "Baja" | "Crítica">("Alta");
  const [scheduledMonth, setScheduledMonth] = useState("Jun");
  const [budgetUSD, setBudgetUSD] = useState(500);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityName.trim()) return;
    onSubmit({
      phase,
      activityName,
      responsible,
      priority,
      scheduledMonth,
      budgetUSD: Number(budgetUSD) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <CalendarRange className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-lg text-white">Agregar Actividad al Plan Anual</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Fase PHVA</label>
              <select
                value={phase}
                onChange={(e: any) => setPhase(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Planear">Planear</option>
                <option value="Hacer">Hacer</option>
                <option value="Verificar">Verificar</option>
                <option value="Actuar">Actuar</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Prioridad</label>
              <select
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Crítica">Crítica</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Nombre de la Actividad</label>
            <input
              type="text"
              required
              placeholder="Ej. Taller de ergonomía y pausas activas"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Responsable Ejecución</label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Mes Programado</label>
              <select
                value={scheduledMonth}
                onChange={(e) => setScheduledMonth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Presupuesto Estimado ($ USD)</label>
            <input
              type="number"
              value={budgetUSD}
              onChange={(e) => setBudgetUSD(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
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
              Agregar al Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
