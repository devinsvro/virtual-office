/**
 * Clinical Virtual Office Portal Types
 * Authoritative schemas for the 6 specialized healthcare AI agents
 */

export type AgentStatus = 'idle' | 'selected' | 'processing' | 'completed' | 'error';

export interface PatientRecord {
  id: string;
  patient_persona: string;
  age_group: '18-35' | '36-50' | '51-64' | '65+';
  visit_type: 'Inpatient' | 'Outpatient' | 'Emergency Department' | 'Telehealth' | 'Ambulatory Surgery';
  service_line: 'Cardiology' | 'Oncology' | 'Orthopedics' | 'Pediatrics' | 'Emergency' | 'Neurology' | 'Primary Care' | 'Obstetrics';
  patient_satisfaction: number; // 1 to 5
  communication_rating: number; // 1 to 5
  follow_up_compliance: 'Yes' | 'No' | 'Partial';
  complaint_severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  patient_portal_usage: 'Active' | 'Inactive' | 'Never Registered';
  readmission_risk: 'Low' | 'Moderate' | 'High';
  ai_risk_flags: 'None' | 'Hallucination Risk' | 'Bias Review' | 'Human Review Required';
  patient_comments: string;
  timestamp?: string;
  vulnerability_factors?: string[]; // e.g. ["Older Adult", "Rural", "Limited English Proficiency", "Disability", "Low Digital Literacy"]
}

// Agent 1: Patient Feedback Insight Agent
export interface FeedbackInsightResult {
  recordId: string;
  theme: 'Communication' | 'Scheduling' | 'Wait Time' | 'Technology / Patient Portal' | 'Billing' | 'Clinical Care' | 'Discharge / Follow-Up' | 'Accessibility / Equity' | 'Mixed or Ambiguous';
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  reasoning: string;
  operationalIssue: string;
  riskOrBiasConcern: string;
  recommendedAction: string;
}

// Agent 2: Patient Experience Monitoring Agent
export interface ExperienceMonitoringResult {
  recordId: string;
  primaryTheme: string;
  secondaryThemes: string[];
  operationalBottleneck: string;
  equityAndAccessibility: {
    flags: string[];
    details: string;
  };
  riskAssessment: {
    overall: 'Low' | 'Moderate' | 'High';
    categories: {
      patientSafety: 'Low' | 'Moderate' | 'High';
      reputational: 'Low' | 'Moderate' | 'High';
      compliance: 'Low' | 'Moderate' | 'High';
      equity: 'Low' | 'Moderate' | 'High';
    };
    explanation: string;
  };
  managerialRecommendation: string;
}

// Agent 3: Complaint Triage Assistant
export type SeverityLevel = 'LEVEL 1 – Low' | 'LEVEL 2 – Moderate' | 'LEVEL 3 – High' | 'LEVEL 4 – Critical';

export type EscalationDestination =
  | 'Patient Experience Team'
  | 'Nursing Leadership'
  | 'Physician Leadership'
  | 'Quality Improvement Team'
  | 'Compliance Office'
  | 'Information Technology'
  | 'Revenue Cycle / Billing'
  | 'Accessibility Coordinator'
  | 'Risk Management'
  | 'Executive Review';

export interface ComplaintTriageResult {
  recordId: string;
  primaryCategory: string;
  secondaryCategories: string[];
  severityLevel: SeverityLevel;
  severityReasoning: string;
  riskDetection: {
    flaggedRisks: Array<'Patient Safety Risk' | 'Clinical Risk' | 'Compliance Risk' | 'Privacy Risk' | 'Accessibility Risk' | 'Equity Risk' | 'Reputational Risk' | 'Operational Risk'>;
    explanation: string;
  };
  escalationRoute: EscalationDestination;
  requiresHumanIntervention: boolean;
  triageUrgency: 'Immediate (Within 1h)' | 'Urgent (Within 4h)' | 'Standard (24-48h)' | 'Routine Review';
}

// Agent 4: Hospital Manager Decision Support Agent
export interface ManagerDecisionResult {
  recordId: string;
  mainProblem: string;
  managementPriority: 'Low' | 'Medium' | 'High';
  priorityReasoning: string;
  recommendedActions: string[];
  humanReviewNeeded: boolean;
  humanReviewReason: string;
  aiRiskFlagAnalysis?: string;
  status?: 'Pending Review' | 'Approved' | 'Overridden';
  humanNotes?: string;
}

