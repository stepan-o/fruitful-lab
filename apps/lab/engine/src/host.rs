//! Host services are outside KVP. The only viewer ingress is UTF-8 JSON at WIRE.
use crate::{
    history::{History, Journal},
    session::Session,
};
use serde_json::{json, Value};
pub const BOOT: u32 = 0;
pub const WIRE: u32 = 1;
pub const BUDGET: u32 = 2;
pub const APPLIED: u32 = 3;
pub const ARTIFACT: u32 = 4;
pub const SAVE: u32 = 5;
pub fn invoke(slot: &mut Option<Session>, op: u32, v: Value) -> Result<Value, &'static str> {
    if op == BOOT {
        let id = v["run"]
            .as_str()
            .filter(|s| s.len() == 36)
            .ok_or("Invalid run identity")?;
        let history = if !v["legacy"].is_null() {
            if v["legacy"]["id"] != id {
                return Err("Legacy run ID differs");
            }
            crate::migration::legacy(&v["legacy"])?
        } else if v["save"].is_null() {
            History::default()
        } else {
            let j: Journal =
                serde_json::from_value(v["save"].clone()).map_err(|_| "Invalid save")?;
            if j.run_id != id {
                return Err("Run ID differs");
            }
            History::restore(j)?
        };
        *slot = Some(Session::new(id.into(), history));
        return Ok(Value::Null);
    }
    let s = slot.as_mut().ok_or("Engine not initialized")?;
    match op {
        WIRE => Ok(json!(s.receive(&v))),
        BUDGET => Ok(json!(
            s.pulse(v.as_u64().ok_or("Invalid elapsed budget")?.min(250) as u32)
        )),
        APPLIED => {
            s.applied(
                v["tick"].as_u64().ok_or("Invalid tick")? as u32,
                v["hash"].as_str().ok_or("Missing hash")?,
            );
            Ok(Value::Null)
        }
        ARTIFACT => s
            .artifacts
            .get(v.as_str().ok_or("Invalid locator")?)
            .map(|s| json!(s))
            .ok_or("Artifact unavailable"),
        SAVE => Ok(s.history.save(&s.run)),
        _ => Err("Unknown host service"),
    }
}
#[cfg(target_arch = "wasm32")]
mod abi {
    use super::*;
    use std::cell::RefCell;
    thread_local! {static IO:RefCell<Vec<u8>>=const{RefCell::new(Vec::new())};static SESSION:RefCell<Option<Session>>=const{RefCell::new(None)};}
    #[no_mangle]
    pub extern "C" fn input(len: usize) -> *mut u8 {
        IO.with_borrow_mut(|buf| {
            buf.resize(len, 0);
            buf.as_mut_ptr()
        })
    }
    #[no_mangle]
    pub extern "C" fn output() -> *const u8 {
        IO.with_borrow(|buf| buf.as_ptr())
    }
    #[no_mangle]
    pub extern "C" fn exchange(op: u32) -> usize {
        IO.with_borrow_mut(|buf| {
            let v = serde_json::from_slice(buf)
                .map_err(|_| "Invalid UTF-8 JSON")
                .and_then(|v| SESSION.with_borrow_mut(|s| invoke(s, op, v)));
            *buf = serde_json::to_vec(&match v {
                Ok(value) => json!({"value":value}),
                Err(message) => json!({"error":message}),
            })
            .unwrap();
            buf.len()
        })
    }
}
