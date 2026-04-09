import pytest

from tests.pinterest_fit.engine import evaluate
from tests.pinterest_fit.fixtures import DOCUMENTED_SCENARIOS


@pytest.mark.parametrize("scenario", DOCUMENTED_SCENARIOS, ids=lambda s: s.name)
def test_documented_brief_scenarios(scenario):
    result = evaluate(scenario.answers)

    assert result.final_outcome == scenario.expected_outcome

    if scenario.expected_role is not None:
        assert result.role_key == scenario.expected_role

    if scenario.expected_reasons is not None:
        assert result.reason_keys == scenario.expected_reasons
