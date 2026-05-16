import { QUESTION_IDS } from "./types";
import type { AssessmentSignalKey, OutcomeScoreBand, QuestionId, RoleKey } from "./types";

export const PINTEREST_FIT_ASSESSMENT_SLUG = "pinterest-fit-assessment" as const;
export const PINTEREST_FIT_ASSESSMENT_NAME = "Pinterest Fit Assessment" as const;

export const QUESTION_COUNT = 7 as const;
export const MAX_SCORE = 25 as const;

export const QUESTION_ORDER = QUESTION_IDS satisfies readonly QuestionId[];

export const OUTCOME_SCORE_BANDS = [
    { outcome: "strong_fit", minScore: 18, maxScore: 25 },
    { outcome: "possible_fit", minScore: 10, maxScore: 17 },
    { outcome: "not_right_now", minScore: 0, maxScore: 9 },
] as const satisfies readonly OutcomeScoreBand[];

export const POSITIVE_REASON_PRIORITY = [
    "category",
    "offer",
    "assets",
    "website",
    "support_readiness",
    "ads_openness",
    "goal",
] as const satisfies readonly AssessmentSignalKey[];

export const BLOCKER_REASON_PRIORITY = [
    "website",
    "assets",
    "offer",
    "support_readiness",
    "ads_openness",
    "category",
    "goal",
] as const satisfies readonly AssessmentSignalKey[];

export const NOT_RIGHT_NOW_FALLBACK_PRIORITY = [
    "goal",
    "support_readiness",
    "ads_openness",
    "category",
    "offer",
    "assets",
    "website",
] as const satisfies readonly AssessmentSignalKey[];

export const ROLE_PRIORITY_ORDER = [
    "not_priority_yet",
    "sales_with_ads_support",
    "warm_audience_support",
    "discovery_traffic",
    "selective_test_channel",
    "organic_first_ads_later",
    "foundation_first",
] as const satisfies readonly RoleKey[];

export const PINTEREST_FIT_CALL_URL_PLACEHOLDER_TOKEN = "TODO_ADD_REAL_FIT_CALL_URL" as const;
export const PINTEREST_FIT_CALL_URL =
    "https://tidycal.com/susycid/pinterest-fit-call?utm_source=fruitful_lab&utm_medium=assessment&utm_campaign=pinterest_fit_assessment&utm_content=book_fit_call" as const;
