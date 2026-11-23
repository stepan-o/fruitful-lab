import { useEffect, useId, useRef } from "react";
import { motionKey, usePreference } from "@/lib/stepanoskin/preferences";
import { noise, Person } from "./Engraving";
import ForkTerrain from "./ForkTerrain";
import ForkPine from "./ForkPine";
import { DistantVillage, House, JourneyGate, TownHall } from "./ForkBuildings";
import { LEFT_ARCH, RIGHT_ARCH } from "./fork-geometry";
import { createForkWorld } from "./fork-world";
import styles from "./fork.module.css";

const round = (n: number) => Math.round(n * 100) / 100;

/** An original engraved diptych: a completed road and an inhabited returning circuit. */
export default function ForkPlate({ label, paused = false }: { label: string; paused?: boolean }) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  const [motion] = usePreference(motionKey);
  useEffect(() => {
    const plate = ref.current;
    const canvas = canvasRef.current;
    if (!plate || !canvas || typeof IntersectionObserver === "undefined") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let last = 0;
    let renderer: ReturnType<typeof createForkWorld> = null;
    function resize() {
      if (!renderer || !canvas || !plate) return;
      // Only the decorative layer is rasterized; text and terrain stay vector.
      canvas.width = Math.max(1, Math.round(Math.min(960, plate.getBoundingClientRect().width * 1.25)));
      canvas.height = Math.round(canvas.width * .59);
      renderer.draw(elapsed.current);
    }
    function draw(now: number) {
      frame = requestAnimationFrame(draw);
      if (last && now - last < 1000 / 30) return;
      elapsed.current += last ? Math.min((now - last) / 1000, .1) : 0;
      last = now;
      renderer?.draw(elapsed.current);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      const playing = visible && !document.hidden && motion && !paused && !preference.matches;
      plate!.dataset.playing = String(playing);
      if (visible && !document.hidden && !renderer) {
        renderer = createForkWorld(canvas!);
        if (renderer) {
          plate!.dataset.ready = "true";
          resize();
        }
      }
      if (playing && renderer) frame = requestAnimationFrame(draw);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0;
      sync();
    }, { threshold: 0.01 });
    observer.observe(plate);
    const size = new ResizeObserver(resize);
    size.observe(plate);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      size.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      plate.dataset.playing = "false";
    };
  }, [motion, paused]);
  const paint = (name: string) => `url(#${id}-${name})`;
  return (
    <div ref={ref} className={styles.plate} data-plate="fork">
    <svg viewBox="0 0 1000 590" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`${id}-sky`} x2="0" y2="1">
          <stop stopColor="#0a1015" />
          <stop offset=".6" stopColor="#38403a" />
          <stop offset="1" stopColor="#c59352" />
        </linearGradient>
        <linearGradient id={`${id}-stone`} x2=".8" y2="1">
          <stop stopColor="#627068" />
          <stop offset=".45" stopColor="#25302f" />
          <stop offset="1" stopColor="#0a151a" />
        </linearGradient>
        <linearGradient id={`${id}-brass`} x2="1" y2="1">
          <stop stopColor="#f3d295" />
          <stop offset=".3" stopColor="#917245" />
          <stop offset=".6" stopColor="#dcc08b" />
          <stop offset="1" stopColor="#645037" />
        </linearGradient>
        <linearGradient id={`${id}-road`} x2="0" y2="1">
          <stop stopColor="#fff0b3" />
          <stop offset=".55" stopColor="#ae8e5e" />
          <stop offset="1" stopColor="#293337" />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop stopColor="#ffe6a4" stopOpacity=".8" />
          <stop offset=".3" stopColor="#e5b776" stopOpacity=".22" />
          <stop offset="1" stopColor="#d5aa70" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-city`}>
          <stop stopColor="#7caf9d" stopOpacity=".5" />
          <stop offset="1" stopColor="#6c9e93" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-lamp`}>
          <stop stopColor="#ffecc0" />
          <stop offset=".12" stopColor="#efbf78" stopOpacity=".85" />
          <stop offset="1" stopColor="#c7783e" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-etch`} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 6L6 0" stroke="#ead5ac" strokeOpacity=".055" />
        </pattern>
        <clipPath id={`${id}-left`}>
          <path d={LEFT_ARCH} />
        </clipPath>
        <clipPath id={`${id}-right`}>
          <path d={RIGHT_ARCH} />
        </clipPath>
      </defs>
      <rect width="1000" height="590" fill="#0b1317" />
      <path d="M500 10V566" stroke={paint("brass")} opacity=".35" />
      <g clipPath={paint("left")}>
        <rect x="35" width="430" height="545" fill={paint("sky")} />
        <circle cx="253" cy="234" r="210" fill={paint("sun")} />
        <circle cx="254" cy="225" r="52" fill="#e3c28c" opacity=".8" />
        <circle cx="254" cy="225" r="64" fill="none" stroke="#e4c98f" opacity=".25" />
        <ForkTerrain />
        <JourneyGate />
        <path d="M247 309C261 343 208 349 211 373C214 400 315 403 320 438C324 470 263 500 244 539H335C343 497 386 468 359 435C328 398 245 397 242 374C239 354 274 341 264 309Z" fill={paint("road")} />
        <path d="M247 312C261 343 208 350 212 374C216 400 315 403 320 438C324 470 263 500 244 539" fill="none" stroke="#e9c88c" strokeWidth="2.5" opacity=".7" />
        <ForkTerrain foreground />
        <g transform="translate(278 429) scale(.61)">
          <Person x={0} y={0} tone="#ead3a0" />
          <path d="M-14 2Q-33 26 -23 69L4 58L9 7Z" fill="#435357" stroke="#a99a79" />
        </g>
        <g className={styles.fallback}>
          <path d="M138 145q10 -8 20 0q9 -8 19 -3M115 125q7 -6 14 0q7 -6 14 -2" fill="none" stroke="#f6e6bd" strokeWidth="2.5" />
        </g>
      </g>
      <g clipPath={paint("right")}>
        <rect x="539" width="430" height="545" fill="#122329" />
        <ellipse cx="755" cy="270" rx="252" ry="238" fill={paint("city")} />
        <g fill="none" stroke="#b1b792">
          <circle cx="752" cy="254" r="156" opacity=".18" />
          <circle cx="752" cy="254" r="171" opacity=".09" />
          {Array.from({length:48},(_,i)=><path key={i} d={`M752 83v${i%4?5:13}`} transform={`rotate(${i*7.5} 752 254)`} opacity=".28" />)}
        </g>
        <DistantVillage />
        <ellipse cx="752" cy="387" rx="169" ry="93" fill="#09181e" stroke="#70857b" strokeWidth="2" />
        <path d="M583 359V387C583 439 659 480 752 480S921 439 921 387V359" fill="#1a2b30" stroke="#7e8873" />
        {Array.from({length:23},(_,i)=>{
          const angle=(i/22)*Math.PI;
          const x=round(752+169*Math.cos(angle));
          const y=round(359+93*Math.sin(angle));
          return <path key={i} d={`M${x} ${y}v28`} stroke="#c9b17c" opacity=".28" />;
        })}
        <ellipse cx="752" cy="359" rx="169" ry="93" fill="#35453e" stroke={paint("brass")} strokeWidth="3" />
        <ellipse cx="752" cy="359" rx="142" ry="74" fill="#122a2c" stroke="#c0b17d" strokeWidth="2" />
        <ellipse cx="752" cy="359" rx="126" ry="61" fill="#304440" stroke="#779a85" />
        <path d="M614 359C614 308 805 263 879 338M889 359C883 410 690 453 624 385" fill="none" stroke="#dfbd7f" strokeWidth="3" />
        <path d="M864 329L880 338L881 321M638 394L623 385L621 402" fill="none" stroke="#f4d9a1" strokeWidth="3" />
        <TownHall />
        <House x={617} y={365} />
        <House x={884} y={365} />
        <House x={704} y={403} scale={.72} />
        <House x={808} y={403} scale={.72} />
        <ForkPine x={665} y={378} scale={.4} />
        <ForkPine x={842} y={388} scale={.36} />
        {[617,884].map(x=><g key={x}>
          <g className={styles.fallback}>
            <circle cx={x} cy="334" r="29" fill={paint("lamp")} opacity=".85" />
          </g>
        </g>)}
        {[629,896].map(x=><g key={x} fill="#344544" stroke="#a5a688" strokeWidth="1">
          <path d={`M${x-4} 305V282h8v23`} />
          <path d={`M${x-6} 284v-5h12v5Z`} />
          <path d={`M${x-3} 281h6`} stroke="#081b21" strokeWidth="2" />
          <path d={`M${x-4} 291h8m-8 7h8`} strokeOpacity=".4" />
        </g>)}
        <path d="M682 529L716 454H788L823 529Z" fill={paint("stone")} stroke="#948769" />
        {[469,487,508,531].map(y=><path key={y} d={`M${round(716-(y-454)*.44)} ${y}H${round(788+(y-454)*.47)}`} stroke="#cdb785" opacity=".5" />)}
        <Person x={748} y={418} s={.44} tone="#e5cc92" />
        <Person x={785} y={399} s={.34} tone="#a9cfb8" />
        <Person x={658} y={362} s={.31} tone="#c7bb94" />
        <path d="M751 226V193M736 204L752 186L768 204L752 214Z" fill="#31473e" stroke="#d9bd83" />
        <g className={styles.fallback}>
          <circle cx="752" cy="204" r="39" fill={paint("lamp")} opacity=".85" />
        </g>
      </g>
      {[248,752].map(x=><g key={x} fill="none" stroke={paint("brass")}>
        <path d={`M${x-206} 537V189Q${x-206} 75 ${x} 16Q${x+206} 75 ${x+206} 189V537Z`} strokeWidth="3" />
        <path d={`M${x-199} 529V189Q${x-199} 83 ${x} 24Q${x+199} 83 ${x+199} 189V529Z`} opacity=".6" />
        <path d={`M${x-188} 522V189Q${x-188} 95 ${x} 36Q${x+188} 95 ${x+188} 189V522`} opacity=".19" />
        <path d={`M${x-220} 220v281M${x+220} 220v281`} opacity=".22" />
        <path d={`M${x-13} 24L${x} 6L${x+13} 24L${x} 44Z`} fill="#172126" />
      </g>)}
      <rect width="1000" height="545" fill={paint("etch")} pointerEvents="none" />
      <g className={styles.fallback} fill="#edcc93">
        {Array.from({length:42},(_,i)=><circle key={i} cx={round(63+noise(i+26)*872)} cy={round(118+noise(i+68)*405)} r={round(.6+noise(i+102)*1.3)} opacity={round(.12+noise(i+4)*.43)} />)}
      </g>
      <g fill="#c8b68e" fontFamily="Georgia, serif" fontSize="17" letterSpacing="2" textAnchor="middle">
        <text x="248" y="566">A JOURNEY COMPLETED</text>
        <text x="752" y="566">A WORLD RENEWED</text>
      </g>
      <path d="M488 551L500 539L512 551L500 563Z" fill="#19272a" stroke="#ae9564" />
    </svg>
    <canvas ref={canvasRef} className={styles.world} aria-hidden="true" />
    </div>
  );
}
