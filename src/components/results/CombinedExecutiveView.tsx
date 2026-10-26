import React, { useState } from 'react';
import {
  CombinedExecutiveInsights,
  MultiAgentAnalysisRun,
  PatientRecord
} from '../../types/clinical';
import { exportAnalysisReportJSON } from '../../utils/csvHelper';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Brain,
  Download,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CombinedExecutiveViewProps {
  analysisRun: MultiAgentAnalysisRun;
  records: PatientRecord[];
}

export const CombinedExecutiveView: React.FC<CombinedExecutiveViewProps> = ({
  analysisRun,
  records
}) => {
  const { combinedInsights } = analysisRun;
  const [reviewStatuses, setReviewStatuses] = useState<Record<string, { status: string; notes: string }>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>('consensus');

  const handleReviewAction = (recordId: string, status: string) => {
    setReviewStatuses(prev => ({
      ...prev,
      [recordId]: { ...prev[recordId], status }
    }));
  };

  const handleNotesChange = (recordId: string, notes: string) => {
    setReviewStatuses(prev => ({
      ...prev,
      [recordId]: { ...prev[recordId], notes }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Executive Command Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
              <span>CROSS-AGENT SYNTHESIS CENTER</span>
              <span className="text-slate-600">·</span>
              <span>RUN ID: {analysisRun.runId}</span>
              <span className="text-slate-600">·</span>
              <span>COMPLETED: {analysisRun.timestamp}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1 tracking-tight">
              Integrated Clinical Leadership Intelligence & Governance Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Consolidated intelligence aligning outputs across all active AI agents. Identifies cross-agent consensus, highlights conflicting interpretations, and enforces mandatory human clinical sign-off protocols.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => exportAnalysisReportJSON(analysisRun, `ClinicaAI_Executive_Report_${analysisRun.runId}.json`)}
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Full JSON Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* MANDATORY RESPONSIBLE USE NOTICE (per prompt instructions) */}
      <div className="bg-slate-950/90 border border-teal-500/40 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-white text-xs">
            Notice Regarding Responsible AI in Healthcare Decision Support
          </h4>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            ClinicaAI agents support healthcare analysis, operational quality improvement, and clinical workflow coordination. AI agents do not independently make clinical diagnoses, medical treatment decisions, employment decisions, or final regulatory compliance determinations. High-risk findings require human clinical and managerial review before operational execution.
          </p>
        </div>
      </div>

      {/* 1. CROSS-AGENT CONSENSUS FINDINGS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              1. Cross-Agent Consensus Findings (Supported by Multiple Agents)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded">
            {combinedInsights.consensusFindings.length} High-Confidence Themes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {combinedInsights.consensusFindings.map((finding, idx) => (
            <div
              key={idx}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider font-semibold">
                    Consensus Cluster {idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    {finding.confidence} Confidence
                  </span>
                </div>
                <h4 className="text-white font-bold text-sm leading-snug">{finding.title}</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">{finding.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block">Supporting Agents:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {finding.supportingAgents.map(ag => (
                      <span key={ag} className="text-[10px] font-mono bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                        {ag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Affected: {finding.affectedServiceLines.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CONFLICTING INTERPRETATIONS ACROSS AGENTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              2. Conflicting Interpretations Across Agent Analytical Outputs
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded">
            {combinedInsights.conflictingInterpretations.length} Nuanced Divergences
          </span>
        </div>

        <div className="space-y-3.5">
          {combinedInsights.conflictingInterpretations.map((conflict, idx) => (
            <div
              key={idx}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-teal-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {conflict.recordId}
                  </span>
                  <h4 className="text-white font-semibold text-sm">{conflict.issue}</h4>
                </div>
              </div>

              {/* Agent Perspectives Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {conflict.agentPerspectives.map((persp, pIdx) => (
                  <div key={pIdx} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="font-mono text-[10px] text-sky-400 uppercase font-semibold">
                      {persp.agentName}
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">"{persp.observation}"</p>
                  </div>
                ))}
              </div>

              {/* Recommended Resolution */}
              <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-900/40 text-[11px] text-amber-200">
                <strong className="text-amber-300 font-mono block mb-0.5">Recommended Managerial Resolution:</strong>
                {conflict.recommendedResolution}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. HIGH-PRIORITY HUMAN REVIEW QUEUE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              3. High-Priority Clinical Human Review Queue ({combinedInsights.highPriorityHumanQueue.length} Cases)
            </h3>
          </div>
          <span className="text-xs font-mono text-rose-300 bg-rose-950/60 border border-rose-500/30 px-2.5 py-0.5 rounded">
            Mandatory Clinical Sign-off
          </span>
        </div>

        <div className="space-y-3">
          {combinedInsights.highPriorityHumanQueue.map((item) => {
            const currentStatus = reviewStatuses[item.recordId]?.status || item.humanReviewStatus;
            const currentNotes = reviewStatuses[item.recordId]?.notes || '';

            return (
              <div
                key={item.recordId}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-400">{item.recordId}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-white font-medium">{item.patientPersona}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{item.serviceLine}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded font-mono font-semibold">
                      {item.severity}
                    </span>
                    <span
                      className={`font-mono px-2 py-0.5 rounded border text-[11px] ${
                        currentStatus === 'Accepted' ? 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40' :
                        currentStatus === 'Overridden' ? 'text-rose-300 bg-rose-950/80 border-rose-500/40' :
                        'text-amber-300 bg-amber-950/80 border-amber-500/40'
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>
                </div>

                {/* Evidence & Escalation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="space-y-1">
                    <span className="font-mono text-slate-500 block">Identified Clinical/AI Risk:</span>
                    <p className="text-slate-300 leading-relaxed">{item.riskSummary}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-slate-500 block">Agent Multi-Route Directive:</span>
                    <p className="text-teal-300 font-mono leading-relaxed">{item.recommendedEscalation}</p>
                  </div>
                </div>

                {/* Human Sign-Off Interactive Row */}
                <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Add clinician or manager verification notes..."
                      value={currentNotes}
                      onChange={(e) => handleNotesChange(item.recordId, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReviewAction(item.recordId, 'Accepted')}
                      className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
                        currentStatus === 'Accepted'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {currentStatus === 'Accepted' ? '✓ Decision Approved' : 'Approve Decision'}
                    </button>

                    <button
                      onClick={() => handleReviewAction(item.recordId, 'Overridden')}
                      className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
                        currentStatus === 'Overridden'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Override
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. RECOMMENDED FOLLOW-UP ACTIONS & DATA GAPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="text-white font-bold text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Recommended Immediate Follow-Up Actions
          </h4>
          <ul className="space-y-2 mt-2">
            {combinedInsights.recommendedFollowUps.map((action, idx) => (
              <li key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold shrink-0">{idx + 1}.</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="text-white font-bold text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Areas Where Additional Data Is Needed
          </h4>
          <ul className="space-y-2 mt-2">
            {combinedInsights.dataGapsAndMissingInfo.map((gap, idx) => (
              <li key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold shrink-0">!</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
