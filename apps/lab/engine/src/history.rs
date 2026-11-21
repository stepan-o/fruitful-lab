use crate::campaign::Game;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;
pub fn hash_bytes(data: &[u8]) -> String {
    format!("{:x}", Sha256::digest(data))
}
pub fn hash(v: &Value) -> String {
    hash_bytes(&serde_json::to_vec(v).unwrap())
}
pub const INTERVAL: u32 = 100;
const LIMIT: u32 = 1_000_000;
#[derive(Clone, Serialize, Deserialize)]
pub struct Input {
    pub id: String,
    pub command: Value,
}
#[derive(Serialize, Deserialize)]
pub struct Journal {
    pub version: u8,
    pub run_id: String,
    pub cursor: u32,
    pub head: u32,
    pub inputs: BTreeMap<u32, Input>,
    pub step_hash: String,
}
pub struct History {
    pub game: Game,
    pub cursor: u32,
    pub head: u32,
    pub inputs: BTreeMap<u32, Input>,
    keys: BTreeMap<u32, Game>,
}
impl Default for History {
    fn default() -> Self {
        let game = Game::default();
        Self {
            keys: BTreeMap::from([(0, game.clone())]),
            game,
            cursor: 0,
            head: 0,
            inputs: BTreeMap::new(),
        }
    }
}
impl History {
    fn replay_step(g: &mut Game, input: Option<&Input>) -> Result<(), &'static str> {
        if let Some(i) = input {
            g.apply(&i.command)
        } else if g.timed() {
            g.step();
            Ok(())
        } else {
            Err("Journal crosses a held clock")
        }
    }
    pub fn past(&self, target: u32) -> Result<Game, &'static str> {
        if target > self.head {
            return Err("Outside recording");
        }
        let (start, base) = self.keys.range(..=target).next_back().unwrap();
        let mut game = base.clone();
        for t in start + 1..=target {
            Self::replay_step(&mut game, self.inputs.get(&t))?
        }
        Ok(game)
    }
    pub fn seek(&mut self, t: u32) -> Result<(), &'static str> {
        self.game = self.past(t)?;
        self.cursor = t;
        Ok(())
    }
    fn commit(&mut self) {
        self.cursor += 1;
        self.head = self.head.max(self.cursor);
        if self.cursor % INTERVAL == 0 {
            self.keys.insert(self.cursor, self.game.clone());
        }
    }
    pub fn step(&mut self) -> bool {
        if self.cursor >= LIMIT {
            return false;
        }
        if Self::replay_step(&mut self.game, self.inputs.get(&(self.cursor + 1))).is_err() {
            return false;
        }
        self.commit();
        true
    }
    pub fn input(&mut self, id: &str, c: Value) -> Result<(), &'static str> {
        if self.cursor >= LIMIT {
            return Err("Run limit reached");
        }
        // Commands occasionally affect more than one worker. Commit the entire
        // transaction only after every reservation and receipt has been admitted.
        let mut proposed = self.game.clone();
        proposed.apply(&c)?;
        self.game = proposed;
        self.head = self.cursor;
        self.keys.retain(|t, _| *t <= self.cursor);
        self.inputs.retain(|t, _| *t <= self.cursor);
        self.inputs.insert(
            self.cursor + 1,
            Input {
                id: id.into(),
                command: c,
            },
        );
        self.commit();
        Ok(())
    }
    pub fn save(&self, id: &str) -> Value {
        json!(Journal {
            version: 1,
            run_id: id.into(),
            cursor: self.cursor,
            head: self.head,
            inputs: self.inputs.clone(),
            step_hash: hash(&self.game.project())
        })
    }
    pub fn restore(j: Journal) -> Result<Self, &'static str> {
        if j.version != 1
            || j.cursor > j.head
            || j.head > LIMIT
            || j.inputs.len() > 10000
            || j.inputs.keys().any(|t| *t == 0 || *t > j.head)
        {
            return Err("Invalid journal");
        }
        let mut h = Self {
            inputs: j.inputs,
            ..Self::default()
        };
        while h.cursor < j.head {
            if !h.step() {
                return Err("Invalid command history");
            }
        }
        h.seek(j.cursor)?;
        if hash(&h.game.project()) != j.step_hash {
            return Err("Saved run hash differs");
        }
        Ok(h)
    }
}
pub fn difference(old: &Value, new: &Value, path: &mut Vec<Value>, ops: &mut Vec<Value>) {
    if old == new {
        return;
    }
    match (old, new) {
        (Value::Object(a), Value::Object(b)) => {
            for k in a.keys().filter(|k| !b.contains_key(*k)) {
                path.push(json!(k));
                ops.push(json!({"op":"REMOVE","path":path}));
                path.pop();
            }
            for (k, v) in b {
                path.push(json!(k));
                if let Some(prev) = a.get(k) {
                    difference(prev, v, path, ops)
                } else {
                    ops.push(json!({"op":"SET","path":path,"value":v}))
                }
                path.pop();
            }
        }
        (Value::Array(a), Value::Array(b)) => {
            for i in (b.len()..a.len()).rev() {
                path.push(json!(i));
                ops.push(json!({"op":"REMOVE","path":path}));
                path.pop();
            }
            for (i, v) in b.iter().enumerate() {
                path.push(json!(i));
                if let Some(prev) = a.get(i) {
                    difference(prev, v, path, ops)
                } else {
                    ops.push(json!({"op":"SET","path":path,"value":v}))
                }
                path.pop();
            }
        }
        _ => ops.push(json!({"op":"SET","path":path,"value":new})),
    }
}
