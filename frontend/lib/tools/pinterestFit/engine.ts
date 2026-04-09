import {
    BLOCKER_REASON_PRIORITY,
    MAX_SCORE,
    NOT_RIGHT_NOW_FALLBACK_PRIORITY,
    OUTCOME_SCORE_BANDS,
    POSITIVE_REASON_PRIORITY,
    ROLE_PRIORITY_ORDER,
} from "./config";
import { CTA_BY_OUTCOME, REASON_COPY_BY_KEY, RESULT_COPY_BY_OUTCOME, ROLE_COPY_BY_KEY } from "./copy";
import { PINTEREST_FIT_QUESTIONS_BY_ID } from "./questions";
import type {
    AdsOpennessValue,
    AssessmentAnswerValue,
    AssessmentAnswers,
    AssessmentQuestionOption,
    AssessmentResult,
    AssessmentSignalKey,
    AssetsValue,
    CategoryFitValue,
    GoalFitValue,
    GoalType,
    GuardrailKey,
    OutcomeKey,
    OfferProvenValue,
    ReasonKey,
    ResultReasons,
    ResultReasonKeys,
    RoleKey,
    StoredAssessmentAnswers,
    SupportReadinessValue,
    WebsiteReadinessValue,
} from "./types";

type SignalEvaluation = Readonly<{
    signal: AssessmentSignalKey;
    score: number;
    reasonKey: ReasonKey;
    isPositive: boolean;
    isBlocker: boolean;
    isModerate: boolean;
}>;

type SignalEvaluationMap = Readonly<Record<AssessmentSignalKey, SignalEvaluation>>;

const FOUNDATION_SIGNALS = ["offer", "assets", "website"] as const satisfies readonly AssessmentSignalKey[];
const READINESS_INTENT_SIGNALS = [
    "support_readiness",
    "ads_openness",
    "goal",
] as const satisfies readonly AssessmentSignalKey[];

function getSelectedOption<TValue extends AssessmentAnswerValue>(
    questionId: keyof typeof PINTEREST_FIT_QUESTIONS_BY_ID,
    value: TValue,
): AssessmentQuestionOption<TValue> {
    const option = PINTEREST_FIT_QUESTIONS_BY_ID[questionId].options.find((candidate) => candidate.value === value);

    if (!option) {
        throw new Error(`Unknown Pinterest Fit answer value "${value}" for ${questionId}.`);
    }

    return option as AssessmentQuestionOption<TValue>;
}

export function normalizePinterestFitAnswers(answers: AssessmentAnswers): StoredAssessmentAnswers {
    const q1 = getSelectedOption<CategoryFitValue>("q1", answers.q1);
    const q2 = getSelectedOption<OfferProvenValue>("q2", answers.q2);
    const q3 = getSelectedOption<AssetsValue>("q3", answers.q3);
    const q4 = getSelectedOption<WebsiteReadinessValue>("q4", answers.q4);
    const q5 = getSelectedOption<GoalFitValue>("q5", answers.q5);
    const q6 = getSelectedOption<SupportReadinessValue>("q6", answers.q6);
    const q7 = getSelectedOption<AdsOpennessValue>("q7", answers.q7);

    if (!q5.goalType) {
        throw new Error(`Pinterest Fit goal answer "${answers.q5}" is missing a goalType mapping.`);
    }

    return {
        q1_category_fit: q1.score,
        q2_offer_proven: q2.score,
        q3_assets: q3.score,
        q4_website: q4.score,
        q5_goal_fit: q5.score,
        q5_goal_type: q5.goalType,
        q6_support_readiness: q6.score,
        q7_ads_openness: q7.score,
    };
}

function calculateTotalScore(normalizedAnswers: StoredAssessmentAnswers): number {
    return (
        normalizedAnswers.q1_category_fit +
        normalizedAnswers.q2_offer_proven +
        normalizedAnswers.q3_assets +
        normalizedAnswers.q4_website +
        normalizedAnswers.q5_goal_fit +
        normalizedAnswers.q6_support_readiness +
        normalizedAnswers.q7_ads_openness
    );
}

function resolveBaseOutcome(score: number): OutcomeKey {
    const matchingBand = OUTCOME_SCORE_BANDS.find((band) => score >= band.minScore && score <= band.maxScore);

    if (!matchingBand) {
        throw new Error(`Pinterest Fit score "${score}" fell outside configured outcome bands.`);
    }

    return matchingBand.outcome;
}

