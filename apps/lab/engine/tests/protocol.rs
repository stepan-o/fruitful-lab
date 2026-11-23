use loopforge_engine::{
    bdi::{Desire, Evidence},
    history::{hash, History, Journal},
    session::{envelope, Session, SCHEMA},
};
use serde_json::{json, Value};
fn send(s: &mut Session, k: &str, p: Value) -> Vec<Value> {
    s.receive(&envelope(k, 1, p))
}
fn session() -> Session {
    Session::new(
        "a702c1d2-0000-4555-a888-000000000009".into(),
        History::default(),
    )
}
fn join(s: &mut Session, channels: Value) -> Vec<Value> {
    send(
        s,
        "VIEWER_HELLO",
        json!({"viewer_name":"test","viewer_version":"1","supported_schema_versions":[SCHEMA],"supports":{"diff_stream":true,"full_snapshot":true}}),
    );
    send(
        s,
        "SUBSCRIBE",
        json!({"stream":"LIVE","compression":"NONE","snapshot_policy":"ON_JOIN","diff_policy":"DIFF_ONLY","channels":channels}),
    )
}
#[test]
fn negotiation_and_resync() {
    let mut s = session();
    assert!(s.pulse(100).is_empty());
    assert_eq!(send(&mut s, "SUBSCRIBE", json!({}))[0]["msg_type"], "ERROR");
    assert_eq!(send(&mut s, "UNKNOWN", json!({}))[0]["msg_type"], "ERROR");
    let mut wrong = envelope("VIEWER_HELLO", 2, json!({}));
    wrong["kvp_version"] = json!("9");
    assert_eq!(s.receive(&wrong)[0]["msg_type"], "ERROR");
    assert_eq!(join(&mut s, json!(["NARRATIVE"]))[0]["msg_type"], "ERROR");
    let rec = send(
        &mut s,
        "SUBSCRIBE",
        json!({"channels":["WORLD"],"stream":"LIVE","snapshot_policy":"ON_JOIN","diff_policy":"DIFF_ONLY","compression":"NONE","future_extension":true}),
    );
    assert_eq!(rec.len(), 2);
    let p = &rec[1]["payload"];
    assert_eq!(p["state"].as_object().unwrap().len(), 1);
    assert_eq!(p["step_hash"], hash(&p["state"]));
    let h = p["step_hash"].as_str().unwrap();
    send(
        &mut s,
        "INPUT_COMMAND",
        json!({"client_cmd_id":"play","tick_target":1,"cmd":{"type":"VIEW_CONTROL","payload":{"hint":"PLAY"}}}),
    );
    assert!(s.pulse(50).is_empty());
    s.applied(0, h);
    let d = s.pulse(50);
    assert_eq!(d[0]["payload"]["from_tick"], 0);
    assert_eq!(d[0]["payload"]["to_tick"], 1);
    assert_eq!(d[0]["payload"]["prev_step_hash"], h);
    let recovered = send(
        &mut s,
        "DESYNC_REPORT",
        json!({"tick":0,"issue":"TICK_GAP"}),
    );
    assert_eq!(recovered[0]["msg_type"], "DESYNC_CONFIRMED");
    assert_eq!(recovered[1]["msg_type"], "FULL_SNAPSHOT");
    assert!(s.pulse(100).is_empty());
}
#[test]
fn idempotent_input_and_artifact_seek() {
    let mut s = session();
    let joined = join(&mut s, json!(["WORLD", "AGENTS", "ITEMS", "EVENTS"]));
    s.applied(0, joined[1]["payload"]["step_hash"].as_str().unwrap());
    let cmd = json!({"client_cmd_id":"skip-1","tick_target":1,"cmd":{"type":"WORLD_NUDGE","payload":{"action":"skip"}}});
    let first = send(&mut s, "INPUT_COMMAND", cmd.clone());
    assert_eq!(first[0]["msg_type"], "COMMAND_ACCEPTED");
    assert_eq!(send(&mut s, "INPUT_COMMAND", cmd.clone()).len(), 1);
    let run = s.run.clone();
    let dest = send(
        &mut s,
        "REPLAY_BEGIN",
        json!({"run_id":run,"start_tick":0,"end_tick":2,"delivery":"ARTIFACTS"}),
    );
    assert_eq!(dest[0]["msg_type"], "REPLAY_READY");
    let pointer = &dest[0]["payload"]["artifacts_manifest_url"];
    let manifest: Value = serde_json::from_str(&s.artifacts[pointer.as_str().unwrap()]).unwrap();
    assert_eq!(manifest["available_end_tick"], 2);
    assert_eq!(manifest["integrity"]["hash_alg"], "SHA-256");
    assert_eq!(
        send(
            &mut s,
            "REPLAY_SEEK",
            json!({"tick":2,"policy":"SNAPSHOT_THEN_DIFFS"})
        )[0]["msg_type"],
        "ERROR"
    );
    let records = send(
        &mut s,
        "REPLAY_SEEK",
        json!({"tick":0,"policy":"SNAPSHOT_THEN_DIFFS"}),
    );
    assert_eq!(records.len(), 1);
    assert!(s.pulse(500).is_empty());
    assert_eq!(s.history.game.phase, "intro");
    assert_eq!(
        send(
            &mut s,
            "DESYNC_REPORT",
            json!({"issue":"EXTERNAL_HASH_MISMATCH"})
        )
        .len(),
        1
    );
    let restored =
        History::restore(serde_json::from_value::<Journal>(s.history.save(&s.run)).unwrap())
            .unwrap();
    assert_eq!(restored.cursor, 0);
    assert_eq!(restored.head, 1);
    assert_eq!(restored.past(1).unwrap().phase, "console");
}
#[test]
fn evidence_and_priority_change_admission() {
    let mut s = session();
    let actor = s.history.game.world.actor("ed");
    actor.believe("card", json!(true), "saw at boot", 7);
    let opts = [
        Desire {
            plan: "watch",
            goal: "keep sight of card",
            priority: 20,
            evidence: vec![],
        },
        Desire {
            plan: "pick-up",
            goal: "keep credential",
            priority: 85,
            evidence: vec![Evidence {
                fact: "card",
                expected: json!(true),
                source: Some("saw at boot"),
            }],
        },
    ];
    assert_eq!(actor.consider("body", &opts).unwrap().plan, "pick-up");
    actor.believe("card", json!(true), "rumor", 8);
    assert_eq!(actor.consider("body", &opts).unwrap().plan, "watch");
}

#[test]
fn one_day_orders_replace_the_superseded_future() {
    let mut h = History::default();
    h.input("skip", json!({"action":"skip"})).unwrap();
    h.input("call", json!({"action":"answer"})).unwrap();
    h.input("topic", json!({"action":"topic","target":"1"}))
        .unwrap();
    h.seek(2).unwrap();
    h.input("leave", json!({"action":"close"})).unwrap();
    assert_eq!(h.game.phase, "console");
    assert_eq!(h.inputs.len(), 3);
    assert_eq!(h.inputs[&3].id, "leave");
    assert_eq!(h.past(3).unwrap().topic, 0);
}
