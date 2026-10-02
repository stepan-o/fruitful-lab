import { useId, type ReactNode } from "react";

export const brass = "#bd965b",
  ember = "#e47442",
  teal = "#74b5ab",
  ink = "#0d1619",
  bone = "#e9d8b6";
// Integer mixing is identical in server and browser engines (unlike sin-based noise).
export const noise = (n: number) => {
  let x = (n | 0) ^ 0x9e3779b9;
  x = Math.imul(x ^ (x >>> 16), 0x21f0aaad);
  x = Math.imul(x ^ (x >>> 15), 0x735a2d97);
  return ((x ^ (x >>> 15)) >>> 0) / 4294967296;
};
export function Rivets({
  x = 0,
  y = 0,
  w = 100,
  h = 100,
}: {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}) {
  return (
    <g fill="#141b1c" stroke={brass} strokeWidth="1.4">
      {[
        [x + 9, y + 9],
        [x + w - 9, y + 9],
        [x + 9, y + h - 9],
        [x + w - 9, y + h - 9],
      ].map(([a, b], i) => (
        <g key={i}>
          <circle cx={a} cy={b} r="3.5" />
          <path d={`M${a - 2} ${b + 1}l4 -2`} />
        </g>
      ))}
    </g>
  );
}
export function Plate({
  x,
  y,
  w,
  h,
  children,
  tone = brass,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: ReactNode;
  tone?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <g>
      <defs>
        <linearGradient id={id} x2=".7" y2="1">
          <stop stopColor="#3d4b49" />
          <stop offset=".18" stopColor="#233036" />
          <stop offset=".7" stopColor="#101b21" />
          <stop offset="1" stopColor="#2c3634" />
        </linearGradient>
      </defs>
      <path
        d={`M${x + 12} ${y + 8}H${x + w - 12}l12 12V${y + h - 4}l-12 12H${x + 12}l-12 -12V${y + 20}Z`}
        fill="#02080b"
        opacity=".8"
      />
      <path
        d={`M${x + 12} ${y}H${x + w - 12}l12 12V${y + h - 12}l-12 12H${x + 12}l-12 -12V${y + 12}Z`}
        fill={`url(#${id})`}
        stroke={tone}
        strokeWidth="2"
      />
      <path
        d={`M${x + 14} ${y + 4}H${x + w - 14}M${x + 4} ${y + 15}V${y + h - 16}`}
        stroke="#e9dfb1"
        opacity=".28"
      />
      <path
        d={`M${x + 15} ${y + h - 4}H${x + w - 15}M${x + w - 4} ${y + 16}V${y + h - 16}`}
        stroke="#02080a"
        strokeWidth="3"
      />
      <rect
        x={x + 7}
        y={y + 7}
        width={w - 14}
        height={h - 14}
        fill="none"
        stroke={tone}
        opacity=".18"
      />
      <path
        d={`M${x + 16} ${y + 19}l${w * 0.27} -4M${x + w - 18} ${y + h - 19}l${-w * 0.2} 3`}
        stroke={tone}
        opacity=".15"
      />
      <Rivets x={x} y={y} w={w} h={h} />
      {children}
    </g>
  );
}
export function Gear({
  x,
  y,
  r = 60,
  tone = brass,
}: {
  x: number;
  y: number;
  r?: number;
  tone?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={tone}>
      <circle cy="5" r={r + 3} stroke="#02090c" strokeWidth="12" opacity=".8" />
      <circle r={r} strokeWidth="9" opacity=".65" />
      <circle r={r + 5} stroke="#dbc28d" strokeWidth="1" opacity=".4" />
      <circle r={r - 12} strokeWidth="2" />
      <circle r={r * 0.25} strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 30})`}>
          <path d={`M-7 ${-r - 8}h14v15h-14Z`} fill="#263133" strokeWidth="2" />
          <path d={`M0 ${-r + 15}V${-r * 0.3}`} opacity=".35" />
        </g>
      ))}
    </g>
  );
}
export function Halo({
  x,
  y,
  r = 90,
  tone = brass,
}: {
  x: number;
  y: number;
  r?: number;
  tone?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={tone}>
      <circle r={r} opacity=".22" />
      <circle r={r - 7} opacity=".3" />
      {Array.from({ length: 36 }, (_, i) => (
        <path
          key={i}
          d={`M0 ${-r}v${i % 3 ? 5 : 12}`}
          transform={`rotate(${i * 10})`}
          opacity=".55"
        />
      ))}
      <path
        d={`M${-r - 15} 0h30M${r - 15} 0h30M0 ${-r - 15}v30M0 ${r - 15}v30`}
        opacity=".3"
      />
    </g>
  );
}
export function Person({
  x,
  y,
  s = 1,
  tone = brass,
  pose = "stand",
}: {
  x: number;
  y: number;
  s?: number;
  tone?: string;
  pose?: "stand" | "kneel";
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cy="76" rx="33" ry="9" fill="#03090b" opacity=".8" />
      {pose === "kneel" ? (
        <>
          <path
            d="M-15 28L5 14L22 36L13 53L37 68L8 75L-25 65Z"
            fill="#253339"
            stroke={tone}
            strokeWidth="2"
          />
          <path
            d="M14 34l21 -15l-5 -10M20 36l17 -14"
            stroke={bone}
            strokeWidth="3"
          />
          <circle cx="8" cy="9" r="12" fill="#aeb6a8" />
        </>
      ) : (
        <>
          <path
            d="M-14 2L-28 64L-10 58L-12 76H-2L4 56L11 76H21L15 56L30 62L15 2Z"
            fill="#26363b"
            stroke={tone}
            strokeWidth="1.5"
          />
          <path
            d="M-10 1L0 26L12 0M0 28V58"
            fill="none"
            stroke={tone}
            opacity=".55"
          />
          <path
            d="M-18 20L-32 43M19 20L34 45"
            stroke="#384447"
            strokeWidth="8"
          />
          <circle
            cy="-11"
            r="13"
            fill="#131e21"
            stroke={tone}
            strokeWidth="2"
          />
          <path d="M-9 -15L0 -22L9 -15M-9 -5H9" stroke={tone} fill="none" />
          <path
            d="M-25 32l-13 -24M-33 19l-12 5"
            stroke={bone}
            strokeWidth="2"
          />
        </>
      )}
    </g>
  );
}
export function Relic({
  x,
  y,
  s = 1,
  tone = brass,
  type = "sword",
}: {
  x: number;
  y: number;
  s?: number;
  tone?: string;
  type?:
    | "sword"
    | "helm"
    | "key"
    | "crystal"
    | "book"
    | "eye"
    | "coin"
    | "flame";
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      stroke={tone}
      strokeWidth="2"
      fill="#293436"
      strokeLinejoin="round"
    >
      {type === "sword" ? (
        <>
          <path d="M0 -70L10 -49L6 17H-6L-10 -49Z" fill="#b4beb4" />
          <path d="M0 -66V18" stroke="#f2d7a0" />
          <path
            d="M-25 19L-10 11L0 16L10 11L25 19L18 25L0 22L-18 25Z"
            fill={tone}
          />
          <path d="M-5 23V50L0 58L5 50V23" />
          <path d="M-4 29l8 4m-8 3l8 4m-8 3l8 4" stroke={bone} opacity=".5" />
          <circle cy="53" r="5" fill={ember} />
        </>
      ) : type === "helm" ? (
        <>
          <path d="M-32 38V-13L-20 -40L0 -56L20 -40L32 -13V38L12 24L0 40L-12 24Z" />
          <path
            d="M0 -53L-20 -38L-30 -12L-6 5L0 25Z"
            fill="#657267"
            opacity=".4"
            stroke="none"
          />
          <path
            d="M0 -53L20 -38L30 -12L6 5L0 25Z"
            fill="#080f12"
            opacity=".6"
            stroke="none"
          />
          <path d="M-27 -2L-6 5M27 -2L6 5" stroke={ember} strokeWidth="4" />
          <path
            d="M0 -52V25M-30 -15L-50 -41L-38 8M30 -15L50 -41L38 8"
            fill="none"
          />
        </>
      ) : type === "key" ? (
        <>
          <circle cy="-30" r="25" />
          <circle cy="-30" r="13" />
          <path d="M-5 -5V58H14V42H5V27H18V14H5V-5" fill={tone} />
        </>
      ) : type === "crystal" ? (
        <>
          <path d="M0 -65L29 -20L17 37L0 64L-25 18L-29 -20Z" fill={tone} />
          <path d="M0 -65L-9 -12L0 64L10 -8Z" fill={bone} opacity=".4" />
          <path
            d="M-29 -20L-9 -12L10 -8L29 -20M-9 -12L-25 18M10 -8L17 37"
            fill="none"
            stroke={ink}
          />
        </>
      ) : type === "book" ? (
        <>
          <path d="M-42 -49L0 -35L42 -49V45L0 57L-42 45Z" />
          <path
            d="M0 -35V57M-31 -31L-11 -24M-31 -18L-11 -11M-31 -5L-11 2M12 -23L32 -30M12 -10L32 -17M12 3L32 -4"
            fill="none"
          />
          <circle cy="20" r="7" fill={ember} />
        </>
      ) : type === "eye" ? (
        <>
          <path d="M-58 0Q0 -60 58 0Q0 60 -58 0Z" />
          <circle r="20" fill={teal} />
          <path d="M0 -14L6 0L0 14L-6 0Z" fill={ink} />
        </>
      ) : type === "coin" ? (
        <>
          <circle r="36" fill="#6b502d" />
          <circle r="28" />
          <path d="M0 -19L14 0L0 19L-14 0Z" fill={tone} />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M0 -32v4" transform={`rotate(${i * 30})`} />
          ))}
        </>
      ) : (
        <>
          <path
            d="M0 -58C14 -27 37 -20 24 5C59 -5 28 64 0 64C-46 62 -42 10 -16 -16C-20 17 12 11 0 -58Z"
            fill={ember}
          />
          <path
            d="M1 -12C28 23 16 52 0 57C-20 50 -25 25 -6 13C-9 39 13 26 1 -12Z"
            fill="#f1bc69"
            stroke="none"
          />
        </>
      )}
    </g>
  );
}
export function Label({
  x,
  y,
  children,
  tone = bone,
  size = 17,
}: {
  x: number;
  y: number;
  children: ReactNode;
  tone?: string;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={tone}
      fontSize={size}
      fontFamily="Georgia,serif"
      textAnchor="middle"
    >
      {children}
    </text>
  );
}
export function Pipe({ d, tone = brass }: { d: string; tone?: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="#03080a" strokeWidth="20" />
      <path d={d} stroke="#354043" strokeWidth="13" />
      <path d={d} stroke={tone} strokeWidth="2" opacity=".5" />
    </g>
  );
}
export function Platform({
  x,
  y,
  w = 300,
}: {
  x: number;
  y: number;
  w?: number;
}) {
  return (
    <g stroke={brass} strokeOpacity=".4">
      <path
        d={`M${x - w / 2} ${y}L${x} ${y - 55}L${x + w / 2} ${y}V${y + 28}L${x} ${y + 83}L${x - w / 2} ${y + 28}Z`}
        fill="#1c292d"
      />
      <path
        d={`M${x - w / 2} ${y}L${x} ${y + 55}L${x + w / 2} ${y}M${x} ${y + 55}v28`}
        fill="none"
      />
      {[0.25, 0.5, 0.75].map((t, i) => (
        <path
          key={i}
          d={`M${x - w / 2 + (w * t) / 2} ${y - 55 * t}l${w / 2} 55`}
          opacity=".3"
        />
      ))}
    </g>
  );
}
