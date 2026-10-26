import { AgentDefinition } from '../types/clinical';

export const HEALTHCARE_AGENTS: AgentDefinition[] = [
  {
    id: 'agent_1',
    roomNumber: 1,
    name: 'Patient Feedback Insight Agent',
    agentRole: 'Patient Experience & Sentiment Analyst',
    specialistName: 'Dr. Patricia Vance',
    title: 'Chief Patient Feedback Specialist',
    avatarColor: 'teal',
    roomTheme: 'from-teal-950/40 via-emerald-950/20 to-slate-900 border-teal-500/30',
    shortDescription: 'Analyzes patient comments to extract core themes, sentiment, operational issues, risks/bias concerns, and actionable managerial solutions.',
    keyResponsibilities: [
      'Extract 1 of 9 standardized primary themes',
      'Classify 4-tier sentiment with contextual reasoning',
      'Isolate root operational bottlenecks in hospital workflows',
      'Screen for patient safety, language, disability & over-automation risks',
      'Provide practical healthcare managerial action items'
    ],
    toolsProvided: ['NLP Lexicon Classifier', 'Sentiment Scoring Engine', 'Quality Improvement Matrix'],
    tasksPreview: [
      'Step 1. Theme Classification',
      'Step 2. Sentiment Scoring (Pos/Neg/Neut/Mixed)',
      'Step 3. Clinical Context Reasoning',
      'Step 4. Operational Process Issue Identification',
      'Step 5. Risk & Bias Flagging',
      'Step 6. Managerial QI Recommendation'
    ]
  },
  {
    id: 'agent_2',
    roomNumber: 2,
    name: 'Patient Experience Monitoring Agent',
    agentRole: 'Equity, Access & Risk Monitor',
    specialistName: 'Dr. Julian Cole',
    title: 'Director of Healthcare Equity & Access',
    avatarColor: 'indigo',
    roomTheme: 'from-indigo-950/40 via-slate-950/20 to-slate-900 border-indigo-500/30',
    shortDescription: 'Monitors ongoing experience patterns with dedicated health equity reviews for older adults, rural patients, disabilities, and digital literacy.',
    keyResponsibilities: [
      'Classify primary and secondary experience themes',
      'Identify specific operational bottlenecks (waits, errors, tech)',
      'Dedicated equity review: older adults, rural, LEP, disabilities',
      'Multi-axis risk matrix across Safety, Reputational, Compliance, Equity',
      'Produce actionable managerial equity improvement plans'
    ],
    toolsProvided: ['Demographic Equity Scanner', 'Accessibility Bottleneck Finder', 'Risk Matrix Calculator'],
    tasksPreview: [
      'Step 1. Primary & Secondary Themes',
      'Step 2. Operational Bottleneck Audit',
      'Step 3. Equity & Vulnerability Screening',
      'Step 4. 4-Pillar Organizational Risk Matrix',
      'Step 5. Strategic Equity Recommendation'
    ]
  },
  {
    id: 'agent_3',
    roomNumber: 3,
    name: 'Complaint Triage Assistant',
    agentRole: 'Rapid Clinical & Regulatory Triage Officer',
    specialistName: 'Commander Sarah Lin, RN',
    title: 'Clinical Triage & Patient Safety Director',
    avatarColor: 'rose',
    roomTheme: 'from-rose-950/40 via-red-950/20 to-slate-900 border-rose-500/30',
    shortDescription: 'Triages patient complaints by category and 4 severity levels (Low to Critical), detecting clinical & regulatory risks and routing to 1 of 10 leadership bodies.',
    keyResponsibilities: [
      'Categorize complaints into 10 healthcare domains',
      'Assign clinical severity Level 1 (Low) through Level 4 (Critical)',
      'Detect 8 distinct risk vectors (Safety, Clinical, Compliance, Privacy, etc.)',
      'Recommend exact routing to 10 specialized hospital leadership desks',
      'Strict adherence: does NOT resolve complaints; triages with human checkpoints'
    ],
    toolsProvided: ['Clinical Severity Calibrator', 'Regulatory Risk Detector', '10-Department Router'],
    tasksPreview: [
      'Step 1. Complaint Categorization (Primary & Secondary)',
      'Step 2. Severity Grading (Level 1-4 with criteria)',
      'Step 3. Multi-Risk Detection & Justification',
      'Step 4. Leadership Escalation Routing'
    ]
  },
  {
    id: 'agent_4',
    roomNumber: 4,
    name: 'Hospital Manager Decision Support Agent',
    agentRole: 'Operational & Executive Decision Strategist',
    specialistName: 'Director Marcus Reed, MHA',
    title: 'VP of Hospital Clinical Operations',
    avatarColor: 'cyan',
    roomTheme: 'from-cyan-950/40 via-sky-950/20 to-slate-900 border-cyan-500/30',
    shortDescription: 'Transforms patient records into prioritized managerial decisions, identifying top hospital alerts, readmission vectors, and AI hallucination/bias flags.',
    keyResponsibilities: [
      'Analyze personas, visit types, satisfaction, portal usage & readmission risk',
      'Synthesize root managerial problems per clinical encounter',
      'Assign management priority (Low, Medium, High) with rationale',
      'Recommend 1-2 concrete managerial operational actions',
      'Flag AI Hallucination Risks, Bias Reviews, and mandatory Human Review cases'
    ],
    toolsProvided: ['Managerial Prioritization Engine', 'AI Hallucination Guardrail', 'Executive Action Synthesizer'],
    tasksPreview: [
      'Step 1. Root Problem Identification',
      'Step 2. Management Priority Rating (Low/Med/High)',
      'Step 3. Justification & Operational Rationale',
      'Step 4. Executive Action Directives',
      'Step 5. AI Risk Flag Audit & Human Sign-off'
    ]
  },
  {
    id: 'agent_5',
    roomNumber: 5,
    name: 'Healthcare Analytics Agent',
    agentRole: 'Chief Biostatistician & Executive Intelligence',
    specialistName: 'Dr. Elena Rostova',
    title: 'Chief Healthcare Analytics Officer',
    avatarColor: 'violet',
    roomTheme: 'from-purple-950/40 via-violet-950/20 to-slate-900 border-violet-500/30',
    shortDescription: 'Generates comprehensive C-Suite executive dashboards across 6 specialized sections: Executive Overview, Satisfaction Insights, NLP Word Cloud, Hidden Problems, AI Risks, and Roadmap.',
    keyResponsibilities: [
      'Section 1: Executive Overview with compliance & satisfaction scores',
      'Section 2: Deep satisfaction breakdown by service line, visit type & persona',
      'Section 3: NLP thematic mining, frequency metrics & interactive word cloud',
      'Section 4: Hidden organizational bottlenecks & service line complaint anomalies',
      'Section 5: AI risk monitoring (hallucination traps, bias, human queue)',
      'Section 6: Top 5 organizational priorities, 3-month quick wins, 6-12 month AI roadmap'
    ],
    toolsProvided: ['C-Suite Executive Synthesizer', 'NLP Word Cloud Engine', 'Strategic Roadmap Generator'],
    tasksPreview: [
      'Section 1: Executive Overview KPIs',
      'Section 2: Satisfaction Cross-Tabulation',
      'Section 3: NLP Frequency & Semantic Cloud',
      'Section 4: Organizational Bottleneck Detection',
      'Section 5: AI Risk & Hallucination Guard',
      'Section 6: 3-Tier Executive Recommendations'
    ]
  },
  {
    id: 'agent_6',
    roomNumber: 6,
    name: 'Healthcare Rescheduling Urgency Agent',
    agentRole: 'Clinical Acuity & Rapid Dispatch Officer',
    specialistName: 'Alex Rivera, EMT-P',
    title: 'Care Coordination & Acuity Dispatch Director',
    avatarColor: 'emerald',
    roomTheme: 'from-emerald-950/40 via-teal-950/20 to-slate-900 border-emerald-500/30',
    shortDescription: 'Assesses patient readmission risks and acute symptoms to categorize into 4 rescheduling tiers (Emergency to Standard Queue), triggering automated holds and venue routing.',
    keyResponsibilities: [
      'Tier 1: EMERGENCY (Immediate Follow-Up) -> Trigger Emergency Override (911/ER)',
      'Tier 2: URGENT (Same Day / 5-10 Hours) -> Hold Urgent Care or same-day Primary Care slots',
      'Tier 3: Semi-Urgent (Within 2-4 Days) -> Search specialty slots within 4 days',
      'Tier 4: Standard Queue (Whenever Available) -> Match customer calendar preference',
      'Collect rescheduling prerequisites (fasting, vitals, transport, lab records)'
    ],
    toolsProvided: ['Clinical Acuity Tier Classifier', 'Emergency Override Trigger', 'Direct Booking Queue Tool'],
    tasksPreview: [
      'Step 1. Readmission & Symptom Acuity Triage',
      'Step 2. Rescheduling Tier Assignment (Tier 1-4)',
      'Step 3. Prerequisite Checklist Assembly',
      'Step 4. Venue Routing & Tool-Call Booking Execution'
    ]
  }
];
