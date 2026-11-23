/** Floor coordinates in metres: [east, south, height]. One camera, same public world. */
export type OperationalCamera={id:string;label:string;eye:readonly [number,number,number];target:readonly [number,number,number];verticalFov:number;source:string};
export function operationalPose(view:OperationalCamera){
 const [x,y,h]=view.eye,[tx,ty,th]=view.target,dx=x-tx,dz=ty-y,dy=h-th,radius=Math.hypot(dx,dy,dz);
 if(![...view.eye,...view.target,view.verticalFov].every(Number.isFinite)||radius===0||view.verticalFov<=0||view.verticalFov>=Math.PI)throw Error('Invalid operational camera');
 return {alpha:Math.atan2(dz,dx),beta:Math.acos(dy/radius),radius,fov:view.verticalFov};
}
// Jointly selected source mounts; imported-mesh visibility still requires actual review.
export const OPERATIONAL_VIEWS:readonly OperationalCamera[]=[
  {
    "id": "L1-lobby",
    "label": "Lobby camera",
    "eye": [
      131,
      121,
      5.8
    ],
    "target": [
      122.8,
      115.8,
      1.1
    ],
    "verticalFov": 1.0,
    "source": "Director D3 / Level L2 joint selection 2026-10-24; interface f9a366c4; visibility unverified"
  },
  {
    "id": "D1-security",
    "label": "Security camera",
    "eye": [
      127.6,
      103.85,
      3.2
    ],
    "target": [
      123.7,
      108.9,
      0.9
    ],
    "verticalFov": 1.05,
    "source": "Director D3 / Level L2 joint selection 2026-10-24; interface f9a366c4; visibility unverified"
  },
  {
    "id": "D3-conveyor-north",
    "label": "Conveyor camera",
    "eye": [
      144,
      99.6,
      6.2
    ],
    "target": [
      144,
      106.8,
      1.2
    ],
    "verticalFov": 1.15,
    "source": "Director D3 / Level L2 joint selection 2026-10-24; interface f9a366c4; visibility unverified"
  }
];
