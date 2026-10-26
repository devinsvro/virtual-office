import React, { useState } from 'react';
import { ExperienceMonitoringResult, PatientRecord } from '../../types/clinical';
import {
  Scale,
  ShieldAlert,
  Search,
  Filter,
  Users,
  Compass,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Agent2ExperienceViewProps {
  results: ExperienceMonitoringResult[];
  records: PatientRecord[];
}

export const Agent2ExperienceView: React.FC<Agent2ExperienceViewProps> = ({ results, records }) => {
  const [riskFilter, setRiskFilter] = useState('All');
  const [equityOnly, setEquityOnly] = useState(false);

  const total = results.length;
  const highRiskCount = results.filter(r => r.riskAssessment.overall === 'High').length;
  const equityFlaggedCount = results.filter(r => r.equityAndAccessibility.flags.length > 0).length;

  const filteredResults = results.filter(r => {
    const matchesRisk = riskFilter === 'All' || r.riskAssessment.overall === riskFilter;
    const matchesEquity = !equityOnly || r.equityAndAccessibility.flags.length > 0;
    return matchesRisk && matchesEquity;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-semibold uppercase">
              <span>SUITE 102 · Dr. Julian Cole</span>
              <span className="text-slate-600">·</span>
              <span>PATIENT EXPERIENCE MONITORING AGENT</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Healthcare Equity, Accessibility & Risk Observatory</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Cross-cutting review of operational bottlenecks and vulnerable patient cohorts: older adults, rural patients, limited English proficiency, disabilities, and digital literacy.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
              Equity Flags: <span className="font-bold">{equityFlaggedCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300">
              High Risk: <span className="font-bold">{highRiskCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Pillar Risk Breakdown & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-slate-400 block text-[11px] font-mono">Patient Safety Risks</span>
          <span className="text-lg font-bold font-mono text-rose-400">
            {results.filter(r => r.riskAssessment.categories.patientSafety === 'High').length} High
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Clinical symptom latency</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-slate-400 block text-[11px] font-mono">Regulatory & Compliance</span>
          <span className="text-lg font-bold font-mono text-amber-400">
            {results.filter(r => r.riskAssessment.categories.compliance === 'High').length} High
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">ADA & Title VI breaches</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-slate-400 block text-[11px] font-mono">Health Equity Disparities</span>
          <span className="text-lg font-bold font-mono text-indigo-400">
            {results.filter(r => r.riskAssessment.categories.equity === 'High').length} High
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Marginalized patient barriers</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-slate-400 block text-[11px] font-mono">Reputational Exposure</span>
          <span className="text-lg font-bold font-mono text-teal-400">
            {results.filter(r => r.riskAssessment.categories.reputational === 'High').length} High
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Severe billing grievances</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium">Filter by Overall Risk:</span>
          {['All', 'High', 'Moderate', 'Low'].map(level => (
            <button
              key={level}
              onClick={() => setRiskFilter(level)}
              className={`px-3 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                riskFilter === level
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
          <input
            type="checkbox"
            checked={equityOnly}
            onChange={(e) => setEquityOnly(e.target.checked)}
            className="w-4 h-4 rounded-sm border-slate-700 bg-slate-900 text-indigo-500 focus:ring-0"
          />
          <span>Show Equity / Vulnerability Flagged Only ({equityFlaggedCount})</span>
        </label>
      </div>

      {/* Results Feed */}
      <div className="space-y-4">
        {filteredResults.map((item) => {
          const rec = records.find(r => r.id === item.recordId);
          const hasFlags = item.equityAndAccessibility.flags.length > 0;

          return (
            <div
              key={item.recordId}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.recordId}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">·</span>
                  <span className="text-xs text-white font-medium">{rec?.patient_persona}</span>
                  <span className="text-slate-500 font-mono text-xs">·</span>
                  <span className="text-xs text-slate-400">{rec?.service_line}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-0.5 rounded">
                    Primary: {item.primaryTheme}
                  </span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded border ${
                      item.riskAssessment.overall === 'High' ? 'text-rose-400 bg-rose-950/60 border-rose-500/40' :
                      item.riskAssessment.overall === 'Moderate' ? 'text-amber-400 bg-amber-950/60 border-amber-500/40' :
                      'text-slate-400 bg-slate-800 border-slate-700'
                    }`}
                  >
                    Risk: {item.riskAssessment.overall}
                  </span>
                </div>
              </div>

              {/* Patient Comment */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-xs italic text-slate-300">
                "{rec?.patient_comments}"
              </div>

              {/* Equity & Bottlenecks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Equity Review */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-2">
                  <span className="font-semibold text-indigo-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    Equity & Accessibility
                  </span>
                  {hasFlags ? (
                    <div className="flex flex-wrap gap-1">
                      {item.equityAndAccessibility.flags.map(f => (
                        <span key={f} className="text-[10px] font-mono bg-indigo-950/80 text-indigo-200 border border-indigo-500/40 px-2 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">No vulnerability markers</span>
                  )}
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {item.equityAndAccessibility.details}
                  </p>
                </div>

                {/* Operational Bottleneck */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-teal-400" />
                    Identified Bottleneck
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{item.operationalBottleneck}</p>
                </div>

                {/* Managerial Recommendation */}
                <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-900/40 space-y-1">
                  <span className="font-semibold text-indigo-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                    Leader Recommendation
                  </span>
                  <p className="text-indigo-200/90 leading-relaxed text-[11px]">{item.managerialRecommendation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
