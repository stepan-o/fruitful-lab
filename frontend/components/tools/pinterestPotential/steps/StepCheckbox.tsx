"use client";

import CheckboxCardGrid from "@/components/ui/forms/CheckboxCardGrid";
import FieldError from "@/components/ui/forms/FieldError";
import HelperText from "@/components/ui/forms/HelperText";
import type { CheckboxStepProps } from "./StepTypes";

export default function StepCheckbox({
                                         question,
                                         values,
                                         onChange,
                                         error,
                                     }: CheckboxStepProps) {
    const helperId = `${question.id}-helper`;
    const errorId = `${question.id}-error`;
    const describedBy =
        [question.helperText ? helperId : undefined, error ? errorId : undefined]
            .filter(Boolean)
            .join(" ") || undefined;

    return (
        <div>
            {question.helperText ? (
                <HelperText id={helperId}>{question.helperText}</HelperText>
            ) : null}

            <div className="mt-2">
                <CheckboxCardGrid
                    values={values}                 // ids (preferred) OR values (legacy) — grid handles both
                    options={question.options}      // options may include id; grid will use id if present
                    onChange={onChange}
                    describedBy={describedBy}
                    // columns={question.columns}   // enable only if your spec/types include it
                    // disabled={question.disabled} // enable only if your spec/types include it
                />
                <FieldError id={errorId} message={error} />
            </div>
        </div>
    );
}
