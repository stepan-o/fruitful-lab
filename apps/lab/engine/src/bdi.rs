//! Beliefs carry provenance. Competing desires use stable priority and plan IDs.
//! Admission and completion remain distinct so a rejected action cannot commit effects.
use crate::world::{Actor, Table};
use serde::{Deserialize, Serialize};
use serde_json::Value;

pub struct Evidence<'a> {
    pub fact: &'a str,
    pub expected: Value,
    pub source: Option<&'a str>,
}
pub struct Desire<'a> {
    pub plan: &'a str,
    pub goal: &'a str,
    pub priority: i32,
    pub evidence: Vec<Evidence<'a>>,
}
#[derive(Clone, Serialize, Deserialize)]
pub struct Commitment {
    pub plan: String,
    pub goal: String,
    pub priority: i32,
    pub since: i32,
    pub evidence: Table<i32>,
}
impl Actor {
    pub fn consider<'a>(&self, lane: &str, candidates: &'a [Desire<'a>]) -> Option<&'a Desire<'a>> {
        candidates
            .iter()
            .filter(|c| {
                self.commitments
                    .get(lane)
                    .is_none_or(|i| i.plan == c.plan || c.priority > i.priority)
                    && c.evidence.iter().all(|need| {
                        self.beliefs.get(need.fact).is_some_and(|b| {
                            b.value == need.expected && need.source.is_none_or(|s| b.source == s)
                        })
                    })
            })
            .min_by(|a, b| b.priority.cmp(&a.priority).then_with(|| a.plan.cmp(b.plan)))
    }
    pub fn commit(&mut self, lane: &str, c: &Desire, t: i32) {
        if self.commitments.get(lane).is_some_and(|i| i.plan == c.plan) {
            return;
        }
        self.commitments.insert(
            lane.into(),
            Commitment {
                plan: c.plan.into(),
                goal: c.goal.into(),
                priority: c.priority,
                since: t,
                evidence: c
                    .evidence
                    .iter()
                    .map(|e| (e.fact.into(), self.beliefs[e.fact].tick))
                    .collect(),
            },
        );
    }
    pub fn conclude(&mut self, lane: &str) {
        self.commitments.remove(lane);
    }
    pub fn intend(
        &mut self,
        lane: &str,
        plan: &str,
        goal: &str,
        priority: i32,
        fact: &str,
        source: &str,
        t: i32,
    ) -> bool {
        let choices = [Desire {
            plan,
            goal,
            priority,
            evidence: vec![Evidence {
                fact,
                expected: Value::Bool(true),
                source: Some(source),
            }],
        }];
        if self.consider(lane, &choices).is_none() {
            return false;
        }
        self.commit(lane, &choices[0], t);
        true
    }
}
