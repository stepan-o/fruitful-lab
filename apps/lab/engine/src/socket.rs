//! Native review host. One controlling viewer attaches to the run at a time.
//! Replay records are fetched from the companion loopback HTTP listener.
use crate::{history::History, session::Session, world::Table};
use serde_json::{json, Value};
use std::{
    error::Error,
    io::{BufRead, BufReader, Write},
    net::{TcpListener, TcpStream},
    sync::{Arc, Mutex},
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};
use tungstenite::{accept, Message};
type Result<T> = std::result::Result<T, Box<dyn Error>>;
pub fn serve(port: u16) -> Result<()> {
    let ws = TcpListener::bind(("127.0.0.1", port))?;
    let http = TcpListener::bind(("127.0.0.1", 0))?;
    let origin = format!("http://{}", http.local_addr()?);
    let records = Arc::new(Mutex::new(Table::<String>::new()));
    let copy = records.clone();
    let base = origin.clone();
    std::thread::spawn(move || {
        for client in http.incoming().flatten() {
            let _ = artifact(client, &base, &copy);
        }
    });
    let now = SystemTime::now().duration_since(UNIX_EPOCH)?.as_nanos();
    let run = format!("00000000-0000-4000-8000-{:012x}", now & 0xffffffffffff);
    println!("ws://{} {origin}", ws.local_addr()?);
    let mut history = History::default();
    for conn in ws.incoming() {
        let mut s = Session::new(run.clone(), history);
        s.artifact_origin = origin.clone();
        if let Ok(tcp) = conn {
            if let Err(e) = connection(tcp, &mut s, &records) {
                eprintln!("Viewer disconnected: {e}")
            }
        }
        history = s.history;
    }
    Ok(())
}
fn artifact(mut tcp: TcpStream, origin: &str, records: &Mutex<Table<String>>) -> Result<()> {
    tcp.set_read_timeout(Some(Duration::from_secs(2)))?;
    let mut line = String::new();
    BufReader::new(&tcp).read_line(&mut line)?;
    let mut fields = line.split_whitespace();
    let body = if fields.next() == Some("GET") {
        fields
            .next()
            .and_then(|p| records.lock().ok()?.get(&format!("{origin}{p}")).cloned())
    } else {
        None
    };
    let status = if body.is_some() {
        "200 OK"
    } else {
        "404 Not Found"
    };
    let text = body.unwrap_or_default();
    write!(tcp,"HTTP/1.1 {status}\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",text.len(),text)?;
    Ok(())
}
fn connection(tcp: TcpStream, s: &mut Session, records: &Mutex<Table<String>>) -> Result<()> {
    tcp.set_read_timeout(Some(Duration::from_secs(4)))?;
    let mut ws = accept(tcp)?;
    ws.get_mut()
        .set_read_timeout(Some(Duration::from_millis(10)))?;
    let mut last = Instant::now();
    loop {
        let mut output = match ws.read() {
            Ok(Message::Text(data)) => {
                s.receive(&serde_json::from_str::<Value>(data.as_str()).unwrap_or(Value::Null))
            }
            Ok(Message::Close(_)) => return Ok(()),
            Ok(Message::Binary(_)) => s.receive(&json!(null)),
            Ok(_) => vec![],
            Err(tungstenite::Error::Io(e))
                if matches!(
                    e.kind(),
                    std::io::ErrorKind::WouldBlock | std::io::ErrorKind::TimedOut
                ) =>
            {
                vec![]
            }
            Err(e) => return Err(e.into()),
        };
        if output
            .iter()
            .any(|e| e["payload"].get("artifacts_manifest_url").is_some())
        {
            *records.lock().unwrap() = s.artifacts.clone();
        }
        let elapsed = last.elapsed().as_millis().min(250) as u32;
        if elapsed > 0 {
            last += Duration::from_millis(elapsed as u64);
            output.extend(s.pulse(elapsed));
        }
        for e in output {
            ws.send(Message::Text(e.to_string().into()))?
        }
    }
}
