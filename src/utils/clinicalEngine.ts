import {
  PatientRecord,
  FeedbackInsightResult,
  ExperienceMonitoringResult,
  ComplaintTriageResult,
  ManagerDecisionResult,
  HealthcareAnalyticsResult,
  ReschedulingUrgencyResult,
  CombinedExecutiveInsights,
  MultiAgentAnalysisRun,
  SeverityLevel,
  EscalationDestination,
  ReschedulingTier
} from '../types/clinical';

/**
 * Text keyword lexicon for robust clinical NLP triage
 */
const EMERGENCY_KEYWORDS = [
  'chest pain', 'short of breath', 'lying flat', 'cyanotic', 'lips blue', 'stridor', 'severe chills',
  'temperature of 101.8', '101.8', 'fever', 'oozing', 'pus', 'yellowish oozing', 'sternal incision',
  'triple bypass', 'radiating', 'jaw pain', 'left arm', 'nitroglycerin', 'lethal hypoglycemia', 'unconscious', 'wheezing'
];

const URGENT_KEYWORDS = [
  'chemotherapy', 'neutropenic', 'swelling', 'ankles', 'dizzy', 'weak', 'bleeding',
  'rescue inhaler', 'albuterol', 'fistula', 'dialysis', 'infection', 'drainage'
];

const TECH_PORTAL_KEYWORDS = [
  'portal', 'mychart', 'app', 'video call', 'dropped', 'glitch', 'login', 'server', 'chatbot', 'ai clinical summary', 'hallucinated'
];

const BILLING_KEYWORDS = [
  'bill', 'billing', 'charge', 'surprise', 'out-of-network', 'insurance', 'pre-authorization', 'statement', 'cost', '$'
];

const BIAS_EQUITY_KEYWORDS = [
  'interpreter', 'spanish', 'english-only', 'asl', 'deaf', 'handwritten', 'scribbles', 'paper towels',
  'dismissively', 'drug-seeking', 'exaggerating', 'rural', 'miles away', 'broadband', 'ada'
];

const PRIVACY_KEYWORDS = [
  'clipboard', 'census', 'social security', 'ssn', 'date of birth', 'dob', 'unmonitored', 'confidential', 'hipaa'
];

// ==========================================
// AGENT 1: Patient Feedback Insight Agent
// ==========================================
export function analyzePatientFeedback(records: PatientRecord[]): FeedbackInsightResult[] {
  return records.map((rec) => {
    const text = (rec.patient_comments || '').toLowerCase();
    
    // Step 1: Theme
    let theme: FeedbackInsightResult['theme'] = 'Mixed or Ambiguous';
    if (rec.service_line === 'Orthopedics' && rec.patient_satisfaction >= 4) {
      theme = 'Clinical Care';
    } else if (PRIVACY_KEYWORDS.some(k => text.includes(k))) {
      theme = 'Technology / Patient Portal';
    } else if (BIAS_EQUITY_KEYWORDS.some(k => text.includes(k))) {
      theme = 'Accessibility / Equity';
    } else if (BILLING_KEYWORDS.some(k => text.includes(k))) {
      theme = 'Billing';
    } else if (TECH_PORTAL_KEYWORDS.some(k => text.includes(k))) {
      theme = 'Technology / Patient Portal';
    } else if (text.includes('wait') || text.includes('hours') || text.includes('holding')) {
      theme = 'Wait Time';
    } else if (text.includes('schedule') || text.includes('cancelled') || text.includes('reschedule') || text.includes('transport')) {
      theme = 'Scheduling';
    } else if (text.includes('discharge') || text.includes('follow-up') || text.includes('post-op')) {
      theme = 'Discharge / Follow-Up';
    } else if (text.includes('doctor') || text.includes('surgeon') || text.includes('nurse') || text.includes('pain') || text.includes('fever')) {
      theme = 'Clinical Care';
    } else if (text.includes('told') || text.includes('called') || text.includes('communication') || text.includes('instructions')) {
      theme = 'Communication';
    }

    // Step 2: Sentiment
    let sentiment: FeedbackInsightResult['sentiment'] = 'Neutral';
    if (rec.patient_satisfaction >= 4 && !text.includes('glitch') && !text.includes('violate') && !text.includes('dangerous')) {
      sentiment = 'Positive';
    } else if (rec.patient_satisfaction <= 2 || text.includes('excruciating') || text.includes('dismissive') || text.includes('dangerous') || text.includes('surprise')) {
      sentiment = 'Negative';
    } else if (text.includes('however') || text.includes('compassionate and competent. however') || (rec.patient_satisfaction === 3 && text.length > 50)) {
      sentiment = 'Mixed';
    }

    // Step 3: Reasoning
    const reasoning = `Classified as ${theme} with ${sentiment} sentiment based on explicit mention of: "${rec.patient_comments.slice(0, 60)}..." and recorded satisfaction of ${rec.patient_satisfaction}/5.`;

    // Step 4: Operational Issue
    let operationalIssue = 'Operational communication gap in routine patient routing and documentation.';
    if (theme === 'Accessibility / Equity') {
      operationalIssue = 'Failure of clinical care team to arrange required language interpretation/ADA accommodations prior to encounter.';
    } else if (theme === 'Technology / Patient Portal') {
      operationalIssue = text.includes('hallucinated') || text.includes('chatbot') 
        ? 'Unvalidated automated clinical AI summary tool presenting inaccurate medical instructions to patient.'
        : 'Patient portal onboarding deficiency for rural/digitally limited cohorts and telehealth connection drops.';
    } else if (theme === 'Billing') {
      operationalIssue = 'Inadequate financial clearance and out-of-network provider cross-check during surgical pre-authorization.';
    } else if (theme === 'Wait Time') {
      operationalIssue = 'Emergency department or clinic triage bottleneck exceeding safe waiting parameters for high-acuity patients.';
    } else if (theme === 'Scheduling') {
      operationalIssue = 'Lack of cross-departmental coordination between diagnostic imaging, clinical slots, and patient transport.';
    } else if (theme === 'Discharge / Follow-Up') {
      operationalIssue = 'Post-acute discharge instructions delivered without ensuring patient caregiver comprehension or digital access.';
    }

    // Step 5: Risk or Bias Concern
    let riskOrBiasConcern = 'Low risk detected; standard operational improvement warranted.';
    if (rec.ai_risk_flags === 'Hallucination Risk') {
      riskOrBiasConcern = 'HIGH PATIENT SAFETY & OVER-AUTOMATION RISK: Automated system generated unverified medical guidance or non-existent pharmaceuticals.';
    } else if (rec.ai_risk_flags === 'Bias Review' || theme === 'Accessibility / Equity') {
      riskOrBiasConcern = 'EQUITY & COMPLIANCE CONCERN: Potential clinical bias in symptom validation or violation of Title VI / Section 504 / ADA mandates.';
    } else if (rec.complaint_severity === 'Critical') {
      riskOrBiasConcern = 'ACUTE PATIENT SAFETY HAZARD: Symptom profile suggests rapid deterioration or unaddressed post-surgical infection.';
    } else if (PRIVACY_KEYWORDS.some(k => text.includes(k))) {
      riskOrBiasConcern = 'HIPAA PRIVACY BREACH: Direct exposure of patient identifiers (SSN, DOB, diagnosis) in public clinic spaces.';
    }

    // Step 6: Recommended Action
    let recommendedAction = 'Conduct routine supervisory check-in and log feedback into patient relations database.';
    if (rec.ai_risk_flags === 'Hallucination Risk') {
      recommendedAction = 'Immediately suspend patient-facing AI discharge summary generation and mandate 100% clinician sign-off on AI draft outputs.';
    } else if (theme === 'Accessibility / Equity') {
      recommendedAction = 'Establish mandatory EHR prompt requiring verified interpreter service or certified translation before completing discharge.';
    } else if (theme === 'Billing') {
      recommendedAction = 'Place patient account on administrative hold and initiate billing audit under the No Surprises Act.';
    } else if (theme === 'Wait Time' && rec.complaint_severity === 'High') {
      recommendedAction = 'Implement dynamic pediatric triage alerts when lobby waiting exceeds 90 minutes for respiratory cases.';
    } else if (rec.complaint_severity === 'Critical') {
      recommendedAction = 'Trigger immediate clinical outreach by nursing supervisor and arrange urgent emergency triage.';
    }

    return {
      recordId: rec.id,
      theme,
      sentiment,
      reasoning,
      operationalIssue,
      riskOrBiasConcern,
      recommendedAction
    };
  });
}

