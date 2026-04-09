from __future__ import annotations

from tests.pinterest_fit.models import Answers, Evaluation, Outcome, SignalName

POSITIVE_PRIORITY = ("category", "offer", "assets", "website", "support", "ads", "goal")
BLOCKER_PRIORITY = ("website", "assets", "offer", "support", "ads", "category", "goal")
NOT_RIGHT_NOW_FALLBACK_PRIORITY = (
    "goal",
    "support",
    "ads",
    "category",
    "offer",
    "assets",
    "website",
)


def evaluate(answers: Answers) -> Evaluation:
    warnings: list[str] = []
    total_score = score_total(answers)
    base_outcome = classify_base_outcome(total_score)
    final_outcome, applied_guardrails = apply_guardrails(answers, base_outcome)
    reason_keys = select_reasons(answers, final_outcome, warnings)
    role_key = assign_role(answers, final_outcome, warnings)
    return Evaluation(
        total_score=total_score,
        base_outcome=base_outcome,
        final_outcome=final_outcome,
        role_key=role_key,
        reason_keys=reason_keys,
        applied_guardrails=applied_guardrails,
        warnings=tuple(warnings),
    )


def score_total(answers: Answers) -> int:
    return (
        answers.q1_category_fit
        + answers.q2_offer_proven
        + answers.q3_assets
        + answers.q4_website
        + answers.q5_goal_fit
        + answers.q6_support_readiness
        + answers.q7_ads_openness
    )


def classify_base_outcome(total_score: int) -> Outcome:
    if total_score >= 18:
        return "strong_fit"
    if total_score >= 10:
        return "possible_fit"
    return "not_right_now"


def apply_guardrails(answers: Answers, base_outcome: Outcome) -> tuple[Outcome, tuple[str, ...]]:
    outcome = base_outcome
    applied: list[str] = []

    if (
        answers.q5_goal_type == "sales"
        and answers.q6_support_readiness <= 1
        and answers.q7_ads_openness <= 1
        and outcome == "strong_fit"
    ):
        outcome = "possible_fit"
        applied.append("guardrail_a")

    if answers.q3_assets == 0 and answers.q4_website == 0:
        outcome = "not_right_now"
        applied.append("guardrail_b")

    if answers.q1_category_fit == 1 and answers.q2_offer_proven <= 1:
        outcome = "not_right_now"
        applied.append("guardrail_c")

    return outcome, tuple(applied)


def select_reasons(
    answers: Answers, final_outcome: Outcome, warnings: list[str]
) -> tuple[str, str, str]:
    if final_outcome == "strong_fit":
        category_reason = reason_key_for_signal(answers, "category")
        foundation_signal = pick_best_signal(
            answers,
            ("offer", "assets", "website"),
            tie_order=("offer", "assets", "website"),
        )
        readiness_signal = pick_best_signal(
            answers,
            ("support", "ads", "goal"),
            tie_order=("support", "ads", "goal"),
        )
        return (
            category_reason,
            reason_key_for_signal(answers, foundation_signal),
            reason_key_for_signal(answers, readiness_signal),
        )

    if final_outcome == "possible_fit":
        positives = [signal for signal in POSITIVE_PRIORITY if is_positive(answers, signal)]
        selected_signals: list[SignalName] = []
        if positives:
            selected_signals.append(positives[0])

        if len(positives) >= 2:
            selected_signals.append(positives[1])
        else:
            moderate = next((signal for signal in POSITIVE_PRIORITY if is_moderate(answers, signal)), None)
            if moderate is not None:
                selected_signals.append(moderate)
            else:
                fallback = next(
                    signal
                    for signal in POSITIVE_PRIORITY
                    if signal not in selected_signals
                )
                selected_signals.append(fallback)

        blockers = [
            signal
            for signal in BLOCKER_PRIORITY
            if is_blocker(answers, signal) and signal not in selected_signals
        ]
        if blockers:
            selected_signals.append(blockers[0])

        selected = [reason_key_for_signal(answers, signal) for signal in selected_signals]
        return ensure_three(selected, answers, warnings)

    blocker_reasons = [
        reason_key_for_signal(answers, signal)
        for signal in BLOCKER_PRIORITY
        if is_blocker(answers, signal)
    ]
    selected = blocker_reasons[:3]
    if len(selected) < 3:
        selected.extend(fill_not_right_now_reasons(answers, selected, warnings))
    return ensure_three(selected, answers, warnings)


def fill_not_right_now_reasons(
    answers: Answers, selected: list[str], warnings: list[str]
) -> list[str]:
    selected_signals = {signal_for_reason(reason) for reason in selected}
    remaining_signals = [signal for signal in POSITIVE_PRIORITY if signal not in selected_signals]
    filled: list[str] = []

    while len(selected) + len(filled) < 3:
        scores = {signal: signal_score(answers, signal) for signal in remaining_signals}
        next_score = min(scores.values())
        tied_signals = [signal for signal in remaining_signals if scores[signal] == next_score]
        tied_signals.sort(key=NOT_RIGHT_NOW_FALLBACK_PRIORITY.index)
        chosen = tied_signals[0]
        filled.append(reason_key_for_signal(answers, chosen))
        remaining_signals.remove(chosen)

    return filled


def ensure_three(selected: list[str], answers: Answers, warnings: list[str]) -> tuple[str, str, str]:
    deduped: list[str] = []
    for reason in selected:
        if reason not in deduped:
            deduped.append(reason)

    if len(deduped) < 3:
        warnings.append("reason_fill_required")
        for signal in POSITIVE_PRIORITY:
            reason = reason_key_for_signal(answers, signal)
            if reason not in deduped:
                deduped.append(reason)
            if len(deduped) == 3:
                break

    return deduped[0], deduped[1], deduped[2]