function applyGuardrails(normalizedAnswers: StoredAssessmentAnswers, baseOutcome: OutcomeKey): {
    finalOutcome: OutcomeKey;
    triggeredGuardrails: readonly GuardrailKey[];
} {
    const triggeredGuardrails: GuardrailKey[] = [];
    let finalOutcome = baseOutcome;

    const guardrailA =
        normalizedAnswers.q5_goal_type === "sales" &&
        normalizedAnswers.q6_support_readiness <= 1 &&
        normalizedAnswers.q7_ads_openness <= 1;

    if (guardrailA) {
        triggeredGuardrails.push("guardrail_a");
        if (finalOutcome === "strong_fit") {
            finalOutcome = "possible_fit";
        }
    }

    const guardrailB = normalizedAnswers.q3_assets === 0 && normalizedAnswers.q4_website === 0;
    if (guardrailB) {
        triggeredGuardrails.push("guardrail_b");
        finalOutcome = "not_right_now";
    }

    const guardrailC = normalizedAnswers.q1_category_fit === 1 && normalizedAnswers.q2_offer_proven <= 1;
    if (guardrailC) {
        triggeredGuardrails.push("guardrail_c");
        finalOutcome = "not_right_now";
    }

    return {
        finalOutcome,
        triggeredGuardrails,
    };
}

function getSignalScore(signal: AssessmentSignalKey, normalizedAnswers: StoredAssessmentAnswers): number {
    switch (signal) {
        case "category":
            return normalizedAnswers.q1_category_fit;
        case "offer":
            return normalizedAnswers.q2_offer_proven;
        case "assets":
            return normalizedAnswers.q3_assets;
        case "website":
            return normalizedAnswers.q4_website;
        case "goal":
            return normalizedAnswers.q5_goal_fit;
        case "support_readiness":
            return normalizedAnswers.q6_support_readiness;
        case "ads_openness":
            return normalizedAnswers.q7_ads_openness;
    }
}

function getSignalReasonKey(signal: AssessmentSignalKey, normalizedAnswers: StoredAssessmentAnswers): ReasonKey {
    switch (signal) {
        case "category":
            switch (normalizedAnswers.q1_category_fit) {
                case 4:
                    return "reason_category_strong";
                case 3:
                    return "reason_category_good";
                case 2:
                    return "reason_category_maybe";
                case 1:
                    return "reason_category_weak";
                default:
                    throw new Error(`Unsupported Pinterest Fit category score "${normalizedAnswers.q1_category_fit}".`);
            }
        case "offer":
            switch (normalizedAnswers.q2_offer_proven) {
                case 4:
                    return "reason_offer_proven";
                case 3:
                    return "reason_offer_some_traction";
                case 1:
                    return "reason_offer_early";
                case 0:
                    return "reason_offer_unproven";
                default:
                    throw new Error(`Unsupported Pinterest Fit offer score "${normalizedAnswers.q2_offer_proven}".`);
            }
        case "assets":
            switch (normalizedAnswers.q3_assets) {
                case 4:
                    return "reason_assets_strong";
                case 3:
                    return "reason_assets_decent";
                case 1:
                    return "reason_assets_limited";
                case 0:
                    return "reason_assets_weak";
                default:
                    throw new Error(`Unsupported Pinterest Fit assets score "${normalizedAnswers.q3_assets}".`);
            }
        case "website":
            switch (normalizedAnswers.q4_website) {
                case 4:
                    return "reason_site_ready";
                case 3:
                    return "reason_site_solid";
                case 1:
                    return "reason_site_friction";
                case 0:
                    return "reason_site_not_ready";
                default:
                    throw new Error(`Unsupported Pinterest Fit website score "${normalizedAnswers.q4_website}".`);
            }
        case "goal":
            return getGoalReasonKey(normalizedAnswers.q5_goal_type);
        case "support_readiness":
            switch (normalizedAnswers.q6_support_readiness) {
                case 3:
                    return "reason_support_ready";
                case 2:
                    return "reason_support_open";
                case 1:
                    return "reason_support_cautious";
                case 0:
                    return "reason_support_not_committed";
                default:
                    throw new Error(
                        `Unsupported Pinterest Fit support readiness score "${normalizedAnswers.q6_support_readiness}".`,
                    );
            }
        case "ads_openness":
            switch (normalizedAnswers.q7_ads_openness) {
                case 3:
                    return "reason_ads_open";
                case 2:
                    return "reason_ads_later";
                case 1:
                    return "reason_ads_unsure";
                case 0:
                    return "reason_ads_not_open";
                default:
                    throw new Error(`Unsupported Pinterest Fit ads openness score "${normalizedAnswers.q7_ads_openness}".`);
            }
    }
}

