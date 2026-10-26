import React, { useState, useRef } from 'react';
import { PREDEFINED_COHORTS } from '../data/sampleDatasets';
import { parseAndValidateCSV, exportDatasetToCSV, CSVValidationResult } from '../utils/csvHelper';
import { PatientRecord } from '../types/clinical';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Download,
  Info,
  X,
  Database,
  Table,
  Check
} from 'lucide-react';

interface DataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRecords: PatientRecord[];
  currentDatasetName: string;
  onApplyDataset: (records: PatientRecord[], datasetName: string) => void;
}

export const DataUploadModal: React.FC<DataUploadModalProps> = ({
  isOpen,
  onClose,
  currentRecords,
  currentDatasetName,
  onApplyDataset
}) => {
  const [selectedCohortId, setSelectedCohortId] = useState<string>('cohort_comprehensive');
  const [dragActive, setDragActive] = useState(false);
  const [validationResult, setValidationResult] = useState<CSVValidationResult | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [activeTab, setActiveTab] = useState<'sample_cohorts' | 'upload_custom' | 'preview_data'>('sample_cohorts');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a standard .csv formatted file.');
      return;
    }

    setIsProcessingFile(true);
    try {
      const text = await file.text();
      const res = await parseAndValidateCSV(text);
      setValidationResult(res);
      setActiveTab('preview_data');
    } catch (e: any) {
      alert(`Error reading file: ${e.message}`);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const applySelectedPredefinedCohort = (cohortId: string) => {
    const cohort = PREDEFINED_COHORTS.find(c => c.id === cohortId);
    if (cohort) {
      onApplyDataset(cohort.records, cohort.name);
      onClose();
    }
  };

  const applyUploadedDataset = () => {
    if (validationResult && validationResult.records.length > 0) {
      onApplyDataset(validationResult.records, 'Uploaded Clinical Dataset');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dataset Management & Privacy Safeguards</h2>
              <p className="text-xs text-slate-400">
                Load certified synthetic cohorts or upload an authorized clinical CSV file
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HIPAA & Synthetic Data Safeguards Notice */}
        <div className="px-6 py-2.5 bg-emerald-950/40 border-b border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-emerald-200">De-Identification Safeguard:</strong> This clinical portal operates exclusively on de-identified, synthetic, or authorized research cohorts. Uploaded records are evaluated locally in memory. No direct PHI (names, SSNs, phone numbers) should be uploaded.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 flex items-center gap-4 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('sample_cohorts')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'sample_cohorts'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Pre-Configured Clinical Cohorts (Instant Test)
          </button>
          <button
            onClick={() => setActiveTab('upload_custom')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload_custom'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload Custom CSV File
          </button>
          {validationResult && (
            <button
              onClick={() => setActiveTab('preview_data')}
              className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'preview_data'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              CSV Validation & Preview ({validationResult.rowCount} Rows)
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'sample_cohorts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Select a tailored synthetic cohort calibrated to test all 6 AI agents:
                </span>
                <button
                  onClick={() => exportDatasetToCSV(currentRecords, 'sample_clinica_template.csv')}
                  className="text-xs text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV Template</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {PREDEFINED_COHORTS.map((cohort) => {
                  const isSelected = selectedCohortId === cohort.id;
                  return (
                    <div
                      key={cohort.id}
                      onClick={() => setSelectedCohortId(cohort.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500/70 ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-white">{cohort.name}</h3>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                              {cohort.caseCount} Patient Cases
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1.5">{cohort.description}</p>
                          <p className="text-[11px] text-emerald-400 mt-2 font-medium">
                            Focus: {cohort.highlightedFocus}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                              : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'upload_custom' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-emerald-400 bg-emerald-950/20'
                    : 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="p-3 bg-slate-800 rounded-2xl mb-3 text-emerald-400">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-white">
                  {isProcessingFile ? 'Analyzing CSV File...' : 'Click to Upload or Drag and Drop CSV'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Must be comma-delimited. Required fields include patient comments, satisfaction, visit type, service line, and complaint severity.
                </p>
              </div>

              {/* Data requirements summary */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <span className="font-semibold text-slate-200 block">Recommended CSV Schema Headers:</span>
                <p className="font-mono text-[11px] text-teal-300">
                  id, patient_persona, age_group, visit_type, service_line, patient_satisfaction, communication_rating, follow_up_compliance, complaint_severity, patient_portal_usage, readmission_risk, ai_risk_flags, patient_comments
                </p>
              </div>
            </div>
          )}

          {activeTab === 'preview_data' && validationResult && (
            <div className="space-y-5">
              {/* Validation Status Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Total Rows Detected</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{validationResult.rowCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Detected Columns</span>
                  <span className="text-lg font-bold font-mono text-teal-400">{validationResult.detectedColumns.length}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Privacy Audit</span>
                  <span className={`text-xs font-semibold ${validationResult.privacySafeguardsPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {validationResult.privacySafeguardsPassed ? 'Passed (Synthetic / Safe)' : 'Warnings Flagged'}
                  </span>
                </div>
              </div>

              {/* Warnings if any */}
              {validationResult.warnings.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Data Validation Warnings:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {validationResult.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detected Columns & Sample Values */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Detected Column Schema</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {validationResult.detectedColumns.map((col, idx) => (
                    <div key={idx} className="p-2 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                      <span className="font-mono font-medium text-slate-200 block truncate">{col.name}</span>
                      <span className="text-[11px] text-slate-400">{col.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Data Preview (First 5 Rows)</h4>
                <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                      <tr>
                        <th className="p-2.5">ID</th>
                        <th className="p-2.5">Persona</th>
                        <th className="p-2.5">Service</th>
                        <th className="p-2.5">Score</th>
                        <th className="p-2.5">Severity</th>
                        <th className="p-2.5">Comment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {validationResult.records.slice(0, 5).map((r) => (
                        <tr key={r.id} className="hover:bg-slate-900/40">
                          <td className="p-2.5 font-mono text-teal-400">{r.id}</td>
                          <td className="p-2.5 truncate max-w-[140px]">{r.patient_persona}</td>
                          <td className="p-2.5">{r.service_line}</td>
                          <td className="p-2.5 font-mono">{r.patient_satisfaction}/5</td>
                          <td className="p-2.5">{r.complaint_severity}</td>
                          <td className="p-2.5 truncate max-w-[240px] text-slate-400">{r.patient_comments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Currently loaded: <span className="font-medium text-white">{currentDatasetName}</span> ({currentRecords.length} records)
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {activeTab === 'preview_data' && validationResult ? (
              <button
                onClick={applyUploadedDataset}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Apply Uploaded Dataset ({validationResult.rowCount} Records)
              </button>
            ) : (
              <button
                onClick={() => applySelectedPredefinedCohort(selectedCohortId)}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Load Selected Cohort
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
