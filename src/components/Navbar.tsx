"use client";

import React from "react";
import { Company, UserRole } from "@/types";
import {
  Building2,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Plus,
  Bell,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface NavbarProps {
  companies: Company[];
  activeCompany: Company | null;
  setActiveCompany: (c: Company) => void;
  role: UserRole;
  setRole: (r: UserRole) => void;
  onOpenNewCompanyModal: () => void;
}

export function Navbar({
  companies,
  activeCompany,
  setActiveCompany,
  role,
  setRole,
  onOpenNewCompanyModal,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Brand logo & Mobile menu toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Alianza Auditores
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  SG-SST SaaS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Plataforma Multi-Tenant Res. 0312 / GTC 45
              </p>
            </div>
          </div>
        </div>

        {/* Center: Tenant / Company Switcher */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all text-left shadow-sm group"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-medium">Empresa Activa:</span>
                <span className="text-xs font-semibold px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                  {activeCompany?.riskLevel.split(" ")[0]}
                </span>
              </div>
              <p className="text-sm font-semibold text-white truncate max-w-[180px] md:max-w-[240px]">
                {activeCompany?.name || "Seleccionar Empresa"}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 md:w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Empresas Clientes ({companies.length})
                </span>
                {role === "SuperAdmin" && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenNewCompanyModal();
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva</span>
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {companies.map((comp) => {
                  const isSelected = activeCompany?.id === comp.id;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => {
                        setActiveCompany(comp);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                        isSelected ? "bg-slate-800 border-l-4 border-emerald-500" : ""
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-semibold text-white truncate">{comp.name}</p>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                          <span>NIT: {comp.nit}</span>
                          <span>•</span>
                          <span>{comp.minStandardsGroup}</span>
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            comp.complianceScore >= 80
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : comp.complianceScore >= 60
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          }`}
                        >
                          {comp.complianceScore}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Role Switcher & User Profile */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Role Switcher Pill */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setRole("SuperAdmin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                role === "SuperAdmin"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Auditor / SuperAdmin</span>
              <span className="md:hidden">Auditor</span>
            </button>
            <button
              onClick={() => setRole("ClienteAdmin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                role === "ClienteAdmin"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-900/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cliente Admin</span>
              <span className="md:hidden">Cliente</span>
            </button>
          </div>

          {/* Quick Add Company Button for SuperAdmin */}
          {role === "SuperAdmin" && (
            <button
              onClick={onOpenNewCompanyModal}
              className="hidden lg:flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Empresa</span>
            </button>
          )}

          {/* Notifications button */}
          <button className="relative p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
}