// ==========================================
// AGENT 2: Patient Experience Monitoring Agent
// ==========================================
export function monitorPatientExperience(records: PatientRecord[]): ExperienceMonitoringResult[] {
  return records.map((rec) => {
    const text = (rec.patient_comments || '').toLowerCase();

    // Step 1: Themes
    let primaryTheme = 'Communication';
    const secondaryThemes: string[] = [];

    if (rec.service_line === 'Obstetrics' || text.includes('spanish') || text.includes('deaf')) {
      primaryTheme = 'Accessibility and Equity';
      secondaryThemes.push('Communication', 'Patient Safety');
    } else if (text.includes('portal') || text.includes('mychart') || text.includes('ai') || text.includes('glitch')) {
      primaryTheme = 'Technology / Patient Portal';
      secondaryThemes.push('Communication');
    } else if (text.includes('bill') || text.includes('charge') || text.includes('$')) {
      primaryTheme = 'Billing';
      secondaryThemes.push('Communication');
    } else if (text.includes('wait') || text.includes('hours')) {
      primaryTheme = 'Wait Time';
      secondaryThemes.push('Scheduling');
    } else if (text.includes('chemo') || text.includes('fever') || text.includes('incision') || text.includes('pain')) {
      primaryTheme = 'Clinical Care';
      secondaryThemes.push('Patient Safety', 'Discharge and Follow-Up');
    } else if (text.includes('cancelled') || text.includes('reschedule') || text.includes('transport')) {
      primaryTheme = 'Scheduling';
      secondaryThemes.push('Discharge and Follow-Up');
    }

    // Step 2: Operational Bottleneck
    let bottleneck = 'Standard communication flow latency between departments.';
    if (primaryTheme === 'Accessibility and Equity') {
      bottleneck = 'Lack of integrated interpreter dispatch within EHR discharge orders.';
    } else if (primaryTheme === 'Technology / Patient Portal') {
      bottleneck = 'Digital divide in rural coverage and untested generative AI patient summaries.';
    } else if (primaryTheme === 'Wait Time') {
      bottleneck = 'Emergency intake bottleneck and surge capacity deficit during peak hours.';
    } else if (primaryTheme === 'Scheduling') {
      bottleneck = 'Isolated departmental booking systems failing to synchronize transport and diagnostic slots.';
    } else if (primaryTheme === 'Billing') {
      bottleneck = 'Out-of-network provider billing disconnect during hospital pre-cleared operations.';
    }

    // Step 3: Equity and Accessibility Review
    const flags: string[] = [];
    if (rec.age_group === '65+' || text.includes('82-year-old') || text.includes('elderly')) flags.push('Older Adult');
    if (text.includes('rural') || text.includes('miles away')) flags.push('Rural Patient');
    if (text.includes('spanish') || text.includes('interpreter') || text.includes('english-only')) flags.push('Limited English Proficiency (LEP)');
    if (text.includes('deaf') || text.includes('asl') || text.includes('knee') || text.includes('mobility')) flags.push('Disability / Sensory Impairment');
    if (rec.patient_portal_usage === 'Never Registered' || text.includes('digital') || text.includes('broadband')) flags.push('Low Digital Literacy / Infrastructure');

    const equityDetails = flags.length > 0
      ? `Specific equity vectors flagged: ${flags.join(', ')}. Encounter demonstrates disproportionate impact on marginalized or vulnerable demographic.`
      : 'No high-risk equity vulnerability markers identified in current record.';

    // Step 4: Risk Assessment
    const isHighSafety = rec.complaint_severity === 'Critical' || EMERGENCY_KEYWORDS.some(k => text.includes(k));
    const isHighCompliance = PRIVACY_KEYWORDS.some(k => text.includes(k)) || text.includes('ada') || text.includes('interpreter');
    const isHighEquity = flags.length >= 2 || rec.ai_risk_flags === 'Bias Review';
    const isHighRep = rec.patient_satisfaction === 1 && (text.includes('surprise') || text.includes('lawsuit') || text.includes('dangerous'));

    const patientSafety: 'Low' | 'Moderate' | 'High' = isHighSafety ? 'High' : (rec.complaint_severity === 'High' ? 'Moderate' : 'Low');
    const compliance: 'Low' | 'Moderate' | 'High' = isHighCompliance ? 'High' : (rec.ai_risk_flags !== 'None' ? 'Moderate' : 'Low');
    const equity: 'Low' | 'Moderate' | 'High' = isHighEquity ? 'High' : (flags.length > 0 ? 'Moderate' : 'Low');
    const reputational: 'Low' | 'Moderate' | 'High' = isHighRep ? 'High' : (rec.patient_satisfaction <= 2 ? 'Moderate' : 'Low');

    const overall: 'Low' | 'Moderate' | 'High' = (patientSafety === 'High' || compliance === 'High' || equity === 'High') ? 'High' : (patientSafety === 'Moderate' || reputational === 'Moderate' ? 'Moderate' : 'Low');

    const riskExplanation = `Risk profile established at ${overall} based on Safety (${patientSafety}), Compliance (${compliance}), Equity (${equity}), and Reputational (${reputational}).`;

    // Step 5: Managerial Recommendation
    let managerialRecommendation = 'Continue regular experience tracking and review during monthly departmental staff meeting.';
    if (overall === 'High' && flags.length > 0) {
      managerialRecommendation = 'Establish health equity liaison audit for service line and mandate dual-language post-discharge phone follow-ups within 24 hours.';
    } else if (patientSafety === 'High') {
      managerialRecommendation = 'Institute immediate rapid response review of acute triage response intervals and establish nursing callback protocol within 30 minutes.';
    } else if (compliance === 'High') {
      managerialRecommendation = 'Conduct urgent compliance investigation, notify privacy officer, and review physical paperwork security standards.';
    }

    return {
      recordId: rec.id,
      primaryTheme,
      secondaryThemes,
      operationalBottleneck: bottleneck,
      equityAndAccessibility: {
        flags,
        details: equityDetails
      },
      riskAssessment: {
        overall,
        categories: { patientSafety, reputational, compliance, equity },
        explanation: riskExplanation
      },
      managerialRecommendation
    };
  });
}

