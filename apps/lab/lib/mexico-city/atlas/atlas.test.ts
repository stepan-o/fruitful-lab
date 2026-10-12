import manifest from "@/lib/assets/generated/mexico-city.json";
import geography from "../geography.json";
import { BOROUGHS, SOURCES, VOCABULARY } from "./content";
import { CHAPTERS, ERAS, LOCAL_TIMELINES } from "./chapters";
import { NEW_STORIES } from "./stories";
import { QUESTIONS, rewardFor } from "./quizzes";
import { STORIES } from "../content";
function validSources(ids: readonly string[]) {
  for (const id of ids)
    expect(new URL(SOURCES[id]?.url ?? id).protocol).toBe("https:");
}
test("every current borough has a bilingual learning profile and three usable place anchors", () => {
  expect(new Set(BOROUGHS.map((b) => b.id))).toEqual(
    new Set(geography.boroughs.map((b) => b.id)),
  );
  for (const b of BOROUGHS) {
    expect(b.anchors).toHaveLength(3);
    for (const field of [
      b.region,
      b.hook,
      b.memory,
      b.today,
      b.transit,
      ...b.anchors.map((a) => a.note),
    ]) {
      expect(field.es.trim().length).toBeGreaterThan(3);
      expect(field.en.trim().length).toBeGreaterThan(3);
    }
    validSources([b.source, ...(b.extra ? [b.extra] : [])]);
    for (const a of b.anchors) {
      expect(a.coordinate[0]).toBeLessThan(-98.8);
      expect(a.coordinate[0]).toBeGreaterThan(-99.5);
      expect(a.coordinate[1]).toBeGreaterThan(19);
      expect(a.coordinate[1]).toBeLessThan(19.7);
      if (a.story)
        expect([...STORIES, ...NEW_STORIES].some((s) => s.id === a.story)).toBe(
          true,
        );
    }
  }
});
test("all lessons and historical windows resolve their evidence and quiz destination", () => {
  expect(CHAPTERS).toHaveLength(6);
  expect(ERAS).toHaveLength(7);
  for (const chapter of CHAPTERS) {
    expect(chapter.scenes).toHaveLength(3);
    expect(QUESTIONS[chapter.track].length).toBeGreaterThan(0);
    for (const scene of chapter.scenes) {
      validSources(scene.sources);
      expect(scene.text.es).toBeTruthy();
      expect(scene.text.en).toBeTruthy();
    }
  }
  for (const era of ERAS) validSources(era.sources);
  for (const local of LOCAL_TIMELINES) validSources(local.sources);
  for (const s of NEW_STORIES) validSources(s.sources);
  for (const w of VOCABULARY) validSources([w.source]);
});
test("every quiz has one valid answer, an explanation in each language and safe reward semantics", () => {
  expect(Object.values(QUESTIONS).flat()).toHaveLength(40);
  const ids = new Set<string>();
  for (const q of Object.values(QUESTIONS).flat()) {
    expect(ids.has(q.id)).toBe(false);
    ids.add(q.id);
    expect(q.options.filter((o) => o.id === q.correct)).toHaveLength(1);
    expect(q.explanation.es).toBeTruthy();
    expect(q.explanation.en).toBeTruthy();
    validSources(q.sources);
    expect(rewardFor(q, q.correct, false)).toBe(25);
    expect(rewardFor(q, q.correct, true)).toBe(0);
    for (const wrong of q.options.filter((o) => o.id !== q.correct))
      expect(rewardFor(q, wrong.id, false)).toBe(0);
  }
});

test("chapter and place artwork resolve to published responsive assets", () => {
  const ids = Object.keys(manifest.assets);
  for (const chapter of CHAPTERS) expect(ids).toContain(chapter.art);
  for (const story of NEW_STORIES) expect(ids).toContain(`atlas-${story.id}`);
  for (const story of STORIES) expect(ids).toContain(`${story.id}-past`);
});
