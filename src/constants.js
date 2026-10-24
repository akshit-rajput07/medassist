// Shared constants for MedAssist. Imported by both the triage engine and the UI,
// so there is exactly one place that defines levels, options and emergency numbers.

export const MAX_INPUT_LENGTH = 600;

/**
 * Triage levels. The string keys are the values stored in symptomData.js (`level`).
 * `rank` is what the engine compares; a higher rank always wins.
 */
export const LEVELS = {
  Emergency: {
    rank: 3,
    short: 'Level 3',
    label: 'Emergency',
    badge: 'High Risk / Emergency Level 3',
    guide: 'Get help now. Call 112 or go to the nearest emergency department.',
    examples: 'Chest pain, severe breathlessness, stroke signs',
  },
  'Medical Consultation': {
    rank: 2,
    short: 'Level 2',
    label: 'See a doctor',
    badge: 'Moderate Risk / Consultation Level 2',
    guide: 'Book a visit within 1–2 days, or the same day if symptoms are severe.',
    examples: 'Fever, burning urination, ear pain, sore throat',
  },
  'General Guidance': {
    rank: 1,
    short: 'Level 1',
    label: 'Self-care',
    badge: 'Low Risk / Self-Care Level 1',
    guide: 'Rest and home care usually settle these. See a doctor if they last 3 days or more.',
    examples: 'Mild cold, tiredness, minor cuts, mild headache',
  },
  Unclassified: {
    rank: 0,
    short: 'No level',
    label: 'Not classified',
    badge: 'Unclassified / Standard Evaluation',
    guide: 'No rule matched. Try more specific words, or see a doctor if you are worried.',
    examples: '',
  },
};

export const EMERGENCY_CONTACTS = [{ label: 'Call 112', tel: '112' }];

export const SEVERITY_OPTIONS = [
  { value: 'Mild', label: 'Mild' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Severe', label: 'Severe' },
];

export const DURATION_OPTIONS = [
  { value: '< 24 Hours', label: 'Under 24 hours' },
  { value: '1-2 Days', label: '1–2 days' },
  { value: '3+ Days', label: '3 days or more' },
];

export const REGION_OPTIONS = [
  { value: 'General / Systemic', label: 'Whole body' },
  { value: 'Chest / Breathing', label: 'Chest or breathing' },
  { value: 'Head, Throat & Neck', label: 'Head, throat or neck' },
  { value: 'Abdomen & Digestive', label: 'Belly or digestion' },
];

export const DEFAULT_CONTEXT = {
  severity: 'Moderate',
  duration: '1-2 Days',
  bodyRegion: 'General / Systemic',
};

// Phrases offered as tap-to-add chips. Every one of these is matched by a rule.
export const QUICK_PHRASES = [
  'fever',
  'chest pain',
  'sore throat',
  'headache',
  'cough',
  'stomach pain',
  'burning urination',
  'skin rash',
];