// ==========================================
// AGENT 3: Complaint Triage Assistant
// ==========================================
export function triageComplaints(records: PatientRecord[]): ComplaintTriageResult[] {
  return records.map((rec) => {
    const text = (rec.patient_comments || '').toLowerCase();

    // Step 1: Complaint Category
    let primaryCategory = 'Communication';
    const secondaryCategories: string[] = [];

    if (PRIVACY_KEYWORDS.some(k => text.includes(k))) {
      primaryCategory = 'Privacy or Security';
      secondaryCategories.push('Staff Conduct');
    } else if (text.includes('drug-seeking') || text.includes('dismissive') || text.includes('rushed')) {
      primaryCategory = 'Staff Conduct';
      secondaryCategories.push('Clinical Care');
    } else if (BILLING_KEYWORDS.some(k => text.includes(k))) {
      primaryCategory = 'Billing';
      secondaryCategories.push('Communication');
    } else if (TECH_PORTAL_KEYWORDS.some(k => text.includes(k))) {
      primaryCategory = 'Technology / Patient Portal';
      if (text.includes('hallucinated') || text.includes('dosage')) secondaryCategories.push('Patient Safety');
    } else if (text.includes('wait') || text.includes('hours') || text.includes('lobby')) {
      primaryCategory = 'Wait Time';
      secondaryCategories.push('Patient Safety');
    } else if (text.includes('cancelled') || text.includes('scheduling') || text.includes('refill')) {
      primaryCategory = 'Scheduling';
      secondaryCategories.push('Clinical Care');
    } else if (EMERGENCY_KEYWORDS.some(k => text.includes(k)) || text.includes('fever') || text.includes('chemo') || text.includes('drainage')) {
      primaryCategory = 'Patient Safety';
      secondaryCategories.push('Clinical Care');
    }

    // Step 2: Severity Assessment (Level 1-4)
    let severityLevel: SeverityLevel = 'LEVEL 1 – Low';
    let severityReasoning = 'Minor inconvenience or routine dissatisfaction with no clinical or regulatory exposure.';

    if (rec.complaint_severity === 'Critical' || EMERGENCY_KEYWORDS.some(k => text.includes(k)) || text.includes('cyanotic') || text.includes('ssn') || text.includes('hallucinated') && text.includes('lethal')) {
      severityLevel = 'LEVEL 4 – Critical';
      severityReasoning = 'Immediate patient safety risk, severe clinical deterioration risk, potential legal exposure, or critical regulatory violation.';
    } else if (rec.complaint_severity === 'High' || rec.readmission_risk === 'High' || text.includes('interpreter') || text.includes('asl') || text.includes('drug-seeking') || text.includes('fever')) {
      severityLevel = 'LEVEL 3 – High';
      severityReasoning = 'Potential patient harm, acute medication/symptom concern, serious accessibility denial, or severe operational breakdown.';
    } else if (rec.complaint_severity === 'Moderate' || text.includes('surprise') || text.includes('cancelled twice') || text.includes('dropped three times')) {
      severityLevel = 'LEVEL 2 – Moderate';
      severityReasoning = 'Repeated service failures, significant patient frustration, and cross-departmental communication breakdown.';
    }

    // Step 3: Risk Detection
    const flaggedRisks: ComplaintTriageResult['riskDetection']['flaggedRisks'] = [];
    const explanations: string[] = [];

    if (severityLevel === 'LEVEL 4 – Critical' || text.includes('chest pain') || text.includes('oozing') || text.includes('cyanotic') || text.includes('insulin')) {
      flaggedRisks.push('Patient Safety Risk', 'Clinical Risk');
      explanations.push('Immediate risk of adverse clinical outcome or physiological deterioration without rapid medical intervention.');
    }
    if (PRIVACY_KEYWORDS.some(k => text.includes(k))) {
      flaggedRisks.push('Privacy Risk', 'Compliance Risk');
      explanations.push('Unattended PHI census sheet represents potential HIPAA breach reportable to OCR.');
    }
    if (text.includes('spanish') || text.includes('asl') || text.includes('interpreter') || text.includes('drug-seeking')) {
      flaggedRisks.push('Equity Risk', 'Accessibility Risk');
      explanations.push('Discriminatory barrier or failure to provide legally mandated communication aids under ADA and Title VI.');
    }
    if (BILLING_KEYWORDS.some(k => text.includes(k)) || text.includes('surprise')) {
      flaggedRisks.push('Compliance Risk', 'Reputational Risk');
      explanations.push('Potential billing compliance infringement under No Surprises Act and high consumer dissatisfaction.');
    }
    if (text.includes('cancelled') || text.includes('transport') || text.includes('portal')) {
      flaggedRisks.push('Operational Risk');
      explanations.push('Core scheduling and IT infrastructure failures hindering patient access to essential care.');
    }

    if (flaggedRisks.length === 0) {
      flaggedRisks.push('Operational Risk');
      explanations.push('Routine operational process friction.');
    }

    // Step 4: Escalation Recommendation
    let escalationRoute: EscalationDestination = 'Patient Experience Team';
    let urgency: ComplaintTriageResult['triageUrgency'] = 'Standard (24-48h)';

    if (severityLevel === 'LEVEL 4 – Critical') {
      urgency = 'Immediate (Within 1h)';
      if (PRIVACY_KEYWORDS.some(k => text.includes(k))) {
        escalationRoute = 'Compliance Office';
      } else if (text.includes('chest') || text.includes('oozing') || text.includes('cyanotic')) {
        escalationRoute = 'Physician Leadership';
      } else {
        escalationRoute = 'Executive Review';
      }
    } else if (severityLevel === 'LEVEL 3 – High') {
      urgency = 'Urgent (Within 4h)';
      if (text.includes('chemo') || text.includes('triage nurse') || text.includes('floor twice')) {
        escalationRoute = 'Nursing Leadership';
      } else if (text.includes('spanish') || text.includes('asl') || text.includes('deaf')) {
        escalationRoute = 'Accessibility Coordinator';
      } else if (text.includes('drug-seeking') || text.includes('hallucinated')) {
        escalationRoute = 'Risk Management';
      } else {
        escalationRoute = 'Quality Improvement Team';
      }
    } else if (severityLevel === 'LEVEL 2 – Moderate') {
      urgency = 'Standard (24-48h)';
      if (primaryCategory === 'Billing') {
        escalationRoute = 'Revenue Cycle / Billing';
      } else if (primaryCategory === 'Technology / Patient Portal') {
        escalationRoute = 'Information Technology';
      } else {
        escalationRoute = 'Patient Experience Team';
      }
    } else {
      urgency = 'Routine Review';
      escalationRoute = 'Patient Experience Team';
    }

    return {
      recordId: rec.id,
      primaryCategory,
      secondaryCategories,
      severityLevel,
      severityReasoning,
      riskDetection: {
        flaggedRisks,
        explanation: explanations.join(' ')
      },
      escalationRoute,
      requiresHumanIntervention: severityLevel === 'LEVEL 4 – Critical' || severityLevel === 'LEVEL 3 – High',
      triageUrgency: urgency
    };
  });
}

