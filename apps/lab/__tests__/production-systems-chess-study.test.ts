import {board,cast,flameAt,lamp,moveAt,pieces,placement,poses,project,shadowMatrix,silhouette,square,surface} from '@/lib/production-systems/chess-study';

it('puts every piece on a square centre and makes the knight move by two files and one rank',()=>{
  for(const p of pieces){const q=placement(p);expect(q).toEqual(square(p.file,p.rank));expect(q.height).toBe(board.height);}
  const knight=pieces.find(p=>p.kind==='knight')!;
  expect(placement(knight,.5)).toEqual(square(4,3));
  expect(moveAt(1)).toEqual(moveAt(0));
  expect(placement(knight,.18).height).toBeGreaterThan(board.height);
  expect(placement(knight,.5).height).toBe(board.height);
  expect(pieces.filter(p=>p.file===4&&p.rank===3)).toHaveLength(0);
});
it('projects every shadow through its source and caster onto its declared receiver',()=>{
  for(const piece of pieces)for(const t of poses)for(const receiver of [0,board.height]){
    const anchor=placement(piece,t);
    for(const loop of silhouette(piece.kind))for(const v of loop){
      const p={x:anchor.x+v.x*piece.scale,depth:anchor.depth,height:anchor.height-Math.min(0,v.y)*piece.scale};
      const hit=cast(p,receiver),ratio=(hit.height-lamp.height)/(p.height-lamp.height);
      expect(ratio).toBeGreaterThanOrEqual(1);
      expect(hit.height).toBe(receiver);
      expect(hit.x-lamp.x).toBeCloseTo((p.x-lamp.x)*ratio,8);
      expect(hit.depth-lamp.depth).toBeCloseTo((p.depth-lamp.depth)*ratio,8);
    }
  }
});
it('moves the projected silhouettes opposite the flame while preserving contact',()=>{
  for(const piece of pieces)for(const t of poses)for(const receiver of [0,board.height]){
    const p=placement(piece,t),dx=flameAt(t).x;
    for(const rise of [0,20,50]){
      const q={...p,height:p.height+rise},a=project(cast(q,receiver)),b=project(cast(q,receiver,{...lamp,x:lamp.x+dx}));
      const [,,k,,shift]=shadowMatrix(p.depth,receiver,dx);
      expect(a.x+k*a.y+shift).toBeCloseTo(b.x,0); // Rounded CSS matrices: <0.5 scene unit.
      expect(a.y).toBeCloseTo(b.y,9);
      if(receiver===board.height&&rise===0&&p.height===board.height)expect(a).toEqual(project(p));
    }
  }
});
it('keeps the board and lamp in one coherent volume with nonzero feet and case thickness',()=>{
  expect(lamp.depth).toBeGreaterThan(board.length+board.rim);
  expect(board.height-board.thickness).toBeGreaterThan(0);
  expect(surface().map(project)[0].y).toBeLessThan(surface().map(project)[3].y);
  const corner=surface()[0];expect(cast(corner,board.height)).toEqual(corner);
});
