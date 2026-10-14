"use client";

import React, { useState } from "react";
import { Company, Standard0312, UserRole } from "@/types";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  Activity,
  Award,
  CheckCircle2,
  Calendar
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";

interface ReportesViewProps {
  activeCompany: Company | null;
  standards: Standard0312[];
}

export function ReportesView({ activeCompany, standards }: ReportesViewProps) {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Sample Recharts dataset for monthly accidentalidad and training coverage
  const indicatorData = [
    { mes: "Ene", IF: 1.2, IS: 4.5, coberturaCapacitacion: 92 },
    { mes: "Feb", IF: 0.8, IS: 2.1, coberturaCapacitacion: 88 },
    { mes: "Mar", IF: 0.0, IS: 0.0, coberturaCapacitacion: 95 },
    { mes: "Abr", IF: 0.5, IS: 1.8, coberturaCapacitacion: 90 },
    { mes: "May", IF: 0.0, IS: 0.0, coberturaCapacitacion: 98 },
    { mes: "Jun", IF: 0.3, IS: 0.9, coberturaCapacitacion: 94 },
  ];

  const handleExportPDF = () => {
    setDownloadSuccess("Generando Reporte Ejecutivo PDF (Res. 0312)...");
    setTimeout(() => {
      window.print();
      setDownloadSuccess(null);
    }, 1000);
  };

  const handleExportExcel = () => {
    setDownloadSuccess("Descargando Matriz Completa en formato Excel (.xlsx)...");
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Indicadores de Gestión Decreto 1072 / Res. 0312</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Reportes e Indicadores SG-SST
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Tablero de control de accidentalidad, ausentismo y cobertura para <span className="text-white font-semibold">{activeCompany?.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center space-x-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Exportar Informe PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Descargar Excel</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 p-3 rounded-xl text-xs font-bold text-center animate-in fade-in">
          ✓ {downloadSuccess}
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            Índice de Frecuencia (IF)
          </span>
          <p className="text-2xl font-black text-emerald-400 mt-1">0.46</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Accidentes por 240.000 HHT</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            Índice de Severidad (IS)
          </span>
          <p className="text-2xl font-black text-emerald-400 mt-1">1.53</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Días perdidos por 240.000 HHT</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            Cobertura Capacitación
          </span>
          <p className="text-2xl font-black text-emerald-400 mt-1">92.8%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Meta anual: &gt; 85.0%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">
            Tasa de Ausentismo
          </span>
          <p className="text-2xl font-black text-amber-400 mt-1">1.2%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Incapacidades médicas / mes</p>
        </div>
      </div>

      {/* RECHARTS GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph 1: Accidentalidad (IF & IS) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="mb-4">
            <h3 className="font-extrabold text-base text-white">Comportamiento de Accidentalidad (IF / IS)</h3>
            <p className="text-xs text-slate-400">Tendencia mensual de Índices de Frecuencia y Severidad</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={indicatorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mes" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#FFF",
                  }}
                />
                <Legend />
                <Bar dataKey="IF" name="Frecuencia (IF)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="IS" name="Severidad (IS)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Cobertura de Capacitaciones */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="mb-4">
            <h3 className="font-extrabold text-base text-white">Cobertura Plan de Capacitaciones (%)</h3>
            <p className="text-xs text-slate-400">Asistencia efectiva de trabajadores a talleres SST</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={indicatorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mes" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#FFF",
                  }}
                  formatter={(val: any) => [`${val}%`, "Cobertura"]}
                />
                <Line
                  type="monotone"
                  dataKey="coberturaCapacitacion"
                  name="Cobertura (%)"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
