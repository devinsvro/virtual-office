import React from 'react';
import { HEALTHCARE_AGENTS } from '../data/agentDefinitions';
import { AgentDefinition } from '../types/clinical';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Sliders,
  CheckSquare,
  Square,
  Play,
  X,
  Sparkles,
  ShieldAlert,
  BrainCircuit,
  Wrench,
  Check
} from 'lucide-react';

interface AgentConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgentIds: string[];
  onToggleAgentSelect: (agentId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onStartSimultaneousAnalysis: () => void;
  focusedAgent?: AgentDefinition | null;
  configOptions: {
    analysisEngine: 'hybrid' | 'deterministic';
    urgencySensitivity: 'high' | 'standard';
    autoTriggerER: boolean;
    requireHumanSignOffForCritical: boolean;
  };
  onChangeConfig: (newConfig: any) => void;
}

export const AgentConfigPanel: React.FC<AgentConfigPanelProps> = ({
  isOpen,
  onClose,
  selectedAgentIds,
  onToggleAgentSelect,
  onSelectAll,
  onDeselectAll,
  onStartSimultaneousAnalysis,
  focusedAgent,
  configOptions,
  onChangeConfig
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-xl">
              <Sliders className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Agent Suite Configuration & Task Parameters</h2>
              <p className="text-xs text-slate-400">
                Select clinical agents and calibrate analytical sensitivity before launching pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Agent Selection Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">Active Agents:</span>
            <span className="font-mono text-teal-300 font-bold">{selectedAgentIds.length} of {HEALTHCARE_AGENTS.length} Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSelectAll}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              Select All 6
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={onDeselectAll}
              className="text-xs text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Agent Selection Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Assigned Virtual Rooms & Agent Roles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {HEALTHCARE_AGENTS.map((agent) => {
                const isSelected = selectedAgentIds.includes(agent.id);
                return (
                  <div
                    key={agent.id}
                    onClick={() => onToggleAgentSelect(agent.id)}
                    className={`p-3.5 rounded-xl border flex items-start gap-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/80 border-sky-500/70 shadow-sm'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-70'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      <AvatarDisplay agentId={agent.id} status={isSelected ? 'selected' : 'idle'} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">SUITE 10{agent.roomNumber}</span>
                        <div
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                            isSelected ? 'bg-sky-500 border-sky-400 text-slate-950' : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-white truncate mt-0.5">{agent.name}</h4>
                      <p className="text-[11px] text-teal-400 font-medium">{agent.specialistName}</p>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {agent.shortDescription}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analytical Task Configuration Controls */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <span>Multi-Agent Analytical Calibration</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Engine Mode */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium block">Clinical Analytical Engine</label>
                <select
                  value={configOptions.analysisEngine}
                  onChange={(e) => onChangeConfig({ ...configOptions, analysisEngine: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 text-xs"
                >
                  <option value="hybrid">High-Precision Clinical NLP & Heuristic Engine (Recommended)</option>
                  <option value="deterministic">Deterministic Quality Rule-Base (Zero Hallucination)</option>
                </select>
                <span className="text-[11px] text-slate-500 block">
                  Grounds all classifications directly in patient records without extraneous hallucination.
                </span>
              </div>

              {/* Urgency Sensitivity */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium block">Acuity & Escalation Sensitivity</label>
                <select
                  value={configOptions.urgencySensitivity}
                  onChange={(e) => onChangeConfig({ ...configOptions, urgencySensitivity: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 text-xs"
                >
                  <option value="high">Conservative / High Sensitivity (Aggressive Patient Safety)</option>
                  <option value="standard">Standard Joint Commission Healthcare Quality Threshold</option>
                </select>
                <span className="text-[11px] text-slate-500 block">
                  Elevates post-surgical fevers and sternal drainage symptoms to immediate emergency tiers.
                </span>
              </div>
            </div>

            {/* Checkbox safeguards */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={configOptions.autoTriggerER}
                  onChange={(e) => onChangeConfig({ ...configOptions, autoTriggerER: e.target.checked })}
                  className="w-4 h-4 rounded-sm border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                />
                <span>
                  Enable Emergency Override tool-calling in Agent 6 for Tier 1 life-threatening symptoms
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={configOptions.requireHumanSignOffForCritical}
                  onChange={(e) => onChangeConfig({ ...configOptions, requireHumanSignOffForCritical: e.target.checked })}
                  className="w-4 h-4 rounded-sm border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                />
                <span>
                  Enforce Mandatory Human Review checkpoint before finalizing Level 4 complaints or AI Hallucination flags
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Close Settings
          </button>

          <button
            onClick={() => {
              onClose();
              onStartSimultaneousAnalysis();
            }}
            disabled={selectedAgentIds.length === 0}
            className={`px-5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer ${
              selectedAgentIds.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Simultaneous Analysis ({selectedAgentIds.length} Agents)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
