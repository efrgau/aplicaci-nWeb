"use client";

import React, { useState } from "react";
import { Specialist } from "@/types";
import {
  Users,
  MapPin,
  Star,
  MessageSquare,
  Calculator,
  Send,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  Search
} from "lucide-react";

interface EspecialistasCotizadorViewProps {
  specialists: Specialist[];
}

export function EspecialistasCotizadorView({ specialists }: EspecialistasCotizadorViewProps) {
  // Negotiation Sliders state
  const [auditHours, setAuditHours] = useState<number>(8); // 8 hours
  const [planDays, setPlanDays] = useState<number>(10); // 10 days design
  const [trainingModules, setTrainingModules] = useState<number>(3); // 3 modules

  // Selected specialist
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(specialists[0] || null);

  // Chat Modal State
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "specialist", text: "¡Hola! Soy la Dra. Elena Mendoza. ¿En qué servicio de Seguridad y Salud en el Trabajo te puedo asesorar hoy?", time: "09:41" },
  ]);
  const [chatInput, setChatInput] = useState<string>("");

  // Quote Success State
  const [quoteSubmitted, setQuoteSuccess] = useState<boolean>(false);

  // Cost calculation
  const auditCost = auditHours * 56.25; // 450 USD for 8 hrs
  const planCost = planDays * 120;       // 1200 USD for 10 days
  const trainingCost = trainingModules * 216.66; // 650 USD for 3 modules
  const totalSuggestedBudget = Math.round(auditCost + planCost + trainingCost);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user", text: chatInput, time: "09:42" };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Automated Specialist response after 1 second
    setTimeout(() => {
      const replyMsg = {
        sender: "specialist",
        text: `Excelente. He recibido tu solicitud para ${auditHours} hrs de Auditoría y ${trainingModules} módulos de capacitación. Podemos agendar una visita virtual o presencial.`,
        time: "09:43",
      };
      setChatMessages((prev) => [...prev, replyMsg]);
    }, 1000);
  };

  const handleRequestQuote = () => {
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
    }, 4000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Red de Especialistas & Cotizador SST Alianza</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Especialistas Cercanos & Negociación de Servicios SST
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Geolocalización de auditores certificados y estimación presupuestal interactiva
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Licencias SST Verificadas por Mintrabajo</span>
        </div>
      </div>

      {/* Main Grid: Left Map + Specialists, Right Negotiation Card (Matches prompt image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Map & Nearby Specialists (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-teal-400" />
                <span>Especialistas Cercanos</span>
              </h3>
              <span className="text-xs text-slate-400">Radio de 5 km</span>
            </div>

            {/* Simulated Interactive Map */}
            <div className="relative w-full h-72 rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 flex flex-col justify-between p-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_1px]">
              {/* Map grid lines overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

              {/* Top search overlay */}
              <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl p-2 px-3">
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <Search className="w-4 h-4 text-teal-400" />
                  <span className="font-medium">Bogotá, D.C. - Zona Industrial</span>
                </div>
                <span className="text-[10px] font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded">
                  4 Especialistas
                </span>
              </div>

              {/* Pin 1: Dra. Elena M */}
              <button
                onClick={() => setSelectedSpecialist(specialists[0])}
                className="absolute top-16 right-20 z-20 group transition-transform hover:scale-110"
              >
                <div className="bg-slate-900/95 border border-teal-400 px-2.5 py-1 rounded-lg shadow-xl text-left flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
                  <div>
                    <p className="text-[11px] font-extrabold text-white">Dra. Elena M.</p>
                    <div className="flex items-center text-[9px] text-amber-400">
                      ★★★★★ <span className="text-slate-400 ml-1">(4.9)</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Pin 2: Carlos R */}
              <button
                onClick={() => setSelectedSpecialist(specialists[1])}
                className="absolute top-28 left-20 z-20 group transition-transform hover:scale-110"
              >
                <div className="bg-slate-900/95 border border-emerald-400 px-2.5 py-1 rounded-lg shadow-xl text-left flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                  <div>
                    <p className="text-[11px] font-extrabold text-white">Carlos R.</p>
                    <div className="flex items-center text-[9px] text-amber-400">
                      ★★★★☆ <span className="text-slate-400 ml-1">(4.8)</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Pin 3: Seguridad Total */}
              <button
                onClick={() => setSelectedSpecialist(specialists[3])}
                className="absolute bottom-12 right-28 z-20 group transition-transform hover:scale-110"
              >
                <div className="bg-slate-900/95 border border-teal-500 px-2.5 py-1 rounded-lg shadow-xl text-left flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <div>
                    <p className="text-[11px] font-extrabold text-white">Seguridad Total</p>
                    <div className="flex items-center text-[9px] text-amber-400">
                      ★★★★☆ <span className="text-slate-400 ml-1">(4.7)</span>
                    </div>
                  </div>
                </div>
              </button>

              <div className="relative z-10 text-[10px] text-slate-500 text-center font-semibold bg-slate-950/80 rounded py-1 border border-slate-800">
                Haz clic en cualquier pin del mapa para seleccionar especialista
              </div>
            </div>
          </div>

          {/* Specialist list items */}
          <div className="mt-4 space-y-2">
            {specialists.map((spec) => {
              const isSel = selectedSpecialist?.id === spec.id;
              return (
                <div
                  key={spec.id}
                  onClick={() => setSelectedSpecialist(spec)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSel
                      ? "bg-slate-800 border-teal-400 shadow-md shadow-teal-950/30"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={spec.avatar}
                      alt={spec.name}
                      className="w-10 h-10 rounded-full object-cover border border-teal-500/40"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-white flex items-center space-x-2">
                        <span>{spec.name}</span>
                        <span className="text-[10px] text-amber-400 flex items-center">
                          <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                          {spec.rating}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">{spec.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-teal-400">${spec.hourlyRateUSD}/hr</span>
                    <p className="text-[10px] text-slate-400">{spec.distance}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Negociación de Servicios SST (Exact Replica of Prompt Design) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-teal-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center pb-3 border-b border-slate-800">
              <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-[11px] font-extrabold tracking-wider uppercase">
                Negociación de Servicios SST
              </span>
              <h3 className="text-lg font-black text-white mt-2">
                Simulador de Presupuesto
              </h3>
              <p className="text-xs text-slate-400">
                Ajusta las cantidades según los requerimientos de la auditoría
              </p>
            </div>

            {/* Slider 1: Auditoría SST */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-white">Auditoría</span>
                <span className="text-slate-400 font-medium">S/{auditHours} hrs</span>
                <span className="font-black text-teal-400 text-sm">${Math.round(auditCost)} USD</span>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                step="2"
                value={auditHours}
                onChange={(e) => setAuditHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Slider 2: Diseño de Plan SST */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-white">Diseño de Plan</span>
                <span className="text-slate-400 font-medium">{planDays}/15 días</span>
                <span className="font-black text-teal-400 text-sm">${Math.round(planCost)} USD</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={planDays}
                onChange={(e) => setPlanDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Slider 3: Capacitación SST */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-white">Capacitación</span>
                <span className="text-slate-400 font-medium">{trainingModules} módulos</span>
                <span className="font-black text-teal-400 text-sm">${Math.round(trainingCost)} USD</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={trainingModules}
                onChange={(e) => setTrainingModules(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Suggested Budget Display */}
            <div className="bg-slate-950/80 border border-teal-500/30 rounded-2xl p-4 text-center">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Presupuesto Sugerido
              </span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                ${totalSuggestedBudget.toLocaleString()} USD
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Incluye informe técnico firmado, evidencias y certificado de horas SST
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleRequestQuote}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Solicitar Presupuesto</span>
              </button>

              <button
                onClick={() => setChatOpen(true)}
                className="w-full py-2.5 bg-slate-800/90 hover:bg-slate-800 text-teal-300 border border-teal-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>Chat con Especialista ({selectedSpecialist?.name.split(" ")[0] || "Elena"})</span>
              </button>
            </div>

            {/* Success Banner */}
            {quoteSubmitted && (
              <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 p-3 rounded-xl text-xs text-center font-bold animate-in fade-in">
                ✓ Solicitud de presupuesto por ${totalSuggestedBudget} USD enviada con éxito al especialista.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHAT MODAL DRAWER */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedSpecialist?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"}
                  alt="Specialist"
                  className="w-9 h-9 rounded-full object-cover border border-teal-400"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{selectedSpecialist?.name}</h4>
                  <p className="text-[11px] text-teal-400 font-semibold">{selectedSpecialist?.role}</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-900/50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-md ${
                      msg.sender === "user"
                        ? "bg-teal-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] text-slate-400 block text-right mt-1">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex space-x-2">
              <input
                type="text"
                placeholder="Escribe tu mensaje sobre la auditoría..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
              />
              <button
                type="submit"
                className="p-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
