from tests.pinterest_fit.engine import evaluate
from tests.pinterest_fit.fixtures import iter_all_answers


def test_all_answer_sets_return_three_reasons():
    for answers in iter_all_answers():
        result = evaluate(answers)
        assert len(result.reason_keys) == 3


def test_all_answer_sets_resolve_to_exactly_one_role():
    unresolved = [result for result in map(evaluate, iter_all_answers()) if result.role_key is None]
    assert unresolved == []


def test_all_answer_sets_are_now_deterministic():
    warned = [result for result in map(evaluate, iter_all_answers()) if result.warnings]
    assert warned == []
