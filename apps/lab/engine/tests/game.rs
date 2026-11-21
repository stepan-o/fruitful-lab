use loopforge_engine::{campaign::Game, line::members};
use serde_json::json;
fn start(lead: &str) -> Game {
    let mut g = Game::default();
    for c in [
        json!({"action":"skip"}),
        json!({"action":"answer"}),
        json!({"action":"topic","target":"1"}),
        json!({"action":"acknowledge"}),
        json!({"action":"appoint","room":"security","target":lead,"incident":"morning"}),
    ] {
        g.apply(&c).unwrap()
    }
    g
}
fn run(lead: &str, outcome: &str) -> Game {
    let mut g = start(lead);
    let mut seen = std::collections::BTreeSet::new();
    let mut manual = 0;
    for _ in 0..9500 {
        seen.insert(g.shift.lesson.clone());
        if g.shift.closed {
            break;
        }
        if g.shift.held() {
            let pair = g.shift.lesson == "pairs";
            let ids = if pair {
                ["sam", "sam", "max", "max"]
            } else {
                ["sam", "max", "jo", "kit"]
            };
            for (station, id) in ["intake", "wash", "belt", "forge"].into_iter().zip(ids) {
                g.apply(&json!({"action":"post","room":"conveyor","target":station,"incident":id}))
                    .unwrap()
            }
            continue;
        }
        if g.shift.case == "open" && outcome != "timeout" {
            g.apply(
                &json!({"action":outcome,"room":"security","target":"bob","incident":"D2-bob-id"}),
            )
            .unwrap()
        }
        if lead == "STILETTO" && g.shift.lesson == "live" {
            for i in 0..4 {
                if let Some(load) = &g.shift.line.cells[i] {
                    let team = members(&g.world, i);
                    if !team.is_empty() {
                        let c = json!({"room":"conveyor","action":"clear","target":loopforge_engine::world::STATIONS[i],"incident":format!("{}/{}",load.id,team[0])});
                        if g.apply(&c).is_ok() {
                            manual += 1;
                            break;
                        }
                    }
                }
            }
        }
        g.step();
    }
    assert!(
        g.shift.closed,
        "{:?} {} {}",
        seen, g.shift.lesson, g.shift.t
    );
    assert!(
        seen.contains("live"),
        "stalled at {} with cue {} positions {:?}, stations {:?}",
        g.shift.lesson,
        g.shift.cue,
        g.world
            .agents
            .iter()
            .map(|(k, a)| (k, a.p, a.target.clone()))
            .collect::<Vec<_>>(),
        g.shift
            .line
            .cells
            .iter()
            .map(|c| c.as_ref().map(|j| (&j.id, j.work, j.permit)))
            .collect::<Vec<_>>()
    );
    if lead == "STILETTO" {
        assert!(manual > 0)
    } else {
        assert_eq!(
            g.shift.case,
            if outcome == "issue-pass" {
                "pass"
            } else {
                "detention"
            }
        );
        assert!(seen.contains("singles"));
        assert_eq!(
            g.shift.entered.contains(&"bob".to_owned()),
            outcome == "issue-pass"
        )
    }
    assert!(g.world.rack.len() > g.shift.initial + 1);
    g
}
#[test]
fn both_supervisors_produce_and_close() {
    run("STILETTO", "timeout");
    run("LIMEN", "issue-pass");
}
#[test]
fn reject_and_expiry_have_custody_consequences() {
    run("LIMEN", "reject-pass");
    run("LIMEN", "timeout");
}
