"use client";

import type { CheckboxQuestion, RadioQuestion, SliderQuestion, Lead } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";

export type RadioStepProps = {
  question: RadioQuestion;
  value?: number;
  onChange: (value: number) => void;
  error?: string;
};

export type CheckboxStepProps = {
  question: CheckboxQuestion;
  values: number[];
  onChange: (values: number[]) => void;
  error?: string;
};

export type SliderStepProps = {
  question: SliderQuestion;
  value: number;
  onChange: (value: number) => void;
  error?: string;
};

export type LeadStepProps = {
  label: string;
  leadDraft: Partial<Lead>;
  onChange: (patch: Partial<Lead>) => void;
  errors?: { name?: string; email?: string };
};
