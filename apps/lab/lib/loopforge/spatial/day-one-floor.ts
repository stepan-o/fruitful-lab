// Day 1 uses the Conveyor design plate's metre grid. North is decreasing y.
// The old episode opens east; remap its working sockets by function, not by rotating the whole hall.
import { PORTALS, portalRect, type Rect } from './floor';

import { FORGE_HALL } from './forge-hall';

type Fixture = { id: string; name: string; kind: 'desk' | 'rail' | 'machine' | 'rack' | 'drain'; rect: Rect };
function fixture(id: string, name: string, kind: Fixture['kind'], x: number, y: number, w: number, h: number): Fixture {
  return { id, name, kind, rect: { x, y, w, h } };
}
const doorway = portalRect(PORTALS.find(portal => portal.id === 'security-conveyor')!);
const stations = ['Intake', 'Wash', 'Main belt', 'Forge'];
const fixtures: Fixture[] = [
  fixture('register', 'Register', 'desk', 122.8, 125, 1.6, 1),
  fixture('checks', 'ID desk', 'desk', 130.8, 124.9, 1.6, 1),
  fixture('grate', 'Drain grate', 'drain', 123.7, 123.4, 1, .6),
  fixture('west-rail', 'Queue rail', 'rail', 123.25, 116.8, .12, 4.4),
  fixture('east-rail', 'Queue rail', 'rail', 130.25, 116.8, .12, 4.4),
  ...stations.map((name, index) => fixture(['intake', 'wash', 'belt', 'forge'][index], name, 'machine', 118 + index * 4, 139, 4, 6)),
  fixture('output', 'Output', 'rack', 134, 139, 7, 6),
];
export const DAY_ONE_FLOOR = {
  doorway, fixtures, forgeHall: FORGE_HALL,
  // Staff return through the two existing Dispatch portals to the south Lobby door.
  exit: { x: 70, y: 128, w: 5 },
  egress: [[128, 128], [128, 112], [115, 104], [112, 104], [80, 104], [72.5, 107], [72.5, 131]],
  stations: stations.map((name, i) => ({ name, x: 119.7 + 4 * i, y: 138.4, sceneMetres: [136.5 + 4 * i, 105.8] })),
  // Actual scene maps by anchor pair (the runtime's point unit is 1 mm).
  anchors: [
    { name: 'Supervisor at doorway', scene: [131.1, 104.6], floor: [129.6, 127.9] },
    { name: 'Register clerk', scene: [121.5, 107.2], floor: [123.7, 124.3] },
    { name: 'Second checking desk', scene: [126.5, 107.2], floor: [131.6, 124.2] },
    { name: 'Output witness', scene: [151.8, 106.8], floor: [135.4, 138.3] },
  ],
};
