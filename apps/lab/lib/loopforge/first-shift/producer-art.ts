import { imageAsset, parseManifest } from "@/lib/assets/types";
import manifest from "@/lib/assets/generated/loopforge-producer-runtime.json";
import type { ProducerSkinId } from "./themes";

const pack = parseManifest(manifest, "loopforge-producer-runtime");
export const producerPlate = (id: ProducerSkinId) => imageAsset(pack, id);
export const producerMobilePlate = (id: ProducerSkinId) => imageAsset(pack, `${id}-mobile`);

/** Portrait sources are split into registered regions, allowing the glass bay to grow. */
export const PRODUCER_MOBILE: Record<ProducerSkinId, {glass:PlateRect; receiver:PlateRect;selector:PlateRect;lever:PlateRect;light:readonly[number,number];panes:PlateRect[]}> = {
  "foundry-desk":{glass:[1,8.5,98,60.5],receiver:[2,72,33,23],selector:[38,72,25,23],lever:[66,72,32,23],light:[92,4.5],panes:[[1.798,2.73,46.51,30.25],[51.409,2.73,46.228,30.25],[1.798,36.747,46.51,29.907],[51.409,36.747,46.228,29.907],[1.798,70.193,46.51,26.825],[51.409,70.193,46.228,26.825]]},
  "dispatch-office":{glass:[3,9.5,94,56.5],receiver:[2,68,32,24],selector:[36,68,29,24],lever:[67,68,30,24],light:[88,5],panes:[[5.233,4.576,42.906,27.38],[52.155,4.699,42.808,27.258],[5.233,36.357,42.906,27.502],[52.155,36.357,42.808,27.502],[5.233,68.503,42.906,26.891],[52.155,68.503,42.808,26.891]]},
  "obedience-organ":{glass:[4,11,92,53],receiver:[3,66,26,30],selector:[32,66,36,30],lever:[71,66,26,30],light:[87,6],panes:[[5.842,6.147,42.99,29.235],[50.955,6.392,42.884,28.99],[5.736,38.453,43.096,28.253],[50.955,38.453,43.096,28.253],[5.842,70.268,42.99,25.796],[50.955,70.268,42.99,25.796]]},
  "broadcast-control":{glass:[7,10,85,48],receiver:[3,60,29,32],selector:[34,60,33,32],lever:[70,60,26,32],light:[85,5.5],panes:[[3.483,3.716,46.415,30.518],[51.507,3.852,46.53,30.382],[3.254,36.133,46.645,28.483],[51.507,36.133,46.53,28.483],[3.598,67.193,46.301,27.669],[51.507,67.193,46.53,27.669]]},
};

/** Percent coordinates belong to the authored plate, never the world model. */
export type PlateRect = readonly [number, number, number, number];
const panes = (...rectangles: PlateRect[]): PlateRect[] => rectangles.map(([x,y,w,h]) => [x/16.72,y/9.41,w/16.72,h/9.41]);
export const PRODUCER_GEOMETRY: Record<ProducerSkinId, {
  glass: PlateRect; receiver: PlateRect; selector: PlateRect; lever: PlateRect;
  facts: PlateRect; light: readonly [number, number]; lens: number; panes: PlateRect[];
}> = {
  "foundry-desk": {
    glass:[3.7,7,92.4,47], receiver:[2,63,30,29], selector:[35,64,32,30],
    lever:[70,62,27,32], facts:[6,57,84,5], light:[93.5,2.8], lens:1.7,
    panes:panes([47,65,508,226],[571,65,530,226],[1118,66,510,226],[38,307,515,198],[568,308,536,197],[1122,308,514,197]),
  },
  "broadcast-control": {
    glass:[2.7,7,94.4,45.8], receiver:[2,63,35,30], selector:[45,66,32,23],
    lever:[77.5,66,8.5,23], facts:[44,91,36,6], light:[6.2,58.3], lens:1.25,
    panes:panes([60,66,514,230],[584,66,508,230],[1100,69,511,227],[56,305,516,194],[581,305,513,194],[1104,305,508,191]),
  },
  "dispatch-office": {
    glass:[5,7,58.5,46.6], receiver:[62,48,36,46], selector:[3,57,32,22],
    lever:[38,60,18,21], facts:[3,88,52,7], light:[88,38], lens:2,
    panes:panes([99,70,736,423],[868,60,190,78],[868,155,190,72],[868,244,191,70],[868,333,192,69],[868,421,192,68]),
  },
  "obedience-organ": {
    glass:[6.5,14,73.2,46.8], receiver:[85.5,18,11.5,51], selector:[15,70,19,26],
    lever:[40,71,30,22], facts:[77,80,12,6], light:[90,6.3], lens:1.6,
    panes:panes([106,126,453,216],[103,362,454,208],[579,129,361,214],[580,363,360,213],[960,136,397,208],[960,362,397,210]),
  },
};
