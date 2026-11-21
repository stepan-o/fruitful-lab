use crate::{intro::story_tick, line::*, world::*};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::sync::LazyLock;
static BOOK: LazyLock<Value> = LazyLock::new(|| {
    serde_json::from_str(include_str!("../../lib/loopforge/shifts/manuscript.json")).unwrap()
});
static SWAPPED: LazyLock<Vec<Vec<(String, String)>>> = LazyLock::new(|| {
    serde_json::from_str(include_str!("../content/swapped-opening.json")).unwrap()
});
const DESK: Point = [125300, 131250];
const FOREMAN: Point = [126300, 142200];
const QUEUE: [Point; 8] = [
    [126400, 128650],
    [127700, 128000],
    [126300, 127050],
    [127700, 126350],
    [126250, 125500],
    [127700, 124800],
    [126250, 123950],
    [127700, 123200],
];
#[derive(Clone, Serialize, Deserialize)]
pub struct Shift {
    pub lead: String,
    pub stage: String,
    pub t: i32,
    pub start: i32,
    pub lesson: String,
    pub crew: Vec<String>,
    pub posts: [String; 4],
    pub shot: String,
    pub shot_seq: i32,
    pub base: usize,
    pub initial: usize,
    pub bell: i32,
    pub case: String,
    pub deadline: i32,
    pub cue: usize,
    pub due: i32,
    pub line: Line,
    pub entered: Vec<String>,
    walk_clocks: Table<i32>,
    pub closed: bool,
}
impl Shift {
    pub fn new(t: i32, initial: usize) -> Self {
        Self {
            lead: "".into(),
            stage: "briefing".into(),
            t,
            start: t,
            lesson: "arrival".into(),
            crew: vec![],
            posts: Default::default(),
            shot: "security".into(),
            shot_seq: 0,
            base: initial,
            initial,
            bell: 0,
            case: "none".into(),
            deadline: 0,
            cue: 0,
            due: 0,
            line: Line::default(),
            entered: vec![],
            walk_clocks: Table::new(),
            closed: false,
        }
    }
    pub fn manual(&self) -> bool {
        self.lead == "STILETTO"
    }
    pub fn held(&self) -> bool {
        matches!(self.lesson.as_str(), "pairs" | "singles")
    }
    fn cut(&mut self, room: &str) {
        if self.shot != room {
            self.shot = room.into();
            self.shot_seq += 1
        }
    }
    fn next(&mut self, stage: &str) {
        self.lesson = stage.into();
        self.cue = 0;
        self.due = self.t
    }
    fn say(&mut self, w: &mut World, who: &str, line: &str) {
        let cause = format!("opportunity.{}.{}", self.lesson, self.cue);
        // The encounter opens an opportunity to speak. Individual memories control
        // private disclosures; a desk assignment alone never grants that knowledge.
        // A response needs a personal hearing receipt from its actual speaker.
        // A director cue alone cannot reveal a credential or an unheard question.
        let predecessor = match (self.lesson.as_str(), self.cue, who) {
            ("walk", 1, "sam") => Some((0, "bob")),
            ("gate", 7, "ed") => Some((6, "LIMEN")),
            ("gate", 8, "LIMEN") => Some((7, "ed")),
            ("swapped", 8, "jo") => Some((7, "LIMEN")),
            ("swapped", 9, "LIMEN") => Some((8, "jo")),
            ("swapped", 21, "LIMEN") => Some((20, "STILETTO")),
            ("swapped", 28, "ed") => Some((27, "sam")),
            ("visit", 1, "LIMEN") => Some((0, "STILETTO")),
            _ => None,
        };
        if self.lesson == "swapped"
            && self.cue == 28
            && !w.agents[who]
                .beliefs
                .get("bob:id")
                .is_some_and(|b| b.value["agent"] == "ed" && b.source == "ed")
        {
            return;
        }
        if let Some((prior, source)) = predecessor {
            let fact = format!("exchange.{}.{prior}", self.lesson);
            if !w.knows(who, &fact, source) {
                return;
            }
        }
        let actor = w.actor(who);
        actor.believe(&cause, json!(true), "encounter", self.t);
        actor.conclude("speech");
        if !actor.intend("speech", &cause, line, 50, &cause, "encounter", self.t) {
            return;
        }
        let duration = (line.split_whitespace().count() as i32 * 5 + 12).max(32);
        w.say(
            who,
            line,
            None,
            &format!("exchange.{}.{}", self.lesson, self.cue),
            self.t,
            self.t + duration,
            if line == line.to_uppercase() {
                26000
            } else {
                10500
            },
        );
        self.due = self.t + duration
    }
    fn script(&mut self, w: &mut World, key: &str, idx: usize) {
        let line = &BOOK["scenes"][key][idx];
        self.say(w, word(&line[0]), word(&line[1]));
    }
    fn release(&mut self, w: &mut World, id: &str) {
        if self.entered.iter().any(|s| s == id) {
            return;
        }
        self.entered.push(id.into());
        let idx = CREW.iter().position(|s| s == &id).unwrap();
        let manual = self.manual();
        let a = w.actor(id);
        a.believe("authorized", json!(true), &self.lead, self.t);
        a.conclude("body");
        if !a.intend(
            "body",
            "report",
            "report to Conveyor",
            60,
            "authorized",
            &self.lead,
            self.t,
        ) {
            return;
        }
        a.duty = "cleared".into();
        a.target = Some(if manual {
            let slot = [
                "sam", "bob", "jo", "max", "ed", "gus", "mae", "kit", "lou", "ben",
            ]
            .iter()
            .position(|who| *who == id)
            .unwrap() as i32;
            if id == "max" {
                station(3)
            } else {
                [122300 + slot % 5 * 1180, 140300 + slot / 5 * 1050]
            }
        } else {
            [
                124400 + (idx as i32 % 4) * 1150,
                140400 + (idx as i32 / 4) * 1200,
            ]
        });
    }
    fn arrived(&self, w: &World, id: &str) -> bool {
        self.entered.iter().any(|s| s == id)
            && w.agents[id].room == "conveyor"
            && w.agents[id].target.is_none()
    }
    pub fn admit(
        &mut self,
        w: &mut World,
        action: &str,
        target: &str,
        incident: &str,
        room: &str,
    ) -> Result<(), &'static str> {
        if self.closed {
            return Err("Shift closed");
        }
        if action == "appoint"
            && self.stage == "briefing"
            && room == "security"
            && incident == "morning"
            && ["STILETTO", "LIMEN"].contains(&target)
        {
            self.lead = target.into();
            self.stage = "walk".into();
            self.start = self.t;
            self.next("walk");
            self.due = self.t + 7;
            for (id, a) in &mut w.agents {
                a.travel(track(id, 0));
                a.moving = false;
                a.post = -1;
                a.duty = if CREW.contains(&id.as_str()) {
                    "walking"
                } else {
                    "supervising"
                }
                .into();
                a.conclude("body");
                a.believe("shift starting", json!(true), "shift bell", self.t);
                a.intend(
                    "body",
                    "arrive",
                    "arrive at the gate",
                    20,
                    "shift starting",
                    "shift bell",
                    self.t,
                );
            }
            return Ok(());
        }
        if room == "security"
            && target == "bob"
            && incident == "D2-bob-id"
            && self.case == "open"
            && self.t < self.deadline
            && ["issue-pass", "reject-pass"].contains(&action)
        {
            self.resolve(w, action == "issue-pass");
            return Ok(());
        }
        let i = STATIONS
            .iter()
            .position(|s| s == &target)
            .ok_or("Unknown station")?;
        if room != "conveyor" || self.stage != "work" {
            return Err("Conveyor is closed");
        }
        match action {
            "post" if self.held() && self.crew.iter().any(|s| s == incident) => {
                if self.posts[i] == incident {
                    return Ok(());
                }
                let pair = self.lesson == "pairs";
                if self.posts.iter().filter(|s| *s == incident).count() >= if pair { 2 } else { 1 }
                {
                    return Err("Choose another operator");
                }
                self.posts[i] = incident.into();
                if self.posts.iter().all(|s| !s.is_empty()) {
                    self.base = w.rack.len();
                    for j in 0..4 {
                        let id = &self.posts[j];
                        if !self.posts[..j].contains(id) {
                            post(w, id, j, self.t)?
                        }
                    }
                    self.next(if pair { "demonstration" } else { "production" });
                    self.say(
                        w,
                        "STILETTO",
                        if pair {
                            "Run one through. Watch them change posts."
                        } else {
                            "One on each. Run it."
                        },
                    );
                }
                Ok(())
            }
            "clear" if self.manual() && self.lesson == "live" => {
                self.line.clear(w, i, incident, self.t)
            }
            "assign"
                if !self.manual()
                    && self.lesson == "live"
                    && self.entered.iter().any(|s| s == incident)
                    && w.agents[incident].room == "conveyor" =>
            {
                self.line.assign(w, incident, i, self.t)
            }
            _ => Err("Order is unavailable"),
        }
    }
    fn resolve(&mut self, w: &mut World, pass: bool) {
        self.case = if pass { "pass" } else { "detention" }.into();
        if pass {
            self.release(w, "bob");
            self.script(w, "2D", 14)
        } else {
            let a = w.actor("bob");
            a.duty = "detained".into();
            a.post = -1;
            a.target = Some([122650, 131400]);
            self.say(w, "LIMEN", "No ID. Detained until the bell.")
        }
        self.next("visit");
        w.actor("STILETTO").target = Some([129400, 132400]);
    }
    fn lesson(&mut self, w: &mut World, kind: &str) {
        self.crew = self.entered.clone();
        self.posts = Default::default();
        self.cut("conveyor");
        self.next(kind);
        self.say(
            w,
            "STILETTO",
            if kind == "pairs" {
                "Two workers, four stations. Give each of them two."
            } else {
                "One worker per station. Post all four."
            },
        );
    }
    fn settle_gate(&mut self, w: &mut World) {
        for (i, id) in CREW.iter().enumerate() {
            let a = w.actor(id);
            a.duty = if i >= 8 && !self.manual() {
                "clerk"
            } else {
                "waiting"
            }
            .into();
            a.target = Some(if i < 8 {
                QUEUE[i]
            } else if *id == "ed" {
                [124650, 130100]
            } else {
                [129350, 130400]
            });
        }
        w.actor("LIMEN").target = Some(if self.manual() { FOREMAN } else { DESK });
        w.actor("STILETTO").target = Some(if self.manual() { DESK } else { FOREMAN });
    }
    fn walk(&mut self, w: &mut World) {
        let elapsed = self.t - self.start;
        let cut = &SCORE["cuts"][0];
        let at = story_tick(cut["at"].as_f64().unwrap());
        let to = story_tick(cut["to"].as_f64().unwrap());
        let steps = if elapsed == at + 1 { to - at + 1 } else { 1 };
        for _ in 0..steps {
            crate::navigation::walk_tracks(w, &mut self.walk_clocks, 0);
        }
        if self.t >= self.due {
            match self.cue{0|1 if w.props["bob:id"]["agent"]!="bob"=>self.script(w,"2A",self.cue),2=>self.say(w,"lou","Did you know that he keeps that blade out at home? Imagine sharing a lift with him."),_=>{}}
            self.cue += 1
        }
        if elapsed >= 310 && self.cue >= 3 {
            self.stage = "welcome".into();
            self.settle_gate(w);
            self.next(if self.manual() { "swapped" } else { "gate" });
        }
    }
    fn opening(&mut self, w: &mut World) {
        if self.t < self.due {
            return;
        }
        let c = self.cue;
        match c {
            0..=3 => self.script(w, "2B", c),
            4..=5 => self.script(w, "2C", c - 4),
            6 => self.say(w, "LIMEN", "Loudspeaker, the book. Ledger, the queue."),
            7 => self.say(w, "ed", "I was Ledger yesterday, sir."),
            8 => self.say(w, "LIMEN", "Then you know where the book is."),
            9..=15 => {
                self.script(w, "2D", c - 9);
                if c == 12 {
                    self.release(w, "sam")
                }
                if c == 15 {
                    self.release(w, "max")
                }
            }
            _ => {
                if !["sam", "max"].iter().all(|id| self.arrived(w, id)) {
                    return;
                }
                self.stage = "work".into();
                self.bell = self.t + 4800;
                self.lesson(w, "pairs");
                return;
            }
        }
        self.cue += 1
    }
    fn swapped(&mut self, w: &mut World) {
        if self.t < self.due {
            return;
        }
        let c = self.cue;
        // Written turns open on receipts from the same line the player operates.
        match c {
            4 if !self.arrived(w, "sam") => return,
            6 if !CREW.iter().all(|id| self.arrived(w, id)) => return,
            14 if self.line.cells[2].is_none() => return,
            17 if self.line.cells[3].is_none() => return,
            20 if w.rack.len() == self.initial => return,
            30 => {
                if self.line.cells[3].as_ref().is_some_and(|j| j.id == "D2-C2") {
                    self.next("live")
                }
                return;
            }
            _ => {}
        }
        let clearance = match c {
            11 | 22 => Some(0),
            13 | 26 => Some(1),
            16 | 29 => Some(2),
            19 => Some(3),
            _ => None,
        };
        if let Some(i) = clearance {
            let crew = members(w, i);
            let Some(job) = self.line.cells[i].as_ref() else {
                return;
            };
            let id = format!("D2-C{}", if c < 22 { 1 } else { 2 });
            if job.id != id
                || crew.is_empty()
                || self
                    .line
                    .clear(w, i, &format!("{id}/{}", crew[0]), self.t)
                    .is_err()
            {
                return;
            }
            let extra = if c == 16 { " Carry on, Twitch." } else { "" };
            self.say(w, "LIMEN", &format!("{}, all clear.{extra}", TITLES[i]));
        }
        for (who, text) in &SWAPPED[c] {
            self.say(w, who, text)
        }
        match c {
            2 => {
                for id in CREW {
                    self.release(w, id)
                }
                self.bell = self.t + 2400;
                self.stage = "work".into()
            }
            4 => self.cut("conveyor"),
            6 => w.actor("max").target = Some([130800, 142200]),
            9 => {
                for (i, id) in ["sam", "bob", "jo", "max"].iter().enumerate() {
                    post(w, id, i, self.t).expect("opening posts are reserved");
                }
                for (id, p) in [
                    ("ed", [120650, 143900]),
                    ("gus", [134950, 144000]),
                    ("mae", [118600, 143200]),
                    ("kit", [128800, 143300]),
                    ("lou", [134000, 143100]),
                    ("ben", [117500, 142000]),
                ] {
                    w.actor(id).target = Some(p);
                }
                w.actor("STILETTO").target = Some([127100, 139200]);
            }
            18 | 24 => self.due = self.t + 40,
            22 => w.actor("STILETTO").target = Some(DESK),
            _ => {}
        }
        self.cue += 1
    }
    fn supervise(&mut self, w: &mut World) {
        let evidence = match self.lesson.as_str() {
            "demonstration" if w.rack.len() > self.base => "first load arrived",
            "production" if w.rack.len() >= self.base + 2 => "two more loads arrived",
            "visit" | "return" if w.agents["STILETTO"].target.is_none() => "at the security desk",
            "two-cleared" | "release" | "live" | "card" => "crew status",
            _ => return,
        };
        let actor = if self.lesson == "card" {
            "LIMEN"
        } else {
            "STILETTO"
        };
        let supervisor = w.actor(actor);
        let fact = format!("observed.{evidence}");
        supervisor.believe(&fact, json!(true), "factory floor", self.t);
        if !supervisor.intend(
            "supervise",
            &self.lesson,
            evidence,
            60,
            &fact,
            "factory floor",
            self.t,
        ) {
            return;
        }
        supervisor.conclude("supervise");
        match self.lesson.as_str() {
            "demonstration" => {
                self.cut("security");
                self.next("card");
                w.actor("bob").target = Some([126200, 130250])
            }
            "card" if self.case == "none" && self.t >= self.due => {
                if w.agents["bob"].target.is_some() {
                    return;
                }
                if self.cue < 7 {
                    self.script(w, "2D", self.cue + 7);
                    self.cue += 1
                } else if w.props["bob:id"]["agent"] != "bob" {
                    self.case = "open".into();
                    self.deadline = self.t + 260
                } else {
                    self.resolve(w, true)
                }
            }
            "card" if self.case == "open" && self.t >= self.deadline => self.resolve(w, false),
            "visit" if self.t >= self.due => {
                if self.cue == 0 {
                    self.say(w, "STILETTO", "I asked for a crew. Where are they?");
                    self.cue += 1
                } else {
                    self.say(
                        w,
                        "LIMEN",
                        "Two more. The rest stay here until I finish their checks.",
                    );
                    self.next("two-cleared");
                    w.actor("STILETTO").target = Some(FOREMAN)
                }
            }
            "two-cleared" => {
                for id in ["jo", "kit"] {
                    if !self.entered.contains(&id.to_string()) {
                        self.release(w, id);
                        return;
                    }
                }
                if ["jo", "kit"].iter().all(|id| self.arrived(w, id)) {
                    self.lesson(w, "singles")
                }
            }
            "production" => {
                self.cut("security");
                w.actor("STILETTO").target = Some([129400, 132400]);
                self.next("return");
                self.say(
                    w,
                    "LIMEN",
                    "Is that scuff on the photograph, or on your face?",
                )
            }
            "return" if self.t >= self.due => {
                self.next("release");
                self.say(w, "STILETTO", "EVERYBODY ON THE LINE! NOW!")
            }
            "release" if self.t >= self.due => {
                for id in ["mae", "lou", "ben"] {
                    if !self.entered.contains(&id.to_string()) {
                        self.release(w, id);
                        self.due = self.t + 9;
                        return;
                    }
                }
                if self.arrived(w, "ben") {
                    w.actor("STILETTO").target = Some(FOREMAN);
                    self.cut("conveyor");
                    self.next("live")
                }
            }
            "live" if self.t >= self.due && self.entered.iter().any(|id| w.agents[id].post < 0) => {
                self.say(w, "STILETTO", "See that lot by the door? Give them work.");
                self.due = self.t + 220
            }
            _ => {}
        }
    }
    pub fn step(&mut self, w: &mut World) {
        self.t += 1;
        w.events.retain(|e| n(&e["until"]) > self.t);
        if self.stage == "walk" {
            self.walk(w);
            return;
        }
        let ids: Vec<_> = w.agents.keys().cloned().collect();
        for id in ids {
            w.actor(&id).moving = false;
            crate::navigation::step_toward(w, &id, self.t);
        }
        if self.lesson == "gate" {
            self.opening(w)
        } else if self.lesson == "swapped" {
            self.swapped(w)
        } else if !self.manual() {
            self.supervise(w)
        }
        if self.stage == "work" && !self.held() {
            let pair = !self.manual()
                && matches!(
                    self.lesson.as_str(),
                    "demonstration" | "card" | "visit" | "two-cleared"
                );
            if pair {
                if let Some(i) = self.line.cells.iter().position(Option::is_some) {
                    let id = &self.posts[i];
                    if !id.is_empty() && w.agents[id].post != i as i32 {
                        let _ = post(w, id, i, self.t);
                    }
                }
            }
            if self.manual() && self.lesson == "live" {
                self.line.inspect_if_due(self.t, w)
            }
            self.line.step(w, self.t, self.manual(), pair);
            if self.bell > 0 && self.t >= self.bell {
                self.closed = true;
                self.stage = "close".into();
                if self.case == "detention" {
                    w.actor("bob").duty = "released".into();
                }
            }
        }
    }
}
