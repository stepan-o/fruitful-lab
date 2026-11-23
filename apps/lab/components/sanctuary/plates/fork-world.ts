/** Bounded atmospheric layer over the static engraving. Sprites and clip paths
 * are cached; a frame moves 28 smoke wisps, 26 motes, 6 clouds and 3 birds. */
import { DISTANT_RIDGE, GATE_ROOF, HALL_ROOF, LEFT_ARCH, RIGHT_ARCH, VILLAGE_RIDGE } from "./fork-geometry";

const fract = (n: number) => n - Math.floor(n);
const random = (n: number) => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);
const tau = Math.PI * 2;

function sprite(kind: "smoke" | "cloud", color: string) {
  const surface = document.createElement("canvas");
  surface.width = kind === "smoke" ? 96 : 384;
  surface.height = kind === "smoke" ? 96 : 112;
  const ctx = surface.getContext("2d")!;
  if (kind === "cloud") {
    // Printed cloud banks: explicit silhouettes and inner contour cuts. Rasterized
    // once, so their motion still costs just one small sprite draw per bank.
    ctx.fillStyle = `rgba(${color},.66)`;
    ctx.strokeStyle = `rgba(${color},.9)`;
    ctx.lineWidth = 1.4;
    const bank = new Path2D("M22 78C9 75 12 63 31 62H62C57 47 72 34 92 38C106 18 137 19 153 37C173 25 198 32 204 47C225 34 252 40 260 53C282 46 306 50 313 63H345C365 63 375 77 356 82H30Z");
    ctx.fill(bank);
    ctx.stroke(bank);
    ctx.fillStyle = "rgba(22,45,47,.26)";
    ctx.fill(new Path2D("M31 70H98C103 58 123 53 140 63H185C195 52 216 54 226 64H297Q320 64 327 76H31Z"));
    ctx.strokeStyle = `rgba(${color},.8)`;
    ctx.lineWidth = 1.2;
    ctx.stroke(new Path2D("M46 72H112M78 60Q88 44 105 48M113 38Q130 32 144 43M145 70H204M214 59Q234 46 249 59M249 73H320"));
    return surface;
  }
  const count = 5;
  for (let i = 0; i < count; i++) {
    const x = 37 + random(i) * 23;
    const y = 37 + random(i + 9) * 23;
    const radius = 24 + random(i + 8) * 10;
    ctx.save();
    ctx.translate(x, y);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    glow.addColorStop(0, `rgba(${color},.24)`);
    glow.addColorStop(.45, `rgba(${color},.16)`);
    glow.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }
  return surface;
}

