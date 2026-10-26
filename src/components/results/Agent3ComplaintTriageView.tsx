import React, { useState } from 'react';
import { ComplaintTriageResult, PatientRecord } from '../../types/clinical';
import {
  AlertOctagon,
  ShieldAlert,
  Send,
  CheckCircle,
  FileText,
  UserCheck,
  ChevronRight,
  Clock
} from 'lucide-react';

interface Agent3ComplaintTriageViewProps {
  results: ComplaintTriageResult[];
  records: PatientRecord[];
}

export const Agent3ComplaintTriageView: React.FC<Agent3ComplaintTriageViewProps> = ({ results, records }) => {
  const [severityFilter, setSeverityFilter] = useState('All');
  const [routeFilter, setRouteFilter] = useState('All');

  const level4Count = results.filter(r => r.severityLevel.includes('LEVEL 4')).length;
  const level3Count = results.filter(r => r.severityLevel.includes('LEVEL 3')).length;
  const level2Count = results.filter(r => r.severityLevel.includes('LEVEL 2')).length;
  const level1Count = results.filter(r => r.severityLevel.includes('LEVEL 1')).length;

  const routes = Array.from(new Set(results.map(r => r.escalationRoute)));

  const filteredResults = results.filter(r => {
    const matchesSev = severityFilter === 'All' || r.severityLevel.includes(severityFilter);
    const matchesRoute = routeFilter === 'All' || r.escalationRoute === routeFilter;
    return matchesSev && matchesRoute;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-semibold uppercase">
              <span>SUITE 103 · Commander Sarah Lin, RN</span>
              <span className="text-slate-600">·</span>
              <span>HEALTHCARE COMPLAINT TRIAGE ASSISTANT</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Clinical Severity Grading & Regulatory Routing Board</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Rapid clinical risk evaluation, 4-tier severity triage, and automated routing to 10 hospital leadership desks with human oversight checkpoints.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300">
              Level 4 Critical: <span className="font-bold">{level4Count}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300">
              Level 3 High: <span className="font-bold">{level3Count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Tier Severity Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => setSeverityFilter(severityFilter === 'LEVEL 4' ? 'All' : 'LEVEL 4')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            severityFilter === 'LEVEL 4'
              ? 'bg-rose-950/80 border-rose-500 ring-1 ring-rose-500'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-slate-400 font-mono text-[11px] block">LEVEL 4 – Critical</span>
          <span className="text-xl font-bold font-mono text-rose-400 mt-0.5 block">{level4Count}</span>
          <span className="text-[11px] text-slate-500">Immediate safety / legal risk</span>
        </div>

        <div
          onClick={() => setSeverityFilter(severityFilter === 'LEVEL 3' ? 'All' : 'LEVEL 3')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            severityFilter === 'LEVEL 3'
              ? 'bg-amber-950/80 border-amber-500 ring-1 ring-amber-500'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-slate-400 font-mono text-[11px] block">LEVEL 3 – High</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-0.5 block">{level3Count}</span>
          <span className="text-[11px] text-slate-500">Potential patient harm / medication</span>
        </div>

        <div
          onClick={() => setSeverityFilter(severityFilter === 'LEVEL 2' ? 'All' : 'LEVEL 2')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            severityFilter === 'LEVEL 2'
              ? 'bg-sky-950/80 border-sky-500 ring-1 ring-sky-500'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-slate-400 font-mono text-[11px] block">LEVEL 2 – Moderate</span>
          <span className="text-xl font-bold font-mono text-sky-400 mt-0.5 block">{level2Count}</span>
          <span className="text-[11px] text-slate-500">Repeated service breakdown</span>
        </div>

        <div
          onClick={() => setSeverityFilter(severityFilter === 'LEVEL 1' ? 'All' : 'LEVEL 1')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            severityFilter === 'LEVEL 1'
              ? 'bg-slate-800 border-teal-500 ring-1 ring-teal-500'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-slate-400 font-mono text-[11px] block">LEVEL 1 – Low</span>
          <span className="text-xl font-bold font-mono text-teal-400 mt-0.5 block">{level1Count}</span>
          <span className="text-[11px] text-slate-500">Minor inconvenience / suggestions</span>
        </div>
      </div>

      {/* Filter and Routing Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Filter by Leadership Destination:</span>
          <select
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs font-mono"
          >
            <option value="All">All 10 Destinations</option>
            {routes.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {severityFilter !== 'All' && (
          <button
            onClick={() => setSeverityFilter('All')}
            className="text-slate-400 hover:text-white underline cursor-pointer"
          >
            Reset Severity Filter
          </button>
        )}
      </div>

      {/* Triage Cards Feed */}
      <div className="space-y-4">
        {filteredResults.map((item) => {
          const rec = records.find(r => r.id === item.recordId);
          const isCritical = item.severityLevel.includes('LEVEL 4');
          const isHigh = item.severityLevel.includes('LEVEL 3');

          return (
            <div
              key={item.recordId}
              className={`rounded-xl border p-5 space-y-4 transition-colors ${
                isCritical
                  ? 'bg-slate-900/95 border-rose-500/60 ring-1 ring-rose-500/20'
                  : isHigh
                  ? 'bg-slate-900/90 border-amber-500/50'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-rose-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
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
                      isCritical ? 'text-rose-300 bg-rose-950/80 border-rose-500/60' :
                      isHigh ? 'text-amber-300 bg-amber-950/70 border-amber-500/50' :
                      'text-sky-300 bg-sky-950/50 border-sky-600/40'
                    }`}
                  >
                    {item.severityLevel}
                  </span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.triageUrgency}
                  </span>
                </div>
              </div>

              {/* Patient Text */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs italic text-slate-300">
                "{rec?.patient_comments}"
              </div>

              {/* 3-Column Triage Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Severity Reasoning */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    Severity Justification
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{item.severityReasoning}</p>
                </div>

                {/* Risk Detection */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    Risk Vectors Flagged
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.riskDetection.flaggedRisks.map(r => (
                      <span key={r} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-200 border border-amber-500/40">
                        {r}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{item.riskDetection.explanation}</p>
                </div>

                {/* Escalation Route */}
                <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-900/40 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="font-semibold text-rose-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <Send className="w-3.5 h-3.5 text-rose-400" />
                      Assigned Escalation Route
                    </span>
                    <p className="text-sm font-bold text-white mt-1 font-mono">
                      {item.escalationRoute}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-rose-900/40 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">Human Sign-off:</span>
                    <span className={`font-semibold ${item.requiresHumanIntervention ? 'text-amber-400' : 'text-slate-500'}`}>
                      {item.requiresHumanIntervention ? 'Required Prior to Action' : 'Manager Discretion'}
                    </span>
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
