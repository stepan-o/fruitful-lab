import { board, cabinet, compound, connectingLength, crankRadius, doors, meshes, output, sliderPose, wheels } from "@/lib/production-systems/open-cabinet";
import { boardOutline } from "@/lib/production-systems/operator-chess";

it("fits the gears and board within the open cabinet with clearance between unmeshed wheels",()=>{
  wheels.forEach((a,i)=>{
    expect(a.x-a.radius-1).toBeGreaterThan(145);expect(a.x+a.radius+1).toBeLessThan(447);
    expect(a.y-a.radius-1).toBeGreaterThan(154);expect(a.y+a.radius+1).toBeLessThan(310);
    wheels.slice(i+1).forEach((b,k)=>{
      if(a.layer!==b.layer)return;
      const distance=Math.hypot(a.x-b.x,a.y-b.y),j=i+k+1;
      if(meshes.some(([x,y])=>x===i&&y===j)) expect(distance).toBeCloseTo(a.radius+b.radius,10);
      else expect(distance).toBeGreaterThan(a.radius+b.radius+2);
    });
  });
  const rim=boardOutline(board,.3,.55);
  expect(rim[0].y).toBeGreaterThan(cabinet.top-cabinet.depth);
  expect(rim[3].y+4.5).toBeLessThan(132);
  expect(board.skew/board.depth).toBeCloseTo(-1/Math.sqrt(3),10);
});

it("keeps tooth phases and surface speeds consistent through the compound train",()=>{
  for(const [i,j] of meshes) {
    const a=wheels[i],b=wheels[j],angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
    expect(a.direction*a.teeth/a.period+b.direction*b.teeth/b.period).toBeCloseTo(0,10);
    for(const time of [0,.3,3,12,60]) {
      const pa=a.phase+a.direction*360*time/a.period,pb=b.phase+b.direction*360*time/b.period;
      const sum=(angle-pa)*a.teeth/360+(angle+180-pb)*b.teeth/360;
      expect(((sum%1)+1)%1).toBeCloseTo(.5,9);
    }
  }
  const [a,b]=compound.map(i=>wheels[i]);
  expect([a.x,a.y,a.period,a.direction]).toEqual([b.x,b.y,b.period,b.direction]);
  expect(a.layer).not.toBe(b.layer);
});

it("keeps the crank attached and the connecting rod rigid throughout the slider stroke",()=>{
  for(let i=0;i<=120;i++) {
    const {pin,slider}=sliderPose(i/120);
    expect(Math.hypot(pin.x-output.x,pin.y-output.y)).toBeCloseTo(crankRadius,10);
    expect(Math.hypot(slider.x-pin.x,slider.y-pin.y)).toBeCloseTo(connectingLength,10);
    expect(slider.y).toBe(243);
    expect(slider.x-4).toBeGreaterThan(409);expect(slider.x+4).toBeLessThan(447);
  }
  expect(sliderPose(1).slider.x).toBeCloseTo(sliderPose(0).slider.x,10);
});

it("projects full-width door leaves from fixed hinges with enough width to close the opening",()=>{
  expect(doors[0].width+doors[1].width).toBe(447-145);
  for(const door of doors) {
    const [hinge,free]=door.points;
    expect(Math.hypot(free.x-hinge.x,free.depth-hinge.depth)).toBeCloseTo(door.width,10);
    expect(hinge.x).toBe(door.hinge);expect(hinge.depth).toBe(0);
    expect(free.x+free.depth/Math.sqrt(3)).toBeCloseTo(door.hinge+door.a*door.width,10);
  }
});
