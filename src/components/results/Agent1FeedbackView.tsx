import React, { useState } from 'react';
import { FeedbackInsightResult, PatientRecord } from '../../types/clinical';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Download
} from 'lucide-react';

interface Agent1FeedbackViewProps {
  results: FeedbackInsightResult[];
  records: PatientRecord[];
}

export const Agent1FeedbackView: React.FC<Agent1FeedbackViewProps> = ({ results, records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [themeFilter, setThemeFilter] = useState('All');
  const [sentimentFilter, setSentimentFilter] = useState('All');

  // Stats
  const total = results.length;
  const positiveCount = results.filter(r => r.sentiment === 'Positive').length;
  const negativeCount = results.filter(r => r.sentiment === 'Negative').length;
  const mixedCount = results.filter(r => r.sentiment === 'Mixed').length;
  const neutralCount = results.filter(r => r.sentiment === 'Neutral').length;

  const filteredResults = results.filter(r => {
    const matchesSearch = r.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reasoning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.operationalIssue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.riskOrBiasConcern.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = themeFilter === 'All' || r.theme === themeFilter;
    const matchesSentiment = sentimentFilter === 'All' || r.sentiment === sentimentFilter;
    return matchesSearch && matchesTheme && matchesSentiment;
  });

  const allThemes = Array.from(new Set(results.map(r => r.theme)));

  return (
    <div className="space-y-6">
      {/* Title & Agent Charter Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-semibold uppercase">
              <span>SUITE 101 · Dr. Patricia Vance</span>
              <span className="text-slate-600">·</span>
              <span>PATIENT FEEDBACK INSIGHT AGENT</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Patient Comments & Experience Synthesis Dashboard</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Quality-improvement analysis isolating 9 clinical themes, sentiment classifications, process friction points, and risk/bias flags with practical management actions.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              Analyzed: <span className="font-bold text-white">{total} Comments</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
              Positive: <span className="font-bold">{positiveCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300">
              Negative: <span className="font-bold">{negativeCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search comment reasoning, operational issue, or record ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 text-xs focus:outline-hidden focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Theme Selector */}
          <select
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs"
          >
            <option value="All">All Themes ({allThemes.length})</option>
            {allThemes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs"
          >
            <option value="All">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Mixed">Mixed</option>
            <option value="Neutral">Neutral</option>
          </select>
        </div>
      </div>

      {/* Case-by-Case Comprehensive Cards */}
      <div className="space-y-4">
        {filteredResults.map((item) => {
          const rec = records.find(r => r.id === item.recordId);
          const sentimentColor =
            item.sentiment === 'Positive' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' :
            item.sentiment === 'Negative' ? 'text-rose-400 bg-rose-950/40 border-rose-500/30' :
            item.sentiment === 'Mixed' ? 'text-amber-400 bg-amber-950/40 border-amber-500/30' :
            'text-slate-400 bg-slate-800/40 border-slate-700/50';

          return (
            <div
              key={item.recordId}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-teal-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.recordId}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">·</span>
                  <span className="text-xs text-white font-medium">
                    {rec?.patient_persona || 'Patient Feedback Encounter'}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">·</span>
                  <span className="text-xs text-slate-400">
                    {rec?.service_line} ({rec?.visit_type})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-300 bg-slate-800/60 px-2 py-0.5 rounded">
                    Score: {rec?.patient_satisfaction}/5
                  </span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded border ${sentimentColor}`}>
                    {item.sentiment}
                  </span>
                  <span className="text-xs font-medium text-teal-300 bg-teal-950/60 border border-teal-500/30 px-2.5 py-0.5 rounded">
                    Theme: {item.theme}
                  </span>
                </div>
              </div>

              {/* Patient Raw Quote */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-xs italic text-slate-300">
                "{rec?.patient_comments}"
              </div>

              {/* Structured 4-Part Analysis (Step 3 to 6) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                {/* Step 3: Reasoning */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                    Classification Reasoning
                  </span>
                  <p className="text-slate-400 leading-relaxed">{item.reasoning}</p>
                </div>

                {/* Step 4: Operational Issue */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Operational Process Issue
                  </span>
                  <p className="text-slate-400 leading-relaxed">{item.operationalIssue}</p>
                </div>

                {/* Step 5: Risk or Bias Concern */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    Risk or Bias Concern
                  </span>
                  <p className="text-slate-400 leading-relaxed">{item.riskOrBiasConcern}</p>
                </div>

                {/* Step 6: Recommended Action */}
                <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40 space-y-1">
                  <span className="font-semibold text-emerald-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                    Managerial Action
                  </span>
                  <p className="text-emerald-200/90 leading-relaxed">{item.recommendedAction}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
