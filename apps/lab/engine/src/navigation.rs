use crate::world::*;
use serde_json::Value;
use std::sync::LazyLock;
type Rect = [i32; 4];
fn bounds(r: &Value) -> Rect {
    let m = |key: &str| (r[key].as_f64().unwrap() * 1000.).round() as i32;
    [m("x"), m("y"), m("x") + m("w"), m("y") + m("h")]
}
static WALLS: LazyLock<Vec<Rect>> = LazyLock::new(|| {
    let mut v = vec![];
    v.extend(rows(&GEOM["walls"]).iter().map(bounds));
    v.extend(
        rows(&GEOM["fixtures"])
            .iter()
            .filter(|f| f["kind"] != "drain")
            .map(|f| bounds(&f["rect"])),
    );
    v.extend(rows(&GEOM["forgeHall"]["columns"]).iter().map(bounds));
    v.extend(
        rows(&GEOM["forgeHall"]["installations"])
            .iter()
            .map(|f| bounds(&f["rect"])),
    );
    v
});
fn point_segment(p: Point, a: Point, b: Point) -> f64 {
    let dx = (b[0] - a[0]) as f64;
    let dy = (b[1] - a[1]) as f64;
    let x = (p[0] - a[0]) as f64;
    let y = (p[1] - a[1]) as f64;
    let dd = dx * dx + dy * dy;
    let t = if dd == 0. {
        0.
    } else {
        ((x * dx + y * dy) / dd).clamp(0., 1.)
    };
    (x - t * dx).powi(2) + (y - t * dy).powi(2)
}
fn rect_clear(a: Point, b: Point, r: Rect, rad: i32) -> bool {
    if (0..2).any(|i| a[i].min(b[i]) - rad > r[i + 2] || a[i].max(b[i]) + rad < r[i]) {
        return true;
    }
    let (mut lo, mut hi) = (0.0_f64, 1.0_f64);
    for i in 0..2 {
        let d = b[i] - a[i];
        if d == 0 {
            if a[i] < r[i] || a[i] > r[i + 2] {
                lo = 2.;
                break;
            }
        } else {
            let u = (r[i] - a[i]) as f64 / d as f64;
            let v = (r[i + 2] - a[i]) as f64 / d as f64;
            lo = lo.max(u.min(v));
            hi = hi.min(u.max(v));
        }
    }
    if lo <= hi {
        return false;
    }
    let d = (rad as f64).powi(2);
    for p in [a, b] {
        let x = (r[0] - p[0]).max(0).max(p[0] - r[2]) as f64;
        let y = (r[1] - p[1]).max(0).max(p[1] - r[3]) as f64;
        if x * x + y * y < d {
            return false;
        }
    }
    [[r[0], r[1]], [r[0], r[3]], [r[2], r[1]], [r[2], r[3]]]
        .into_iter()
        .all(|p| point_segment(p, a, b) >= d)
}
fn clear(a: Point, b: Point, others: &[Point]) -> bool {
    WALLS.iter().all(|r| rect_clear(a, b, *r, 399))
        && others
            .iter()
            .all(|p| point_segment(*p, a, b) >= 800_f64.powi(2))
}
pub fn directed(a: Point, b: Point, bodies: &[Point]) -> Option<Point> {
    if clear(a, b, bodies) {
        return Some(b);
    }
    let mut nodes = vec![
        a,
        b,
        [127000, 132000],
        [127000, 136000],
        [127000, 140000],
        [125600, 143000],
        [129500, 129000],
        [125000, 128500],
        [128700, 132000],
        [126000, 141400],
        [131000, 142800],
        [122000, 121500],
        [125400, 120800],
        [128700, 121400],
        [131700, 120800],
    ];
    for p in bodies {
        if distance(a, *p) + distance(b, *p) < distance(a, b) + 5000 {
            for [x, y] in [
                [950, 0],
                [-950, 0],
                [0, 950],
                [0, -950],
                [690, 690],
                [-690, 690],
                [690, -690],
                [-690, -690],
            ] {
                nodes.push([p[0] + x, p[1] + y]);
            }
        }
    }
    let mut cost = vec![i32::MAX; nodes.len()];
    let mut first = vec![0; nodes.len()];
    let mut used = vec![false; nodes.len()];
    cost[0] = 0;
    while let Some(i) = (0..nodes.len())
        .filter(|&i| !used[i] && cost[i] < i32::MAX)
        .min_by_key(|&i| cost[i])
    {
        if i == 1 {
            return Some(nodes[first[i]]);
        }
        used[i] = true;
        for j in 1..nodes.len() {
            let new = cost[i] + distance(nodes[i], nodes[j]);
            if !used[j] && new < cost[j] && clear(nodes[i], nodes[j], bodies) {
                cost[j] = new;
                first[j] = if i == 0 { j } else { first[i] };
            }
        }
    }
    None
}
pub fn step_toward(w: &mut World, id: &str, t: i32) {
    let a = &w.agents[id];
    let Some(dest) = a.target else { return };
    let from = a.p;
    let bodies: Vec<Point> = w
        .agents
        .iter()
        .filter(|(who, a)| *who != id && a.duty != "detained")
        .map(|(_, a)| a.p)
        .collect();
    let need_path = a.waypoint.is_none() || a.destination != Some(dest) || a.waypoint == Some(a.p);
    if need_path {
        let next = directed(from, dest, &bodies);
        let a = w.actor(id);
        a.waypoint = next;
        a.destination = Some(dest);
    }
    let Some(next) = w.agents[id].waypoint else {
        return;
    };
    let stride = match id {
        "bob" => 115,
        "STILETTO" => 205,
        _ => 155,
    };
    let step = towards(from, next, stride);
    if !clear(from, step, &bodies) {
        if t % 8 == 0 {
            w.actor(id).waypoint = None
        }
        return;
    }
    let a = w.actor(id);
    a.travel(step);
    if step == dest {
        a.target = None;
        a.waypoint = None;
        if a.post >= 0 {
            a.duty = "working".into()
        } else if a.duty == "cleared" {
            a.duty = "standing".into()
        }
    }
}
pub fn walk_tracks(w: &mut World, elapsed: &mut Table<i32>, gate: i32) {
    let hinge = meters(&GEOM["gate"]["hinge"]);
    let gate_rect = [hinge[0], hinge[1], hinge[0] + gate, hinge[1]];
    let mut moves = Table::new();
    for (id, a) in &w.agents {
        let t = elapsed.get(id).copied().unwrap_or(0) + 1;
        let to = track(id, t);
        if distance(a.p, to) <= 650
            && (a.p == to || clear(a.p, to, &[]) && rect_clear(a.p, to, gate_rect, 399))
        {
            moves.insert(id.clone(), to);
        }
    }
    let ids: Vec<_> = w.agents.keys().cloned().collect();
    loop {
        let mut rejected = vec![];
        for (i, x) in ids.iter().enumerate() {
            for y in &ids[..i] {
                if !moves.contains_key(x) && !moves.contains_key(y) {
                    continue;
                }
                let a = w.agents[x].p;
                let b = w.agents[y].p;
                let to = *moves.get(x).unwrap_or(&a);
                let other = *moves.get(y).unwrap_or(&b);
                if point_segment(
                    [0, 0],
                    [a[0] - b[0], a[1] - b[1]],
                    [to[0] - other[0], to[1] - other[1]],
                ) < 848_f64.powi(2)
                {
                    rejected.extend([x, y])
                }
            }
        }
        if rejected.is_empty() {
            break;
        }
        for id in rejected {
            moves.remove(id);
        }
    }
    for a in w.agents.values_mut() {
        a.moving = false
    }
    for (id, to) in moves {
        *elapsed.entry(id.clone()).or_default() += 1;
        w.actor(&id).travel(to)
    }
}