function getGoalReasonKey(goalType: GoalType): ReasonKey {
    switch (goalType) {
        case "discovery":
            return "reason_goal_discovery";
        case "traffic":
            return "reason_goal_traffic";
        case "launches":
            return "reason_goal_launches";
        case "retargeting":
            return "reason_goal_retargeting";
        case "sales":
            return "reason_goal_sales_caution";
    }
}

function isPositiveSignal(signal: AssessmentSignalKey, normalizedAnswers: StoredAssessmentAnswers): boolean {
    switch (signal) {
        case "category":
            return normalizedAnswers.q1_category_fit >= 3;
        case "offer":
            return normalizedAnswers.q2_offer_proven >= 3;
        case "assets":
            return normalizedAnswers.q3_assets >= 3;
        case "website":
            return normalizedAnswers.q4_website >= 3;
        case "goal":
            return normalizedAnswers.q5_goal_type !== "sales";
        case "support_readiness":
            return normalizedAnswers.q6_support_readiness >= 2;
        case "ads_openness":
            return normalizedAnswers.q7_ads_openness >= 2;
    }
}

function isBlockerSignal(signal: AssessmentSignalKey, normalizedAnswers: StoredAssessmentAnswers): boolean {
    switch (signal) {
        case "category":
            return normalizedAnswers.q1_category_fit <= 2;
        case "offer":
            return normalizedAnswers.q2_offer_proven <= 1;
        case "assets":
            return normalizedAnswers.q3_assets <= 1;
        case "website":
            return normalizedAnswers.q4_website <= 1;
        case "goal":
            return normalizedAnswers.q5_goal_type === "sales";
        case "support_readiness":
            return normalizedAnswers.q6_support_readiness <= 1;
        case "ads_openness":
            return normalizedAnswers.q7_ads_openness <= 1;
    }
}

function buildSignalEvaluations(normalizedAnswers: StoredAssessmentAnswers): SignalEvaluationMap {
    return POSITIVE_REASON_PRIORITY.reduce<Record<AssessmentSignalKey, SignalEvaluation>>((accumulator, signal) => {
        const isPositive = isPositiveSignal(signal, normalizedAnswers);
        const isBlocker = isBlockerSignal(signal, normalizedAnswers);

        accumulator[signal] = {
            signal,
            score: getSignalScore(signal, normalizedAnswers),
            reasonKey: getSignalReasonKey(signal, normalizedAnswers),
            isPositive,
            isBlocker,
            isModerate: !isPositive && !isBlocker,
        };

        return accumulator;
    }, {} as Record<AssessmentSignalKey, SignalEvaluation>);
}

function selectHighestScoringSignal(
    evaluations: SignalEvaluationMap,
    priorityOrder: readonly AssessmentSignalKey[],
): AssessmentSignalKey {
    return priorityOrder.reduce<AssessmentSignalKey>((bestSignal, signal) => {
        if (evaluations[signal].score > evaluations[bestSignal].score) {
            return signal;
        }

        return bestSignal;
    }, priorityOrder[0]);
}

function selectStrongFitReasonSignals(evaluations: SignalEvaluationMap): readonly AssessmentSignalKey[] {
    return [
        "category",
        selectHighestScoringSignal(evaluations, FOUNDATION_SIGNALS),
        selectHighestScoringSignal(evaluations, READINESS_INTENT_SIGNALS),
    ] as const;
}

