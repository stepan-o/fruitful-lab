#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
target_dir="${CARGO_TARGET_DIR:-$PWD/target}"
effective_cargo_home="${CARGO_HOME:-$HOME/.cargo}"
export RUSTFLAGS="--remap-path-prefix=$effective_cargo_home=/cargo --remap-path-prefix=$PWD=/loopforge/engine"
cargo build --locked --release --lib --target wasm32-unknown-unknown
install -m 644 "$target_dir/wasm32-unknown-unknown/release/loopforge_engine.wasm" ../public/loopforge-engine/kernel.wasm
