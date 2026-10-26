import React from 'react';
import { HEALTHCARE_AGENTS } from '../data/agentDefinitions';
import { AgentDefinition, AgentStatus } from '../types/clinical';
import { AvatarDisplay } from './AvatarDisplay';
import {
  CheckCircle2,
  Clock,
  Play,
  Settings,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Sparkles,
  Shield,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface VirtualOfficeProps {
  agentStatuses: Record<string, AgentStatus>;
  selectedAgentIds: string[];
  onToggleAgentSelect: (agentId: string) => void;
  onSelectAllAgents: () => void;
  onClearAgentSelection: () => void;
  onOpenAgentWorkspace: (agent: AgentDefinition) => void;
  onStartAnalysis: () => void;
  onOpenDataUpload: () => void;
  datasetName: string;
  datasetRowCount: number;
  agentProgress: Record<string, { percent: number; step: string }>;
}

export const VirtualOffice: React.FC<VirtualOfficeProps> = ({
  agentStatuses,
  selectedAgentIds,
  onToggleAgentSelect,
  onSelectAllAgents,
  onClearAgentSelection,
  onOpenAgentWorkspace,
  onStartAnalysis,
  onOpenDataUpload,
  datasetName,
  datasetRowCount,
  agentProgress
}) => {
  // Compute summary stats
  const totalAgents = HEALTHCARE_AGENTS.length;
  const idleCount = Object.values(agentStatuses).filter(s => s === 'idle').length;
  const selectedCount = selectedAgentIds.length;
  const processingCount = Object.values(agentStatuses).filter(s => s === 'processing').length;
  const completedCount = Object.values(agentStatuses).filter(s => s === 'completed').length;
  const errorCount = Object.values(agentStatuses).filter(s => s === 'error').length;

  const isAnyProcessing = processingCount > 0;

  return (
    <div className="space-y-6">
      {/* Virtual Office Header & Global Shared Activity Telemetry */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xl font-bold text-white tracking-tight">ClinicaAI Virtual Office Headquarters</h2>
              <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700">
                Floor 4 · Clinical Intelligence Wing
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Six specialized clinical AI agents operating independently in dedicated virtual suites. Upload patient feedback or cohorts to coordinate simultaneous multi-agent analysis.
            </p>
          </div>

          {/* Quick Action Station */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onOpenDataUpload}
              className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg flex items-center gap-2 transition-all hover:border-slate-600"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-400" />
              <span>Dataset: {datasetName} ({datasetRowCount} records)</span>
            </button>

            <button
              onClick={selectedCount === totalAgents ? onClearAgentSelection : onSelectAllAgents}
              className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
            >
              {selectedCount === totalAgents ? 'Deselect All' : 'Select All 6 Agents'}
            </button>

            <button
              onClick={onStartAnalysis}
              disabled={selectedCount === 0 || isAnyProcessing}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md transition-all ${
                selectedCount === 0 || isAnyProcessing
                  ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 hover:shadow-emerald-700/40 cursor-pointer'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              {isAnyProcessing ? 'Analysis In Progress...' : `Launch Analysis (${selectedCount} Active)`}
            </button>
          </div>
        </div>

        {/* Shared Activity Status Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-xs text-slate-400 font-medium">Idle Suites</span>
            </div>
            <span className="text-sm font-bold font-mono text-slate-200">{idleCount}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-xs text-slate-400 font-medium">Selected</span>
            </div>
            <span className="text-sm font-bold font-mono text-sky-300">{selectedCount}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs text-slate-400 font-medium">Processing</span>
            </div>
            <span className="text-sm font-bold font-mono text-amber-300">{processingCount}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-400 font-medium">Completed</span>
            </div>
            <span className="text-sm font-bold font-mono text-emerald-300">{completedCount}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs text-slate-400 font-medium">Errors</span>
            </div>
            <span className="text-sm font-bold font-mono text-rose-300">{errorCount}</span>
          </div>
        </div>
      </div>

      {/* Six Virtual Office Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {HEALTHCARE_AGENTS.map((agent) => {
          const status = agentStatuses[agent.id] || 'idle';
          const isSelected = selectedAgentIds.includes(agent.id);
          const progress = agentProgress[agent.id] || { percent: 0, step: 'Standing by' };
          const isWorking = status === 'processing';

          // Status Badge styling
          const statusBadge = {
            idle: { label: 'Idle / Ready', text: 'text-slate-400', bg: 'bg-slate-800/60 border-slate-700' },
            selected: { label: 'Selected for Run', text: 'text-sky-300', bg: 'bg-sky-950/60 border-sky-600/40' },
            processing: { label: 'Analyzing Data...', text: 'text-amber-300', bg: 'bg-amber-950/80 border-amber-500/60 animate-pulse' },
            completed: { label: 'Analysis Complete', text: 'text-emerald-300', bg: 'bg-emerald-950/70 border-emerald-500/50' },
            error: { label: 'Alert / Error', text: 'text-rose-300', bg: 'bg-rose-950/70 border-rose-500/50' }
          }[status];

          return (
            <div
              key={agent.id}
              className={`group relative rounded-2xl border transition-all duration-300 bg-slate-900/95 overflow-hidden flex flex-col justify-between ${
                isWorking
                  ? 'border-emerald-500/60 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                  : isSelected
                  ? 'border-sky-500/50 shadow-md shadow-sky-950/30'
                  : 'border-slate-800 hover:border-slate-700 shadow-sm'
              }`}
            >
              {/* Room Header Sign */}
              <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    SUITE {100 + agent.roomNumber}
                  </span>
                  <span className="text-slate-600 font-mono">·</span>
                  <span className="text-xs text-slate-300 font-medium truncate max-w-[180px]">
                    {agent.agentRole}
                  </span>
                </div>

                {/* Agent Activation Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleAgentSelect(agent.id)}
                    className="sr-only peer"
                    disabled={isWorking}
                  />
                  <div className="w-8 h-4 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Room Interior View with Specialist Avatar */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-4">
                  {/* Avatar with click to inspect */}
                  <div
                    onClick={() => onOpenAgentWorkspace(agent)}
                    className="cursor-pointer group-hover:scale-105 transition-transform shrink-0"
                    title={`Click to enter ${agent.specialistName}'s office workspace`}
                  >
                    <AvatarDisplay
                      agentId={agent.id}
                      status={status}
                      currentStep={isWorking ? progress.step : undefined}
                      size="md"
                    />
                  </div>

                  {/* Agent identity & role */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        onClick={() => onOpenAgentWorkspace(agent)}
                        className="text-base font-semibold text-white truncate cursor-pointer hover:text-emerald-400 transition-colors"
                      >
                        {agent.name}
                      </h3>
                    </div>
                    <p className="text-xs text-teal-400 font-medium">{agent.specialistName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{agent.title}</p>

                    {/* Status Pill */}
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono border font-medium">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        status === 'processing' ? 'bg-amber-400 animate-ping' :
                        status === 'completed' ? 'bg-emerald-400' :
                        status === 'selected' ? 'bg-sky-400' : 'bg-slate-500'
                      }`} />
                      <span className={statusBadge.text}>{statusBadge.label}</span>
                    </div>
                  </div>
                </div>

                {/* Agent Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                  {agent.shortDescription}
                </p>

                {/* Progress bar during analysis */}
                {isWorking && (
                  <div className="space-y-1.5 bg-slate-950/70 p-2.5 rounded-xl border border-emerald-900/50">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Activity className="w-3 h-3 animate-spin" />
                        {progress.step}
                      </span>
                      <span className="text-slate-300 font-bold">{progress.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Room Bottom Actions */}
              <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  {agent.toolsProvided.length} Specialized Tools
                </span>

                <button
                  onClick={() => onOpenAgentWorkspace(agent)}
                  className="text-slate-300 hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors cursor-pointer py-1"
                >
                  <span>Enter Suite</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
