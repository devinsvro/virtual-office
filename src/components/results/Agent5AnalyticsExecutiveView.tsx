import React, { useState } from 'react';
import { HealthcareAnalyticsResult, PatientRecord } from '../../types/clinical';
import {
  BarChart3,
  PieChart,
  Cloud,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Brain,
  ShieldAlert,
  Download,
  Building,
  Activity
} from 'lucide-react';

interface Agent5AnalyticsExecutiveViewProps {
  analytics: HealthcareAnalyticsResult;
  records: PatientRecord[];
}

export const Agent5AnalyticsExecutiveView: React.FC<Agent5AnalyticsExecutiveViewProps> = ({
  analytics,
  records
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'satisfaction' | 'nlp' | 'problems' | 'ai_risk' | 'recommendations'>('all');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const { overview, satisfactionInsights, nlpAnalysis, hiddenProblems, aiRiskMonitoring, executiveRecommendations } = analytics;

  return (
    <div className="space-y-8">
      {/* C-Suite Executive Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase">
              <span>SUITE 105 · Dr. Elena Rostova</span>
              <span className="text-slate-600">·</span>
              <span>HEALTHCARE ANALYTICS AGENT</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1 tracking-tight">
              Hospital Leadership & C-Suite Executive Intelligence Report
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              High-level strategic analytics and quantitative performance metrics across clinical service lines, patient experience vectors, NLP sentiment clouds, and AI risk monitoring.
            </p>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs flex-wrap">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSection === 'all' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All 6 Sections
            </button>
            <button
              onClick={() => setActiveSection('satisfaction')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSection === 'satisfaction' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satisfaction
            </button>
            <button
              onClick={() => setActiveSection('nlp')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSection === 'nlp' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              NLP & Word Cloud
            </button>
            <button
              onClick={() => setActiveSection('problems')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSection === 'problems' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hidden Problems
            </button>
            <button
              onClick={() => setActiveSection('ai_risk')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSection === 'ai_risk' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              AI Risk Guard
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: EXECUTIVE OVERVIEW */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider">
            SECTION 1: Executive Overview KPIs
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-mono text-slate-400 block">Total Analyzed</span>
            <span className="text-2xl font-bold font-mono text-white mt-1 block">
              {overview.totalComments}
            </span>
            <span className="text-[11px] text-slate-500">Patient Encounters</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-mono text-slate-400 block">Avg Satisfaction</span>
            <span className="text-2xl font-bold font-mono text-teal-400 mt-1 block">
              {overview.avgSatisfaction} <span className="text-xs text-slate-500">/ 5.0</span>
            </span>
            <span className="text-[11px] text-slate-500">Cohort Average</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-mono text-slate-400 block">Avg Communication</span>
            <span className="text-2xl font-bold font-mono text-sky-400 mt-1 block">
              {overview.avgCommunication} <span className="text-xs text-slate-500">/ 5.0</span>
            </span>
            <span className="text-[11px] text-slate-500">Provider Clarity</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-mono text-slate-400 block">Follow-up Compliance</span>
            <span className="text-2xl font-bold font-mono text-purple-400 mt-1 block">
              {overview.followUpComplianceRate}%
            </span>
            <span className="text-[11px] text-slate-500">Adherent Patients</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-mono text-slate-400 block">Service Lines</span>
            <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
              {overview.serviceLinesCount}
            </span>
            <span className="text-[11px] text-slate-500">Represented</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: PATIENT SATISFACTION INSIGHTS */}
      {(activeSection === 'all' || activeSection === 'satisfaction') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider">
              SECTION 2: Patient Satisfaction Insights
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* Distribution */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="font-semibold text-white block text-xs">Satisfaction Score Distribution (1-5 Stars)</span>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((score) => {
                  const count = satisfactionInsights.distribution[score] || 0;
                  const pct = overview.totalComments > 0 ? Math.round((count / overview.totalComments) * 100) : 0;
                  return (
                    <div key={score} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-300">{score} Stars</span>
                        <span className="text-slate-400">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${score >= 4 ? 'bg-emerald-400' : score === 3 ? 'bg-amber-400' : 'bg-rose-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* By Service Line */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="font-semibold text-white block text-xs">Satisfaction by Service Line</span>
              <div className="space-y-2.5">
                {Object.entries(satisfactionInsights.byServiceLine).map(([line, data]) => {
                  const pct = Math.round((data.avg / 5) * 100);
                  return (
                    <div key={line} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 font-medium truncate max-w-[140px]">{line}</span>
                        <span className="font-mono text-teal-300 font-bold">{data.avg} / 5</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${data.avg >= 3.5 ? 'bg-teal-400' : data.avg >= 2.5 ? 'bg-amber-400' : 'bg-rose-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* By Visit Type */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="font-semibold text-white block text-xs">Satisfaction by Visit Type</span>
              <div className="space-y-2.5">
                {Object.entries(satisfactionInsights.byVisitType).map(([vtype, data]) => {
                  const pct = Math.round((data.avg / 5) * 100);
                  return (
                    <div key={vtype} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 font-medium truncate max-w-[140px]">{vtype}</span>
                        <span className="font-mono text-purple-300 font-bold">{data.avg} / 5</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${data.avg >= 3.5 ? 'bg-purple-400' : 'bg-amber-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: NLP ANALYSIS & WORD CLOUD */}
      {(activeSection === 'all' || activeSection === 'nlp') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider">
              SECTION 3: NLP Semantic Mining & Clinical Word Cloud
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
            {/* Interactive Word Cloud Simulation */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs">Semantic Sentiment Word Cloud</span>
                <span className="text-[11px] text-slate-500 font-mono">Click term to inspect</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 min-h-[180px] flex flex-wrap items-center justify-center gap-3">
                {nlpAnalysis.wordCloud.map((item) => {
                  const isSelected = selectedWord === item.text;
                  const color =
                    item.sentiment === 'positive' ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border-emerald-500/30' :
                    item.sentiment === 'negative' ? 'text-rose-400 hover:text-rose-300 bg-rose-950/40 border-rose-500/30' :
                    'text-sky-300 hover:text-sky-200 bg-sky-950/40 border-sky-500/30';

                  const fontSize =
                    item.value > 35 ? 'text-base font-bold' :
                    item.value > 25 ? 'text-sm font-semibold' : 'text-xs';

                  return (
                    <button
                      key={item.text}
                      onClick={() => setSelectedWord(isSelected ? null : item.text)}
                      className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${color} ${fontSize} ${
                        isSelected ? 'ring-2 ring-purple-400 scale-110 shadow-lg' : ''
                      }`}
                    >
                      {item.text} <span className="text-[10px] opacity-70">({item.value})</span>
                    </button>
                  );
                })}
              </div>

              {selectedWord && (
                <div className="p-3 bg-purple-950/30 border border-purple-800/50 rounded-lg text-xs text-purple-200">
                  Inspecting cluster: <strong className="text-white">"{selectedWord}"</strong> — Cross-referenced across {records.filter(r => r.patient_comments.toLowerCase().includes(selectedWord.toLowerCase().split(' ')[0])).length} comments in Cardiology and Inpatient Surgical cohorts.
                </div>
              )}
            </div>

            {/* Top Themes & Keywords */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <span className="font-semibold text-white block text-xs">Top Emergent Clinical Themes</span>
              <div className="space-y-2">
                {nlpAnalysis.topThemes.map((item) => (
                  <div key={item.theme} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 font-medium">{item.theme}</span>
                      <span className="font-mono text-purple-300 font-bold">{item.count} mentions ({item.percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono block mb-2">Most Frequent Complaint Keywords:</span>
                <div className="flex flex-wrap gap-1.5">
                  {nlpAnalysis.frequentKeywords.map(kw => (
                    <span key={kw.word} className="font-mono text-[11px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {kw.word} ({kw.count})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: HIDDEN ORGANIZATIONAL PROBLEMS */}
      {(activeSection === 'all' || activeSection === 'problems') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider">
              SECTION 4: Hidden Organizational Problems & Service Line Anomalies
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="font-mono font-bold text-rose-400 block text-[11px]">HIGH COMPLAINT SERVICE LINES</span>
              <div className="space-y-2 mt-1">
                {hiddenProblems.serviceLinesHighComplaints.map(item => (
                  <div key={item.serviceLine} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                      <strong className="text-white">{item.serviceLine}</strong>
                      <span className="font-mono text-rose-400 font-bold">{item.complaintRate}% rate</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.keyDriver}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="font-mono font-bold text-amber-400 block text-[11px]">COMMUNICATION BOTTLENECKS</span>
              <ul className="space-y-2 mt-1">
                {hiddenProblems.communicationBottlenecks.map((item, idx) => (
                  <li key={idx} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="font-mono font-bold text-sky-400 block text-[11px]">TECHNOLOGY & PORTAL FAILURES</span>
              <ul className="space-y-2 mt-1">
                {hiddenProblems.technologyIssues.map((item, idx) => (
                  <li key={idx} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="font-mono font-bold text-teal-400 block text-[11px]">WAIT-TIME ANOMALIES</span>
              <ul className="space-y-2 mt-1">
                {hiddenProblems.waitTimeComplaints.map((item, idx) => (
                  <li key={idx} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: AI RISK MONITORING */}
      {(activeSection === 'all' || activeSection === 'ai_risk') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider">
              SECTION 5: AI Risk Monitoring & Hallucination Guardrails
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Hallucination Traps */}
            <div className="bg-slate-900/90 border border-rose-500/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-300 flex items-center gap-1.5 text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Hallucination Trap Comments ({aiRiskMonitoring.hallucinationTraps.length})
                </span>
                <span className="text-[11px] font-mono text-rose-400">Strict Human Sign-off</span>
              </div>

              <div className="space-y-2.5">
                {aiRiskMonitoring.hallucinationTraps.map(trap => (
                  <div key={trap.recordId} className="bg-slate-950 p-3 rounded-lg border border-rose-900/50 space-y-1">
                    <span className="font-mono text-teal-400 text-[11px]">{trap.recordId}</span>
                    <p className="text-slate-300 italic text-[11px]">"{trap.comment}"</p>
                    <p className="text-rose-300/90 text-[11px] font-semibold mt-1">Hazard: {trap.concern}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bias-Related Comments */}
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Bias & Equity Review Cases ({aiRiskMonitoring.biasRelatedCases.length})
                </span>
                <span className="text-[11px] font-mono text-amber-400">Title VI / ADA</span>
              </div>

              <div className="space-y-2.5">
                {aiRiskMonitoring.biasRelatedCases.map(bias => (
                  <div key={bias.recordId} className="bg-slate-950 p-3 rounded-lg border border-amber-900/50 space-y-1">
                    <span className="font-mono text-teal-400 text-[11px]">{bias.recordId}</span>
                    <p className="text-slate-300 italic text-[11px]">"{bias.comment}"</p>
                    <p className="text-amber-300/90 text-[11px] font-semibold mt-1">Concern: {bias.concern}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: EXECUTIVE RECOMMENDATIONS */}
      {(activeSection === 'all' || activeSection === 'recommendations') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              SECTION 6: C-Suite Executive Strategic Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Top 5 Priorities */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <span className="font-mono text-purple-400 font-bold block text-xs">TOP 5 SYSTEM PRIORITIES</span>
              <ul className="space-y-2">
                {executiveRecommendations.top5Priorities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-[11px] leading-relaxed">
                    <span className="text-purple-400 font-mono font-bold shrink-0">{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Wins */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <span className="font-mono text-teal-400 font-bold block text-xs">QUICK WINS (WITHIN 3 MONTHS)</span>
              <ul className="space-y-2">
                {executiveRecommendations.quickWins3Months.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-[11px] leading-relaxed">
                    <span className="text-teal-400 font-mono font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Long-Term AI Opportunities */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <span className="font-mono text-sky-400 font-bold block text-xs">LONG-TERM AI ROADMAP (6–12 MO)</span>
              <ul className="space-y-2">
                {executiveRecommendations.longTermAIOpportunities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-[11px] leading-relaxed">
                    <span className="text-sky-400 font-mono font-bold shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