def assign_role(answers: Answers, final_outcome: Outcome, warnings: list[str]) -> str | None:
    role_key: str | None = None

    if final_outcome == "not_right_now":
        role_key = "not_priority_yet"
    elif (
        answers.q5_goal_type == "sales"
        and answers.q2_offer_proven >= 3
        and answers.q4_website >= 3
        and answers.q7_ads_openness >= 2
    ):
        role_key = "sales_with_ads_support"
    elif answers.q5_goal_type == "retargeting" and final_outcome != "not_right_now":
        role_key = "warm_audience_support"
    elif (
        answers.q1_category_fit >= 3
        and answers.q3_assets >= 3
        and answers.q4_website >= 3
        and answers.q5_goal_type in ("discovery", "traffic")
    ):
        role_key = "discovery_traffic"
    elif (
        answers.q1_category_fit <= 2
        and answers.q2_offer_proven >= 3
        and answers.q3_assets >= 3
        and answers.q4_website >= 3
        and answers.q5_goal_type in ("discovery", "traffic", "launches")
        and final_outcome != "not_right_now"
    ):
        role_key = "selective_test_channel"
    elif (
        answers.q1_category_fit >= 3
        and answers.q3_assets >= 1
        and answers.q4_website >= 1
        and answers.q5_goal_type in ("discovery", "traffic", "launches")
    ):
        role_key = "organic_first_ads_later"
    elif final_outcome != "not_right_now":
        role_key = "foundation_first"

    return role_key


def pick_best_signal(
    answers: Answers, candidates: tuple[SignalName, ...], tie_order: tuple[SignalName, ...]
) -> SignalName:
    best_score = max(signal_score(answers, signal) for signal in candidates)
    tied = [signal for signal in candidates if signal_score(answers, signal) == best_score]
    tied.sort(key=tie_order.index)
    return tied[0]


def is_positive(answers: Answers, signal: SignalName) -> bool:
    if signal == "category":
        return answers.q1_category_fit >= 3
    if signal == "offer":
        return answers.q2_offer_proven >= 3
    if signal == "assets":
        return answers.q3_assets >= 3
    if signal == "website":
        return answers.q4_website >= 3
    if signal == "support":
        return answers.q6_support_readiness >= 2
    if signal == "ads":
        return answers.q7_ads_openness >= 2
    return answers.q5_goal_type in ("discovery", "traffic", "launches", "retargeting")


def is_blocker(answers: Answers, signal: SignalName) -> bool:
    if signal == "category":
        return answers.q1_category_fit <= 2
    if signal == "offer":
        return answers.q2_offer_proven <= 1
    if signal == "assets":
        return answers.q3_assets <= 1
    if signal == "website":
        return answers.q4_website <= 1
    if signal == "support":
        return answers.q6_support_readiness <= 1
    if signal == "ads":
        return answers.q7_ads_openness <= 1
    return answers.q5_goal_type == "sales"


def is_moderate(answers: Answers, signal: SignalName) -> bool:
    return not is_positive(answers, signal) and not is_blocker(answers, signal)


def signal_score(answers: Answers, signal: SignalName) -> int:
    if signal == "category":
        return answers.q1_category_fit
    if signal == "offer":
        return answers.q2_offer_proven
    if signal == "assets":
        return answers.q3_assets
    if signal == "website":
        return answers.q4_website
    if signal == "support":
        return answers.q6_support_readiness
    if signal == "ads":
        return answers.q7_ads_openness
    return answers.q5_goal_fit


def reason_key_for_signal(answers: Answers, signal: SignalName) -> str:
    if signal == "category":
        return {
            4: "reason_category_strong",
            3: "reason_category_good",
            2: "reason_category_maybe",
            1: "reason_category_weak",
        }[answers.q1_category_fit]
    if signal == "offer":
        return {
            4: "reason_offer_proven",
            3: "reason_offer_some_traction",
            1: "reason_offer_early",
            0: "reason_offer_unproven",
        }[answers.q2_offer_proven]
    if signal == "assets":
        return {
            4: "reason_assets_strong",
            3: "reason_assets_decent",
            1: "reason_assets_limited",
            0: "reason_assets_weak",
        }[answers.q3_assets]
    if signal == "website":
        return {
            4: "reason_site_ready",
            3: "reason_site_solid",
            1: "reason_site_friction",
            0: "reason_site_not_ready",
        }[answers.q4_website]
    if signal == "support":
        return {
            3: "reason_support_ready",
            2: "reason_support_open",
            1: "reason_support_cautious",
            0: "reason_support_not_committed",
        }[answers.q6_support_readiness]
    if signal == "ads":
        return {
            3: "reason_ads_open",
            2: "reason_ads_later",
            1: "reason_ads_unsure",
            0: "reason_ads_not_open",
        }[answers.q7_ads_openness]
    return {
        "discovery": "reason_goal_discovery",
        "traffic": "reason_goal_traffic",
        "launches": "reason_goal_launches",
        "retargeting": "reason_goal_retargeting",
        "sales": "reason_goal_sales_caution",
    }[answers.q5_goal_type]


def signal_for_reason(reason_key: str) -> SignalName:
    if reason_key.startswith("reason_category_"):
        return "category"
    if reason_key.startswith("reason_offer_"):
        return "offer"
    if reason_key.startswith("reason_assets_"):
        return "assets"
    if reason_key.startswith("reason_site_"):
        return "website"
    if reason_key.startswith("reason_goal_"):
        return "goal"
    if reason_key.startswith("reason_support_"):
        return "support"
    return "ads"