export function createForkWorld(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const smoke = sprite("smoke", "194,202,187");
  const warmCloud = sprite("cloud", "227,214,181");
  const coolCloud = sprite("cloud", "161,190,181");
  const leftArch = new Path2D(LEFT_ARCH);
  const rightArch = new Path2D(RIGHT_ARCH);
  const bothArches = new Path2D();
  bothArches.addPath(leftArch);
  bothArches.addPath(rightArch);
  // Sky masks stop clouds at the existing mountain / distant-city silhouettes.
  const leftSky = new Path2D(`${DISTANT_RIDGE}V0H20Z`);
  const rightSky = new Path2D(`${VILLAGE_RIDGE}V0H539Z`);
  const leftOcclusion = new Path2D(`M0 0H1000V590H0Z ${GATE_ROOF} M187 320V232H321V320Z`);
  const rightOcclusion = new Path2D(`M0 0H1000V590H0Z ${HALL_ROOF} M688 358V295H817V358Z M736 204L752 186L768 204L752 214Z`);
  const motes = Array.from({ length: 26 }, (_, i) => ({
    x: (i % 2 ? 561 : 57) + random(i + 31) * 380,
    y: 120 + random(i + 67) * 380,
    radius: .9 + random(i + 18) * 1.3,
    phase: random(i + 55) * tau,
    speed: .35 + random(i + 7) * .35,
  }));
  const cloudLayers = [
    { x: 90, y: 106, w: 246, h: 70, speed: 4.4, alpha: .48 },
    { x: 320, y: 150, w: 300, h: 84, speed: 6.1, alpha: .38 },
    { x: 225, y: 213, w: 280, h: 48, speed: 3.2, alpha: .36 },
  ];
  // Both outlets sit on small brick chimneys attached to the side-house roofs.
  const emitters = [{ x: 629, y: 281, phase: 0 }, { x: 896, y: 281, phase: .37 }];
  const lamp = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  lamp.addColorStop(0, "rgba(255,236,181,.9)");
  lamp.addColorStop(.17, "rgba(242,184,102,.6)");
  lamp.addColorStop(1, "rgba(214,135,61,0)");

  function glow(x: number, y: number, radius: number, alpha: number) {
    ctx!.save();
    ctx!.translate(x, y);
    ctx!.scale(radius, radius);
    ctx!.globalAlpha = alpha;
    ctx!.fillStyle = lamp;
    ctx!.fillRect(-1, -1, 2, 2);
    ctx!.restore();
  }

  function clouds(time: number, right: boolean) {
    ctx!.save();
    ctx!.clip(right ? rightArch : leftArch);
    ctx!.clip(right ? rightSky : leftSky);
    ctx!.clip(right ? rightOcclusion : leftOcclusion, "evenodd");
    for (const layer of cloudLayers) {
      const x = ((layer.x + time * layer.speed + (right ? 170 : 0)) % 720) - 160 + (right ? 504 : 0);
      ctx!.globalAlpha = layer.alpha;
      ctx!.drawImage(right ? coolCloud : warmCloud, x - layer.w / 2, layer.y - layer.h / 2, layer.w, layer.h);
    }
    ctx!.restore();
  }

  function bird(x: number, y: number, size: number, time: number, phase: number) {
    // Three brief wingbeats then a glide, with each bird offset in the flock.
    const cycle = (time + phase) % 6.4;
    const envelope = cycle < 2.1 ? Math.sin(cycle / 2.1 * Math.PI) : 0;
    const lift = -1.4 + envelope * Math.sin(cycle / .7 * tau) * 5;
    ctx!.save();
    ctx!.translate(x, y);
    ctx!.scale(size, size);
    ctx!.fillStyle = "#f6e6bd";
    ctx!.strokeStyle = "#122127";
    ctx!.lineWidth = .9;
    ctx!.beginPath();
    ctx!.moveTo(-2, 0);
    ctx!.quadraticCurveTo(-7, lift - 4, -14, lift - 2);
    ctx!.quadraticCurveTo(-7, lift + 2, 0, 2);
    ctx!.quadraticCurveTo(6, lift + 1, 12, lift - 3);
    ctx!.quadraticCurveTo(6, lift - 5, 1, -1);
    ctx!.closePath();
    ctx!.fill();
    ctx!.stroke();
    ctx!.beginPath();
    ctx!.ellipse(0, .5, 3.4, 1.4, -.15, 0, tau);
    ctx!.fill();
    ctx!.restore();
  }

  return {
    draw(time: number) {
      ctx.setTransform(canvas.width / 1000, 0, 0, canvas.height / 590, 0, 0);
      ctx.clearRect(0, 0, 1000, 590);
      clouds(time, false);
      clouds(time, true);
      ctx.save();
      ctx.clip(bothArches);
      // Age increases continuously from a fixed source. The lower plume stays
      // narrow; buoyancy, wind and eddies spread it before it loses opacity.
      for (const emitter of emitters) {
        for (let i = 0; i < 14; i++) {
          const age = fract(time / 5.8 + i / 14 + emitter.phase);
          const y = emitter.y - age * 102;
          const wind = 30 * age * age;
          const eddy = Math.sin(time * 1.25 - age * 8 + emitter.phase * tau) * age * 6;
          const radius = 3 + age * 22;
          ctx.globalAlpha = Math.min(1, age * 14) * Math.pow(1 - age, .8) * .88;
          ctx.drawImage(smoke, emitter.x + wind + eddy - radius, y - radius * 1.2, radius * 2, radius * 2.4);
        }
        // A continuous thin source bridges the first emitted wisps to the lip.
        ctx.globalAlpha = .33;
        ctx.drawImage(smoke, emitter.x - 4, emitter.y - 10, 8, 12);
      }
      ctx.globalAlpha = 1;
      glow(617, 334, 29, .58 + .23 * Math.sin(time * 2.4) + .08 * Math.sin(time * 7.7));
      glow(884, 334, 29, .6 + .22 * Math.sin(time * 2.1 + 2) + .07 * Math.sin(time * 6.1));
      glow(752, 204, 38 + 5 * Math.sin(time * 1.1), .63 + .3 * Math.sin(time * 1.1));
      for (const mote of motes) {
        const x = mote.x + Math.sin(time * mote.speed + mote.phase) * 13 + Math.sin(time * .19 + mote.phase) * 9;
        const y = mote.y + Math.cos(time * mote.speed * .7 + mote.phase) * 9;
        const shimmer = .5 + .26 * Math.sin(time * 2.2 + mote.phase) + .16 * Math.sin(time * 4.7 + mote.phase * 2);
        ctx.globalAlpha = shimmer;
        ctx.fillStyle = "#ffe3a3";
        ctx.beginPath();
        ctx.arc(x, y, mote.radius, 0, tau);
        ctx.fill();
        if (mote.radius > 1.8) glow(x, y, mote.radius * 3.5, shimmer * .35);
      }
      ctx.restore();
      ctx.save();
      ctx.clip(leftArch);
      // Forward flight leaves and re-enters behind the frame, never reverses.
      const flight = ((time * 18 + 250) % 660) - 90;
      const height = 147 + Math.sin(time * .28) * 8;
      bird(flight, height, .9, time, 0);
      bird(flight - 34, height - 19, .63, time, .36);
      bird(flight - 65, height + 5, .7, time, .72);
      ctx.restore();
    },
  };
}
