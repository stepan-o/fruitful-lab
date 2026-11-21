use crate::world::*;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::collections::BTreeSet;
pub fn story_tick(world: f64) -> i32 {
    ((world - SCORE["start"].as_f64().unwrap()) * 20.).round() as i32
}
pub fn edited(t: i32) -> i32 {
    let real = SCORE["start"].as_f64().unwrap() + t as f64 / 20.;
    let cut = rows(&SCORE["cuts"])
        .iter()
        .map(|c| {
            let from = c["at"].as_f64().unwrap();
            (real - from).clamp(0., c["to"].as_f64().unwrap() - from)
        })
        .sum::<f64>();
    (t * 50 - (cut * 1000.).round() as i32).max(0)
}
#[derive(Clone, Serialize, Deserialize)]
pub struct Intro {
    pub elapsed: Table<i32>,
    pub t: i32,
    pub confirmed: usize,
    pub active: Vec<(usize, i32)>,
    pub admitted: BTreeSet<usize>,
    pub pieces: [Point; 3],
    pub gate: i32,
}
impl Default for Intro {
    fn default() -> Self {
        Self {
            elapsed: Table::new(),
            t: 0,
            confirmed: 0,
            active: vec![],
            admitted: BTreeSet::new(),
            pieces: [[station(0)[0], 147000]; 3],
            gate: 6200,
        }
    }
}
fn guards(w: &World, conditions: &[Value]) -> bool {
    conditions.iter().all(|c| {
        if let Some(f) = c["fact"].as_str() {
            return w.facts.get(f) == Some(&c["equals"]);
        }
        if let Some(prop) = c["prop"].as_str() {
            return w
                .props
                .get(prop)
                .is_some_and(|p| p["kind"] == "hand" && p["agent"] == c["heldBy"]);
        }
        let Some(actor) = w.agents.get(word(&c["agent"])) else {
            return false;
        };
        let to = if let Some(other) = c["near"].as_str() {
            w.agents[other].p
        } else {
            point(&c["at"])
        };
        distance(actor.p, to) <= n(&c["within"])
    })
}
fn can_observe(w: &World, p: &Plan) -> bool {
    let actor = &w.agents[&p.actor];
    let hand = &w.props["bob:id"];
    match p.id.as_str() {
        "pocket-card" | "watch-card" => {
            hand["kind"] == "floor"
                && distance(actor.p, point(&hand["position"]))
                    <= if p.id == "pocket-card" { 1400 } else { 4500 }
        }
        "gate-post" => distance(actor.p, meters(&GEOM["contact"]["patrolPost"])) < 450,
        "press-jams" => distance(actor.p, station(3)) < 750,
        "palm-release" => {
            distance(actor.p, station(3)) < 600 && w.knows("bob", "heard.line.27", "STILETTO")
        }
        _ => {
            let op = &p.phase["process"];
            if op.is_null() {
                return true;
            }
            let i = n(&op["from"]);
            let prev = match word(&op["workpiece"]) {
                "cortex-1" => Some(13 + i),
                "cortex-2" if i == 0 => Some(26),
                _ => None,
            };
            distance(actor.p, point(&op["operator"]["position"])) <= n(&op["operator"]["within"])
                && prev.is_none_or(|j| w.knows(&p.actor, &format!("heard.line.{j}"), "STILETTO"))
        }
    }
}
impl Intro {
    pub fn new(w: &mut World) -> Self {
        let mut s = Self::default();
        for i in 1..=3 {
            for k in ["socket", "stage"] {
                w.facts.insert(format!("cortex-{i}.{k}"), json!(0));
            }
        }
        s.choose(w);
        s
    }
    fn fits(&self, p: &Plan) -> bool {
        !self.active.iter().any(|(i, _)| {
            let a = &CAST.plans[*i];
            (a.lane == p.lane && a.participants.iter().any(|v| p.participants.contains(v)))
                || a.resources.iter().any(|v| p.resources.contains(v))
        })
    }
    fn choose(&mut self, w: &mut World) {
        let t = self.t;
        let mut options: Vec<_> = CAST
            .plans
            .iter()
            .enumerate()
            .take_while(|(_, p)| p.opens <= t)
            .filter(|(i, p)| t <= p.closes && !self.admitted.contains(i))
            .collect();
        options.sort_by(|(_, a), (_, b)| b.priority.cmp(&a.priority).then(a.id.cmp(&b.id)));
        for (i, p) in options {
            let observed = can_observe(w, p);
            let fact = format!("available.{}", p.id);
            w.actor(&p.actor)
                .believe(&fact, json!(observed), "local observation", t);
            if !observed
                || !self.fits(p)
                || !guards(w, &p.requires)
                || !rows(&p.phase["transfers"])
                    .iter()
                    .all(|x| w.props.get(word(&x["prop"])) == Some(&x["from"]))
            {
                continue;
            }
            if !w.actor(&p.actor).intend(
                &p.lane,
                &p.id,
                &p.goal,
                p.priority,
                &fact,
                "local observation",
                t,
            ) {
                continue;
            }
            self.admitted.insert(i);
            self.active.push((i, t + n(&p.phase["ticks"])));
        }
    }
    fn complete(&mut self, w: &mut World) {
        let mut ended = vec![];
        self.active.retain(|(i, at)| {
            if *at <= self.t {
                ended.push(*i);
                false
            } else {
                true
            }
        });
        for i in ended {
            let p = &CAST.plans[i];
            w.actor(&p.actor).conclude(&p.lane);
            let phase = &p.phase;
            if !guards(w, rows(&phase["completesWhen"]))
                || !rows(&phase["transfers"])
                    .iter()
                    .all(|x| w.props.get(word(&x["prop"])) == Some(&x["from"]))
            {
                self.admitted.remove(&i);
                continue;
            }
            for effect in rows(&phase["effects"]) {
                w.facts
                    .insert(word(&effect["fact"]).into(), effect["value"].clone());
            }
            for tr in rows(&phase["transfers"]) {
                let prop = word(&tr["prop"]);
                w.props.insert(prop.into(), tr["to"].clone());
                for who in rows(&tr["observedBy"]) {
                    w.actor(word(who))
                        .believe(prop, tr["to"].clone(), &p.actor, self.t);
                }
            }
            for line in rows(&phase["say"]) {
                w.say(
                    &p.actor,
                    word(&line["text"]),
                    line["to"].as_array().map(Vec::as_slice),
                    word(&line["claim"]["fact"]),
                    self.t,
                    self.t + (line["seconds"].as_f64().unwrap() * 20.).ceil() as i32,
                    if line["channel"] == "shout" {
                        26000
                    } else {
                        10500
                    },
                );
            }
        }
    }
    pub fn held(&self) -> bool {
        CAST.orders
            .get(self.confirmed)
            .is_some_and(|o| self.t >= n(&o["tick"]))
    }
    pub fn done(&self) -> bool {
        self.t >= story_tick(SCORE["end"].as_f64().unwrap())
    }
    pub fn step(&mut self, w: &mut World) {
        self.t += 1;
        let t = self.t;
        crate::navigation::walk_tracks(w, &mut self.elapsed, self.gate);
        self.complete(w);
        for (i, pos) in self.pieces.iter_mut().enumerate() {
            let id = format!("cortex-{}", i + 1);
            let stage = n(&w.facts[&format!("{id}.stage")]);
            if stage == 0 {
                continue;
            }
            let target = if stage == 4 {
                rack(i)
            } else {
                [station(stage as usize)[0], 147000]
            };
            *pos = towards(*pos, target, 500);
            if *pos == target {
                w.facts.insert(format!("{id}.socket"), json!(stage));
                if stage == 4 && !w.rack.contains(&id) {
                    w.rack.push(id)
                }
            }
        }
        self.choose(w);
        w.events.retain(|e| n(&e["until"]) > t);
        self.gate = 6200;
        if w.facts.get("gate.staffed") == Some(&json!(true)) {
            for span in rows(&SCORE["gate"]["openings"]) {
                let v: Vec<_> = rows(span)
                    .iter()
                    .map(|x| story_tick(x.as_f64().unwrap()))
                    .collect();
                if (v[0]..v[3]).contains(&t) {
                    let f = if t < v[1] {
                        (t - v[0]) as f64 / (v[1] - v[0]) as f64
                    } else if t < v[2] {
                        1.
                    } else {
                        (v[3] - t) as f64 / (v[3] - v[2]) as f64
                    };
                    self.gate = (6200. * (f * std::f64::consts::FRAC_PI_2).cos()).round() as i32;
                }
            }
        }
    }
    pub fn advance(&mut self, w: &mut World) {
        self.step(w);
        for c in rows(&SCORE["cuts"]) {
            if self.t == story_tick(c["at"].as_f64().unwrap()) {
                let end = story_tick(c["to"].as_f64().unwrap());
                while self.t < end {
                    self.step(w)
                }
            }
        }
    }
    pub fn items(&self, w: &World) -> Vec<Value> {
        let mut v = vec![];
        for (id, location) in &w.props {
            if location["kind"] == "stowed" {
                continue;
            }
            let who = word(&location["agent"]);
            let p = if who.is_empty() {
                point(&location["position"])
            } else {
                w.agents[who].p
            };
            v.push(json!({"item_id":id,"x":p[0],"y":p[1],"holder":who,"stage":0}));
        }
        for (i, p) in self.pieces.iter().enumerate() {
            if self.t < story_tick([51., 101.5, 113.5][i]) {
                continue;
            }
            let id = format!("cortex-{}", i + 1);
            v.push(json!({"item_id":id,"x":p[0],"y":p[1],"stage":w.facts[&format!("{id}.stage")],"holder":""}));
        }
        v.sort_by_key(|v| word(&v["item_id"]).to_owned());
        v
    }
}
