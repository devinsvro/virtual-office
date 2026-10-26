import React from 'react';
import { AgentDefinition, AgentStatus } from '../types/clinical';
import { AvatarDisplay } from './AvatarDisplay';
import {
  X,
  Play,
  RotateCcw,
  CheckCircle,
  Wrench,
  FileText,
  Sliders,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface AgentWorkspaceModalProps {
  agent: AgentDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  status: AgentStatus;
  onRunSingleAgent: (agentId: string) => void;
  onOpenResultsTab: (tabId: string) => void;
  hasResults: boolean;
}

export const AgentWorkspaceModal: React.FC<AgentWorkspaceModalProps> = ({
  agent,
  isOpen,
  onClose,
  status,
  onRunSingleAgent,
  onOpenResultsTab,
  hasResults
}) => {
  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-teal-400 border border-slate-700">
              SUITE 10{agent.roomNumber}
            </span>
            <div>
              <h2 className="text-base font-bold text-white">{agent.name}</h2>
              <p className="text-xs text-slate-400">{agent.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Avatar and Core Persona */}
          <div className="flex items-start gap-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <AvatarDisplay agentId={agent.id} status={status} size="lg" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{agent.specialistName}</h3>
                  <p className="text-xs text-teal-400 font-medium">{agent.agentRole}</p>
                </div>
                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded border capitalize ${
                    status === 'processing' ? 'text-amber-400 bg-amber-950 border-amber-500/40 animate-pulse' :
                    status === 'completed' ? 'text-emerald-400 bg-emerald-950 border-emerald-500/40' :
                    'text-slate-400 bg-slate-800 border-slate-700'
                  }`}
                >
                  Status: {status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {agent.shortDescription}
              </p>
            </div>
          </div>

          {/* Analytical Task Pipeline from Authoritative Prompt */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              Standard Analytical Protocol Tasks
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {agent.tasksPreview.map((task, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-slate-300 font-mono text-[11px] flex items-center gap-2">
                  <span className="text-teal-400 font-bold">{idx + 1}.</span>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Responsibilities */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider">
              Core Responsibilities & Clinical Constraints
            </h4>
            <ul className="space-y-1.5">
              {agent.keyResponsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300 text-[11px] leading-relaxed">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Integrated Tool Calls */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-sky-400" />
              Integrated Analytical Tools & APIs
            </h4>
            <div className="flex flex-wrap gap-2">
              {agent.toolsProvided.map((tool, idx) => (
                <span key={idx} className="font-mono text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Close Suite
          </button>

          <div className="flex items-center gap-3">
            {hasResults && (
              <button
                onClick={() => {
                  onClose();
                  onOpenResultsTab(agent.id);
                }}
                className="px-4 py-2 text-xs font-semibold text-teal-300 bg-slate-800 hover:bg-slate-700 border border-teal-500/30 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>View Suite Findings</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onRunSingleAgent(agent.id);
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Analyze Current Dataset with This Agent</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
