from __future__ import annotations

from collections import Counter

from tests.pinterest_fit.engine import evaluate
from tests.pinterest_fit.fixtures import DOCUMENTED_SCENARIOS, iter_all_answers


def main() -> None:
    evaluations = [evaluate(answers) for answers in iter_all_answers()]
    unresolved_roles = [result for result in evaluations if result.role_key is None]
    warning_counts = Counter(warning for result in evaluations for warning in result.warnings)

    print("Pinterest Fit Assessment simulation")
    print(f"Total answer sets: {len(evaluations)}")
    print(f"Unresolved roles: {len(unresolved_roles)}")
    print(f"Warnings: {dict(warning_counts)}")
    print()
    print("Documented scenarios")

    for scenario in DOCUMENTED_SCENARIOS:
        result = evaluate(scenario.answers)
        print(
            f"- {scenario.name}: outcome={result.final_outcome} role={result.role_key} "
            f"reasons={result.reason_keys} warnings={result.warnings}"
        )

    if unresolved_roles:
        print()
        print("First unresolved-role examples")
        for result in unresolved_roles[:5]:
            print(result)


if __name__ == "__main__":
    main()
