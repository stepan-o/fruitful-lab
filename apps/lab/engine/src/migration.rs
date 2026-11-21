//! Recover the older first-playthrough tab save by admitting its recorded inputs.
//! Serialized agents, inventory and client-side outcomes are never imported.
use crate::{
    history::History,
    intro::edited,
    world::{rows, word, CAST},
};
use serde_json::{json, Value};
pub fn legacy(v: &Value) -> Result<History, &'static str> {
    if v["version"] != 1 || !["intro", "console", "call", "floor"].contains(&word(&v["phase"])) {
        return Err("Unsupported playtest save");
    }
    let mut h = History::default();
    let mut n = 0;
    let cmd = |h: &mut History, n: &mut usize, c: Value| {
        *n += 1;
        h.input(&format!("legacy-{n}"), c)
    };
    if v["phase"] == "intro" {
        let ms = (v["seconds"].as_f64().ok_or("Invalid intro time")? * 1000.).round() as i32;
        let confirmed = v["confirmed"].as_u64().unwrap_or(0) as usize;
        if !(0..=190700).contains(&ms) || confirmed > 8 {
            return Err("Invalid intro position");
        }
        while h.game.phase == "intro"
            && (edited(h.game.intro.t) + 25 < ms || h.game.intro.confirmed < confirmed)
        {
            if h.game.intro.held() {
                if h.game.intro.confirmed >= confirmed {
                    return Err("Saved time crosses a tutorial hold");
                }
                let station = &CAST.orders[h.game.intro.confirmed]["station"];
                cmd(&mut h, &mut n, json!({"action":"confirm","target":station}))?
            } else if !h.step() {
                return Err("Intro could not advance");
            }
        }
        return Ok(h);
    }
    cmd(&mut h, &mut n, json!({"action":"skip"}))?;
    let morning = (v["morningSeconds"].as_f64().unwrap_or(0.) * 20.).round() as i32;
    if !(0..=200000).contains(&morning) {
        return Err("Invalid morning time");
    }
    for _ in 0..morning {
        h.step();
    }
    if v["phase"] == "console" {
        return Ok(h);
    }
    cmd(&mut h, &mut n, json!({"action":"answer"}))?;
    if v["callTopic"] == 1 || v["phase"] == "floor" {
        cmd(&mut h, &mut n, json!({"action":"topic","target":"1"}))?
    }
    if v["phase"] == "call" {
        return Ok(h);
    }
    cmd(&mut h, &mut n, json!({"action":"acknowledge"}))?;
    let commands = rows(&v["progress"]["commands"]);
    if commands.len() > 3000 {
        return Err("Invalid saved orders");
    }
    for order in commands {
        let mut c = json!({});
        for k in ["action", "room", "target", "incident"] {
            c[k] = order[k].clone();
        }
        if ["issue-pass", "reject-pass"].contains(&word(&c["action"])) {
            c["incident"] = json!("D2-bob-id")
        }
        let mut applied = false;
        for _ in 0..12000 {
            if h.input(word(&order["id"]), c.clone()).is_ok() {
                applied = true;
                break;
            }
            if !h.step() {
                break;
            }
        }
        if !applied {
            return Err("An old order could not be admitted. The original save is retained.");
        }
    }
    let requested = v["progress"]["tick"].as_i64().unwrap_or(0);
    while i64::from(h.game.shift.t) < requested && h.step() {}
    Ok(h)
}
