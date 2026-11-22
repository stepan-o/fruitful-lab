use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::collections::BTreeMap;
use std::sync::LazyLock;

pub type Point = [i32; 2];
pub type Table<T> = BTreeMap<String, T>;
pub const STATIONS: [&str; 4] = ["intake", "wash", "belt", "forge"];
pub const TITLES: [&str; 4] = ["Intake", "Wash", "Belt", "Forge"];
pub static GEOM: LazyLock<Value> = LazyLock::new(|| {
    serde_json::from_str(include_str!("../../lib/loopforge/intro/geometry.json")).unwrap()
});
pub static SCORE: LazyLock<Value> = LazyLock::new(|| {
    serde_json::from_str(include_str!("../../lib/loopforge/intro/score.json")).unwrap()
});
pub static CAST: LazyLock<Cast> =
    LazyLock::new(|| serde_json::from_str(include_str!("../content/day-one.json")).unwrap());
#[derive(Deserialize)]
pub struct Cast {
    pub tracks: Table<Vec<[i32; 3]>>,
    pub orders: Vec<Value>,
    pub plans: Vec<Plan>,
}
#[derive(Deserialize)]
pub struct Plan {
    pub id: String,
    pub actor: String,
    pub opens: i32,
    pub closes: i32,
    pub goal: String,
    pub priority: i32,
    pub lane: String,
    pub participants: Vec<String>,
    pub resources: Vec<String>,
    pub requires: Vec<Value>,
    pub phase: Value,
}
pub fn n(v: &Value) -> i32 {
    v.as_i64().unwrap_or_default() as i32
}
pub fn word(v: &Value) -> &str {
    v.as_str().unwrap_or("")
}
pub fn rows(v: &Value) -> &[Value] {
    v.as_array().map(Vec::as_slice).unwrap_or_default()
}
pub fn point(v: &Value) -> Point {
    [n(&v[0]), n(&v[1])]
}
pub fn meters(v: &Value) -> Point {
    [mm(&v[0]), mm(&v[1])]
}
fn mm(v: &Value) -> i32 {
    (1000. * v.as_f64().unwrap()).round() as i32
}
pub fn station(i: usize) -> Point {
    let p = &GEOM["stations"][i];
    [mm(&p["x"]), mm(&p["y"])]
}
pub fn rack(i: usize) -> Point {
    meters(&GEOM["contact"]["outputSlots"][i % 3])
}
pub fn distance(a: Point, b: Point) -> i32 {
    let dx = (a[0] - b[0]) as f64;
    let dy = (a[1] - b[1]) as f64;
    (dx * dx + dy * dy).sqrt().round() as i32
}
pub fn towards(a: Point, b: Point, step: i32) -> Point {
    let d = distance(a, b);
    if d <= step {
        return b;
    }
    [
        a[0] + (b[0] - a[0]) * step / d,
        a[1] + (b[1] - a[1]) * step / d,
    ]
}
pub fn room(p: Point) -> String {
    for z in rows(&GEOM["zones"]) {
        let poly = rows(&z["polygon"]);
        let mut inside = false;
        let mut prev = meters(poly.last().unwrap());
        for vertex in poly {
            let next = meters(vertex);
            if (prev[1] > p[1]) != (next[1] > p[1])
                && (p[0] as f64)
                    < (next[0] - prev[0]) as f64 * (p[1] - prev[1]) as f64
                        / (next[1] - prev[1]) as f64
                        + prev[0] as f64
            {
                inside = !inside
            }
            prev = next
        }
        if inside {
            return word(&z["id"]).into();
        }
    }
    "outside".into()
}
pub fn audible(a: Point, b: Point, range: i32) -> bool {
    if distance(a, b) > range {
        return false;
    }
    // Clip the sound segment against every solid wall (Liang–Barsky).
    !rows(&GEOM["walls"]).iter().any(|r| {
        let (mut lo, mut hi) = (0.0_f64, 1.0_f64);
        for (axis, key, size) in [(0, "x", "w"), (1, "y", "h")] {
            let min = mm(&r[key]);
            let max = min + mm(&r[size]);
            let d = b[axis] - a[axis];
            if d == 0 {
                if a[axis] < min || a[axis] > max {
                    return false;
                }
            } else {
                let t1 = (min - a[axis]) as f64 / d as f64;
                let t2 = (max - a[axis]) as f64 / d as f64;
                lo = lo.max(t1.min(t2));
                hi = hi.min(t1.max(t2));
            }
        }
        lo <= hi
    })
}
pub fn track(id: &str, t: i32) -> Point {
    let keys = &CAST.tracks[id];
    let index = keys.partition_point(|k| k[0] <= t).saturating_sub(1);
    let a = keys[index];
    let Some(b) = keys.get(index + 1) else {
        return [a[1], a[2]];
    };
    let span = (b[0] - a[0]).max(1) as i64;
    let k = (t - a[0]).clamp(0, span as i32) as i64;
    [1, 2].map(|i| a[i] + (((b[i] - a[i]) as i64 * k) as f64 / span as f64).round() as i32)
}
#[derive(Clone, Serialize, Deserialize)]
pub struct Belief {
    pub source: String,
    pub tick: i32,
    pub value: Value,
}
#[derive(Clone, Serialize, Deserialize)]
pub struct Actor {
    pub p: Point,
    pub room: String,
    pub facing: String,
    pub walked: i32,
    pub moving: bool,
    pub beliefs: Table<Belief>,
    pub commitments: Table<crate::bdi::Commitment>,
    pub duty: String,
    pub post: i32,
    pub target: Option<Point>,
    pub waypoint: Option<Point>,
    pub destination: Option<Point>,
}
impl Actor {
    fn new(p: Point) -> Self {
        Self {
            p,
            room: room(p),
            facing: "S".into(),
            walked: 0,
            moving: false,
            beliefs: Table::new(),
            commitments: Table::new(),
            duty: "standing".into(),
            post: -1,
            target: None,
            waypoint: None,
            destination: None,
        }
    }
    pub fn travel(&mut self, to: Point) {
        let d = distance(self.p, to);
        self.moving = d > 0;
        if self.moving {
            let [x, y] = [to[0] - self.p[0], to[1] - self.p[1]];
            self.facing = (if x.abs() > y.abs() {
                if x > 0 {
                    "E"
                } else {
                    "W"
                }
            } else if y > 0 {
                "S"
            } else {
                "N"
            })
            .into();
            self.walked += d;
            self.p = to;
            self.room = room(to)
        }
    }
    pub fn believe(&mut self, k: &str, value: Value, source: &str, tick: i32) {
        self.beliefs.insert(
            k.into(),
            Belief {
                source: source.into(),
                tick,
                value,
            },
        );
    }
}
#[derive(Clone, Serialize, Deserialize)]
pub struct World {
    pub agents: Table<Actor>,
    pub facts: Table<Value>,
    pub props: Table<Value>,
    pub events: Vec<Value>,
    pub seq: i32,
    pub rack: Vec<String>,
}
impl Default for World {
    fn default() -> Self {
        Self {
            agents: CAST
                .tracks
                .keys()
                .map(|k| (k.clone(), Actor::new(track(k, 0))))
                .collect(),
            facts: Table::from([("press.jammed".into(), json!(false))]),
            props: ["bob", "max"]
                .map(|id| (format!("{id}:id"), json!({"kind":"stowed","agent":id})))
                .into(),
            events: vec![],
            seq: 0,
            rack: vec![],
        }
    }
}
impl World {
    pub fn actor(&mut self, id: &str) -> &mut Actor {
        self.agents.get_mut(id).unwrap()
    }
    pub fn say(
        &mut self,
        id: &str,
        text: &str,
        recipients: Option<&[Value]>,
        claim: &str,
        t: i32,
        until: i32,
        range: i32,
    ) {
        let p = self.agents[id].p;
        let room = self.agents[id].room.clone();
        let mut audience = vec![];
        for (other, a) in &mut self.agents {
            if other != id
                && recipients.is_none_or(|to| to.contains(&json!(other)))
                && audible(p, a.p, range)
            {
                a.believe(claim, json!(true), id, t);
                audience.push(other.clone());
            }
        }
        self.seq += 1;
        self.events.push(json!({"seq":self.seq,"event_id":format!("speech-{}",self.seq),"tick":t,"until":until,"kind":"speech.delivered","actor":id,"speaker":id,"text":text,"room":room,"at":p,"audience":audience,"subject":"","anchor":format!("actor.{id}")}));
    }
    pub fn knows(&self, id: &str, fact: &str, src: &str) -> bool {
        self.agents[id]
            .beliefs
            .get(fact)
            .is_some_and(|b| b.value == true && b.source == src)
    }
}
