from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

GoalType = Literal["discovery", "traffic", "launches", "retargeting", "sales"]
Outcome = Literal["strong_fit", "possible_fit", "not_right_now"]
SignalName = Literal[
    "category",
    "offer",
    "assets",
    "website",
    "goal",
    "support",
    "ads",
]


@dataclass(frozen=True)
class Answers:
    q1_category_fit: int
    q2_offer_proven: int
    q3_assets: int
    q4_website: int
    q5_goal_fit: int
    q5_goal_type: GoalType
    q6_support_readiness: int
    q7_ads_openness: int


@dataclass(frozen=True)
class Evaluation:
    total_score: int
    base_outcome: Outcome
    final_outcome: Outcome
    role_key: str | None
    reason_keys: tuple[str, str, str]
    applied_guardrails: tuple[str, ...]
    warnings: tuple[str, ...]


@dataclass(frozen=True)
class Scenario:
    name: str
    answers: Answers
    expected_outcome: Outcome
    expected_role: str | None = None
    expected_reasons: tuple[str, ...] | None = None