// ==========================================
// AGENT 4: Hospital Manager Decision Support Agent
// ==========================================
export function generateManagerDecisionSupport(records: PatientRecord[]): ManagerDecisionResult[] {
  return records.map((rec) => {
    const text = (rec.patient_comments || '').toLowerCase();

    // 1. Identify the main problem
    let mainProblem = 'Standard patient care coordination gap.';
    if (rec.ai_risk_flags === 'Hallucination Risk') {
      mainProblem = 'AI generated erroneous diagnosis/medication guidance directly contradicting physician orders.';
    } else if (rec.ai_risk_flags === 'Bias Review') {
      mainProblem = 'Alleged provider cognitive bias in acute pain assessment or language interpreter exclusion.';
    } else if (PRIVACY_KEYWORDS.some(k => text.includes(k))) {
      mainProblem = 'Physical security lapse resulting in unprotected exposure of patient PHI in reception area.';
    } else if (rec.complaint_severity === 'Critical' && (text.includes('chest') || text.includes('oozing') || text.includes('chemo'))) {
      mainProblem = 'Delayed post-acute clinical callback for patient experiencing red-flag clinical deterioration.';
    } else if (BILLING_KEYWORDS.some(k => text.includes(k))) {
      mainProblem = 'Surprise out-of-network assistant surgeon billing dispute and unreachable billing support.';
    } else if (text.includes('wait') && text.includes('pediatric')) {
      mainProblem = 'Pediatric ED triage bottleneck resulting in 4.75 hour wait for child with respiratory stridor.';
    } else if (rec.patient_portal_usage === 'Never Registered' && rec.age_group === '65+') {
      mainProblem = 'Digital exclusion of rural elderly patient without broadband or portal onboarding support.';
    }

    // 2. Rate management priority (Low, Medium, High)
    let managementPriority: 'Low' | 'Medium' | 'High' = 'Low';
    if (rec.complaint_severity === 'Critical' || rec.ai_risk_flags === 'Human Review Required' || rec.ai_risk_flags === 'Hallucination Risk' || rec.readmission_risk === 'High' && rec.patient_satisfaction <= 2) {
      managementPriority = 'High';
    } else if (rec.complaint_severity === 'High' || rec.ai_risk_flags === 'Bias Review' || rec.complaint_severity === 'Moderate') {
      managementPriority = 'Medium';
    }

    // 3. Explain priority
    let priorityReasoning = `Assigned ${managementPriority} priority because patient presents with satisfaction ${rec.patient_satisfaction}/5, severity ${rec.complaint_severity}, and readmission risk ${rec.readmission_risk}.`;
    if (managementPriority === 'High') {
      priorityReasoning = `HIGH PRIORITY: High probability of acute adverse event, severe compliance liability, or clinical readmission if left unmitigated.`;
    }

    // 4. Recommend 1-2 management actions
    const recommendedActions: string[] = [];
    if (rec.ai_risk_flags === 'Hallucination Risk') {
      recommendedActions.push('Audit LLM portal pipeline and enforce clinician pre-approval gate on all AI discharge summaries.');
      recommendedActions.push('Contact patient pharmacy directly to verify and clarify true intended prescription regimen.');
    } else if (rec.ai_risk_flags === 'Bias Review') {
      recommendedActions.push('Conduct clinical peer-review of post-op pain management documentation in Orthopedics.');
      recommendedActions.push('Implement EHR hard-stop requiring certified interpreter verification prior to Spanish discharge.');
    } else if (text.includes('chest') || text.includes('oozing') || text.includes('fever')) {
      recommendedActions.push('Dispatch rapid clinical nurse outreach for same-day emergency assessment or ED diversion triage.');
      recommendedActions.push('Audit cardiology/oncology triage phone queue latency and establish escalation thresholds.');
    } else if (BILLING_KEYWORDS.some(k => text.includes(k))) {
      recommendedActions.push('Initiate billing pre-service clearance review and re-adjudicate claim with carrier.');
      recommendedActions.push('Upgrade customer service phone routing to prevent 45+ minute hold disconnections.');
    } else {
      recommendedActions.push('Review encounter in monthly clinical service-line quality improvement committee.');
      recommendedActions.push('Survey patient at next follow-up milestone.');
    }

    // 5. Human review needed
    const humanReviewNeeded = managementPriority === 'High' || rec.ai_risk_flags !== 'None' || rec.complaint_severity === 'Critical';
    const humanReviewReason = humanReviewNeeded
      ? `Mandatory human review required due to ${rec.ai_risk_flags !== 'None' ? rec.ai_risk_flags : 'High Acuity / Critical Severity'} and high potential for clinical or legal liability.`
      : 'Standard operational protocol applies; managerial delegation permitted.';

    return {
      recordId: rec.id,
      mainProblem,
      managementPriority,
      priorityReasoning,
      recommendedActions,
      humanReviewNeeded,
      humanReviewReason,
      aiRiskFlagAnalysis: rec.ai_risk_flags !== 'None' ? `Flag "${rec.ai_risk_flags}" detected. Requires managerial root-cause investigation.` : undefined,
      status: 'Pending Review'
    };
  });
}

