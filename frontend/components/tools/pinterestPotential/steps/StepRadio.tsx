"use client";

import RadioPillGroup from "@/components/ui/forms/RadioPillGroup";
import FieldError from "@/components/ui/forms/FieldError";
import HelperText from "@/components/ui/forms/HelperText";
import type { RadioStepProps } from "./StepTypes";

export default function StepRadio({ question, value, onChange, error }: RadioStepProps) {
  const helperId = `${question.id}-helper`;
  const errorId = `${question.id}-error`;
  const describedBy = [question.helperText ? helperId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div>
      {question.helperText ? (
        <HelperText id={helperId}>{question.helperText}</HelperText>
      ) : null}
      <div className="mt-2">
        <RadioPillGroup
          name={question.id}
          value={value}
          options={question.options}
          onChange={onChange}
          errorId={error ? errorId : undefined}
          describedBy={describedBy}
        />
        <FieldError id={errorId} message={error} />
      </div>
    </div>
  );
}