function selectPossibleFitReasonSignals(evaluations: SignalEvaluationMap): readonly AssessmentSignalKey[] {
    const selectedSignals: AssessmentSignalKey[] = [];
    const positiveSignals = POSITIVE_REASON_PRIORITY.filter((signal) => evaluations[signal].isPositive);
    const moderateSignals = POSITIVE_REASON_PRIORITY.filter((signal) => evaluations[signal].isModerate);

    for (const signal of positiveSignals) {
        if (selectedSignals.length === 2) {
            break;
        }

        selectedSignals.push(signal);
    }

    for (const signal of moderateSignals) {
        if (selectedSignals.length === 2) {
            break;
        }

        if (!selectedSignals.includes(signal)) {
            selectedSignals.push(signal);
        }
    }

    for (const signal of POSITIVE_REASON_PRIORITY) {
        if (selectedSignals.length === 2) {
            break;
        }

        if (!selectedSignals.includes(signal)) {
            selectedSignals.push(signal);
        }
    }

    const blockerSignal = BLOCKER_REASON_PRIORITY.find(
        (signal) => evaluations[signal].isBlocker && !selectedSignals.includes(signal),
    );

    if (blockerSignal) {
        selectedSignals.push(blockerSignal);
    } else {
        const fallbackSignal = BLOCKER_REASON_PRIORITY.find((signal) => !selectedSignals.includes(signal));

        if (!fallbackSignal) {
            throw new Error("Pinterest Fit possible-fit reason selection could not resolve a third reason.");
        }

        selectedSignals.push(fallbackSignal);
    }

    return selectedSignals as readonly AssessmentSignalKey[];
}

function selectNotRightNowReasonSignals(evaluations: SignalEvaluationMap): readonly AssessmentSignalKey[] {
    const selectedSignals = BLOCKER_REASON_PRIORITY.filter((signal) => evaluations[signal].isBlocker).slice(0, 3);

    if (selectedSignals.length < 3) {
        const fallbackIndexBySignal = NOT_RIGHT_NOW_FALLBACK_PRIORITY.reduce<Record<AssessmentSignalKey, number>>(
            (accumulator, signal, index) => {
                accumulator[signal] = index;
                return accumulator;
            },
            {} as Record<AssessmentSignalKey, number>,
        );

        const remainingSignals = POSITIVE_REASON_PRIORITY.filter((signal) => !selectedSignals.includes(signal)).sort(
            (left, right) => {
                const scoreDifference = evaluations[left].score - evaluations[right].score;

                if (scoreDifference !== 0) {
                    return scoreDifference;
                }

                return fallbackIndexBySignal[left] - fallbackIndexBySignal[right];
            },
        );

        for (const signal of remainingSignals) {
            if (selectedSignals.length === 3) {
                break;
            }

            selectedSignals.push(signal);
        }
    }

    if (selectedSignals.length !== 3) {
        throw new Error("Pinterest Fit not-right-now reason selection did not resolve exactly three reasons.");
    }

    return selectedSignals as readonly AssessmentSignalKey[];
}

function selectReasonSignals(
    finalOutcome: OutcomeKey,
    evaluations: SignalEvaluationMap,
): readonly AssessmentSignalKey[] {
    switch (finalOutcome) {
        case "strong_fit":
            return selectStrongFitReasonSignals(evaluations);
        case "possible_fit":
            return selectPossibleFitReasonSignals(evaluations);
        case "not_right_now":
            return selectNotRightNowReasonSignals(evaluations);
    }
}

function mapReasonKeys(
    selectedSignals: readonly AssessmentSignalKey[],
    evaluations: SignalEvaluationMap,
): ResultReasonKeys {
    if (selectedSignals.length !== 3) {
        throw new Error("Pinterest Fit reason selection must resolve exactly three signals.");
    }

    return [
        evaluations[selectedSignals[0]].reasonKey,
        evaluations[selectedSignals[1]].reasonKey,
        evaluations[selectedSignals[2]].reasonKey,
    ];
}

function mapReasonCopy(reasonKeys: ResultReasonKeys): ResultReasons {
    return [
        REASON_COPY_BY_KEY[reasonKeys[0]],
        REASON_COPY_BY_KEY[reasonKeys[1]],
        REASON_COPY_BY_KEY[reasonKeys[2]],
    ];
}

