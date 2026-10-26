import React, { useState } from 'react';
import { ManagerDecisionResult, PatientRecord } from '../../types/clinical';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  UserCheck,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  MessageSquareQuote
} from 'lucide-react';

interface Agent4HospitalManagerViewProps {
  results: ManagerDecisionResult[];
  records: PatientRecord[];
}

export const Agent4HospitalManagerView: React.FC<Agent4HospitalManagerViewProps> = ({ results, records }) => {
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [humanReviewOnly, setHumanReviewOnly] = useState(false);
  const [localStatuses, setLocalStatuses] = useState<Record<string, { status: string; notes: string }>>({});

  const highCount = results.filter(r => r.managementPriority === 'High').length;
  const mediumCount = results.filter(r => r.managementPriority === 'Medium').length;
  const lowCount = results.filter(r => r.managementPriority === 'Low').length;
  const humanReviewCount = results.filter(r => r.humanReviewNeeded).length;

  const handleActionStatus = (recordId: string, status: string) => {
    setLocalStatuses(prev => ({
      ...prev,
      [recordId]: { ...prev[recordId], status }
    }));
  };

  const handleSaveNote = (recordId: string, notes: string) => {
    setLocalStatuses(prev => ({
      ...prev,
      [recordId]: { ...prev[recordId], notes }
    }));
  };

  const filteredResults = results.filter(r => {
    const matchesPriority = priorityFilter === 'All' || r.managementPriority === priorityFilter;
    const matchesHuman = !humanReviewOnly || r.humanReviewNeeded;
    return matchesPriority && matchesHuman;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase">
              <span>SUITE 104 · Director Marcus Reed, MHA</span>
              <span className="text-slate-600">·</span>
              <span>HOSPITAL MANAGER DECISION SUPPORT AGENT</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Hospital Executive Operations & Management Prioritization</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Synthesizing clinical operational bottlenecks, readmission risks, and AI risk flags (Hallucination & Bias) into actionable managerial interventions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300">
              High Priority: <span className="font-bold">{highCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300">
              Human Review Needed: <span className="font-bold">{humanReviewCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP MANDATORY DASHBOARD ALERT (as explicitly requested by prompt) */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/70 border-l-4 border-l-rose-500 border border-slate-800 rounded-xl p-5 shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                CRITICAL MANAGEMENT ALERT #1
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                · Immediate Executive Huddle Required
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">
              Patient Portal Generative AI Hallucination & Post-CABG Infection Callback Deficits
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Automated discharge summaries have communicated non-existent pharmaceuticals (Neuro-Calmex) and conflicting hypoglycemic insulin advice to outpatients. Concurrently, post-CABG and oncology patients with red-flag symptoms (sternal drainage, 101.8°F fever) experienced 4+ hour nursing callback delays.
            </p>
          </div>
        </div>
      </div>

      {/* Priority Filters */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium">Filter Management Priority:</span>
          {['All', 'High', 'Medium', 'Low'].map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                priorityFilter === p
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
          <input
            type="checkbox"
            checked={humanReviewOnly}
            onChange={(e) => setHumanReviewOnly(e.target.checked)}
            className="w-4 h-4 rounded-sm border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
          />
          <span>Show Mandatory Human Review Only ({humanReviewCount})</span>
        </label>
      </div>

      {/* Case Management Feed */}
      <div className="space-y-4">
        {filteredResults.map((item) => {
          const rec = records.find(r => r.id === item.recordId);
          const localState = localStatuses[item.recordId] || { status: 'Pending Review', notes: '' };

          return (
            <div
              key={item.recordId}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.recordId}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">·</span>
                  <span className="text-xs text-white font-medium">{rec?.patient_persona}</span>
                  <span className="text-slate-500 font-mono text-xs">·</span>
                  <span className="text-xs text-slate-400">{rec?.service_line}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded border font-semibold ${
                      item.managementPriority === 'High' ? 'text-rose-400 bg-rose-950/60 border-rose-500/40' :
                      item.managementPriority === 'Medium' ? 'text-amber-400 bg-amber-950/60 border-amber-500/40' :
                      'text-teal-400 bg-teal-950/60 border-teal-500/40'
                    }`}
                  >
                    Priority: {item.managementPriority}
                  </span>

                  {rec?.ai_risk_flags && rec.ai_risk_flags !== 'None' && (
                    <span className="text-xs font-mono text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded">
                      Flag: {rec.ai_risk_flags}
                    </span>
                  )}
                </div>
              </div>

              {/* Patient Encounter Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block">Satisfaction</span>
                  <span className="text-slate-200 font-semibold">{rec?.patient_satisfaction}/5</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Communication</span>
                  <span className="text-slate-200 font-semibold">{rec?.communication_rating}/5</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Readmission Risk</span>
                  <span className={rec?.readmission_risk === 'High' ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                    {rec?.readmission_risk}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Portal Usage</span>
                  <span className="text-slate-200">{rec?.patient_portal_usage}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Follow-up Adherence</span>
                  <span className="text-slate-200">{rec?.follow_up_compliance}</span>
                </div>
              </div>

              {/* Patient Comment */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs italic text-slate-300">
                "{rec?.patient_comments}"
              </div>

              {/* Main Problem & Priority Reasoning */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-cyan-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    Root Operational Problem
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{item.mainProblem}</p>
                </div>

                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Priority Rationale
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{item.priorityReasoning}</p>
                </div>
              </div>

              {/* Recommended 1-2 Management Actions */}
              <div className="bg-cyan-950/20 p-3 rounded-lg border border-cyan-900/40 space-y-1.5 text-xs">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                  Recommended Management Interventions
                </span>
                <ul className="list-disc pl-4 space-y-1 text-cyan-100/90 text-[11px]">
                  {item.recommendedActions.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>

              {/* Human Review Checkpoint Controls */}
              {item.humanReviewNeeded && (
                <div className="bg-slate-950 p-3 rounded-lg border border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-amber-400" />
                      Human Clinical Oversight Checkpoint
                    </span>
                    <p className="text-slate-400 text-[11px]">{item.humanReviewReason}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleActionStatus(item.recordId, 'Approved')}
                      className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                        localState.status === 'Approved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {localState.status === 'Approved' ? 'Sign-Off Approved' : 'Approve Action'}
                    </button>

                    <button
                      onClick={() => handleActionStatus(item.recordId, 'Overridden')}
                      className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                        localState.status === 'Overridden'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Override
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BOTTOM RECOMMENDED MANAGEMENT ACTIONS (as explicitly requested by prompt) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Executive Summary: 3 Recommended Management Actions Based on Cohort Data
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-cyan-400 font-bold block">ACTION 1 · CLINICAL SAFETY</span>
            <h4 className="text-white font-semibold text-sm">Deploy Rapid Callback Nurse Desk</h4>
            <p className="text-slate-400 leading-relaxed">
              Mandate return call within 30 minutes for all post-CABG, cardiology stent, and oncology outpatient portal inquiries presenting with acute symptom triggers.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-cyan-400 font-bold block">ACTION 2 · AI GOVERNANCE</span>
            <h4 className="text-white font-semibold text-sm">Halt Unreviewed AI Discharge Notes</h4>
            <p className="text-slate-400 leading-relaxed">
              Enforce a strict clinician verification sign-off rule on all patient-facing automated medical summaries to stop hallucinated dosages from reaching pharmacies.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-cyan-400 font-bold block">ACTION 3 · HEALTH EQUITY</span>
            <h4 className="text-white font-semibold text-sm">Mandatory Dual-Language Discharge Orders</h4>
            <p className="text-slate-400 leading-relaxed">
              Implement hard-stop EHR logic requiring certified medical interpreter sign-off before discharging patients with limited English proficiency or ADA hearing needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
