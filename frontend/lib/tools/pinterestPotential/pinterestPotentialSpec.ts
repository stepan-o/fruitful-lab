/**
 * Fruitful Lab — Pinterest Potential Calculator
 * Sprint 0: Canonical spec (no UI, no compute implementation)
 *
 * This file is the single source of truth for the calculator structure:
 * - Ordered questions (Q1–Q9) and Lead form
 * - Question types and validation rules
 * - Option labels and numeric weights (where known)
 *
 * IMPORTANT: We do NOT guess numbers or copy. If any weight/label is unknown,
 * it is explicitly marked as missing and must be confirmed from the Outgrow source.
 */

// -----------------------------
// Types
// -----------------------------

export type QuestionType = "radio" | "checkbox" | "slider" | "lead";

export type Option = {
  label: string;
  value: number; // exact numeric weight from Outgrow (no placeholders)
};

export type BaseQuestion = {
  id: `Q${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;
  type: QuestionType;
  label: string;
  helperText?: string;
  required: boolean;
};

// Sprint 0 note: For copy parity without weights, we allow label-only storage
// via `optionLabels`. Once numeric weights are confirmed, populate `options`
// and you may drop `optionLabels`.
export type RadioQuestion = BaseQuestion & {
  type: "radio";
  options: Option[]; // scalar selection → numeric weight
  optionLabels?: string[]; // Sprint 0: labels only; weights pending
};

export type CheckboxQuestion = BaseQuestion & {
  type: "checkbox";
  options: Option[]; // multi-select → numeric weights (sum later in compute)
  optionLabels?: string[]; // Sprint 0: labels only; weights pending
};

export type SliderQuestion = BaseQuestion & {
  type: "slider";
  min: number; // inclusive
  max: number; // inclusive
  step: number;
};

export type LeadQuestion = {
  id: "LEAD";
  type: "lead";
  label: string; // e.g., "Where should we send your results?"
  required: true;
};

export type Question =
  | RadioQuestion
  | CheckboxQuestion
  | SliderQuestion
  | LeadQuestion;

// -----------------------------
// Validation helpers & types
// -----------------------------

export type Answers = {
  Q1?: number; // radio → scalar weight
  Q2?: number[]; // checkbox → array of weights
  Q3?: number[]; // checkbox → array of weights
  Q4?: number; // radio
  Q5?: number; // radio
  Q6?: number; // radio
  Q7?: number; // slider (1..5)
  Q8?: number; // slider (1..5)
  Q9?: number[]; // checkbox → array of weights
  // Lead captured separately (name/email)
};

export type Lead = {
  name: string;
  email: string;
};

export type ValidationResult = {
  ok: boolean;
  errors: Record<string, string>;
};

export function clampToSliderRange(v: number, min = 1, max = 5): number {
  return Math.min(max, Math.max(min, Math.round(v)));
}

export function validateEmail(email: string): boolean {
  // Simple RFC5322-ish check that’s adequate for client-side validation
  const re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  return re.test(email);
}

/**
 * Validation rules (Sprint 0 spec):
 * - Required questions cannot be skipped
 * - Checkbox questions must have ≥1 selection
 * - Sliders must be within [1,5] (UI should clamp); if out of range → validation error
 * - Lead form: name and a syntactically valid email are required
 */
export function validateAnswers(answers: Answers, lead?: Lead): ValidationResult {
  const errors: Record<string, string> = {};

  for (const q of QUESTIONS) {
    if (q.type === "lead") continue; // handled after loop

    const id = q.id;
    if (q.type === "radio") {
      const v = answers[id as keyof Answers] as number | undefined;
      if (q.required && (v === undefined || v === null)) {
        errors[id] = "This question is required.";
      }
    } else if (q.type === "checkbox") {
      const arr = answers[id as keyof Answers] as number[] | undefined;
      if (q.required && (!Array.isArray(arr) || arr.length === 0)) {
        errors[id] = "Please select at least one option.";
      }
    } else if (q.type === "slider") {
      const v = answers[id as keyof Answers] as number | undefined;
      if (q.required && (v === undefined || v === null)) {
        errors[id] = "This question is required.";
      } else if (v !== undefined && (v < q.min || v > q.max)) {
        errors[id] = `Value must be between ${q.min} and ${q.max}.`;
      }
    }
  }

  // Lead form (required)
  if (!lead) {
    errors[LEAD.id] = "Lead info is required.";
  } else {
    if (!lead.name || !lead.name.trim()) {
      errors["LEAD.name"] = "Name is required.";
    }
    if (!lead.email || !validateEmail(lead.email)) {
      errors["LEAD.email"] = "A valid email is required.";
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

// -----------------------------
// Canonical question order and definitions (Q1–Q9 + Lead)
// NOTE: Any unknown labels/options/weights are explicitly marked as MISSING.
// -----------------------------

// -----------------------------
// Sprint 0 copy parity:
// Populate exact labels from Outgrow screenshots.
// Do NOT invent numeric weights; keep `options: []` empty until confirmed.
// Q3 is treated as multi-select (checkbox) per formula sum(Q3) even if UI looked like dropdown.
// -----------------------------

export const Q1: RadioQuestion = {
  id: "Q1",
  type: "radio",
  label: "Do you have a Pinterest Business account ?",
  // helperText: "",
  required: true,
  optionLabels: ["Yes", "No"],
  options: [],
};

export const Q2: CheckboxQuestion = {
  id: "Q2",
  type: "checkbox",
  label: "Select your target market/region (all that apply)",
  required: true,
  optionLabels: [
    "Global",
    "USA",
    "Canada",
    "Europe",
    "Latin America",
    "Asia-Pacific",
    "Rest of the world",
  ],
  options: [],
};

export const Q3: CheckboxQuestion = {
  id: "Q3",
  type: "checkbox",
  label: "What types of products do you offer? (Select all that apply)",
  required: true,
  // NOTE: Outgrow UI appears as a dropdown in screenshot, but label indicates multi-select
  // and the final formula uses sum(Q3), so this is modeled as checkbox multi-select.
  optionLabels: [
    // Only one visible in screenshot; full list pending confirmation
    "Travel & Mobility (Strollers, buggies, joggers, car acces...)",
  ],
  options: [],
};

export const Q4: RadioQuestion = {
  id: "Q4",
  type: "radio",
  label: "Could you allocate an ad spend budget for Pinterest?",
  required: true,
  optionLabels: [
    "Yes",
    "No",
    "No, but could consider it",
  ],
  options: [],
};

export const Q5: RadioQuestion = {
  id: "Q5",
  type: "radio",
  label: "Do you have a blog?",
  required: true,
  optionLabels: [
    "Yes, my brand has a blog",
    "Not a blog, but we create user guides etc.",
    "No, but can create",
    "No and not planning to",
  ],
  options: [],
};

export const Q6: RadioQuestion = {
  id: "Q6",
  type: "radio",
  label: "Could your product be positioned for gifting occasions?",
  required: true,
  optionLabels: ["Yes", "No", "Not sure"],
  options: [],
};

export const Q7: SliderQuestion = {
  id: "Q7",
  type: "slider",
  label:
    "How seasonal is your product or brand? (1 = not seasonal, 5 = very seasonal)",
  required: true,
  min: 1,
  max: 5,
  step: 1,
};

export const Q8: SliderQuestion = {
  id: "Q8",
  type: "slider",
  label:
    "On a scale of 1 (low competition) to 5 (high competition), how competitive is your product category?",
  required: true,
  min: 1,
  max: 5,
  step: 1,
};

export const Q9: CheckboxQuestion = {
  id: "Q9",
  type: "checkbox",
  label: "Which platform is most important for your marketing?",
  required: true,
  optionLabels: [
    "Instagram",
    "Facebook",
    "Tiktok",
    "Youtube",
    "Google/SEO",
    "Email",
  ],
  options: [],
};

export const LEAD: LeadQuestion = {
  id: "LEAD",
  type: "lead",
  label: "Where can we send your results?",
  required: true,
};

/**
 * The ordered list of questions (Q1–Q9), followed by the lead form (placement must match Outgrow).
 */
export const QUESTIONS: Question[] = [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, LEAD];

/**
 * Final score formula (documentation only — DO NOT implement here):
 *
 * Final score formula:
 * round(
 *   sum(Q3) *
 *   sum(Q2) *
 *   Q1 *
 *   Q4 *
 *   Q5 *
 *   Q6 *
 *   (1.175 - 0.175 * Q7) *
 *   (1.15  - 0.15  * Q8),
 *   0
 * )
 */

// -----------------------------
// Notes
// -----------------------------
// - This spec intentionally omits numeric weights where not confirmed. As soon as
//   Outgrow-provided tables are available, replace the ❗ MISSING markers with the
//   exact labels and numbers.
// - Lead form placement (before/after results) must match Outgrow behavior.
