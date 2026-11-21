use crate::world::*;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
pub const CREW: [&str; 10] = [
    "sam", "max", "bob", "jo", "kit", "mae", "lou", "ben", "ed", "gus",
];
const RATINGS: [[i32; 3]; 10] = [
    [4, 3, 3],
    [5, 2, 4],
    [2, 4, 5],
    [3, 4, 3],
    [2, 5, 4],
    [3, 3, 5],
    [4, 4, 2],
    [3, 3, 4],
    [2, 5, 2],
    [4, 2, 3],
];
pub const NEEDS: [[i32; 3]; 4] = [[4, 1, 1], [1, 1, 4], [1, 4, 1], [2, 1, 3]]; // station weights
pub const UNITS: [i32; 4] = [4000, 5400, 6400, 4800];
pub const PROTOCOL: [i32; 4] = [50, 60, 30, 40];
#[derive(Clone, Serialize, Deserialize)]
pub struct Load {
    pub id: String,
    pub work: i32,
    pub permit: bool,
    pub travel: i32,
    pub holder: String,
    pub receiver: String,
    pub at: Point,
}
#[derive(Clone, Serialize, Deserialize, Default)]
pub struct Line {
    pub cells: [Option<Load>; 4],
    pub next: i32,
    pub last_feed: i32,
    pub call: Option<(usize, String, i32)>,
    pub inspect: i32,
    pub next_inspection: i32,
    pub seed: u32,
    pub pending: Table<usize>,
}
pub fn ratings() -> Table<[i32; 3]> {
    CREW.into_iter()
        .zip(RATINGS)
        .map(|(name, values)| (name.into(), values))
        .collect()
}
pub fn members(w: &World, i: usize) -> Vec<String> {
    CREW.iter()
        .filter(|id| w.agents[**id].post == i as i32 && w.agents[**id].duty == "working")
        .map(|s| s.to_string())
        .collect()
}
pub fn rate(team: &[String], i: usize) -> i32 {
    let mut scores: Vec<i32> = team
        .iter()
        .map(|id| {
            let j = CREW.iter().position(|x| x == id).unwrap();
            NEEDS[i].iter().zip(RATINGS[j]).map(|(a, b)| a * b).sum()
        })
        .collect();
    scores.sort_by(|a, b| b.cmp(a));
    scores.iter().zip([4, 2, 1]).map(|(s, k)| s * k).sum()
}
pub fn post(w: &mut World, id: &str, i: usize, t: i32) -> Result<(), &'static str> {
    let count = CREW
        .iter()
        .filter(|other| **other != id && w.agents[**other].post == i as i32)
        .count();
    if count >= 3 {
        return Err("All three positions are occupied");
    }
    let mut to = station(i);
    let other: Vec<_> = w
        .agents
        .iter()
        .filter(|(key, a)| *key != id && a.post == i as i32)
        .map(|(_, a)| a.target.unwrap_or(a.p)[0])
        .collect();
    to[0] += [0, -950, 950]
        .into_iter()
        .find(|dx| !other.contains(&(to[0] + dx)))
        .ok_or("Station is full")?;
    let a = w.actor(id);
    a.believe("posted", json!(i), "supervisor", t);
    a.believe("posting order", json!(true), "supervisor", t);
    a.conclude("body");
    if !a.intend(
        "body",
        STATIONS[i],
        "operate the assigned station",
        70,
        "posting order",
        "supervisor",
        t,
    ) {
        return Err("Operator unavailable");
    }
    a.duty = "cleared".into();
    a.post = i as i32;
    a.target = Some(to);
    Ok(())
}
impl Line {
    fn contact(&self, w: &World, id: &str) -> bool {
        self.cells.iter().enumerate().any(|(i, cell)| {
            cell.as_ref().is_some_and(|j| {
                (j.travel > 0 && (j.holder == id || j.receiver == id))
                    || (i == 3
                        && j.holder == id
                        && j.work > 0
                        && UNITS[i] - j.work <= 5 * rate(&members(w, i), i))
            })
        })
    }
    pub fn assign(
        &mut self,
        w: &mut World,
        id: &str,
        i: usize,
        t: i32,
    ) -> Result<(), &'static str> {
        let reserved = CREW
            .iter()
            .filter(|other| {
                **other != id
                    && (w.agents[**other].post == i as i32 || self.pending.get(**other) == Some(&i))
            })
            .count();
        if reserved >= 3 {
            return Err("Station full");
        }
        if self.contact(w, id) {
            self.pending.insert(id.into(), i);
            return Ok(());
        }
        self.pending.remove(id);
        post(w, id, i, t)
    }
    pub fn inspect_if_due(&mut self, t: i32, w: &World) {
        if self.next_inspection == 0 || (self.inspect > 0 && self.inspect <= t) {
            self.inspect = 0;
            self.seed = self.seed.wrapping_mul(1664525).wrapping_add(1013904223);
            self.next_inspection = t + 240 + ((self.seed as u64 * 161) >> 32) as i32;
        }
        if self.inspect == 0
            && self.call.is_none()
            && t >= self.next_inspection
            && self.cells.iter().enumerate().any(|(i, j)| {
                j.as_ref().is_some_and(|j| !j.permit && j.travel == 0) && !members(w, i).is_empty()
            })
        {
            self.inspect = t + 40
        }
    }
    pub fn clear(
        &mut self,
        w: &mut World,
        i: usize,
        incident: &str,
        t: i32,
        extra: &str,
    ) -> Result<(), &'static str> {
        let team = members(w, i);
        let id = team.first().ok_or("No operator at the control")?;
        let load = self.cells[i].as_ref().ok_or("No carrier")?;
        if incident != format!("{}/{}", load.id, id)
            || load.permit
            || load.travel > 0
            || self.call.is_some()
            || self.inspect > t
        {
            return Err("This clearance has expired");
        }
        let claim = format!("permit.{}.{}", load.id, i);
        let foreman = w.actor("LIMEN");
        foreman.believe("clearance requested", json!(true), "station control", t);
        foreman.conclude("speech");
        if !foreman.intend(
            "speech",
            &claim,
            "authorize this carrier at this post",
            70,
            "clearance requested",
            "station control",
            t,
        ) {
            return Err("Supervisor is occupied");
        }
        w.say(
            "LIMEN",
            &format!("{}, all clear.{extra}", TITLES[i]),
            Some(&[json!(id)]),
            &claim,
            t,
            t + 32,
            10500,
        );
        self.call = Some((i, id.clone(), t + 10));
        Ok(())
    }
    pub fn step(&mut self, w: &mut World, t: i32, manual: bool, single: bool) {
        if let Some((i, ref who, due)) = self.call.clone() {
            if t >= due {
                self.call = None;
                if let Some(job) = self.cells[i].as_mut() {
                    if members(w, i).contains(who)
                        && w.knows(who, &format!("permit.{}.{}", job.id, i), "LIMEN")
                    {
                        job.permit = true;
                        w.actor(who).believe("clearance", json!(job.id), "LIMEN", t);
                    }
                }
            }
        }
        for (id, i) in self.pending.clone() {
            if !self.contact(w, &id) {
                if post(w, &id, i, t).is_ok() {
                    self.pending.remove(&id);
                }
            }
        }
        if self.cells[0].is_none()
            && !members(w, 0).is_empty()
            && t >= self.last_feed + 20
            && (!single || self.next == 0)
        {
            self.next += 1;
            self.last_feed = t;
            self.cells[0] = Some(Load {
                id: format!("D2-C{}", self.next),
                work: 0,
                permit: !manual,
                travel: 0,
                holder: String::new(),
                receiver: String::new(),
                at: [station(0)[0], 147000],
            })
        }
        for i in (0..4).rev() {
            let crew = members(w, i);
            let dest_free = i == 3 || self.cells[i + 1].is_none();
            let downstream = if i < 3 { members(w, i + 1) } else { vec![] };
            let Some(job) = self.cells[i].as_mut() else {
                continue;
            };
            if job.travel > 0 {
                let dest = if i == 3 {
                    rack(w.rack.len())
                } else {
                    [station(i + 1)[0], 147000]
                };
                let left = (job.travel - t + 1).max(1);
                for (a, b) in job.at.iter_mut().zip(dest) {
                    *a += ((b - *a) as f64 / left as f64).round() as i32;
                }
                if t >= job.travel {
                    let mut finished = self.cells[i].take().unwrap();
                    if i == 3 {
                        w.rack.push(finished.id)
                    } else {
                        finished.work = 0;
                        finished.travel = 0;
                        finished.holder.clear();
                        finished.receiver.clear();
                        finished.permit = !manual;
                        self.cells[i + 1] = Some(finished)
                    }
                }
                continue;
            }
            if crew.is_empty() || !job.permit {
                continue;
            }
            job.holder = crew.first().unwrap().clone();
            let goal = if manual { PROTOCOL[i] } else { UNITS[i] };
            if job.work >= goal {
                if dest_free && (i == 0 || i == 3 || single || !downstream.is_empty()) {
                    job.receiver = downstream.first().cloned().unwrap_or_default();
                    job.travel = t + 10;
                }
            } else {
                job.work += if manual { 1 } else { rate(&crew, i) }
            }
        }
    }
    pub fn machines(&self, w: &World, t: i32, manual: bool, live: bool) -> Vec<Value> {
        (0..4).map(|i|{let crew=members(w,i);let speed=rate(&crew,i);let job=self.cells[i].as_ref();let ready=live&&manual&&!crew.is_empty()&&job.is_some_and(|j|!j.permit&&j.travel==0)&&self.call.is_none()&&self.inspect<=t;
 json!({"name":STATIONS[i],"title":TITLES[i],"crew":crew,"rate":speed,"cycleMs":if speed>0{Some((UNITS[i]+speed-1)/speed*50)}else{None},"carrier":job.map_or("",|j|j.id.as_str()),"hold":if crew.is_empty(){"Needs worker"}else if ready{"Waiting for clearance"}else if job.is_some_and(|j|j.travel>0){"Travelling"}else if job.is_some(){"Working"}else{"Waiting for carrier"},"canClear":ready,"caller":crew.first().map(String::as_str).unwrap_or("")})}).collect()
    }
}
