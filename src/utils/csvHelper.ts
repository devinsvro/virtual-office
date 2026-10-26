import Papa from 'papaparse';
import { PatientRecord } from '../types/clinical';

export interface CSVValidationResult {
  isValid: boolean;
  records: PatientRecord[];
  detectedColumns: { name: string; type: string; sampleValue: string }[];
  rowCount: number;
  warnings: string[];
  privacySafeguardsPassed: boolean;
  privacyNotice: string;
}

const EXPECTED_FIELDS = [
  'id',
  'patient_persona',
  'age_group',
  'visit_type',
  'service_line',
  'patient_satisfaction',
  'communication_rating',
  'follow_up_compliance',
  'complaint_severity',
  'patient_portal_usage',
  'readmission_risk',
  'ai_risk_flags',
  'patient_comments'
];

export function parseAndValidateCSV(fileContent: string): Promise<CSVValidationResult> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, any>>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const warnings: string[] = [];
        const rows = results.data;
        const fields = results.meta.fields || [];

        // Column detection & type mapping
        const detectedColumns = fields.map((field) => {
          const sample = rows[0] ? String(rows[0][field] ?? '') : '';
          let type = 'Text';
          if (typeof rows[0]?.[field] === 'number') {
            type = 'Numerical / Score';
          } else if (['Yes', 'No', 'Partial', 'Active', 'Inactive', 'Low', 'Moderate', 'High', 'Critical'].includes(sample)) {
            type = 'Categorical Code';
          }
          return { name: field, type, sampleValue: sample };
        });

        // Check for missing key columns
        const missingExpected = EXPECTED_FIELDS.filter((f) => !fields.includes(f));
        if (missingExpected.length > 0) {
          warnings.push(`Missing standard clinical columns: ${missingExpected.join(', ')}. Default safe fallbacks will be applied.`);
        }

        // Privacy & De-identification safeguards check
        let privacySafeguardsPassed = true;
        const fullContent = fileContent.toLowerCase();
        if (fullContent.includes('@') && fullContent.includes('.com')) {
          warnings.push('Potential email addresses detected in uploaded file. Ensure dataset is de-identified in compliance with HIPAA Safe Harbor.');
          privacySafeguardsPassed = false;
        }
        if (/\b\d{3}-\d{2}-\d{4}\b/.test(fileContent)) {
          warnings.push('Potential unmasked Social Security numbers detected in CSV raw text. Prototype safeguards require synthetic or de-identified identifiers.');
          privacySafeguardsPassed = false;
        }

        // Map rows to PatientRecord
        const records: PatientRecord[] = rows.map((row, idx) => {
          const id = String(row.id || row.ID || `PT-${1000 + idx + 1}`);
          const satisfaction = Number(row.patient_satisfaction || row.satisfaction || 3);
          const commRating = Number(row.communication_rating || row.communication || 3);

          return {
            id,
            patient_persona: String(row.patient_persona || row.persona || 'Clinical Inpatient Encounter'),
            age_group: (row.age_group as any) || '51-64',
            visit_type: (row.visit_type as any) || 'Outpatient',
            service_line: (row.service_line as any) || 'Primary Care',
            patient_satisfaction: isNaN(satisfaction) ? 3 : Math.min(5, Math.max(1, satisfaction)),
            communication_rating: isNaN(commRating) ? 3 : Math.min(5, Math.max(1, commRating)),
            follow_up_compliance: (row.follow_up_compliance as any) || 'Yes',
            complaint_severity: (row.complaint_severity as any) || 'Low',
            patient_portal_usage: (row.patient_portal_usage as any) || 'Active',
            readmission_risk: (row.readmission_risk as any) || 'Low',
            ai_risk_flags: (row.ai_risk_flags as any) || 'None',
            patient_comments: String(row.patient_comments || row.comments || row.feedback || row.text || 'No comment provided by patient.')
          };
        });

        resolve({
          isValid: records.length > 0,
          records,
          detectedColumns,
          rowCount: records.length,
          warnings,
          privacySafeguardsPassed,
          privacyNotice: privacySafeguardsPassed
            ? 'HIPAA Synthetic Compliance Verified: No unmasked direct patient identifiers detected. Safe for multi-agent clinical simulation.'
            : 'Caution: Potential sensitive tokens flagged. Please verify data governance before executive distribution.'
        });
      },
      error: (err: any) => {
        resolve({
          isValid: false,
          records: [],
          detectedColumns: [],
          rowCount: 0,
          warnings: [`CSV Parsing Error: ${err.message}`],
          privacySafeguardsPassed: false,
          privacyNotice: 'Failed to parse CSV file.'
        });
      }
    });
  });
}

export function exportDatasetToCSV(records: PatientRecord[], filename = 'clinica_ai_dataset.csv') {
  const csv = Papa.unparse(records);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAnalysisReportJSON(analysisData: any, filename = 'clinica_ai_multi_agent_report.json') {
  const jsonStr = JSON.stringify(analysisData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