function matchesRole(
    role: RoleKey,
    normalizedAnswers: StoredAssessmentAnswers,
    finalOutcome: OutcomeKey,
): boolean {
    switch (role) {
        case "not_priority_yet":
            return finalOutcome === "not_right_now";
        case "sales_with_ads_support":
            return (
                normalizedAnswers.q5_goal_type === "sales" &&
                normalizedAnswers.q2_offer_proven >= 3 &&
                normalizedAnswers.q4_website >= 3 &&
                normalizedAnswers.q7_ads_openness >= 2
            );
        case "warm_audience_support":
            return normalizedAnswers.q5_goal_type === "retargeting" && finalOutcome !== "not_right_now";
        case "discovery_traffic":
            return (
                normalizedAnswers.q1_category_fit >= 3 &&
                normalizedAnswers.q3_assets >= 3 &&
                normalizedAnswers.q4_website >= 3 &&
                (normalizedAnswers.q5_goal_type === "discovery" || normalizedAnswers.q5_goal_type === "traffic")
            );
        case "selective_test_channel":
            return (
                normalizedAnswers.q1_category_fit <= 2 &&
                normalizedAnswers.q2_offer_proven >= 3 &&
                normalizedAnswers.q3_assets >= 3 &&
                normalizedAnswers.q4_website >= 3 &&
                (normalizedAnswers.q5_goal_type === "discovery" ||
                    normalizedAnswers.q5_goal_type === "traffic" ||
                    normalizedAnswers.q5_goal_type === "launches") &&
                finalOutcome !== "not_right_now"
            );
        case "organic_first_ads_later":
            return (
                normalizedAnswers.q1_category_fit >= 3 &&
                normalizedAnswers.q3_assets >= 1 &&
                normalizedAnswers.q4_website >= 1 &&
                (normalizedAnswers.q5_goal_type === "discovery" ||
                    normalizedAnswers.q5_goal_type === "traffic" ||
                    normalizedAnswers.q5_goal_type === "launches")
            );
        case "foundation_first":
            return finalOutcome !== "not_right_now";
    }
}

function resolveRole(normalizedAnswers: StoredAssessmentAnswers, finalOutcome: OutcomeKey): RoleKey {
    const matchedRole = ROLE_PRIORITY_ORDER.find((role) => matchesRole(role, normalizedAnswers, finalOutcome));

    if (!matchedRole) {
        throw new Error("Pinterest Fit role resolution failed to match a role.");
    }

    return matchedRole;
}

export function scorePinterestFitAssessment(answers: AssessmentAnswers): AssessmentResult {
    const normalizedAnswers = normalizePinterestFitAnswers(answers);
    const score = calculateTotalScore(normalizedAnswers);
    const baseOutcome = resolveBaseOutcome(score);
    const { finalOutcome, triggeredGuardrails } = applyGuardrails(normalizedAnswers, baseOutcome);
    const evaluations = buildSignalEvaluations(normalizedAnswers);
    const selectedReasonSignals = selectReasonSignals(finalOutcome, evaluations);
    const reasonKeys = mapReasonKeys(selectedReasonSignals, evaluations);
    const reasons = mapReasonCopy(reasonKeys);
    const roleKey = resolveRole(normalizedAnswers, finalOutcome);
    const outcomeCopy = RESULT_COPY_BY_OUTCOME[finalOutcome];

    return {
        score,
        maxScore: MAX_SCORE,
        baseOutcome,
        finalOutcome,
        label: outcomeCopy.label,
        headline: outcomeCopy.headline,
        intro: outcomeCopy.intro,
        reasonKeys,
        reasons,
        roleKey,
        roleCopy: ROLE_COPY_BY_KEY[roleKey],
        cta: CTA_BY_OUTCOME[finalOutcome],
        debug: {
            normalizedAnswers,
            triggeredGuardrails,
            signalScores: POSITIVE_REASON_PRIORITY.reduce<Record<AssessmentSignalKey, number>>((accumulator, signal) => {
                accumulator[signal] = evaluations[signal].score;
                return accumulator;
            }, {} as Record<AssessmentSignalKey, number>),
            signalReasonKeys: POSITIVE_REASON_PRIORITY.reduce<Record<AssessmentSignalKey, ReasonKey>>(
                (accumulator, signal) => {
                    accumulator[signal] = evaluations[signal].reasonKey;
                    return accumulator;
                },
                {} as Record<AssessmentSignalKey, ReasonKey>,
            ),
            positiveSignals: POSITIVE_REASON_PRIORITY.filter((signal) => evaluations[signal].isPositive),
            blockerSignals: BLOCKER_REASON_PRIORITY.filter((signal) => evaluations[signal].isBlocker),
            moderateSignals: POSITIVE_REASON_PRIORITY.filter((signal) => evaluations[signal].isModerate),
            selectedReasonSignals,
            matchedRole: roleKey,
        },
    };
}
