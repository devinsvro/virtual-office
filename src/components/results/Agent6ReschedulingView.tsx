import React, { useState } from 'react';
import { ReschedulingUrgencyResult, PatientRecord } from '../../types/clinical';
import {
  Clock,
  AlertOctagon,
  Calendar,
  CheckCircle,
  Siren,
  Hospital,
  ArrowRight,
  ClipboardList,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface Agent6ReschedulingViewProps {
  results: ReschedulingUrgencyResult[];
  records: PatientRecord[];
}

export const Agent6ReschedulingView: React.FC<Agent6ReschedulingViewProps> = ({ results, records }) => {
  const [tierFilter, setTierFilter] = useState('All');
  const [activeToolSimulations, setActiveToolSimulations] = useState<Record<string, string>>({});

  const tier1Count = results.filter(r => r.reschedulingTier.includes('Tier 1')).length;
  const tier2Count = results.filter(r => r.reschedulingTier.includes('Tier 2')).length;
  const tier3Count = results.filter(r => r.reschedulingTier.includes('Tier 3')).length;
  const tier4Count = results.filter(r => r.reschedulingTier.includes('Tier 4')).length;

  const handleSimulateToolCall = (recordId: string, actionName: string) => {
    setActiveToolSimulations(prev => ({
      ...prev,
      [recordId]: actionName
    }));
  };

  const filteredResults = results.filter(r => {
    if (tierFilter === 'All') return true;
    return r.reschedulingTier.includes(tierFilter);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
              <span>SUITE 106 · Alex Rivera, EMT-P</span>
              <span className="text-slate-600">·</span>
              <span>HEALTHCARE RESCHEDULING URGENCY AGENT</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Clinical Acuity Rescheduling & Care Venue Dispatch</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Automated 4-tier clinical triage, Emergency Override triggering, same-day slot hold reservations, and prerequisite checklist validation for acute symptoms.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300">
              Tier 1 Emergency: <span className="font-bold">{tier1Count}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300">
              Tier 2 Urgent: <span className="font-bold">{tier2Count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Rescheduling Tiers Quick Select Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => setTierFilter(tierFilter === 'Tier 1' ? 'All' : 'Tier 1')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            tierFilter === 'Tier 1'
              ? 'bg-rose-950/80 border-rose-500 ring-1 ring-rose-500'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-rose-400 font-mono font-bold text-[11px]">TIER 1 · EMERGENCY</span>
            <Siren className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">{tier1Count}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Immediate Follow-Up (911/ER)</span>
        </div>

        <div
          onClick={() => setTierFilter(tierFilter === 'Tier 2' ? 'All' : 'Tier 2')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            tierFilter === 'Tier 2'
              ? 'bg-amber-950/80 border-amber-500 ring-1 ring-amber-500'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-mono font-bold text-[11px]">TIER 2 · URGENT</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">{tier2Count}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Same Day (Within 5-10 Hours)</span>
        </div>

        <div
          onClick={() => setTierFilter(tierFilter === 'Tier 3' ? 'All' : 'Tier 3')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            tierFilter === 'Tier 3'
              ? 'bg-sky-950/80 border-sky-500 ring-1 ring-sky-500'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sky-400 font-mono font-bold text-[11px]">TIER 3 · SEMI-URGENT</span>
            <Calendar className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">{tier3Count}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Within 2 to 4 Days</span>
        </div>

        <div
          onClick={() => setTierFilter(tierFilter === 'Tier 4' ? 'All' : 'Tier 4')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            tierFilter === 'Tier 4'
              ? 'bg-slate-800 border-teal-500 ring-1 ring-teal-500'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-teal-400 font-mono font-bold text-[11px]">TIER 4 · STANDARD</span>
            <CheckCircle className="w-4 h-4 text-teal-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">{tier4Count}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Standard Queue Availability</span>
        </div>
      </div>

      {/* Case-by-Case Triage Cards */}
      <div className="space-y-4">
        {filteredResults.map((item) => {
          const rec = records.find(r => r.id === item.recordId);
          const isTier1 = item.reschedulingTier.includes('Tier 1');
          const isTier2 = item.reschedulingTier.includes('Tier 2');
          const toolState = activeToolSimulations[item.recordId];

          return (
            <div
              key={item.recordId}
              className={`rounded-xl border p-5 space-y-4 transition-colors ${
                isTier1
                  ? 'bg-slate-900/95 border-rose-500/60 ring-1 ring-rose-500/30'
                  : isTier2
                  ? 'bg-slate-900/95 border-amber-500/60'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.recordId}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">·</span>
                  <span className="text-xs text-white font-medium">{rec?.patient_persona}</span>
                  <span className="text-slate-500 font-mono text-xs">·</span>
                  <span className="text-xs text-slate-400">{rec?.service_line}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono px-2.5 py-0.5 rounded border font-semibold ${
                      isTier1 ? 'text-rose-300 bg-rose-950/80 border-rose-500/60 animate-pulse' :
                      isTier2 ? 'text-amber-300 bg-amber-950/80 border-amber-500/60' :
                      'text-sky-300 bg-sky-950/60 border-sky-600/40'
                    }`}
                  >
                    {item.reschedulingTier.split('(')[0]}
                  </span>
                  <span className="text-xs font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Venue: {item.careVenue}
                  </span>
                </div>
              </div>

              {/* Patient Comment */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs italic text-slate-300">
                "{rec?.patient_comments}"
              </div>

              {/* 3-Column Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Clinical Acuity Reason */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Hospital className="w-3.5 h-3.5 text-emerald-400" />
                    Clinical Acuity Assessment
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{item.clinicalAcuityReasoning}</p>
                </div>

                {/* Prerequisite Checklist */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <ClipboardList className="w-3.5 h-3.5 text-teal-400" />
                    Prerequisites Collected
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {item.prerequisites.map((p, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-teal-400 text-xs">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action & Integrated Tool Call State */}
                <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="font-semibold text-emerald-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Integrated Care Action
                    </span>
                    <p className="text-xs font-semibold text-white mt-1">
                      {item.recommendedAction}
                    </p>
                    <p className="text-[11px] font-mono text-teal-300 mt-1">
                      Assigned Slot: {item.bookedSlotTime}
                    </p>
                  </div>

                  {/* Tool Call Action Buttons */}
                  <div className="pt-2 border-t border-emerald-900/40">
                    {isTier1 ? (
                      <button
                        onClick={() => handleSimulateToolCall(item.recordId, 'Triggered Emergency Override')}
                        className={`w-full py-1.5 px-3 rounded-md font-mono text-xs font-bold transition-all cursor-pointer ${
                          toolState
                            ? 'bg-rose-950 border border-rose-500 text-rose-300'
                            : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                        }`}
                      >
                        {toolState || 'Execute Emergency Override Tool'}
                      </button>
                    ) : isTier2 ? (
                      <button
                        onClick={() => handleSimulateToolCall(item.recordId, 'Held Urgent Care Slot #4')}
                        className={`w-full py-1.5 px-3 rounded-md font-mono text-xs font-bold transition-all cursor-pointer ${
                          toolState
                            ? 'bg-amber-950 border border-amber-500 text-amber-300'
                            : 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-md'
                        }`}
                      >
                        {toolState || 'Reserve Urgent Care Triage Hold'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSimulateToolCall(item.recordId, 'Fast-Track Confirmed')}
                        className="w-full py-1.5 px-3 rounded-md font-mono text-xs bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors cursor-pointer"
                      >
                        {toolState || 'Confirm Calendar Schedule'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
