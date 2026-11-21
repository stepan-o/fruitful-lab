use crate::{
    history::*,
    world::{rows, word, Table},
};
use serde_json::{json, Value};
use std::collections::BTreeSet;
pub const SCHEMA: &str = "loopforge_campaign_1";
const CHANNELS: [&str; 4] = ["WORLD", "AGENTS", "ITEMS", "EVENTS"];
pub fn envelope(kind: &str, id: u64, p: Value) -> Value {
    json!({"kvp_version":"0.1","msg_type":kind,"msg_id":format!("00000000-0000-4000-8000-{id:012x}"),"sent_at_ms":0,"payload":p})
}
fn select(mut state: Value, channels: &BTreeSet<String>) -> Value {
    state
        .as_object_mut()
        .unwrap()
        .retain(|key, _| channels.contains(&key.to_uppercase()));
    state
}
fn full(t: u32, s: &Value) -> Value {
    json!({"tick":t,"schema_version":SCHEMA,"state":s,"step_hash":hash(s)})
}
fn diff(t: u32, prev: &Value, h: &str, next: &Value, nh: &str) -> Value {
    let mut ops = vec![];
    difference(prev, next, &mut vec![], &mut ops);
    json!({"schema_version":SCHEMA,"from_tick":t-1,"to_tick":t,"prev_step_hash":h,"step_hash":nh,"ops":ops})
}
pub struct Session {
    pub run: String,
    pub history: History,
    mode: &'static str,
    channels: BTreeSet<String>,
    seq: u64,
    last: Value,
    last_hash: String,
    pub paused: bool,
    pub rate: u32,
    credit: u32,
    cache: Table<(Value, Value)>,
    pub artifact_origin: String,
    pub artifacts: Table<String>,
    replay_range: (u32, u32),
    awaiting: bool,
}
impl Session {
    pub fn new(run: String, history: History) -> Self {
        Self {
            run,
            history,
            mode: "hello",
            channels: BTreeSet::new(),
            seq: 0,
            last: Value::Null,
            last_hash: String::new(),
            paused: true,
            rate: 2,
            credit: 0,
            cache: Table::new(),
            artifact_origin: "artifact:/".into(),
            artifacts: Table::new(),
            replay_range: (0, 0),
            awaiting: false,
        }
    }
    fn msg(&mut self, k: &str, p: Value) -> Value {
        self.seq += 1;
        envelope(k, self.seq, p)
    }
    fn state(&self) -> Value {
        select(self.history.game.project(), &self.channels)
    }
    fn baseline(&mut self) -> Value {
        self.last = self.state();
        self.last_hash = hash(&self.last);
        self.awaiting = true;
        let data = full(self.history.cursor, &self.last);
        self.msg("FULL_SNAPSHOT", data)
    }
    pub fn applied(&mut self, t: u32, h: &str) {
        if t == self.history.cursor && h == self.last_hash {
            self.awaiting = false
        }
    }
    fn frame(&mut self) -> Value {
        let next = self.state();
        let nh = hash(&next);
        let p = diff(self.history.cursor, &self.last, &self.last_hash, &next, &nh);
        self.last = next;
        self.last_hash = nh;
        self.msg("FRAME_DIFF", p)
    }
    pub fn pulse(&mut self, ms: u32) -> Vec<Value> {
        if self.mode != "live" || self.paused || self.awaiting {
            return vec![];
        }
        self.credit += ms.min(250) * self.rate;
        let mut out = vec![];
        while self.credit >= 100 {
            self.credit -= 100;
            if self.history.step() {
                out.push(self.frame())
            } else {
                self.credit = 0;
                break;
            }
        }
        out
    }
    fn replay(&mut self, t: u32) -> Result<Value, &'static str> {
        let start = (t / INTERVAL * INTERVAL).max(self.replay_range.0);
        self.replay_files(start, t)
    }
    /// Offline exports and kernel-hosted seeks use the same artifact builder.
    pub fn offline(&mut self) -> Result<Table<String>, &'static str> {
        self.channels = CHANNELS.iter().map(|s| s.to_string()).collect();
        self.replay_range = (0, self.history.head + 1);
        let ready = self.replay_files(0, self.history.head)?;
        let base = ready["artifacts_manifest_url"]
            .as_str()
            .unwrap()
            .strip_suffix("manifest.kvp.json")
            .unwrap();
        Ok(self
            .artifacts
            .iter()
            .filter_map(|(path, data)| Some((path.strip_prefix(base)?.into(), data.clone())))
            .collect())
    }
    fn replay_files(&mut self, start: u32, t: u32) -> Result<Value, &'static str> {
        let mut game = self.history.past(start)?;
        let mut state = select(game.project(), &self.channels);
        let mut hash_before = hash(&state);
        self.artifacts.clear();
        let snap = envelope("FULL_SNAPSHOT", start as u64, full(start, &state)).to_string();
        let snap_id = format!("snap-{start}");
        let snap_path = format!("state/snapshots/tick_{start:010}.kvp.json");
        let mut hashes = Table::new();
        hashes.insert(snap_id.clone(), hash_bytes(snap.as_bytes()));
        let snapshots = Table::from([(
            start.to_string(),
            json!({"id":snap_id,"format":"JSON","msg_type":"FULL_SNAPSHOT","tick":start,"rel_path":snap_path}),
        )]);
        let mut files = Table::from([(snap_path, snap)]);
        let mut diffs = Table::new();
        for at in start + 1..=t {
            if let Some(input) = self.history.inputs.get(&at) {
                game.apply(&input.command)?
            } else {
                game.step()
            }
            let next = select(game.project(), &self.channels);
            let nh = hash(&next);
            let from = at - 1;
            let d = envelope(
                "FRAME_DIFF",
                at as u64,
                diff(at, &state, &hash_before, &next, &nh),
            )
            .to_string();
            let id = format!("diff-{from}");
            let path = format!("state/diffs/from_{from:010}_to_{at:010}.kvp.json");
            hashes.insert(id.clone(), hash_bytes(d.as_bytes()));
            diffs.insert(from.to_string(),json!({"id":id,"format":"JSON","msg_type":"FRAME_DIFF","from_tick":from,"to_tick":at,"rel_path":path}));
            files.insert(path, d);
            state = next;
            hash_before = nh;
        }
        let manifest = json!({"kvp_version":"0.1","schema_version":SCHEMA,"channels":self.channels,"available_start_tick":start,"available_end_tick":t+1,"keyframe_ticks":[start],
 "run_anchors":{"engine_name":"loopforge_rust","engine_version":"0.1.0","schema_version":SCHEMA,"world_id":"e826632c-da7b-4f81-971c-1522acd6742d","run_id":self.run,"seed":0,"tick_rate_hz":20,"time_origin_ms":0},
 "render_spec":serde_json::from_str::<Value>(include_str!("../content/render-spec.json")).unwrap(),"snapshots":snapshots,"diffs":{"diffs_by_from_tick":diffs},"integrity":{"hash_alg":"SHA-256","records_sha256":hashes},"layout":{"diff_storage":"PER_TICK_FILES","records_root":".","snapshots_dir":"state/snapshots","diffs_dir":"state/diffs","overlays_dir":"overlays"},"overlays":{},"step_hash":hash_before});
        let data = manifest.to_string();
        let digest = hash_bytes(data.as_bytes());
        let base = format!("{}/{}/{digest}/", self.artifact_origin, self.run);
        for (path, text) in files {
            self.artifacts.insert(format!("{base}{path}"), text);
        }
        let url = format!("{base}manifest.kvp.json");
        self.artifacts.insert(url.clone(), data);
        Ok(
            json!({"run_id":self.run,"available_start_tick":self.replay_range.0,"available_end_tick":self.replay_range.1,"keyframe_interval":INTERVAL,"delivery":"ARTIFACTS","recovery_tick":t,"artifacts_manifest_url":url,"manifest_sha256":digest}),
        )
    }
    pub fn receive(&mut self, e: &Value) -> Vec<Value> {
        match self.dispatch(e) {
            Ok(out) => out,
            Err(reason) => {
                vec![self.msg("ERROR", json!({"code":"INVALID_MESSAGE","message":reason}))]
            }
        }
    }
    fn dispatch(&mut self, e: &Value) -> Result<Vec<Value>, &'static str> {
        if e["kvp_version"] != "0.1"
            || word(&e["msg_id"]).is_empty()
            || e["sent_at_ms"].as_u64().is_none()
            || !e["payload"].is_object()
        {
            return Err("Invalid KVP envelope");
        }
        let p = &e["payload"];
        let kind = word(&e["msg_type"]);
        match (self.mode, kind) {
            ("hello", "VIEWER_HELLO") => {
                if !rows(&p["supported_schema_versions"]).contains(&json!(SCHEMA)) {
                    return Err("Unsupported schema");
                }
                self.mode = "subscribe";
                Ok(vec![self.msg("KERNEL_HELLO",json!({"engine_name":"loopforge_rust","engine_version":"0.1.0","schema_version":SCHEMA,"world_id":"e826632c-da7b-4f81-971c-1522acd6742d","run_id":self.run,"seed":0,"tick_rate_hz":20,"time_origin_ms":0,"render_spec":serde_json::from_str::<Value>(include_str!("../content/render-spec.json")).unwrap()}))])
            }
            ("subscribe" | "replay", "SUBSCRIBE") => {
                if p["stream"] != "LIVE"
                    || p["snapshot_policy"] != "ON_JOIN"
                    || p["diff_policy"] != "DIFF_ONLY"
                    || p["compression"] != "NONE"
                {
                    return Err("Unsupported subscription policy");
                }
                let channels: BTreeSet<_> = rows(&p["channels"])
                    .iter()
                    .map(|x| word(x).to_owned())
                    .collect();
                if channels.is_empty()
                    || channels.len() != rows(&p["channels"]).len()
                    || channels.iter().any(|c| !CHANNELS.contains(&c.as_str()))
                {
                    return Err("Unsupported or duplicate channel");
                }
                self.channels = channels;
                self.mode = "live";
                Ok(vec![self.msg("SUBSCRIBED",json!({"effective_stream":"LIVE","effective_channels":self.channels,"effective_diff_policy":"DIFF_ONLY","effective_snapshot_policy":"ON_JOIN","effective_compression":"NONE"})),self.baseline()])
            }
            ("live", "INPUT_COMMAND") => {
                let id = word(&p["client_cmd_id"]);
                if id.is_empty() || id.len() > 96 {
                    return Err("Invalid command ID");
                }
                if let Some((old, response)) = self.cache.get(id) {
                    return Ok(vec![if old == p {
                        response.clone()
                    } else {
                        self.msg(
                            "COMMAND_REJECTED",
                            json!({"client_cmd_id":id,"reason":"ID_CONFLICT"}),
                        )
                    }]);
                }
                if let Some((at, input)) = self.history.inputs.iter().find(|(_, c)| c.id == id) {
                    let matches = p["tick_target"] == *at
                        && p["cmd"]["type"] == "WORLD_NUDGE"
                        && p["cmd"]["payload"] == input.command;
                    return Ok(vec![if matches {
                        self.msg("COMMAND_ACCEPTED", json!({"client_cmd_id":id}))
                    } else {
                        self.msg(
                            "COMMAND_REJECTED",
                            json!({"client_cmd_id":id,"reason":"ID_CONFLICT"}),
                        )
                    }]);
                }
                let mut domain = false;
                let cmd = &p["cmd"];
                let payload = &cmd["payload"];
                let accepted = if p["tick_target"].as_u64() != Some(self.history.cursor as u64 + 1)
                {
                    Err("STALE_TICK")
                } else {
                    match word(&cmd["type"]) {
                        "VIEW_CONTROL" => match word(&payload["hint"]) {
                            "PLAY" => {
                                self.paused = false;
                                Ok(())
                            }
                            "PAUSE" => {
                                self.paused = true;
                                self.credit = 0;
                                Ok(())
                            }
                            "BASELINE_APPLIED"
                                if payload["tick"] == self.history.cursor
                                    && payload["step_hash"] == self.last_hash =>
                            {
                                self.awaiting = false;
                                Ok(())
                            }
                            "RATE" => match payload["rate_milli"].as_u64() {
                                Some(n @ (500 | 1000 | 2000)) => {
                                    self.rate = n as u32 / 500;
                                    Ok(())
                                }
                                _ => Err("Invalid speed"),
                            },
                            _ => Err("Unknown view control"),
                        },
                        "WORLD_NUDGE" if !self.awaiting => {
                            domain = true;
                            self.history.input(id, payload.clone())
                        }
                        _ => Err("Unknown or unavailable command"),
                    }
                };
                let ack = match accepted {
                    Ok(()) => self.msg("COMMAND_ACCEPTED", json!({"client_cmd_id":id})),
                    Err(reason) => self.msg(
                        "COMMAND_REJECTED",
                        json!({"client_cmd_id":id,"reason":reason}),
                    ),
                };
                self.cache.insert(id.into(), (p.clone(), ack.clone()));
                if accepted.is_ok() && domain {
                    Ok(vec![ack, self.frame()])
                } else {
                    Ok(vec![ack])
                }
            }
            ("live" | "replay", "REPLAY_BEGIN") => {
                let lo = p["start_tick"].as_u64().ok_or("Missing start tick")?;
                let hi = p["end_tick"].as_u64().ok_or("Missing end tick")?;
                if p["run_id"] != self.run
                    || p["delivery"] != "ARTIFACTS"
                    || lo >= hi
                    || hi > self.history.head as u64 + 1
                {
                    return Err("Invalid replay range or delivery");
                }
                self.mode = "replay";
                self.paused = true;
                self.credit = 0;
                self.replay_range = (lo as u32, hi as u32);
                let at = self.history.cursor.clamp(lo as u32, hi as u32 - 1);
                let pointer = self.replay(at)?;
                Ok(vec![self.msg("REPLAY_READY", pointer)])
            }
            ("replay", "REPLAY_SEEK") => {
                let t = p["tick"].as_u64().ok_or("Invalid tick")?;
                if p["policy"] != "SNAPSHOT_THEN_DIFFS"
                    || t < self.replay_range.0 as u64
                    || t >= self.replay_range.1 as u64
                {
                    return Err("Invalid replay seek");
                }
                let pointer = self.replay(t as u32)?;
                self.history.seek(t as u32)?;
                Ok(vec![self.msg("REPLAY_READY", pointer)])
            }
            ("live" | "replay", "DESYNC_REPORT") => {
                if ![
                    "TICK_GAP",
                    "FROM_TICK_MISMATCH",
                    "INVALID_PAYLOAD",
                    "EXTERNAL_HASH_MISMATCH",
                ]
                .contains(&word(&p["issue"]))
                {
                    return Err("Invalid desync issue");
                }
                let t = self.history.cursor;
                if self.mode == "live" {
                    Ok(vec![
                        self.msg("DESYNC_CONFIRMED", json!({"recovery_tick":t})),
                        self.baseline(),
                    ])
                } else {
                    let pointer = self.replay(t)?;
                    Ok(vec![self.msg("DESYNC_CONFIRMED", pointer)])
                }
            }
            _ => Err("Message is unknown or out of sequence"),
        }
    }
}
