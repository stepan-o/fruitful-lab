import {
  blankEntry,
  blankJournal,
  mergeJournals,
  parseJournal,
  points,
} from "./journal";

describe("a two-person field journal", () => {
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
