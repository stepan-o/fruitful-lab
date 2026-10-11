/** @jest-environment node */
import {
  demoCommand,
  demoState,
  expireChallenges,
  groupPoints,
  personalPoints,
} from "./field-game";
import { containsPoint, project, unproject } from "./map-engine";
const id = () => String(Math.random());
test("a photo earns personal points, peer review settles separate group points only once", () => {
  let s = demoState();
  const groupId = s.groups[0].id,
    challengeId = "demo-mural";
  s = demoCommand(s, { kind: "accept", id: id(), groupId, challengeId });
  const command = {
    kind: "record" as const,
    id: id(),
    title: "Mural",
    category: "art" as const,
    place: "Roma",
    lat: 19.41,
    lng: -99.16,
    photo: "data:image/jpeg;base64,test",
    groupId,
    challengeId,
  };
  s = demoCommand(s, command);
  s = demoCommand(s, command);
  expect(personalPoints(s)).toBe(30);
  expect(groupPoints(s.groups[0], "susy")).toBe(0);
  expect(() =>
    demoCommand(s, {
      kind: "review",
      id: id(),
      groupId,
      challengeId,
      target: "susy",
      decision: "confirm",
    }),
  ).toThrow("review_forbidden");
  s = expireChallenges(s, Date.now() + 172800000);
  expect(s.groups[0].challenges[0].status).toBe("submitted");
  s.me = { id: "stepan", name: "Stepan", admin: true };
  s = demoCommand(s, {
    kind: "review",
    id: id(),
    groupId,
    challengeId,
    target: "susy",
    decision: "confirm",
  });
  s = demoCommand(s, {
    kind: "review",
    id: id(),
    groupId,
    challengeId,
    target: "susy",
    decision: "confirm",
  });
  expect(groupPoints(s.groups[0], "susy")).toBe(100);
  expect(s.records).toHaveLength(1);
});
test("an unaccepted offer never expires; an accepted unfulfilled one loses only the chosen stake", () => {
  let s = demoState();
  s = expireChallenges(s, Date.now() + 172800000);
  expect(groupPoints(s.groups[0], "susy")).toBe(0);
  s = demoCommand(s, {
    kind: "accept",
    id: id(),
    groupId: s.groups[0].id,
    challengeId: "demo-mural",
  });
  s = expireChallenges(s, Date.now() + 172800000);
  expect(groupPoints(s.groups[0], "susy")).toBe(-25);
});
test("geographic projection roundtrips real CDMX positions and territory painting uses containment", () => {
  const p = { lat: 19.4326, lng: -99.1332 };
  const result = unproject(project(p));
  expect(result.lat).toBeCloseTo(p.lat, 8);
  expect(result.lng).toBeCloseTo(p.lng, 8);
  const ring = [
    { lat: 19, lng: -100 },
    { lat: 20, lng: -100 },
    { lat: 20, lng: -99 },
    { lat: 19, lng: -99 },
  ];
  expect(containsPoint(p, ring)).toBe(true);
  expect(containsPoint({ lat: 21, lng: -99.5 }, ring)).toBe(false);
});
