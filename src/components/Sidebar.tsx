"use client";

import React from "react";
import { Company, UserRole } from "@/types";
import {
  LayoutDashboard,
  ClipboardCheck,
  AlertTriangle,
  CalendarRange,
  Search,
  Users,
  BarChart3,
  ShieldCheck,
  Building2,
  MapPin,
  CheckCircle2,
  FileText
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "evaluacion"
  | "matriz"
  | "plan"
  | "auditorias"
  | "especialistas"
  | "reportes";

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeCompany: Company | null;
  role: UserRole;
}

export function Sidebar({ activeTab, setActiveTab, activeCompany, role }: SidebarProps) {
  const menuItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "dashboard",
      label: "Dashboard Principal",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "evaluacion",
      label: "Evaluación Inicial (Res. 0312)",
      icon: <ClipboardCheck className="w-5 h-5" />,
      badge: "0312",
    },
    {
      id: "matriz",
      label: "Matriz de Riesgos (GTC 45)",
      icon: <AlertTriangle className="w-5 h-5" />,
      badge: "GTC45",
    },
    {
      id: "plan",
      label: "Plan Anual de Trabajo",
      icon: <CalendarRange className="w-5 h-5" />,
    },
    {
      id: "auditorias",
      label: "Auditorías y Hallazgos",
      icon: <Search className="w-5 h-5" />,
    },
    {
      id: "especialistas",
      label: "Especialistas & Cotizador",
      icon: <Users className="w-5 h-5" />,
      badge: "Nuevo",
    },
    {
      id: "reportes",
      label: "Reportes e Indicadores",
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 text-slate-300 flex-shrink-0">
      <div className="space-y-6">
        {/* Active Tenant Summary Widget */}
        {activeCompany && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/70 rounded-2xl p-4 shadow-inner">
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Cliente Seleccionado</span>
            </div>
            <h3 className="text-sm font-extrabold text-white truncate">{activeCompany.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{activeCompany.city}</span>
              <span>•</span>
              <span>{activeCompany.employeesCount} Empleados</span>
            </p>

            {/* Score pill */}
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Cumplimiento SST:</span>
              <span className="text-sm font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {activeCompany.complianceScore}%
              </span>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Módulos del Sistema
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-md shadow-emerald-950/50"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? "text-white" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        isActive
                          ? "bg-slate-900/40 text-white"
                          : "bg-slate-800 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Role / Context Footer */}
      <div className="pt-4 border-t border-slate-800 mt-6">
        <div className="flex items-center space-x-3 px-2 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            {role === "SuperAdmin" ? "AA" : "CA"}
          </div>
          <div className="truncate text-xs">
            <p className="font-semibold text-white truncate">
              {role === "SuperAdmin" ? "Alianza Auditores" : activeCompany?.name || "Cliente"}
            </p>
            <p className="text-[11px] text-emerald-400 truncate">
              {role === "SuperAdmin" ? "Auditor Principal SST" : "Cliente Admin"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