// Agent 5: Healthcare Analytics Agent
export interface AnalyticsWordFreq {
  text: string;
  value: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface HealthcareAnalyticsResult {
  overview: {
    totalComments: number;
    avgSatisfaction: number;
    avgCommunication: number;
    followUpComplianceRate: number; // percentage
    serviceLinesCount: number;
  };
  satisfactionInsights: {
    distribution: Record<number, number>; // 1: count, 2: count...
    byServiceLine: Record<string, { avg: number; count: number }>;
    byVisitType: Record<string, { avg: number; count: number }>;
    byPersona: Record<string, { avg: number; count: number }>;
  };
  nlpAnalysis: {
    topThemes: Array<{ theme: string; count: number; percentage: number }>;
    frequentKeywords: Array<{ word: string; count: number }>;
    wordCloud: AnalyticsWordFreq[];
  };
  hiddenProblems: {
    serviceLinesHighComplaints: Array<{ serviceLine: string; complaintRate: number; keyDriver: string }>;
    communicationBottlenecks: string[];
    technologyIssues: string[];
    schedulingIssues: string[];
    waitTimeComplaints: string[];
  };
  aiRiskMonitoring: {
    hallucinationTraps: Array<{ recordId: string; comment: string; concern: string }>;
    biasRelatedCases: Array<{ recordId: string; comment: string; concern: string }>;
    humanReviewRequiredCount: number;
    humanReviewCases: string[];
  };
  executiveRecommendations: {
    top5Priorities: string[];
    quickWins3Months: string[];
    longTermAIOpportunities: string[];
  };
}

// Agent 6: Healthcare Rescheduling Urgency Agent
export type ReschedulingTier =
  | 'Tier 1: EMERGENCY (Immediate Follow-Up)'
  | 'Tier 2: URGENT (Same Day Visit / Within 5-10 Hours)'
  | 'Tier 3: Semi-Urgent (Within 2-4 Days)'
  | 'Tier 4: Standard Queue (Whenever Available)';

export interface ReschedulingUrgencyResult {
  recordId: string;
  reschedulingTier: ReschedulingTier;
  recommendedAction: string;
  prerequisites: string[];
  careVenue: 'Emergency Department' | 'Urgent Care Center' | 'Same-Day Primary Care Hold' | 'Specialty Clinic' | 'Telehealth Virtual Triage';
  simulatedBookingStatus: 'Pending Action' | 'Dispatched to 911/ER' | 'Hold Placed' | 'Slot Reserved' | 'Queued';
  bookedSlotTime?: string;
  clinicalAcuityReasoning: string;
}

// Complete Multi-Agent Analysis Output Container
export interface MultiAgentAnalysisRun {
  runId: string;
  timestamp: string;
  datasetName: string;
  recordCount: number;
  activeAgentIds: string[];
  agent1Feedback: FeedbackInsightResult[];
  agent2Experience: ExperienceMonitoringResult[];
  agent3ComplaintTriage: ComplaintTriageResult[];
  agent4ManagerDecision: ManagerDecisionResult[];
  agent5Analytics: HealthcareAnalyticsResult | null;
  agent6Rescheduling: ReschedulingUrgencyResult[];
  combinedInsights: CombinedExecutiveInsights;
}

export interface CombinedExecutiveInsights {
  consensusFindings: Array<{
    title: string;
    description: string;
    supportingAgents: string[];
    affectedServiceLines: string[];
    confidence: 'High' | 'Moderate';
  }>;
  conflictingInterpretations: Array<{
    recordId: string;
    issue: string;
    agentPerspectives: { agentName: string; observation: string }[];
    recommendedResolution: string;
  }>;
  highPriorityHumanQueue: Array<{
    recordId: string;
    patientPersona: string;
    serviceLine: string;
    severity: string;
    riskSummary: string;
    recommendedEscalation: string;
    humanReviewStatus: 'Unreviewed' | 'Accepted' | 'Overridden';
    humanSignOffNotes?: string;
  }>;
  recommendedFollowUps: string[];
  dataGapsAndMissingInfo: string[];
}

export interface AgentDefinition {
  id: string;
  roomNumber: number;
  name: string;
  agentRole: string;
  specialistName: string;
  title: string;
  avatarColor: string;
  roomTheme: string;
  shortDescription: string;
  keyResponsibilities: string[];
  toolsProvided: string[];
  tasksPreview: string[];
}
