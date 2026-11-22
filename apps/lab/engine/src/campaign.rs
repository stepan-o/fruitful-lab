use crate::{
    intro::{edited, Intro},
    line::{members, CREW},
    shift::Shift,
    world::*,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[derive(Clone, Serialize, Deserialize)]
pub struct Game {
    pub world: World,
    pub intro: Intro,
    pub shift: Shift,
    pub phase: String,
    pub topic: i32,
    pub morning: i32,
}
impl Default for Game {
    fn default() -> Self {
        let mut world = World::default();
        let intro = Intro::new(&mut world);
        Self {
            world,
            intro,
            shift: Shift::new(0, 0),
            phase: "intro".into(),
            topic: 0,
            morning: 0,
        }
    }
}
impl Game {
    fn departure(&mut self) {
        self.phase = "console".into();
        self.world.events.clear();
        for a in self.world.agents.values_mut() {
            a.commitments.clear()
        }
        self.shift = Shift::new(self.intro.t, self.world.rack.len());
    }
    pub fn timed(&self) -> bool {
        match self.phase.as_str() {
            "intro" => !self.intro.held(),
            "floor" => !self.shift.held() && !self.shift.closed && self.shift.stage != "briefing",
            "console" | "call" => true,
            _ => false,
        }
    }
    pub fn step(&mut self) {
        match self.phase.as_str() {
            "intro" => {
                self.intro.advance(&mut self.world);
                if self.intro.done() {
                    self.departure()
                }
            }
            "console" | "call" => self.morning += 1,
            "floor" => self.shift.step(&mut self.world),
            _ => {}
        }
    }
    pub fn apply(&mut self, c: &Value) -> Result<(), &'static str> {
        let action = word(&c["action"]);
        let target = word(&c["target"]);
        match (self.phase.as_str(), action) {
            ("intro", "confirm")
                if self.intro.held() && CAST.orders[self.intro.confirmed]["station"] == target =>
            {
                self.intro.confirmed += 1;
                Ok(())
            }
            ("intro", "skip") => {
                while !self.intro.done() {
                    if self.intro.held() {
                        self.intro.confirmed += 1
                    }
                    self.intro.advance(&mut self.world)
                }
                self.departure();
                Ok(())
            }
            ("console", "answer") => {
                self.phase = "call".into();
                Ok(())
            }
            ("call", "close") => {
                self.phase = "console".into();
                Ok(())
            }
            ("call", "topic") if ["0", "1"].contains(&target) => {
                self.topic = if target == "1" { 1 } else { 0 };
                Ok(())
            }
            ("call", "acknowledge") if self.topic == 1 => {
                self.phase = "floor".into();
                Ok(())
            }
            ("floor", _) => self.shift.admit(
                &mut self.world,
                action,
                target,
                word(&c["incident"]),
                word(&c["room"]),
            ),
            _ => Err("Order does not apply to this phase"),
        }
    }
    pub fn minutes(&self) -> i32 {
        let morning = 360 + self.morning / 1200;
        match self.phase.as_str() {
            "intro" => {
                let ms = edited(self.intro.t);
                360 + 1080 * ms.min(165400) / 165400 + (ms - 165400).max(0) / 6000
            }
            "floor" => {
                let s = &self.shift;
                let dt = s.t - s.start;
                let len = if s.manual() { 2400 } else { 4800 };
                if s.bell == 0 {
                    return morning + dt / 12;
                }
                let start = s.bell - len;
                let at = morning + (start - s.start) / 12;
                at + (1440 - at) * (s.t - start).clamp(0, len) / len
            }
            _ => morning,
        }
    }
    pub fn project(&self) -> Value {
        let w = &self.world;
        let s = &self.shift;
        let intro = self.phase == "intro";
        let tick = if intro { self.intro.t } else { s.t };
        let mut world = json!({"phase":self.phase,"minute":self.minutes(),"layout":GEOM["version"],"quota":60,"topic":self.topic,"clock_tick":tick,"day_one_count":if intro{w.rack.len()}else{s.initial},"rack":w.rack,"gate_mm":self.intro.gate,"jammed":w.facts["press.jammed"],"outputs":w.rack.len(),"edited_ms":edited(self.intro.t),"confirmed":self.intro.confirmed,"order":if intro&&self.intro.held(){CAST.orders.get(self.intro.confirmed).map(|o|json!({"station":o["station"],"text":o["text"]}))}else{None}});
        let injured = w.facts.get("injury.bob").is_some_and(|v| v == "limping");
        let agents:Vec<_>=w.agents.iter().map(|(id,a)|json!({"agent_id":id,"x":a.p[0],"y":a.p[1],"room":a.room,"facing":a.facing,"moving":a.moving,"walked":a.walked,"injured":id=="bob"&&injured,"action":if intro{self.intro.active.iter().find(|(i,_)|CAST.plans[*i].actor==*id&&CAST.plans[*i].lane=="body").map(|(i,_)|CAST.plans[*i].id.as_str()).unwrap_or(if a.moving{"walk"}else{"idle"})}else{a.duty.as_str()},"duty":a.duty,"station":a.post,"available":s.entered.contains(id)&&a.room=="conveyor","label":if a.post>=0{TITLES[a.post as usize]}else{a.duty.as_str()}})).collect();
        let mut items = self.intro.items(w);
        if !intro {
            items.retain(|i| i["stage"] == 4);
            for (i, id) in w.rack.iter().enumerate().skip(s.initial) {
                let p = rack(i);
                items.push(json!({"item_id":id,"x":p[0],"y":p[1],"stage":4,"holder":""}));
            }
            for (i, j) in s.line.cells.iter().enumerate() {
                if let Some(j) = j {
                    items.push(json!({"item_id":j.id,"stage":i,"x":j.at[0],"y":j.at[1],"holder":"","travel":j.travel>0}));
                }
            }
            items.sort_by_key(|v| word(&v["item_id"]).to_owned());
        }
        if self.phase == "floor" {
            let manual = s.manual();
            let coverage: Vec<_> = (0..4)
                .map(|i| members(w, i).into_iter().next().unwrap_or_default())
                .collect();
            let waiting: Vec<_> = CREW
                .iter()
                .filter(|id| {
                    !s.entered.iter().any(|s| s == **id) && w.agents[**id].duty == "waiting"
                })
                .collect();
            world["floor"] = json!({"stage":s.stage,"start":s.start,"lead":s.lead,"bell":s.bell,"lesson":s.lesson,"held":s.held(),"posts":s.posts,"crew":s.crew,"manual":manual,"closed":s.closed,"dayCount":w.rack.len()-s.initial,"status":s.case,"deadline":s.deadline,"waiting":waiting,"coverage":coverage,"bids":{"LIMEN":"We have to stick to the Protocol. No need to change anything.","STILETTO":"Give me the gate, send LIMEN to conveyor. It took him two helpers to count to eight."},"ratings":crate::line::ratings(),"needs":crate::line::NEEDS,"machines":s.line.machines(w,s.t,manual,s.lesson=="live"),"shot":s.shot,"shotSeq":s.shot_seq,"opening":manual&&s.lesson!="live","stroke":s.line.cells[3].as_ref().map_or(0,|j|(1000*j.work/if manual{40}else{4800}).min(1000))});
        }
        let mut events = w.events.clone();
        if intro {
            if let Some(b) = rows(&SCORE["speech"])
                .iter()
                .find(|l| l["speaker"] == "BELL")
            {
                let start = crate::intro::story_tick(b["start"].as_f64().unwrap());
                let end = crate::intro::story_tick(b["end"].as_f64().unwrap());
                if tick >= start && tick < end {
                    events.push(json!({"event_id":"shift-bell","speaker":"BELL","text":b["text"],"tick":start,"until":end}));
                }
            }
        }
        events.sort_by(|a, b| {
            n(&a["tick"])
                .cmp(&n(&b["tick"]))
                .then_with(|| word(&a["event_id"]).cmp(word(&b["event_id"])))
        });
        json!({"world":world,"agents":agents,"items":items,"events":events})
    }
}
