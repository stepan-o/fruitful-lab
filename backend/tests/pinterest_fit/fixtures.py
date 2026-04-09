from __future__ import annotations

from itertools import product

from tests.pinterest_fit.models import Answers, Scenario

Q1_CATEGORY_OPTIONS = (1, 2, 3, 4)
Q2_OFFER_OPTIONS = (0, 1, 3, 4)
Q3_ASSET_OPTIONS = (0, 1, 3, 4)
Q4_WEBSITE_OPTIONS = (0, 1, 3, 4)
Q6_SUPPORT_OPTIONS = (0, 1, 2, 3)
Q7_ADS_OPTIONS = (0, 1, 2, 3)
Q5_GOAL_OPTIONS = (
    ("discovery", 3),
    ("traffic", 3),
    ("launches", 3),
    ("retargeting", 3),
    ("sales", 2),
)


def iter_all_answers():
    for q1, q2, q3, q4, (goal_type, goal_fit), q6, q7 in product(
        Q1_CATEGORY_OPTIONS,
        Q2_OFFER_OPTIONS,
        Q3_ASSET_OPTIONS,
        Q4_WEBSITE_OPTIONS,
        Q5_GOAL_OPTIONS,
        Q6_SUPPORT_OPTIONS,
        Q7_ADS_OPTIONS,
    ):
        yield Answers(
            q1_category_fit=q1,
            q2_offer_proven=q2,
            q3_assets=q3,
            q4_website=q4,
            q5_goal_fit=goal_fit,
            q5_goal_type=goal_type,
            q6_support_readiness=q6,
            q7_ads_openness=q7,
        )


DOCUMENTED_SCENARIOS = (
    Scenario(
        name="Scenario 1 — clear strong fit",
        answers=Answers(4, 4, 4, 4, 3, "discovery", 3, 3),
        expected_outcome="strong_fit",
    ),
    Scenario(
        name="Scenario 2 — strong category but weak foundation",
        answers=Answers(4, 1, 0, 0, 3, "traffic", 2, 2),
        expected_outcome="not_right_now",
        expected_role="not_priority_yet",
    ),
    Scenario(
        name="Scenario 3 — sales expectation but low readiness",
        answers=Answers(4, 4, 4, 4, 2, "sales", 1, 1),
        expected_outcome="possible_fit",
    ),
    Scenario(
        name="Scenario 4 — unclear niche + unproven offer",
        answers=Answers(1, 1, 3, 3, 3, "discovery", 2, 2),
        expected_outcome="not_right_now",
    ),
    Scenario(
        name="Scenario 5 — moderate fit",
        answers=Answers(3, 3, 3, 1, 3, "launches", 2, 2),
        expected_outcome="possible_fit",
    ),
    Scenario(
        name="Scenario 6 — low commitment",
        answers=Answers(4, 3, 3, 3, 3, "retargeting", 0, 0),
        expected_outcome="possible_fit",
        expected_role="warm_audience_support",
        expected_reasons=(
            "reason_category_strong",
            "reason_offer_some_traction",
            "reason_support_not_committed",
        ),
    ),
    Scenario(
        name="Scenario 7 — weak assets + weak website",
        answers=Answers(4, 4, 0, 0, 3, "traffic", 3, 3),
        expected_outcome="not_right_now",
        expected_role="not_priority_yet",
        expected_reasons=(
            "reason_site_not_ready",
            "reason_assets_weak",
            "reason_goal_traffic",
        ),
    ),
    Scenario(
        name="Scenario 8 — strong sales-oriented respondent",
        answers=Answers(4, 4, 4, 4, 2, "sales", 3, 3),
        expected_outcome="strong_fit",
        expected_role="sales_with_ads_support",
        expected_reasons=(
            "reason_category_strong",
            "reason_offer_proven",
            "reason_support_ready",
        ),
    ),
    Scenario(
        name="Scenario 9 — strong foundation, less natural category fit",
        answers=Answers(2, 4, 4, 4, 3, "discovery", 3, 3),
        expected_outcome="strong_fit",
        expected_role="selective_test_channel",
        expected_reasons=(
            "reason_category_maybe",
            "reason_offer_proven",
            "reason_support_ready",
        ),
    ),
    Scenario(
        name="Scenario 10 — strong score but weak asset foundation",
        answers=Answers(4, 4, 0, 4, 3, "traffic", 3, 3),
        expected_outcome="strong_fit",
        expected_role="foundation_first",
        expected_reasons=(
            "reason_category_strong",
            "reason_offer_proven",
            "reason_support_ready",
        ),
    ),
    Scenario(
        name="Scenario 11 — strong foundation, weak natural category fit",
        answers=Answers(1, 4, 4, 4, 3, "discovery", 3, 3),
        expected_outcome="strong_fit",
        expected_role="selective_test_channel",
        expected_reasons=(
            "reason_category_weak",
            "reason_offer_proven",
            "reason_support_ready",
        ),
    ),
)
