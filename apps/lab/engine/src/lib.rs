pub mod bdi;
pub mod campaign;
pub mod history;
pub mod host;
pub mod intro;
pub mod line;
pub mod migration;
pub mod navigation;
pub mod session;
pub mod shift;
#[cfg(not(target_arch = "wasm32"))]
pub mod socket;
pub mod world;
#[cfg(test)]
mod tests {
    use super::{campaign::Game, world::CAST};
    use serde_json::json;
    #[test]
    fn departure_is_a_consequence() {
        let mut g = Game::default();
        while g.phase == "intro" {
            if g.intro.held() {
                let station = CAST.orders[g.intro.confirmed]["station"].clone();
                g.apply(&json!({"action":"confirm","target":station}))
                    .unwrap()
            } else {
                g.step()
            }
        }
        assert_eq!(g.world.rack.len(), 3);
        assert_eq!(g.world.props["bob:id"]["agent"], "ed");
        assert_eq!(g.world.facts["injury.bob"], "limping");
        let mut skipped = Game::default();
        skipped.apply(&json!({"action":"skip"})).unwrap();
        assert_eq!(skipped.project(), g.project());
    }
}
