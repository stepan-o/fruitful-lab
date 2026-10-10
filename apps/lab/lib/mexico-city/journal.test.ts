import {
  blankEntry,
  blankJournal,
  mergeJournals,
  parseJournal,
  points,
} from "./journal";

describe("a two-person field journal", () => {
  it("keeps old journals compatible and ignores unknown or unearned learning rewards", () => {
    const legacy = parseJournal({
      version: 1,
      players: { Susy: {}, Stepan: {} },
    });
    expect(points(legacy.players.Susy, legacy.learning?.Susy)).toBe(0);
    const imported = parseJournal({
      version: 1,
      players: { Susy: {}, Stepan: {} },
      learning: {
        Susy: {
          orientation: true,
          "city-lake": true,
          "nahuatl-atl": "true",
          invented: 99999,
        },
        Stepan: { "nahuatl-atl": true },
      },
    });
    expect(points(imported.players.Susy, imported.learning?.Susy)).toBe(35);
    expect(points(imported.players.Stepan, imported.learning?.Stepan)).toBe(10);
    expect(imported.learning?.Susy).toEqual({
      orientation: true,
      "city-lake": true,
    });
  });
  it("merges learning rewards once without losing either player’s discoveries", () => {
    const local = blankJournal(),
      incoming = blankJournal();
    local.learning!.Susy = { orientation: true, "city-lake": true };
    incoming.learning!.Susy = { "city-lake": true, "nahuatl-xochimilco": true };
    incoming.learning!.Stepan = { "city-airport": true };
    local.players.Susy.zocalo = { ...blankEntry(), read: true };
    const result = mergeJournals(local, incoming);
    const twice = mergeJournals(result, incoming);
    expect(points(twice.players.Susy, twice.learning?.Susy)).toBe(65);
    expect(points(twice.players.Stepan, twice.learning?.Stepan)).toBe(20);
    expect(local.learning!.Susy["nahuatl-xochimilco"]).toBeUndefined();
  });
  it("keeps players independent and awards each activity once", () => {
    const journal = blankJournal();
    journal.players.Susy.zocalo = {
      ...blankEntry(),
      read: true,
      visited: true,
      photo: "data:image/jpeg;base64,AA==",
    };
    const imported = parseJournal(JSON.parse(JSON.stringify(journal)));
    const combined = mergeJournals(journal, imported);
    expect(points(combined.players.Susy)).toBe(50);
    expect(points(combined.players.Stepan)).toBe(0);
    expect(points(mergeJournals(combined, imported).players.Susy)).toBe(50);
  });
  it("combines discoveries while preserving existing personal notes and photographs", () => {
    const local = blankJournal(),
      incoming = blankJournal();
    local.players.Susy.zocalo = {
      ...blankEntry(),
      read: true,
      note: "Our own detail",
      photo: "local photo",
    };
    incoming.players.Susy.zocalo = {
      ...blankEntry(),
      visited: true,
      saved: true,
      note: "Older note",
      photo: "old photo",
    };
    incoming.players.Stepan.revolucion = { ...blankEntry(), visited: true };
    const result = mergeJournals(local, incoming);
    expect(result.players.Susy.zocalo).toEqual({
      read: true,
      visited: true,
      saved: true,
      note: "Our own detail",
      photo: "local photo",
    });
    expect(points(result.players.Stepan)).toBe(25);
    expect(local.players.Susy.zocalo.visited).toBe(false);
  });
  it("rejects unsupported formats and external image payloads", () => {
    expect(() => parseJournal({ version: 2, players: {} })).toThrow();
    expect(() => parseJournal({ version: 1, players: { Susy: {} } })).toThrow();
    const journal = blankJournal();
    journal.players.Susy.zocalo = {
      ...blankEntry(),
      photo: "https://external.example/track.jpg",
    };
    expect(() => parseJournal(journal)).toThrow("unsupported photograph");
    journal.players.Susy.zocalo.photo = "data:image/svg+xml,<svg/>";
    expect(() => parseJournal(journal)).toThrow("unsupported photograph");
  });
  it("discards foreign places and limits imported notes without trusting truthy flags", () => {
    const value = {
      version: 1,
      players: {
        Susy: {
          zocalo: { read: "yes", note: "a".repeat(700) },
          invented: { read: true },
        },
        Stepan: {},
      },
    };
    const result = parseJournal(value);
    expect(result.players.Susy.zocalo?.read).toBe(false);
    expect(result.players.Susy.zocalo?.note).toHaveLength(500);
    expect(Object.keys(result.players.Susy)).toEqual(["zocalo"]);
  });
});
