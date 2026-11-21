use loopforge_engine::host::invoke;
use serde_json::{json, Value};
use std::io::{self, BufRead};
fn export(journal: &str, out: &str) -> Result<(), Box<dyn std::error::Error>> {
    use loopforge_engine::{
        history::{History, Journal},
        session::Session,
    };
    use std::{fs, path::Path};
    let j: Journal = serde_json::from_reader(fs::File::open(journal)?)?;
    let run = j.run_id.clone();
    let mut session = Session::new(run, History::restore(j)?);
    let files = session.offline()?;
    fs::create_dir(out)?;
    for (name, text) in files {
        let path = Path::new(out).join(name);
        fs::create_dir_all(path.parent().unwrap())?;
        fs::write(path, text)?;
    }
    Ok(())
}
fn main() {
    let args: Vec<_> = std::env::args().collect();
    if args.get(1).is_some_and(|v| v == "export") {
        if args.len() != 4 {
            eprintln!("Usage: loopforge export JOURNAL.json NEW_DIRECTORY");
            std::process::exit(2)
        }
        if let Err(e) = export(&args[2], &args[3]) {
            eprintln!("{e}");
            std::process::exit(1)
        }
        return;
    }
    #[cfg(not(target_arch = "wasm32"))]
    if std::env::args().nth(1).as_deref() == Some("serve") {
        let port = std::env::args()
            .nth(2)
            .map(|s| s.parse().expect("expected a TCP port"))
            .unwrap_or(3008);
        if let Err(e) = loopforge_engine::socket::serve(port) {
            eprintln!("{e}");
            std::process::exit(1)
        }
        return;
    }
    let mut session = None;
    for line in io::stdin().lock().lines().map_while(Result::ok) {
        let result = serde_json::from_str::<Value>(&line)
            .map_err(|_| "Invalid JSON")
            .and_then(|v| {
                invoke(
                    &mut session,
                    v["op"].as_u64().ok_or("Invalid operation")? as u32,
                    v["value"].clone(),
                )
            });
        println!(
            "{}",
            match result {
                Ok(v) => json!({"value":v}),
                Err(e) => json!({"error":e}),
            }
        )
    }
}
