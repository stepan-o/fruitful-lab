import { pushEvent } from "@/lib/gtm";

import { PINTEREST_FIT_ASSESSMENT_NAME, PINTEREST_FIT_ASSESSMENT_SLUG } from "./config";
import type { AssessmentAnswerValue, AssessmentResult, OutcomeKey, QuestionId } from "./types";

export const PINTEREST_FIT_TRACKING_EVENTS = {
    assessmentStarted: "assessment_started",
    assessmentQuestionCompleted: "assessment_question_completed",
    assessmentCompleted: "assessment_completed",
    resultStrongFit: "result_strong_fit",
    resultPossibleFit: "result_possible_fit",
    resultNotRightNow: "result_not_right_now",
    ctaFitCallClicked: "cta_fit_call_clicked",
} as const;

export type PinterestFitTrackingEvent =
    (typeof PINTEREST_FIT_TRACKING_EVENTS)[keyof typeof PINTEREST_FIT_TRACKING_EVENTS];

export type PinterestFitRunId = string;

type PinterestFitTrackingPayload = Readonly<{
    tool_name: typeof PINTEREST_FIT_ASSESSMENT_SLUG;
    assessment_name: typeof PINTEREST_FIT_ASSESSMENT_NAME;
    assessment_key: typeof PINTEREST_FIT_ASSESSMENT_SLUG;
    location: string;
    run_id: PinterestFitRunId;
}>;

export type PinterestFitQuestionCompletedPayload = PinterestFitTrackingPayload &
    Readonly<{
        question_id: QuestionId;
        selected_answer: AssessmentAnswerValue;
        step_number: number;
    }>;

export type PinterestFitCompletedPayload = PinterestFitTrackingPayload &
    Readonly<{
        final_score: number;
        final_outcome: OutcomeKey;
        result_variant: OutcomeKey;
        role_key: AssessmentResult["roleKey"];
        reason_keys: AssessmentResult["reasonKeys"];
    }>;

export type PinterestFitCtaClickedPayload = PinterestFitCompletedPayload &
    Readonly<{
        button_label: AssessmentResult["cta"]["label"];
        cta_url: AssessmentResult["cta"]["url"];
    }>;

const RESULT_EVENT_BY_OUTCOME = {
    strong_fit: PINTEREST_FIT_TRACKING_EVENTS.resultStrongFit,
    possible_fit: PINTEREST_FIT_TRACKING_EVENTS.resultPossibleFit,
    not_right_now: PINTEREST_FIT_TRACKING_EVENTS.resultNotRightNow,
} as const satisfies Record<OutcomeKey, PinterestFitTrackingEvent>;

function getTrackingLocation(): string {
    if (typeof window === "undefined") {
        return "";
    }

    return window.location?.pathname ?? "";
}

function buildBasePayload(runId: PinterestFitRunId): PinterestFitTrackingPayload {
    return {
        tool_name: PINTEREST_FIT_ASSESSMENT_SLUG,
        assessment_name: PINTEREST_FIT_ASSESSMENT_NAME,
        assessment_key: PINTEREST_FIT_ASSESSMENT_SLUG,
        location: getTrackingLocation(),
        run_id: runId,
    };
}

function buildCompletedPayload(runId: PinterestFitRunId, result: AssessmentResult): PinterestFitCompletedPayload {
    return {
        ...buildBasePayload(runId),
        final_score: result.score,
        final_outcome: result.finalOutcome,
        result_variant: result.finalOutcome,
        role_key: result.roleKey,
        reason_keys: result.reasonKeys,
    };
}

export function createPinterestFitRunId(): PinterestFitRunId {
    const cryptoObject = globalThis.crypto as { randomUUID?: () => string } | undefined;

    if (cryptoObject?.randomUUID) {
        return cryptoObject.randomUUID();
    }

    return `pfa_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function trackPinterestFitAssessmentStarted(runId: PinterestFitRunId): void {
    pushEvent(PINTEREST_FIT_TRACKING_EVENTS.assessmentStarted, buildBasePayload(runId));
}

export function trackPinterestFitQuestionCompleted(params: {
    runId: PinterestFitRunId;
    questionId: QuestionId;
    selectedAnswer: AssessmentAnswerValue;
    stepNumber: number;
}): void {
    pushEvent(PINTEREST_FIT_TRACKING_EVENTS.assessmentQuestionCompleted, {
        ...buildBasePayload(params.runId),
        question_id: params.questionId,
        selected_answer: params.selectedAnswer,
        step_number: params.stepNumber,
    } satisfies PinterestFitQuestionCompletedPayload);
}

export function trackPinterestFitAssessmentCompleted(params: {
    runId: PinterestFitRunId;
    result: AssessmentResult;
}): void {
    pushEvent(PINTEREST_FIT_TRACKING_EVENTS.assessmentCompleted, buildCompletedPayload(params.runId, params.result));
}

export function trackPinterestFitResultShown(params: { runId: PinterestFitRunId; result: AssessmentResult }): void {
    pushEvent(RESULT_EVENT_BY_OUTCOME[params.result.finalOutcome], buildCompletedPayload(params.runId, params.result));
}

export function trackPinterestFitCallClicked(params: {
    runId: PinterestFitRunId;
    result: AssessmentResult;
}): void {
    pushEvent(PINTEREST_FIT_TRACKING_EVENTS.ctaFitCallClicked, {
        ...buildCompletedPayload(params.runId, params.result),
        button_label: params.result.cta.label,
        cta_url: params.result.cta.url,
    } satisfies PinterestFitCtaClickedPayload);
}
