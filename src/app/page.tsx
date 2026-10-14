"use client";

import React, { useState, useEffect } from "react";
import { Company, Standard0312, RiskItemGTC45, AnnualPlanItem, AuditFinding, Specialist, UserRole } from "@/types";
import { Navbar } from "@/components/Navbar";
import { Sidebar, NavTab } from "@/components/Sidebar";
import { DashboardView } from "@/components/DashboardView";
import { EvaluacionRes0312View } from "@/components/EvaluacionRes0312View";
import { MatrizRiesgosView } from "@/components/MatrizRiesgosView";
import { PlanAnualView } from "@/components/PlanAnualView";
import { AuditoriasView } from "@/components/AuditoriasView";
import { EspecialistasCotizadorView } from "@/components/EspecialistasCotizadorView";
import { ReportesView } from "@/components/ReportesView";

import { NewCompanyModal } from "@/components/NewCompanyModal";
import { NewRiskModal } from "@/components/NewRiskModal";
import { NewTaskModal } from "@/components/NewTaskModal";
import { NewFindingModal } from "@/components/NewFindingModal";

export default function Home() {
  // State
  const [role, setRole] = useState<UserRole>("SuperAdmin");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");

  // Domain state
  const [standards, setStandards] = useState<Standard0312[]>([]);
  const [risks, setRisks] = useState<RiskItemGTC45[]>([]);
  const [annualPlan, setAnnualPlan] = useState<AnnualPlanItem[]>([]);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);

  // Modals state
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFindingModalOpen, setIsFindingModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  // 1. Fetch Companies and Specialists on mount
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        // Seed DB if needed
        await fetch("/api/seed");

        const compRes = await fetch("/api/companies");
        const compJson = await compRes.json();
        if (compJson.success && compJson.data.length > 0) {
          setCompanies(compJson.data);
          setActiveCompany(compJson.data[0]);
        }

        const specRes = await fetch("/api/specialists");
        const specJson = await specRes.json();
        if (specJson.success) {
          setSpecialists(specJson.data);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // 2. Fetch company specific data when activeCompany changes
  useEffect(() => {
    const compId = activeCompany?.id;
    if (!compId) return;

    async function loadCompanyData() {
      try {
        const [stdRes, riskRes, planRes, findRes] = await Promise.all([
          fetch(`/api/standards?companyId=${compId}`).then((r) => r.json()),
          fetch(`/api/risks?companyId=${compId}`).then((r) => r.json()),
          fetch(`/api/plan?companyId=${compId}`).then((r) => r.json()),
          fetch(`/api/audits?companyId=${compId}`).then((r) => r.json()),
        ]);

        if (stdRes.success) setStandards(stdRes.data);
        if (riskRes.success) setRisks(riskRes.data);
        if (planRes.success) setAnnualPlan(planRes.data);
        if (findRes.success) setFindings(findRes.data);
      } catch (err) {
        console.error("Error loading company data:", err);
      }
    }

    loadCompanyData();
  }, [activeCompany?.id]);

  // Handlers for Standards
  const handleUpdateStandardStatus = async (
    id: string,
    status: "Cumple" | "No Cumple" | "No Aplica",
    observation?: string,
    evidence?: string
  ) => {
    if (!activeCompany) return;

    const compId = activeCompany.id;

    // Optimistic UI update
    setStandards((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, observation, evidence } : s))
    );

    try {
      const res = await fetch("/api/standards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, companyId: compId, status, observation, evidence }),
      });
      const data = await res.json();
      if (data.success && data.newComplianceScore !== undefined) {
        const updatedScore = data.newComplianceScore;
        setActiveCompany((prev) => (prev ? { ...prev, complianceScore: updatedScore } : null));
        setCompanies((prev) =>
          prev.map((c) => (c.id === compId ? { ...c, complianceScore: updatedScore } : c))
        );
      }
    } catch (err) {
      console.error("Error updating standard:", err);
    }
  };

  // Handlers for Risks
  const handleCreateRisk = async (newRiskData: any) => {
    if (!activeCompany) return;
    try {
      const res = await fetch("/api/risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newRiskData, companyId: activeCompany.id }),
      });
      const json = await res.json();
      if (json.success) {
        setRisks((prev) => [json.data, ...prev]);
      }
    } catch (err) {
      console.error("Error creating risk:", err);
    }
  };

  const handleUpdateRiskStatus = async (id: string, status: "Identificado" | "En Mitigación" | "Controlado") => {
    setRisks((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await fetch("/api/risks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch (err) {
      console.error("Error updating risk status:", err);
    }
  };

  // Handlers for Plan Tasks
  const handleCreateTask = async (taskData: any) => {
    if (!activeCompany) return;
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...taskData, companyId: activeCompany.id }),
      });
      const json = await res.json();
      if (json.success) {
        setAnnualPlan((prev) => [json.data, ...prev]);
      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: "Pendiente" | "En Proceso" | "Completado") => {
    setAnnualPlan((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              completionPercentage: newStatus === "Completado" ? 100 : t.completionPercentage,
            }
          : t
      )
    );

    try {
      await fetch("/api/plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus, completionPercentage: newStatus === "Completado" ? 100 : undefined }),
      });
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleUpdateTaskProgress = async (taskId: string, percentage: number) => {
    const status = percentage === 100 ? "Completado" : percentage > 0 ? "En Proceso" : "Pendiente";
    setAnnualPlan((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completionPercentage: percentage, status } : t))
    );

    try {
      await fetch("/api/plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, completionPercentage: percentage, status }),
      });
    } catch (err) {
      console.error("Error updating task progress:", err);
    }
  };

  // Handlers for Findings
  const handleCreateFinding = async (findingData: any) => {
    if (!activeCompany) return;
    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...findingData, companyId: activeCompany.id }),
      });
      const json = await res.json();
      if (json.success) {
        setFindings((prev) => [json.data, ...prev]);
      }
    } catch (err) {
      console.error("Error creating finding:", err);
    }
  };

  const handleUpdateFindingStatus = async (id: string, status: "Abierto" | "En Gestión" | "Cerrado") => {
    setFindings((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
    try {
      await fetch("/api/audits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch (err) {
      console.error("Error updating finding status:", err);
    }
  };

  // Handlers for New Company Creation
  const handleCreateCompany = async (companyData: any) => {
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
      });
      const json = await res.json();
      if (json.success) {
        setCompanies((prev) => [json.data, ...prev]);
        setActiveCompany(json.data);
      }
    } catch (err) {
      console.error("Error creating company:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        companies={companies}
        activeCompany={activeCompany}
        setActiveCompany={setActiveCompany}
        role={role}
        setRole={setRole}
        onOpenNewCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeCompany={activeCompany}
          role={role}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0B1120]">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400 font-semibold">Cargando Plataforma Alianza Auditores...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardView
                  companies={companies}
                  activeCompany={activeCompany}
                  standards={standards}
                  risks={risks}
                  annualPlan={annualPlan}
                  role={role}
                  setActiveCompany={setActiveCompany}
                  setActiveTab={setActiveTab}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
                />
              )}

              {activeTab === "evaluacion" && (
                <EvaluacionRes0312View
                  activeCompany={activeCompany}
                  standards={standards}
                  role={role}
                  onUpdateStandardStatus={handleUpdateStandardStatus}
                />
              )}

              {activeTab === "matriz" && (
                <MatrizRiesgosView
                  activeCompany={activeCompany}
                  risks={risks}
                  role={role}
                  onOpenNewRiskModal={() => setIsRiskModalOpen(true)}
                  onUpdateRiskStatus={handleUpdateRiskStatus}
                />
              )}

              {activeTab === "plan" && (
                <PlanAnualView
                  activeCompany={activeCompany}
                  annualPlan={annualPlan}
                  role={role}
                  onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onUpdateTaskProgress={handleUpdateTaskProgress}
                />
              )}

              {activeTab === "auditorias" && (
                <AuditoriasView
                  activeCompany={activeCompany}
                  findings={findings}
                  role={role}
                  onOpenNewFindingModal={() => setIsFindingModalOpen(true)}
                  onUpdateFindingStatus={handleUpdateFindingStatus}
                />
              )}

              {activeTab === "especialistas" && (
                <EspecialistasCotizadorView specialists={specialists} />
              )}

              {activeTab === "reportes" && (
                <ReportesView activeCompany={activeCompany} standards={standards} />
              )}
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
      <NewCompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSubmit={handleCreateCompany}
      />

      <NewRiskModal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        onSubmit={handleCreateRisk}
      />

      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      <NewFindingModal
        isOpen={isFindingModalOpen}
        onClose={() => setIsFindingModalOpen(false)}
        onSubmit={handleCreateFinding}
      />
    </div>
  );
}