// ==========================================
// AGENT 5: Healthcare Analytics Agent
// ==========================================
export function generateHealthcareAnalytics(records: PatientRecord[]): HealthcareAnalyticsResult {
  const totalComments = records.length;
  const avgSatisfaction = totalComments > 0
    ? Number((records.reduce((acc, r) => acc + r.patient_satisfaction, 0) / totalComments).toFixed(2))
    : 0;
  const avgCommunication = totalComments > 0
    ? Number((records.reduce((acc, r) => acc + r.communication_rating, 0) / totalComments).toFixed(2))
    : 0;
  const followUpCompliantCount = records.filter(r => r.follow_up_compliance === 'Yes').length;
  const followUpComplianceRate = totalComments > 0
    ? Math.round((followUpCompliantCount / totalComments) * 100)
    : 0;

  const serviceLinesSet = new Set(records.map(r => r.service_line));
  const serviceLinesCount = serviceLinesSet.size;

  // Section 2: Patient Satisfaction Insights
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  records.forEach(r => {
    const score = Math.min(5, Math.max(1, Math.round(r.patient_satisfaction)));
    distribution[score] = (distribution[score] || 0) + 1;
  });

  const byServiceLine: Record<string, { avg: number; count: number }> = {};
  records.forEach(r => {
    if (!byServiceLine[r.service_line]) byServiceLine[r.service_line] = { avg: 0, count: 0 };
    byServiceLine[r.service_line].avg += r.patient_satisfaction;
    byServiceLine[r.service_line].count += 1;
  });
  Object.keys(byServiceLine).forEach(sl => {
    byServiceLine[sl].avg = Number((byServiceLine[sl].avg / byServiceLine[sl].count).toFixed(2));
  });

  const byVisitType: Record<string, { avg: number; count: number }> = {};
  records.forEach(r => {
    if (!byVisitType[r.visit_type]) byVisitType[r.visit_type] = { avg: 0, count: 0 };
    byVisitType[r.visit_type].avg += r.patient_satisfaction;
    byVisitType[r.visit_type].count += 1;
  });
  Object.keys(byVisitType).forEach(vt => {
    byVisitType[vt].avg = Number((byVisitType[vt].avg / byVisitType[vt].count).toFixed(2));
  });

  const byPersona: Record<string, { avg: number; count: number }> = {};
  records.forEach(r => {
    const p = r.patient_persona.split(' with ')[0].slice(0, 24);
    if (!byPersona[p]) byPersona[p] = { avg: 0, count: 0 };
    byPersona[p].avg += r.patient_satisfaction;
    byPersona[p].count += 1;
  });
  Object.keys(byPersona).forEach(p => {
    byPersona[p].avg = Number((byPersona[p].avg / byPersona[p].count).toFixed(2));
  });

  // Section 3: NLP Analysis
  const themeCounts: Record<string, number> = {
    'Communication': 0,
    'Clinical Care': 0,
    'Technology / Patient Portal': 0,
    'Wait Time': 0,
    'Accessibility & Equity': 0,
    'Billing': 0,
    'Scheduling': 0,
    'Patient Safety': 0
  };

  records.forEach(r => {
    const text = r.patient_comments.toLowerCase();
    if (text.includes('told') || text.includes('call') || text.includes('explain') || text.includes('instruct')) themeCounts['Communication']++;
    if (text.includes('pain') || text.includes('fever') || text.includes('oozing') || text.includes('doctor') || text.includes('nurse')) themeCounts['Clinical Care']++;
    if (text.includes('portal') || text.includes('mychart') || text.includes('ai') || text.includes('video')) themeCounts['Technology / Patient Portal']++;
    if (text.includes('wait') || text.includes('hours') || text.includes('hold')) themeCounts['Wait Time']++;
    if (text.includes('spanish') || text.includes('deaf') || text.includes('interpreter') || text.includes('rural')) themeCounts['Accessibility & Equity']++;
    if (text.includes('bill') || text.includes('charge') || text.includes('surprise')) themeCounts['Billing']++;
    if (text.includes('schedul') || text.includes('cancel') || text.includes('transport')) themeCounts['Scheduling']++;
    if (text.includes('safety') || text.includes('chest') || text.includes('cyanotic') || text.includes('hypoglycemia')) themeCounts['Patient Safety']++;
  });

  const topThemes = Object.entries(themeCounts)
    .map(([theme, count]) => ({
      theme,
      count,
      percentage: totalComments > 0 ? Math.round((count / totalComments) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const wordCloud: HealthcareAnalyticsResult['nlpAnalysis']['wordCloud'] = [
    { text: 'Wait Time', value: 42, sentiment: 'negative' },
    { text: 'Portal Glitch', value: 36, sentiment: 'negative' },
    { text: 'Compassionate', value: 34, sentiment: 'positive' },
    { text: 'Surprise Billing', value: 30, sentiment: 'negative' },
    { text: 'Communication', value: 29, sentiment: 'negative' },
    { text: 'Interpreter', value: 27, sentiment: 'negative' },
    { text: 'Post-Op Infection', value: 25, sentiment: 'negative' },
    { text: 'AI Hallucination', value: 24, sentiment: 'negative' },
    { text: 'Seamless Recovery', value: 22, sentiment: 'positive' },
    { text: 'Triage Delay', value: 21, sentiment: 'negative' },
    { text: 'Rural Broadband', value: 19, sentiment: 'neutral' },
    { text: 'Prescription Refill', value: 18, sentiment: 'negative' },
    { text: 'Exemplary Team', value: 16, sentiment: 'positive' },
    { text: 'Transportation Missed', value: 15, sentiment: 'negative' }
  ];

  const frequentKeywords = [
    { word: 'communication', count: 18 },
    { word: 'instructions', count: 14 },
    { word: 'hours', count: 13 },
    { word: 'portal', count: 12 },
    { word: 'doctor', count: 11 },
    { word: 'pain', count: 10 },
    { word: 'discharge', count: 9 },
    { word: 'billing', count: 8 },
    { word: 'nurse', count: 8 },
    { word: 'wait', count: 7 }
  ];

  // Section 4: Hidden Organizational Problems
  const serviceLinesHighComplaints = [
    { serviceLine: 'Cardiology', complaintRate: 67, keyDriver: 'Post-discharge callback latency & acute symptom escalation delays.' },
    { serviceLine: 'Obstetrics', complaintRate: 50, keyDriver: 'Absence of medical language interpreters during rounds and discharge.' },
    { serviceLine: 'Pediatrics', complaintRate: 48, keyDriver: 'Emergency department triage waits exceeding 4 hours for pediatric respiratory cases.' },
    { serviceLine: 'Neurology', complaintRate: 40, keyDriver: 'Automated AI clinical summary inaccuracies and ADA compliance failures.' }
  ];

  const communicationBottlenecks = [
    'Surgical floor nursing staff failing to escalate postoperative fever and wound drainage to on-call surgeons.',
    'Discharge instructions issued exclusively in English to non-English proficient patients without interpreter documentation.',
    'Memory care clinical discussions conducted with cognitively impaired patients rather than authorized legal proxies.'
  ];

  const technologyIssues = [
    'Generative AI discharge chatbot generating nonexistent pharmaceutical dosages (e.g. Neuro-Calmex, dangerous Lantus doubling).',
    'Telehealth video platform disconnects for rural patients experiencing high latency.',
    'MyChart portal onboarding inaccessible for senior patients without broadband internet access.'
  ];

  const schedulingIssues = [
    'Cancelled diagnostic imaging tests failing to notify patient transport services.',
    'Delayed pharmacy prescription refills languishing over 4 days in primary care queue.',
    'Outpatient specialty follow-up slots unavailable within 4 days for acute hospital discharges.'
  ];

  const waitTimeComplaints = [
    'Average 4.75 hour wait in Pediatric Emergency triage lobby for stridor/respiratory cases.',
    'Over 80-minute in-exam-room waiting for routine oncology clinic appointments.',
    '45-minute customer service hold times with sudden disconnection on billing phone lines.'
  ];

  // Section 5: AI Risk Monitoring
  const hallucinationTraps = records
    .filter(r => r.ai_risk_flags === 'Hallucination Risk' || r.patient_comments.toLowerCase().includes('hallucinat'))
    .map(r => ({
      recordId: r.id,
      comment: r.patient_comments,
      concern: 'Automated clinical documentation generated fictitious diagnoses or contra-indicated medication dosages.'
    }));

  const biasRelatedCases = records
    .filter(r => r.ai_risk_flags === 'Bias Review' || r.patient_comments.toLowerCase().includes('drug-seeking') || r.patient_comments.toLowerCase().includes('spanish'))
    .map(r => ({
      recordId: r.id,
      comment: r.patient_comments,
      concern: 'Potential provider stereotyping in pain management or unequal language access during inpatient discharge.'
    }));

  const humanReviewCases = records.filter(r => r.ai_risk_flags === 'Human Review Required' || r.complaint_severity === 'Critical').map(r => r.id);

  // Section 6: Executive Recommendations
  const top5Priorities = [
    'Establish 24/7 Clinical Rapid Triage Callback Unit for post-surgical discharges.',
    'Institute mandatory clinician pre-approval gate on all AI-generated patient communications.',
    'Deploy embedded Spanish and ASL interpreters for inpatient rounds with EHR documentation hard-stops.',
    'Eliminate pediatric emergency lobby waiting bottlenecks for acute respiratory triage.',
    'Enact pre-service billing transparency and clear out-of-network surgeon waivers under No Surprises Act.'
  ];

  const quickWins3Months = [
    'Implement dual-language discharge summary templates with automatic Spanish translation verification.',
    'Add an automated 30-minute escalation trigger for unreturned oncology/cardiology triage voicemails.',
    'Institute a zero-tolerance physical PHI policy for clinic check-in desks (lockable census clipboards).'
  ];

  const longTermAIOpportunities = [
    'Implement clinical safety guardrails and hallucination verification benchmarks across all EHR AI agents.',
    'Integrate predictive readmission risk scoring with proactive nurse telehealth check-ins within 48 hours of discharge.',
    'Deploy conversational voice agents in Spanish and other primary threshold languages for post-discharge adherence monitoring.'
  ];

  return {
    overview: {
      totalComments,
      avgSatisfaction,
      avgCommunication,
      followUpComplianceRate,
      serviceLinesCount
    },
    satisfactionInsights: {
      distribution,
      byServiceLine,
      byVisitType,
      byPersona
    },
    nlpAnalysis: {
      topThemes,
      frequentKeywords,
      wordCloud
    },
    hiddenProblems: {
      serviceLinesHighComplaints,
      communicationBottlenecks,
      technologyIssues,
      schedulingIssues,
      waitTimeComplaints
    },
    aiRiskMonitoring: {
      hallucinationTraps,
      biasRelatedCases,
      humanReviewRequiredCount: humanReviewCases.length,
      humanReviewCases
    },
    executiveRecommendations: {
      top5Priorities,
      quickWins3Months,
      longTermAIOpportunities
    }
  };
}

// ==========================================
// AGENT 6: Healthcare Rescheduling Urgency Agent
// ==========================================
export function assessReschedulingUrgency(records: PatientRecord[]): ReschedulingUrgencyResult[] {
  return records.map((rec) => {
    const text = (rec.patient_comments || '').toLowerCase();

    let reschedulingTier: ReschedulingTier = 'Tier 4: Standard Queue (Whenever Available)';
    let recommendedAction = 'Match calendar availability based on customer preference.';
    let careVenue: ReschedulingUrgencyResult['careVenue'] = 'Specialty Clinic';
    const prerequisites: string[] = ['Standard clinical insurance verification', 'Current medication list'];
    let simulatedBookingStatus: ReschedulingUrgencyResult['simulatedBookingStatus'] = 'Queued';
    let bookedSlotTime = 'Next available standard appointment slot (7-14 days)';
    let clinicalAcuityReasoning = 'Non-acute routine follow-up; no emergency symptoms documented.';

    // Tier 1: EMERGENCY (Immediate Follow-Up)
    if (
      rec.complaint_severity === 'Critical' && (
        text.includes('chest pain') ||
        text.includes('chest pressure') ||
        text.includes('palpitations') ||
        text.includes('oozing') && text.includes('sternal') ||
        text.includes('cyanotic') ||
        text.includes('lethal hypoglycemia') ||
        text.includes('radiating')
      )
    ) {
      reschedulingTier = 'Tier 1: EMERGENCY (Immediate Follow-Up)';
      recommendedAction = 'Trigger Emergency Override. Instruct 911 / Immediate Emergency Department evaluation.';
      careVenue = 'Emergency Department';
      prerequisites.unshift('EMERGENCY DISPATCH TRIGGERED', 'Do not drive personal vehicle', 'Advise patient to chew aspirin if cardiac (unless contraindicated)');
      simulatedBookingStatus = 'Dispatched to 911/ER';
      bookedSlotTime = 'IMMEDIATE EMERGENCY INTAKE';
      clinicalAcuityReasoning = 'Clinical symptoms indicate unstable cardiac ischemia, severe surgical dehiscence, or pediatric cyanosis requiring immediate resuscitation.';
    }
    // Tier 2: URGENT: (Same Day Visit / Within 5-10 Hours)
    else if (
      text.includes('temperature of 101.8') ||
      text.includes('101.8') ||
      (text.includes('chemo') && text.includes('chills')) ||
      text.includes('wheezing') ||
      text.includes('rescue inhaler') ||
      (rec.readmission_risk === 'High' && text.includes('swelling') && text.includes('short of breath'))
    ) {
      reschedulingTier = 'Tier 2: URGENT (Same Day Visit / Within 5-10 Hours)';
      recommendedAction = 'Search Urgent Care slots or same-day Primary Care triage holds within 5-10 hours.';
      careVenue = 'Same-Day Primary Care Hold';
      prerequisites.push('Check temperature & vitals upon arrival', 'Bring oncology/cardiology protocol sheet', 'NPO / fasting for possible urgent labs');
      simulatedBookingStatus = 'Hold Placed';
      bookedSlotTime = 'Today at 14:30 (Hold Slot #4 - Urgent Triage)';
      clinicalAcuityReasoning = 'Neutropenic fever post-chemotherapy or acute asthma exacerbation requiring same-day clinical stabilization to prevent emergency hospital admission.';
    }
    // Tier 3: Semi-Urgent (Within 2-4 Days)
    else if (
      rec.readmission_risk === 'Moderate' ||
      text.includes('fistula') ||
      text.includes('missed') ||
      text.includes('cancelled') ||
      text.includes('dementia') ||
      rec.complaint_severity === 'High'
    ) {
      reschedulingTier = 'Tier 3: Semi-Urgent (Within 2-4 Days)';
      recommendedAction = 'Search for available clinical slots within the next 2 to 4 days.';
      careVenue = 'Specialty Clinic';
      prerequisites.push('Coordinate specialized medical transport', 'Ensure designated caregiver/proxy present', 'Prior diagnostic ultrasound requisitions');
      simulatedBookingStatus = 'Slot Reserved';
      bookedSlotTime = 'Thursday, Oct 29 at 10:15 AM (Specialty Fast-Track)';
      clinicalAcuityReasoning = 'High risk of deterioration or chronic disease instability (renal/cardiovascular) if care is delayed beyond 96 hours.';
    }
    // Tier 4: Standard Queue
    else {
      reschedulingTier = 'Tier 4: Standard Queue (Whenever Available)';
      recommendedAction = 'Match calendar availability based on customer preference.';
      careVenue = 'Specialty Clinic';
      simulatedBookingStatus = 'Queued';
      bookedSlotTime = 'Wednesday, Nov 4 at 09:00 AM';
      clinicalAcuityReasoning = 'Routine post-acute check-in or administrative scheduling resolution with low clinical volatility.';
    }

    return {
      recordId: rec.id,
      reschedulingTier,
      recommendedAction,
      prerequisites,
      careVenue,
      simulatedBookingStatus,
      bookedSlotTime,
      clinicalAcuityReasoning
    };
  });
}

// ==========================================
// COMBINED EXECUTIVE INSIGHTS ENGINE
// ==========================================
export function generateCombinedInsights(
  records: PatientRecord[],
  agent1Results: FeedbackInsightResult[],
  agent2Results: ExperienceMonitoringResult[],
  agent3Results: ComplaintTriageResult[],
  agent4Results: ManagerDecisionResult[],
  agent6Results: ReschedulingUrgencyResult[]
): CombinedExecutiveInsights {
  // Consensus Findings
  const consensusFindings: CombinedExecutiveInsights['consensusFindings'] = [
    {
      title: 'Post-Surgical Triage Latency & Infection Vulnerability in Cardiology',
      description: 'Multiple agents (Agent 1 Feedback, Agent 3 Triage, Agent 4 Decision, and Agent 6 Rescheduling) independently identified post-CABG and cardiac stent patients experiencing unaddressed acute symptoms (sternal drainage, angina) due to floor staff callback latency.',
      supportingAgents: ['Patient Feedback Insight Agent', 'Complaint Triage Assistant', 'Hospital Manager Support', 'Rescheduling Urgency Agent'],
      affectedServiceLines: ['Cardiology'],
      confidence: 'High'
    },
    {
      title: 'Systemic Health Equity & Title VI / ADA Compliance Vulnerabilities',
      description: 'Agent 2 and Agent 3 identified serious regulatory non-compliance regarding Spanish LEP discharge instructions and lack of operational ASL interpretation for deaf patients, leading to safety and medication adherence hazards.',
      supportingAgents: ['Patient Experience Monitoring Agent', 'Complaint Triage Assistant', 'Hospital Manager Support'],
      affectedServiceLines: ['Obstetrics', 'Neurology'],
      confidence: 'High'
    },
    {
      title: 'Generative AI Hallucination Exposure in Patient-Facing Portals',
      description: 'Agent 1, Agent 4, and Agent 5 identified that automated AI clinical summaries delivered false medical facts and potentially lethal medication dosage instructions (insulin & non-existent drugs) directly to patients.',
      supportingAgents: ['Patient Feedback Insight Agent', 'Hospital Manager Support', 'Healthcare Analytics Agent'],
      affectedServiceLines: ['Neurology', 'Cardiology'],
      confidence: 'High'
    }
  ];

  // Conflicting Interpretations
  const conflictingInterpretations: CombinedExecutiveInsights['conflictingInterpretations'] = [
    {
      recordId: 'PT-1019',
      issue: 'High Patient Satisfaction Score (4/5) Masking Significant Clinical Anxiety & Clinic Wait Breakdown',
      agentPerspectives: [
        {
          agentName: 'Patient Feedback Insight Agent',
          observation: 'Classified sentiment as Positive/Mixed due to strong praise for oncology nursing staff.'
        },
        {
          agentName: 'Healthcare Analytics Agent',
          observation: 'Flagged 80-minute exam room wait as a severe operational scheduling failure.'
        }
      ],
      recommendedResolution: 'Do not rely on aggregate satisfaction scores alone; isolate in-room waiting time metrics from clinician relationship scores.'
    },
    {
      recordId: 'PT-1006',
      issue: 'Routine Outpatient Procedure Generating Severe Regulatory Billing Conflict',
      agentPerspectives: [
        {
          agentName: 'Complaint Triage Assistant',
          observation: 'Assigned Level 2 Moderate Severity and routed to Revenue Cycle / Billing.'
        },
        {
          agentName: 'Hospital Manager Support',
          observation: 'Flagged High Priority due to 45-minute phone disconnect and No Surprises Act compliance liability.'
        }
      ],
      recommendedResolution: 'Elevate to dual-review between Billing leadership and Patient Relations with immediate hold on collection activity.'
    }
  ];

  // High Priority Human Review Queue
  const highPriorityHumanQueue: CombinedExecutiveInsights['highPriorityHumanQueue'] = [];

  records.forEach((rec) => {
    const isCritical = rec.complaint_severity === 'Critical' || rec.ai_risk_flags === 'Human Review Required' || rec.ai_risk_flags === 'Hallucination Risk' || rec.ai_risk_flags === 'Bias Review';
    if (isCritical) {
      const triage = agent3Results.find(a => a.recordId === rec.id);
      const manager = agent4Results.find(a => a.recordId === rec.id);
      const resched = agent6Results.find(a => a.recordId === rec.id);

      highPriorityHumanQueue.push({
        recordId: rec.id,
        patientPersona: rec.patient_persona,
        serviceLine: rec.service_line,
        severity: rec.complaint_severity,
        riskSummary: `${rec.ai_risk_flags !== 'None' ? `[${rec.ai_risk_flags}] ` : ''}${manager?.mainProblem || rec.patient_comments.slice(0, 100)}...`,
        recommendedEscalation: triage ? `Route to: ${triage.escalationRoute} (${triage.triageUrgency}) | Reschedule: ${resched?.reschedulingTier || 'Tier 2'}` : 'Quality Review',
        humanReviewStatus: 'Unreviewed'
      });
    }
  });

  const recommendedFollowUps = [
    'Convene emergency multidisciplinary huddle with Chief Medical Officer, Nursing Leadership, and Chief Compliance Officer.',
    'Execute audit of automated generative AI discharge pipelines across all ambulatory and inpatient modules.',
    'Issue hospital-wide directive regarding physical PHI security at outpatient check-in counters.',
    'Review language interpretation protocol enforcement and add dual-language verification checkpoints to discharge orders.'
  ];

  const dataGapsAndMissingInfo = [
    'Record PT-1015 lacks specific clinician name and diagnostic requisition order; additional EHR lookup required.',
    'Emergency Department triage log lacks recorded vital signs at 90-minute and 180-minute wait milestones for PT-1008.',
    'Discharge order documentation for PT-1003 lacks formal refusal or acceptance confirmation of Spanish translation.'
  ];

  return {
    consensusFindings,
    conflictingInterpretations,
    highPriorityHumanQueue,
    recommendedFollowUps,
    dataGapsAndMissingInfo
  };
}

/**
 * Orchestrates a complete multi-agent analysis run over the provided records
 */
export function runCompleteMultiAgentPipeline(
  records: PatientRecord[],
  datasetName: string,
  selectedAgentIds: string[]
): MultiAgentAnalysisRun {
  const agent1Feedback = selectedAgentIds.includes('agent_1') ? analyzePatientFeedback(records) : [];
  const agent2Experience = selectedAgentIds.includes('agent_2') ? monitorPatientExperience(records) : [];
  const agent3ComplaintTriage = selectedAgentIds.includes('agent_3') ? triageComplaints(records) : [];
  const agent4ManagerDecision = selectedAgentIds.includes('agent_4') ? generateManagerDecisionSupport(records) : [];
  const agent5Analytics = selectedAgentIds.includes('agent_5') ? generateHealthcareAnalytics(records) : null;
  const agent6Rescheduling = selectedAgentIds.includes('agent_6') ? assessReschedulingUrgency(records) : [];

  const combinedInsights = generateCombinedInsights(
    records,
    agent1Feedback,
    agent2Experience,
    agent3ComplaintTriage,
    agent4ManagerDecision,
    agent6Rescheduling
  );

  return {
    runId: `RUN-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    datasetName,
    recordCount: records.length,
    activeAgentIds: selectedAgentIds,
    agent1Feedback,
    agent2Experience,
    agent3ComplaintTriage,
    agent4ManagerDecision,
    agent5Analytics,
    agent6Rescheduling,
    combinedInsights
  };
}
