import React, { useState, useEffect, useRef } from 'react';
import { HEALTHCARE_AGENTS } from './data/agentDefinitions';
import { SAMPLE_COHORT_COMPREHENSIVE } from './data/sampleDatasets';
import {
  PatientRecord,
  AgentStatus,
  AgentDefinition,
  MultiAgentAnalysisRun
} from './types/clinical';
import { runCompleteMultiAgentPipeline } from './utils/clinicalEngine';
import { VirtualOffice } from './components/VirtualOffice';
import { DataUploadModal } from './components/DataUploadModal';
import { AgentConfigPanel } from './components/AgentConfigPanel';
import { AgentWorkspaceModal } from './components/AgentWorkspaceModal';
import { LiveProcessingView } from './components/LiveProcessingView';
import { Agent1FeedbackView } from './components/results/Agent1FeedbackView';
import { Agent2ExperienceView } from './components/results/Agent2ExperienceView';
import { Agent3ComplaintTriageView } from './components/results/Agent3ComplaintTriageView';
import { Agent4HospitalManagerView } from './components/results/Agent4HospitalManagerView';
import { Agent5AnalyticsExecutiveView } from './components/results/Agent5AnalyticsExecutiveView';
import { Agent6ReschedulingView } from './components/results/Agent6ReschedulingView';
import { CombinedExecutiveView } from './components/results/CombinedExecutiveView';
import {
  Building,
  Activity,
  Layers,
  FileSpreadsheet,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  BarChart2,
  Stethoscope,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeScreen, setActiveScreen] = useState<'virtual_office' | 'live_processing' | 'agent_results' | 'combined_executive'>('virtual_office');
  const [activeResultTab, setActiveResultTab] = useState<string>('agent_1');

  // Dataset State
  const [currentRecords, setCurrentRecords] = useState<PatientRecord[]>(SAMPLE_COHORT_COMPREHENSIVE);
  const [datasetName, setDatasetName] = useState<string>('Hospital Health System Multi-Service Cohort (20 Records)');

  // Agents & Selection State
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([
    'agent_1', 'agent_2', 'agent_3', 'agent_4', 'agent_5', 'agent_6'
  ]);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({
    agent_1: 'idle',
    agent_2: 'idle',
    agent_3: 'idle',
    agent_4: 'idle',
    agent_5: 'idle',
    agent_6: 'idle'
  });

  // Processing Progress State
  const [agentProgress, setAgentProgress] = useState<Record<string, { percent: number; step: string; previewFinding?: string }>>({
    agent_1: { percent: 0, step: 'Standing by' },
    agent_2: { percent: 0, step: 'Standing by' },
    agent_3: { percent: 0, step: 'Standing by' },
    agent_4: { percent: 0, step: 'Standing by' },
    agent_5: { percent: 0, step: 'Standing by' },
    agent_6: { percent: 0, step: 'Standing by' }
  });

  // Configuration State
  const [configOptions, setConfigOptions] = useState({
    analysisEngine: 'hybrid' as const,
    urgencySensitivity: 'high' as const,
    autoTriggerER: true,
    requireHumanSignOffForCritical: true
  });

  // Modals State
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [focusedAgentWorkspace, setFocusedAgentWorkspace] = useState<AgentDefinition | null>(null);

  // Completed Analysis Results
  const [analysisRun, setAnalysisRun] = useState<MultiAgentAnalysisRun | null>(null);

  // Background Processing Timer Reference
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Run initial pre-computation so results tabs have rich data immediately if user navigates directly
  useEffect(() => {
    const initialRun = runCompleteMultiAgentPipeline(currentRecords, datasetName, selectedAgentIds);
    setAnalysisRun(initialRun);
  }, []);

  // Selection handlers
  const handleToggleAgentSelect = (agentId: string) => {
    setSelectedAgentIds(prev =>
      prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
    );
  };

  const handleSelectAllAgents = () => {
    setSelectedAgentIds(HEALTHCARE_AGENTS.map(a => a.id));
  };

  const handleClearAgentSelection = () => {
    setSelectedAgentIds([]);
  };

  // Launch Multi-Agent Parallel Analysis Pipeline
  const startMultiAgentAnalysis = () => {
    if (selectedAgentIds.length === 0) return;

    setActiveScreen('live_processing');

    // Set initial statuses
    setAgentStatuses(prev => {
      const next = { ...prev };
      selectedAgentIds.forEach(id => {
        next[id] = 'processing';
      });
      return next;
    });

    const agentStagesMap: Record<string, string[]> = {
      agent_1: [
        'Parsing patient comments & tokenizing text...',
        'Classifying 1 of 9 primary themes...',
        'Evaluating sentiment & clinical context...',
        'Screening for patient safety & over-automation risks...',
        'Formulating managerial action recommendations...',
        'Synthesis complete.'
      ],
      agent_2: [
        'Auditing demographic vulnerability vectors...',
        'Evaluating older adult & rural access barriers...',
        'Conducting Title VI / LEP interpretation review...',
        'Calculating 4-pillar risk matrix (Safety/Compliance/Equity)...',
        'Synthesizing operational bottleneck resolutions...',
        'Synthesis complete.'
      ],
      agent_3: [
        'Ingesting grievance text & classification...',
        'Grading clinical severity (Level 1 to 4)...',
        'Evaluating potential patient harm & medication risk...',
        'Determining regulatory exposure & HIPAA compliance...',
        'Routing to 1 of 10 hospital leadership desks...',
        'Triage finalized.'
      ],
      agent_4: [
        'Reviewing patient persona & service line context...',
        'Calculating readmission risk vs satisfaction...',
        'Auditing AI risk flags & hallucination traps...',
        'Generating root managerial problem synthesis...',
        'Drafting executive priority directives...',
        'Management review ready.'
      ],
      agent_5: [
        'Aggregating cohort-wide satisfaction & communication...',
        'Generating cross-service line satisfaction distribution...',
        'Running NLP semantic word cloud clustering...',
        'Detecting hidden organizational bottleneck anomalies...',
        'Building 3-month quick wins & 12-month AI roadmap...',
        'C-Suite dashboard rendered.'
      ],
      agent_6: [
        'Screening acute clinical red-flag symptoms...',
        'Categorizing into 4 rescheduling acuity tiers...',
        'Checking prerequisites (vitals, fasting, transport)...',
        'Executing simulated Emergency Override / Slot hold...',
        'Assigning care venue & dispatch hold...',
        'Booking pipeline synchronized.'
      ]
    };

    const previewFindingsMap: Record<string, string[]> = {
      agent_1: [
        'Detected high frequency of communication gaps in Cardiology.',
        'Extracted positive recovery sentiment in Orthopedics ambulatory care.',
        'Flagged severe over-automation concern in automated discharge instructions.'
      ],
      agent_2: [
        'Identified Title VI language barrier: Spanish LEP English-only discharge.',
        'Flagged rural broadband deficit for elderly heart failure patient PT-1001.',
        'Calculated High Regulatory Compliance risk in outpatient pavilion.'
      ],
      agent_3: [
        'Assigned LEVEL 4 – Critical to post-CABG sternal infection case PT-1005.',
        'Routed physical PHI check-in breach to Compliance Office immediately.',
        'Escalated pediatric stridor waiting delay to Physician Leadership.'
      ],
      agent_4: [
        'Top Alert: Post-discharge callback latency driving avoidable readmission risk.',
        'Flagged Hallucination Risk: Erroneous 400mg Neuro-Calmex prescription.',
        'Recommended mandatory clinician pre-approval gate on AI summaries.'
      ],
      agent_5: [
        'Cohort Avg Satisfaction: 2.35 / 5.0 across 5 hospital service lines.',
        'Word Cloud peak keywords: "Wait Time", "Portal Glitch", "Interpreter".',
        'Identified Cardiology complaint rate at 67% driven by callback latency.'
      ],
      agent_6: [
        'TRIGGERED EMERGENCY OVERRIDE for PT-1005 (Sternal drainage & chest pressure).',
        'Placed same-day urgent care hold #4 for neutropenic fever PT-1002.',
        'Fast-tracked nephrology ultrasound within 2-4 days for renal patient.'
      ]
    };

    let stepIndex = 0;
    if (processingIntervalRef.current) clearInterval(processingIntervalRef.current);

    processingIntervalRef.current = setInterval(() => {
      stepIndex++;

      setAgentProgress(prev => {
        const next = { ...prev };
        selectedAgentIds.forEach(id => {
          const stages = agentStagesMap[id] || agentStagesMap.agent_1;
          const currentStage = stages[Math.min(stepIndex, stages.length - 1)];
          const previews = previewFindingsMap[id] || previewFindingsMap.agent_1;
          const previewFinding = previews[stepIndex % previews.length];
          const pct = Math.min(100, Math.round((stepIndex / (stages.length - 1)) * 100));

          next[id] = {
            percent: pct,
            step: currentStage,
            previewFinding
          };
        });
        return next;
      });

      if (stepIndex >= 5) {
        if (processingIntervalRef.current) clearInterval(processingIntervalRef.current);

        // Finalize pipeline
        setAgentStatuses(prev => {
          const next = { ...prev };
          selectedAgentIds.forEach(id => {
            next[id] = 'completed';
          });
          return next;
        });

        // Compute authoritative multi-agent run
        const run = runCompleteMultiAgentPipeline(currentRecords, datasetName, selectedAgentIds);
        setAnalysisRun(run);
      }
    }, 700);
  };

  // Run a single agent alone from room workspace
  const handleRunSingleAgent = (agentId: string) => {
    setSelectedAgentIds([agentId]);
    setTimeout(() => {
      startMultiAgentAnalysis();
    }, 100);
  };

  const handleCancelAgent = (agentId: string) => {
    setAgentStatuses(prev => ({ ...prev, [agentId]: 'idle' }));
    setAgentProgress(prev => ({
      ...prev,
      [agentId]: { percent: 0, step: 'Cancelled by operator' }
    }));
  };

  const handleRestartAgent = (agentId: string) => {
    setAgentStatuses(prev => ({ ...prev, [agentId]: 'processing' }));
    setAgentProgress(prev => ({
      ...prev,
      [agentId]: { percent: 10, step: 'Re-evaluating patient records...' }
    }));
    setTimeout(() => {
      setAgentStatuses(prev => ({ ...prev, [agentId]: 'completed' }));
      setAgentProgress(prev => ({
        ...prev,
        [agentId]: { percent: 100, step: 'Re-analysis complete', previewFinding: 'Recalibrated findings synchronized.' }
      }));
    }, 1200);
  };

  const isAllSelectedCompleted = selectedAgentIds.length > 0 && selectedAgentIds.every(id => agentStatuses[id] === 'completed');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Brand & Room Facility Identifier */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-900/30">
            <Stethoscope className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">ClinicaAI</h1>
              <span className="text-[10px] font-mono bg-teal-950 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-md font-semibold">
                6-AGENT VIRTUAL OFFICE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Clinical Intelligence & Operational Quality Governance Portal</p>
          </div>
        </div>

        {/* Primary Screen Switcher Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveScreen('virtual_office')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeScreen === 'virtual_office'
                ? 'bg-slate-800 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-teal-400" />
            <span>Virtual Office</span>
          </button>

          <button
            onClick={() => setActiveScreen('live_processing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeScreen === 'live_processing'
                ? 'bg-slate-800 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Processing</span>
          </button>

          <button
            onClick={() => setActiveScreen('agent_results')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeScreen === 'agent_results'
                ? 'bg-slate-800 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Agent Results</span>
          </button>

          <button
            onClick={() => setActiveScreen('combined_executive')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeScreen === 'combined_executive'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Combined Executive</span>
          </button>
        </nav>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDataModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Upload CSV or Select Preconfigured Cohort"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-mono text-[11px] truncate max-w-[130px]">{datasetName.split(' ')[0]} ({currentRecords.length})</span>
          </button>

          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Agent Configuration"
          >
            <Sliders className="w-4 h-4 text-sky-400" />
          </button>

          <button
            onClick={startMultiAgentAnalysis}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-900/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run ({selectedAgentIds.length})</span>
          </button>
        </div>
      </header>

      {/* Mobile Screen Switcher Bar */}
      <div className="md:hidden px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-around text-xs">
        <button
          onClick={() => setActiveScreen('virtual_office')}
          className={`px-2 py-1 rounded ${activeScreen === 'virtual_office' ? 'text-teal-400 font-bold' : 'text-slate-400'}`}
        >
          Offices
        </button>
        <button
          onClick={() => setActiveScreen('live_processing')}
          className={`px-2 py-1 rounded ${activeScreen === 'live_processing' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          Pipeline
        </button>
        <button
          onClick={() => setActiveScreen('agent_results')}
          className={`px-2 py-1 rounded ${activeScreen === 'agent_results' ? 'text-sky-400 font-bold' : 'text-slate-400'}`}
        >
          Results
        </button>
        <button
          onClick={() => setActiveScreen('combined_executive')}
          className={`px-2 py-1 rounded ${activeScreen === 'combined_executive' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Executive
        </button>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* SCREEN 1: VIRTUAL OFFICE LANDING PAGE */}
        {activeScreen === 'virtual_office' && (
          <VirtualOffice
            agentStatuses={agentStatuses}
            selectedAgentIds={selectedAgentIds}
            onToggleAgentSelect={handleToggleAgentSelect}
            onSelectAllAgents={handleSelectAllAgents}
            onClearAgentSelection={handleClearAgentSelection}
            onOpenAgentWorkspace={(agent) => setFocusedAgentWorkspace(agent)}
            onStartAnalysis={startMultiAgentAnalysis}
            onOpenDataUpload={() => setIsDataModalOpen(true)}
            datasetName={datasetName}
            datasetRowCount={currentRecords.length}
            agentProgress={agentProgress}
          />
        )}

        {/* SCREEN 2: LIVE PROCESSING SCREEN */}
        {activeScreen === 'live_processing' && (
          <LiveProcessingView
            agentStatuses={agentStatuses}
            agentProgress={agentProgress}
            selectedAgentIds={selectedAgentIds}
            onCancelAgent={handleCancelAgent}
            onRestartAgent={handleRestartAgent}
            onViewResults={() => setActiveScreen('combined_executive')}
            isAllCompleted={isAllSelectedCompleted}
            datasetName={datasetName}
            totalRecords={currentRecords.length}
          />
        )}

        {/* SCREEN 3: INDIVIDUAL AGENT RESULTS DASHBOARD */}
        {activeScreen === 'agent_results' && analysisRun && (
          <div className="space-y-6">
            {/* Agent Sub-Tab Navigation Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center gap-2 overflow-x-auto text-xs">
              {HEALTHCARE_AGENTS.map((agent) => {
                const isActive = activeResultTab === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveResultTab(agent.id)}
                    className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-slate-800 text-white font-bold shadow-xs border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/60'
                    }`}
                  >
                    <span className="font-mono text-[11px] text-teal-400">10{agent.roomNumber}</span>
                    <span>{agent.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Individual Agent Results Components */}
            {activeResultTab === 'agent_1' && (
              <Agent1FeedbackView
                results={analysisRun.agent1Feedback}
                records={currentRecords}
              />
            )}

            {activeResultTab === 'agent_2' && (
              <Agent2ExperienceView
                results={analysisRun.agent2Experience}
                records={currentRecords}
              />
            )}

            {activeResultTab === 'agent_3' && (
              <Agent3ComplaintTriageView
                results={analysisRun.agent3ComplaintTriage}
                records={currentRecords}
              />
            )}

            {activeResultTab === 'agent_4' && (
              <Agent4HospitalManagerView
                results={analysisRun.agent4ManagerDecision}
                records={currentRecords}
              />
            )}

            {activeResultTab === 'agent_5' && analysisRun.agent5Analytics && (
              <Agent5AnalyticsExecutiveView
                analytics={analysisRun.agent5Analytics}
                records={currentRecords}
              />
            )}

            {activeResultTab === 'agent_6' && (
              <Agent6ReschedulingView
                results={analysisRun.agent6Rescheduling}
                records={currentRecords}
              />
            )}
          </div>
        )}

        {/* SCREEN 4: COMBINED EXECUTIVE DASHBOARD */}
        {activeScreen === 'combined_executive' && analysisRun && (
          <CombinedExecutiveView
            analysisRun={analysisRun}
            records={currentRecords}
          />
        )}
      </main>

      {/* Footer Notice */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-500">
        <p>
          ClinicaAI Clinical Virtual-Office Portal · Six Specialized Healthcare Intelligence Suites · HIPAA Synthetic Research Mode
        </p>
      </footer>

      {/* MODALS */}
      {/* 1. Data Upload & Safeguards Modal */}
      <DataUploadModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        currentRecords={currentRecords}
        currentDatasetName={datasetName}
        onApplyDataset={(records, name) => {
          setCurrentRecords(records);
          setDatasetName(name);
          const newRun = runCompleteMultiAgentPipeline(records, name, selectedAgentIds);
          setAnalysisRun(newRun);
        }}
      />

      {/* 2. Agent Configuration Modal */}
      <AgentConfigPanel
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        selectedAgentIds={selectedAgentIds}
        onToggleAgentSelect={handleToggleAgentSelect}
        onSelectAll={handleSelectAllAgents}
        onDeselectAll={handleClearAgentSelection}
        onStartSimultaneousAnalysis={startMultiAgentAnalysis}
        configOptions={configOptions}
        onChangeConfig={setConfigOptions}
      />

      {/* 3. Agent Workspace Suite Modal */}
      <AgentWorkspaceModal
        agent={focusedAgentWorkspace}
        isOpen={!!focusedAgentWorkspace}
        onClose={() => setFocusedAgentWorkspace(null)}
        status={focusedAgentWorkspace ? (agentStatuses[focusedAgentWorkspace.id] || 'idle') : 'idle'}
        onRunSingleAgent={handleRunSingleAgent}
        onOpenResultsTab={(agentId) => {
          setActiveResultTab(agentId);
          setActiveScreen('agent_results');
        }}
        hasResults={!!analysisRun}
      />
    </div>
  );
}
