import React from 'react';
import { HEALTHCARE_AGENTS } from '../data/agentDefinitions';
import { AgentStatus } from '../types/clinical';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Square,
  ArrowRight,
  Sparkles,
  Terminal,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface LiveProcessingViewProps {
  agentStatuses: Record<string, AgentStatus>;
  agentProgress: Record<string, { percent: number; step: string; previewFinding?: string }>;
  selectedAgentIds: string[];
  onCancelAgent: (agentId: string) => void;
  onRestartAgent: (agentId: string) => void;
  onViewResults: () => void;
  isAllCompleted: boolean;
  datasetName: string;
  totalRecords: number;
}

export const LiveProcessingView: React.FC<LiveProcessingViewProps> = ({
  agentStatuses,
  agentProgress,
  selectedAgentIds,
  onCancelAgent,
  onRestartAgent,
  onViewResults,
  isAllCompleted,
  datasetName,
  totalRecords
}) => {
  const activeAgents = HEALTHCARE_AGENTS.filter(a => selectedAgentIds.includes(a.id));

  return (
    <div className="space-y-6">
      {/* Live Pipeline Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isAllCompleted ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isAllCompleted ? 'Multi-Agent Clinical Pipeline Complete' : 'Active Multi-Agent Clinical Processing'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Analyzing <span className="font-mono text-teal-300 font-semibold">{totalRecords} patient records</span> across {activeAgents.length} parallel healthcare intelligence agents from {datasetName}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAllCompleted ? (
              <button
                onClick={onViewResults}
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Open Comprehensive Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-lg animate-pulse">
                <Activity className="w-4 h-4 animate-spin text-amber-400" />
                <span>Asynchronous Parallel Execution</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parallel Agent Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeAgents.map((agent) => {
          const status = agentStatuses[agent.id] || 'idle';
          const progress = agentProgress[agent.id] || { percent: 0, step: 'Standing by', previewFinding: 'Awaiting data queue...' };
          const isProcessing = status === 'processing';
          const isCompleted = status === 'completed';

          return (
            <div
              key={agent.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all bg-slate-900/90 shadow-md ${
                isProcessing
                  ? 'border-emerald-500/60 shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                  : isCompleted
                  ? 'border-teal-500/40 bg-slate-900/95'
                  : 'border-slate-800'
              }`}
            >
              {/* Agent Title & Suite */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400">SUITE 10{agent.roomNumber}</span>
                  <div className="flex items-center gap-1.5">
                    {isProcessing && (
                      <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
                        <Activity className="w-3 h-3 animate-spin" />
                        PROCESSING
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[11px] font-mono text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        COMPLETED
                      </span>
                    )}
                  </div>
                </div>

                {/* Avatar & Specialist Info */}
                <div className="flex items-center gap-3.5 mt-3.5">
                  <AvatarDisplay
                    agentId={agent.id}
                    status={status}
                    currentStep={isProcessing ? progress.step : undefined}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white truncate">{agent.name}</h3>
                    <p className="text-xs text-teal-400">{agent.specialistName}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{agent.agentRole}</p>
                  </div>
                </div>

                {/* Step & Progress Bar */}
                <div className="mt-4 space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 truncate max-w-[200px]">{progress.step}</span>
                    <span className="text-emerald-400 font-bold">{progress.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-400'
                          : 'bg-gradient-to-r from-teal-400 to-emerald-400'
                      }`}
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>

                {/* Live Preview Finding Snippet */}
                <div className="mt-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
                  <span className="text-slate-500 font-mono flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-teal-400" />
                    Latest Telemetry Finding:
                  </span>
                  <p className="text-slate-300 line-clamp-2 italic font-mono text-[11px]">
                    "{progress.previewFinding || 'Extracting structured thematic patterns...'}"
                  </p>
                </div>
              </div>

              {/* Individual Controls */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                {isProcessing ? (
                  <button
                    onClick={() => onCancelAgent(agent.id)}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Cancel Task</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onRestartAgent(agent.id)}
                    className="text-slate-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rerun Analysis</span>
                  </button>
                )}

                <span className="text-[11px] text-slate-500 font-mono">
                  {isCompleted ? 'Ready for Canvas' : 'Simultaneous Worker'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
