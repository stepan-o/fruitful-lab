import { memo, useId } from "react";
import {
  brass,
  ember,
  teal,
  bone,
  noise,
  Plate,
  Gear,
  Halo,
  Person,
  Relic,
  Label,
  Pipe,
  Platform,
} from "./Engraving";

function Arch({
  x,
  y,
  w = 180,
  h = 310,
  lit = false,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  lit?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M${-w / 2 - 18} ${h}V80L0 -22L${w / 2 + 18} 80V${h}Z`}
        fill="#263032"
        stroke="#75624b"
        strokeWidth="3"
      />
      <path
        d={`M${-w / 2} ${h}V87L0 7L${w / 2} 87V${h}Z`}
        fill={lit ? "#263e3c" : "#060d10"}
        stroke={lit ? teal : brass}
        strokeWidth="2"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M${-w / 2 - 18} ${110 + i * 42}h18M${w / 2} ${110 + i * 42}h18`}
          stroke="#060c0f"
          strokeWidth="6"
        />
      ))}
      <path
        d={`M${-w / 2 - 16} ${h}V81L0 -19`}
        stroke="#e4c995"
        strokeWidth="2"
        opacity=".25"
        fill="none"
      />
      <path
        d={`M${w / 2 + 16} ${h}V81L0 -19`}
        stroke="#02080c"
        strokeWidth="4"
        opacity=".7"
        fill="none"
      />
      <path
        d={`M${-w / 2 + 10} ${h}V93L0 25L${w / 2 - 10} 93V${h}`}
        fill="none"
        stroke={brass}
        opacity=".25"
      />
    </g>
  );
}
function Armor({
  x,
  y,
  tone = brass,
  variant = 0,
}: {
  x: number;
  y: number;
  tone?: string;
  variant?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Halo x={0} y={-40} r={89} tone={tone} />
      <path
        d="M-22 -5L-55 11L-67 48L-47 58L-27 35L-21 93L-35 171L-9 177L0 110L9 177L35 171L21 93L27 35L47 58L67 48L55 11L22 -5Z"
        fill="#29373a"
        stroke={tone}
        strokeWidth="3"
      />
      <path
        d="M-21 1L0 48L-21 92L-27 35L-47 58L-67 48L-55 11Z"
        fill="#a7b39a"
        opacity=".17"
        stroke="none"
      />
      <path
        d="M21 1L0 48L21 92L27 35L47 58L67 48L55 11Z"
        fill="#02090c"
        opacity=".4"
        stroke="none"
      />
      <path
        d="M-22 3L0 48L22 3M-23 43L0 60L23 43M-20 71H20M-17 91H17M-21 122L-8 125M21 122L8 125"
        fill="none"
        stroke={tone}
      />
      <Relic type="helm" x={0} y={-39} s={0.7} tone={tone} />
      {variant === 1 ? (
        <path
          d="M-52 15L-90 -8L-62 40M52 15L90 -8L62 40M-22 88L0 110L22 88"
          fill="#383d3a"
          stroke={tone}
          strokeWidth="3"
        />
      ) : variant === 2 ? (
        <path
          d="M-47 10L-74 154L-27 122M47 10L74 154L27 122"
          fill="#3b2725"
          stroke={tone}
        />
      ) : (
        <path d="M-15 14L0 0L15 14L0 39Z" fill={tone} />
      )}
    </g>
  );
}
function Floor({
  x,
  y,
  w = 340,
  variant = 0,
}: {
  x: number;
  y: number;
  w?: number;
  variant?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Platform x={0} y={0} w={w} />
      {Array.from({ length: 7 }, (_, i) => (
        <path
          key={i}
          d={`M${-w / 2 + (i * w) / 7} ${i * 7}l${w / 2} -55`}
          fill="none"
          stroke={brass}
          opacity=".12"
        />
      ))}
      {(variant
        ? [
            [-90, -7],
            [20, -35],
            [90, 10],
          ]
        : [
            [-90, 0],
            [85, 0],
          ]
      ).map(([a, b], i) => (
        <g key={i}>
          <path
            d={`M${a - 16} ${b}v-50l20 -10l23 13v50l-20 10Z`}
            fill="#344145"
            stroke={brass}
            strokeOpacity=".5"
          />
          <path
            d={`M${a + 4} ${b - 60}v57l23 6`}
            stroke="#111c20"
            fill="none"
          />
        </g>
      ))}
    </g>
  );
}
function Scene({ chapter }: { chapter: string }) {
  switch (chapter) {
    case "the-fork":
      return (
        <>
          <Arch x={500} y={40} w={250} h={390} />
          <path
            d="M416 315L434 182L471 143L454 96L492 121L530 96L519 143L560 186L584 315Z"
            fill="#2b2322"
            stroke={brass}
            strokeWidth="3"
          />
          <path
            d="M471 174l16 5M514 174l16 -5"
            stroke={ember}
            strokeWidth="4"
          />
          <path
            d="M438 236L320 298M555 236L684 299"
            stroke="#605043"
            strokeWidth="13"
          />
          <Plate x={235} y={313} w={530} h={132} />
          {(["coin", "book", "crystal", "eye"] as const).map((t, i) => (
            <g key={t}>
              <Relic
                type={t}
                x={303 + i * 130}
                y={352}
                s={0.47}
                tone={i % 2 ? teal : brass}
              />
              <Label x={303 + i * 130} y={413} size={16}>
                {["OWN", "RETURN", "ACQUIRE", "ATTEND"][i]}
              </Label>
            </g>
          ))}
          <Person x={494} y={463} s={1.1} />
          <Gear x={175} y={420} r={60} />
          <Gear x={825} y={420} r={60} />
        </>
      );
    case "six-games":
      return (
        <>
          {Array.from({ length: 6 }, (_, i) => {
            const x = 178 + (i % 3) * 322,
              y = 76 + Math.floor(i / 3) * 245;
            return (
              <g key={i}>
                <Plate
                  x={x - 133}
                  y={y}
                  w={266}
                  h={220}
                  tone={i % 2 ? teal : brass}
                />
                {i === 0 ? (
                  <g>
                    {[-60, 0, 60].map((n, j) => (
                      <Person
                        key={n}
                        x={x + n}
                        y={y + 95 + (j % 2) * 10}
                        s={0.72}
                      />
                    ))}
                  </g>
                ) : i === 1 ? (
                  <>
                    <Halo x={x} y={y + 103} r={65} />
                    <path
                      d={`M${x - 59} ${y + 99}l-9 -40l35 27l32 -39l34 39l35 -27l-11 64h-116Z`}
                      fill="#615339"
                      stroke={brass}
                      strokeWidth="3"
                    />
                    <path
                      d={`M${x + 6} ${y + 50}l-14 44l21 12l-10 32`}
                      stroke="#080f12"
                      strokeWidth="7"
                    />
                  </>
                ) : i === 2 ? (
                  <>
                    <path
                      d={`M${x - 15} ${y + 44}l27 -6l17 116h-60Z`}
                      fill="#b0a58a"
                      stroke={brass}
                    />
                    <Label x={x} y={y + 112} tone="#283239" size={34}>
                      33
                    </Label>
                    <Person x={x - 69} y={y + 126} s={0.48} />
                    <Person x={x + 72} y={y + 126} s={0.48} />
                  </>
                ) : i === 3 ? (
                  <>
                    <Relic x={x - 18} y={y + 105} s={0.8} />
                    <Relic x={x + 22} y={y + 105} s={0.8} tone={teal} />
                    <path
                      d={`M${x - 69} ${y + 146}Q${x} ${y + 71} ${x + 71} ${y + 146}`}
                      fill="none"
                      stroke={brass}
                      strokeWidth="3"
                    />
                  </>
                ) : i === 4 ? (
                  <>
                    {Array.from({ length: 7 }, (_, j) => (
                      <g key={j}>
                        <rect
                          x={x - 100 + j * 30}
                          y={y + 57 + (j % 3) * 20}
                          width="22"
                          height={107 - (j % 3) * 20}
                          fill="#244448"
                          stroke={teal}
                        />
                        <path
                          d={`M${x - 89 + j * 30} ${y + 70 + (j % 3) * 20}v55`}
                          stroke={j % 2 ? ember : teal}
                          strokeWidth="4"
                        />
                      </g>
                    ))}
                  </>
                ) : (
                  <>
                    <Floor x={x} y={y + 145} w={195} />
                    <Relic x={x} y={y + 90} type="helm" s={0.72} tone={ember} />
                  </>
                )}
                <Label x={x} y={y + 202} size={16}>
                  {
                    [
                      "THE PARTY",
                      "THE FALLEN CROWN",
                      "THE EXPEDITION",
                      "THE HUNT",
                      "THE NEON CITY",
                      "THE DUNGEON",
                    ][i]
                  }
                </Label>
              </g>
            );
          })}
        </>
      );
    case "the-reset":
      return (
        <>
          <Pipe d="M215 325H785" tone={teal} />
          <Gear x={495} y={354} r={121} />
          <Gear x={372} y={439} r={49} />
          <Arch x={215} y={130} w={182} h={275} />
          <Arch x={785} y={130} w={182} h={275} lit />
          <Person x={487} y={265} s={1.25} tone={teal} />
          <path
            d="M363 317H416M585 317H641l-15 -12m15 12l-15 12"
            stroke={teal}
            strokeWidth="4"
            fill="none"
          />
          <Label x={215} y={458}>
            SEASONAL
          </Label>
          <Label x={785} y={458}>
            ETERNAL
          </Label>
          <Plate x={315} y={45} w={370} h={75} tone={teal} />
          <Label x={500} y={76} size={16}>
            KNOWLEDGE · SKILL
          </Label>
          <Label x={500} y={101} size={14}>
            carried by the player
          </Label>
          <path
            d="M215 418V508H380"
            fill="none"
            stroke={brass}
            strokeDasharray="6 9"
          />
          <Relic type="flame" x={425} y={507} s={0.4} />
          <Label x={623} y={515}>
            A NEW SEASON BEGINS
          </Label>
        </>
      );
    case "several-histories":
      return (
        <>
          <Pipe d="M75 475H925" />
          {[190, 398, 606, 814].map((x, i) => (
            <g key={x} transform={`rotate(${[-3, 2, -1, 3][i]} ${x} 460)`}>
              <path
                d={`M${x - 82} 475V141l38 -47h110l20 60v321Z`}
                fill="#253033"
                stroke={brass}
                strokeWidth="3"
              />
              <Plate x={x - 67} y={155} w={134} h={190} />
              <Relic
                x={x}
                y={246}
                type={(["coin", "helm", "book", "eye"] as const)[i]}
                s={0.78}
                tone={i % 2 ? teal : ember}
              />
              <path
                d={`M${x - 62} 373h125l10 39h-142Z`}
                fill="#45504b"
                stroke={brass}
              />
              <circle cx={x - 26} cy="390" r="10" fill={ember} />
              <path d={`M${x + 25} 383v15`} stroke={brass} strokeWidth="6" />
              <Label x={x} y={454} size={16}>
                {["COIN", "SHOP", "EVENT", "ATTENTION"][i]}
              </Label>
            </g>
          ))}
          <Label x={500} y={548} tone={teal}>
            NEW MACHINES. OLD MACHINES STILL RUNNING.
          </Label>
        </>
      );
    case "concord":
      return (
        <>
          <path
            d="M114 447L500 230L886 447L500 550Z"
            fill="#21333a"
            stroke={teal}
            strokeOpacity=".5"
          />
          {[210, 790].map((x, i) => (
            <g key={x}>
              <path
                d={`M${x - 106} 359V139l35 -45h142l35 45v220Z`}
                fill="#283b42"
                stroke={i ? ember : teal}
                strokeWidth="3"
              />
              <path
                d={`M${x - 78} 350V152H${x + 78}V350`}
                fill="#070e13"
                stroke={i ? ember : teal}
              />
              {[-42, 0, 42].map((n) => (
                <path
                  key={n}
                  d={`M${x + n} 179v132`}
                  stroke={i ? ember : teal}
                  opacity=".3"
                  strokeWidth="7"
                />
              ))}
              <Label x={x} y={127} size={16}>
                TEAM {i ? "B" : "A"}
              </Label>
            </g>
          ))}
          <Floor x={500} y={378} w={375} variant={1} />
          {[
            [-195, 445],
            [-90, 489],
            [90, 489],
            [195, 445],
          ].map(([dx, y], i) => (
            <g key={i}>
              <ellipse
                cx={500 + dx}
                cy={y}
                rx="24"
                ry="10"
                fill="none"
                stroke={i < 2 ? teal : ember}
                strokeDasharray="3 5"
              />
              <path
                d={`M${500 + dx} ${y - 23}v-28`}
                stroke={bone}
                opacity=".22"
                strokeDasharray="4 5"
              />
            </g>
          ))}
          <Label x={500} y={178} tone={bone} size={30}>
            WAITING FOR PEOPLE
          </Label>
        </>
      );
    case "what-decides":
      return (
        <>
          <g transform="translate(675 233) rotate(-24)">
            {[74, 121, 178].map((r) => (
              <ellipse
                key={r}
                rx={r}
                ry={r * 0.62}
                stroke={brass}
                fill="none"
                opacity=".4"
              />
            ))}
            <circle r="25" fill="#ab5930" stroke={ember} />
            <circle cx="-113" cy="31" r="17" fill={teal} />
            <circle cx="104" cy="-96" r="23" fill="#7e8068" />
            <path
              d="M-132 81Q-202 -27 -102 -88"
              stroke={teal}
              strokeWidth="2"
              strokeDasharray="4 8"
              fill="none"
            />
          </g>
          <path
            d="M200 451L267 291L340 451M267 291V451"
            stroke="#786448"
            strokeWidth="11"
          />
          <g transform="translate(279 257) rotate(-24)">
            <path
              d="M-84 -36H26L67 -64H111V64H67L26 36H-84Z"
              fill="#4e5247"
              stroke={brass}
              strokeWidth="4"
            />
            <ellipse
              cx="110"
              ry="64"
              rx="20"
              fill="#0b191f"
              stroke={teal}
              strokeWidth="4"
            />
            <circle cx="-50" r="21" fill="#182628" stroke={brass} />
            <path
              d="M143 -62L286 -109M143 62L286 105"
              stroke={teal}
              opacity=".25"
              strokeDasharray="5 8"
            />
          </g>
          <Person x={169} y={404} s={1.05} />
          <Relic x={457} y={469} type="flame" s={0.65} />
          <path
            d="M409 512l95 -16M418 493l76 22"
            stroke={brass}
            strokeWidth="8"
          />
          <Label x={746} y={458}>
            FOLLOW THE QUESTION
          </Label>
          <Label x={746} y={484} size={14} tone={teal}>
            the instrument cannot choose it for you
          </Label>
        </>
      );
    case "shape-of-money":
      return (
        <>
          <Pipe d="M198 365V460H809V314M498 422V265" />
          <Plate x={73} y={156} w={245} h={240} />
          <Relic type="coin" x={195} y={250} s={1.3} />
          <Label x={195} y={366}>
            THE SHOP
          </Label>
          <Arch x={500} y={100} w={206} h={312} lit />
          <Relic type="flame" x={500} y={304} s={1.5} />
          <Gear x={361} y={382} r={56} />
          <Gear x={635} y={382} r={56} />
          <Plate x={693} y={147} w={240} h={246} tone={teal} />
          <Person x={778} y={253} s={0.67} />
          <Person x={847} y={253} s={0.67} />
          <Label x={813} y={366}>
            THE WORLD
          </Label>
          <Label x={500} y={530} tone={teal}>
            KEEP THE PROMISE RUNNING
          </Label>
          <Label x={500} y={147} size={14}>
            CONTENT · OPERATIONS · SUPPORT
          </Label>
        </>
      );
    case "why-people-play":
      return (
        <>
          <Platform x={500} y={421} w={745} />
          <Relic type="flame" x={500} y={350} s={1.3} />
          <Halo x={500} y={354} r={110} tone={ember} />
          <Person x={256} y={339} s={1.5} />
          <Person x={730} y={343} s={1.5} tone={teal} />
          <Person x={529} y={484} s={0.75} />
          <Relic x={225} y={183} s={0.65} />
          <Plate x={650} y={117} w={160} h={118} tone={teal} />
          <path
            d="M685 203l25 -31l33 13l37 -39M688 151l49 51"
            fill="none"
            stroke={teal}
            strokeWidth="2"
          />
          <circle cx="780" cy="146" r="7" fill={ember} />
          <Label x={256} y={274}>
            I WANT TO MASTER THIS
          </Label>
          <Label x={746} y={284}>
            I WANT TO CHOOSE
          </Label>
          <Label x={498} y={112}>
            I WANT TO BE HERE WITH YOU
          </Label>
          <path
            d="M393 145Q500 200 607 145"
            stroke={brass}
            fill="none"
            strokeDasharray="2 7"
          />
        </>
      );
    case "play-beyond-score":
      return (
        <>
          <path
            d="M65 469V200L223 62L341 137L479 85L582 207L666 109L862 222L937 469Z"
            fill="#41272a"
            stroke="#855142"
            strokeWidth="2"
          />
          {[190, 400, 620, 829].map((x, i) => (
            <path
              key={x}
              d={`M${x - 59} 450V${160 + (i % 2) * 71}l59 -71l59 71v290`}
              fill="#11181e"
              stroke={brass}
              opacity=".6"
            />
          ))}
          <path
            d="M447 74l-42 146l72 34l-97 257M714 129l-83 101l61 44l-57 84"
            fill="none"
            stroke={ember}
            strokeWidth="7"
          />
          <Person x={352} y={342} s={1.7} pose="kneel" tone={bone} />
          <Plate x={621} y={277} w={229} h={145} tone={ember} />
          <Label x={735} y={324} size={16}>
            THE COUNTER
          </Label>
          <Label x={735} y={377} size={40} tone={ember}>
            + + +
          </Label>
          <Label x={299} y={537} size={23}>
            WHAT WAS MEASURED?
          </Label>
          <Label x={735} y={497} size={23} tone={teal}>
            WHAT WAS FELT?
          </Label>
        </>
      );
    case "anatomy-of-loop":
      return (
        <>
          {[440, 337, 232].map((r, i) => (
            <g key={r} transform={`translate(500 316) rotate(-15)`}>
              <ellipse
                rx={r}
                ry={r * 0.51}
                fill={i === 2 ? "#23353a" : "none"}
                stroke={i === 1 ? teal : brass}
                strokeWidth={i === 2 ? 4 : 2}
                opacity=".65"
              />
            </g>
          ))}
          <Floor x={500} y={317} w={450} variant={1} />
          <Person x={464} y={284} s={0.65} />
          <Relic x={558} y={273} s={0.65} tone={ember} />
          <path
            d="M388 322Q432 239 554 251"
            stroke={ember}
            fill="none"
            strokeWidth="3"
            strokeDasharray="4 8"
          />
          <Label x={193} y={138}>
            A PROJECT
          </Label>
          <Label x={770} y={202} tone={teal}>
            A ROUTE
          </Label>
          <Label x={669} y={420}>
            AN ENCOUNTER
          </Label>
          <Label x={434} y={526} tone={ember}>
            A DECISION
          </Label>
          <Plate x={85} y={395} w={179} h={106} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect
              key={i}
              x={105 + (i % 4) * 38}
              y={416 + Math.floor(i / 4) * 23}
              width="26"
              height="13"
              fill={i < 7 ? brass : "#253b3e"}
            />
          ))}
        </>
      );
    case "loot-table":
      return (
        <>
          <Plate x={60} y={69} w={543} h={459} />
          {Array.from({ length: 30 }, (_, i) => {
            const x = 98 + (i % 6) * 79,
              y = 110 + Math.floor(i / 6) * 82;
            return (
              <g key={i}>
                <rect
                  x={x - 17}
                  y={y - 18}
                  width="64"
                  height="67"
                  fill="#0c181e"
                  stroke={i === 16 ? ember : "#415151"}
                />
                <Relic
                  type={
                    (
                      [
                        "helm",
                        "sword",
                        "coin",
                        "key",
                        "book",
                        "crystal",
                      ] as const
                    )[i % 6]
                  }
                  x={x + 15}
                  y={y + 17}
                  s={0.28}
                  tone={i === 16 ? ember : "#778a81"}
                />
              </g>
            );
          })}
          <Platform x={771} y={443} w={280} />
          <Halo x={766} y={272} r={131} tone={ember} />
          <Relic x={767} y={269} s={2.15} tone={ember} />
          <path
            d="M608 329l58 -28"
            stroke={ember}
            strokeWidth="2"
            strokeDasharray="3 7"
          />
          <Label x={768} y={105}>
            THE ONE YOU WANT
          </Label>
          <Label x={768} y={529} size={16} tone={teal}>
            RARITY IS A DISTRIBUTION
          </Label>
        </>
      );
    case "the-checklist":
      return (
        <>
          <Gear x={501} y={235} r={164} />
          <Halo x={501} y={235} r={142} />
          <path
            d="M501 125V235L589 285"
            fill="none"
            stroke={bone}
            strokeWidth="6"
          />
          <circle cx="501" cy="235" r="12" fill={ember} />
          <Pipe d="M98 432H902" />
          {[149, 288, 427, 566, 705].map((x, i) => (
            <g key={x}>
              <Plate
                x={x - 46}
                y={365}
                w={92}
                h={123}
                tone={i < 3 ? teal : brass}
              />
              <Relic
                x={x}
                y={415}
                type={i % 2 ? "crystal" : "coin"}
                s={0.42}
                tone={i < 3 ? teal : brass}
              />
              <Label x={x} y={468} size={15}>
                {i < 3 ? "✓" : `0${i + 1}`}
              </Label>
            </g>
          ))}
          <Arch x={855} y={262} w={98} h={228} />
          <path
            d="M824 349V481M846 319V481M868 319V481M890 349V481"
            stroke={brass}
            strokeWidth="6"
          />
          <Person x={321} y={476} s={0.72} />
          <path
            d="M728 502Q566 582 404 518l19 0m-19 0l9 19"
            stroke={teal}
            strokeWidth="3"
            fill="none"
          />
          <Label x={188} y={234} size={20}>
            COME BACK
          </Label>
          <Label x={815} y={234} size={20} tone={ember}>
            BEFORE WHEN?
          </Label>
        </>
      );
    case "familiar-verbs":
      return (
        <>
          {[260, 747].map((x, i) => (
            <g key={x}>
              <Floor x={x} y={346} w={425} variant={i} />
              <Person x={x - 42} y={300} s={0.78} />
              <Relic x={x + 65} y={273} type="helm" s={0.68} tone={ember} />
              <path
                d={`M${x - 24} 297q49 -73 94 -23`}
                stroke={ember}
                strokeWidth="5"
                fill="none"
              />
              {i ? (
                <>
                  <path
                    d={`M${x - 83} 359q-30 -99 15 -128`}
                    stroke={teal}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5 7"
                  />
                  <circle
                    cx={x + 40}
                    cy="357"
                    r="34"
                    fill={ember}
                    opacity=".13"
                    stroke={ember}
                  />
                </>
              ) : null}
              <circle
                cx={x - 153}
                cy="464"
                r="25"
                fill="#722e29"
                stroke={brass}
                strokeWidth="4"
              />
              <circle
                cx={x + 153}
                cy="464"
                r="25"
                fill="#2c6470"
                stroke={brass}
                strokeWidth="4"
              />
              <path
                d={`M${x - 104} 464H${x + 104}`}
                stroke={brass}
                opacity=".4"
              />
              <Label x={x} y={151} size={22}>
                {i ? "CHANGE THE CONSTRAINT" : "KEEP THE VERB"}
              </Label>
              <Label x={x} y={522} size={17} tone={teal}>
                {i ? "position · timing · escape" : "attack · defend · collect"}
              </Label>
            </g>
          ))}
          <path
            d="M500 110V510"
            stroke={brass}
            opacity=".3"
            strokeDasharray="3 9"
          />
        </>
      );
    case "access":
      return (
        <>
          <Arch x={267} y={126} w={229} h={324} lit />
          <Arch x={732} y={182} w={178} h={269} />
          <Pipe d="M267 479H515V376H724" tone={teal} />
          <Relic type="key" x={264} y={285} s={1.1} tone={teal} />
          <Person x={486} y={413} s={1.03} />
          <Relic type="book" x={732} y={321} s={0.72} />
          <Label x={269} y={110} size={24}>
            OWN THE CHAPTER
          </Label>
          <Label x={733} y={129} size={24}>
            DO THE WORK
          </Label>
          <Label x={492} y={548} tone={teal}>
            AN OPEN DOOR STILL HAS A PATH BEHIND IT
          </Label>
        </>
      );
    case "identity":
      return (
        <>
          {[230, 500, 770].map((x, i) => (
            <g key={x}>
              <Arch x={x} y={76} w={211} h={357} />
              <Platform x={x} y={421} w={241} />
              <Armor x={x} y={248} tone={[brass, teal, ember][i]} variant={i} />
              <Label x={x} y={530} size={19}>
                {["THE WARDEN", "THE WAYFARER", "THE ASH-BEARER"][i]}
              </Label>
            </g>
          ))}
          <Label x={500} y={50} size={16} tone={teal}>
            THREE SELVES · ONE MECHANICAL BASELINE
          </Label>
        </>
      );
    case "time":
      return (
        <>
          <Pipe d="M153 426H350V296H518V450H830" />
          <Pipe d="M167 169H827V364" tone={teal} />
          <Gear x={355} y={408} r={86} />
          <Arch x={515} y={197} w={150} h={241} />
          <Relic type="flame" x={515} y={346} s={1} />
          <Plate x={83} y={274} w={181} h={162} />
          <Relic type="crystal" x={171} y={340} s={0.7} />
          <Plate x={726} y={296} w={190} h={148} tone={teal} />
          <Relic x={820} y={358} s={0.65} />
          <Plate x={409} y={91} w={197} h={112} tone={teal} />
          <Relic type="coin" x={505} y={137} s={0.66} />
          <Label x={167} y={481}>
            GATHER
          </Label>
          <Label x={512} y={490}>
            CRAFT
          </Label>
          <Label x={824} y={486}>
            ACQUIRE
          </Label>
          <Label x={509} y={69} tone={teal}>
            EXCHANGE · WITH CONDITIONS
          </Label>
          <Person x={268} y={470} s={0.75} />
        </>
      );
    case "power":
      return (
        <>
          <Platform x={255} y={420} w={330} />
          <path
            d="M164 389L185 256L224 230L193 166L253 206L289 168L285 228L337 273L348 392L292 372L258 401L222 372Z"
            fill="#4c302b"
            stroke={ember}
            strokeWidth="3"
          />
          <path
            d="M219 270l20 7M273 277l20 -7"
            stroke={ember}
            strokeWidth="6"
          />
          <Person x={166} y={420} s={0.6} />
          <Plate x={697} y={226} w={233} h={229} />
          <Relic type="coin" x={815} y={304} s={1.1} />
          <Label x={815} y={412} size={17}>
            THE EXCHANGE
          </Label>
          <Halo x={501} y={242} r={96} />
          <Relic x={501} y={242} s={1.4} />
          <path
            d="M326 299L412 258M589 258L698 299"
            stroke={brass}
            strokeWidth="3"
            strokeDasharray="5 8"
          />
          <Label x={249} y={124} size={23}>
            PLAY FOR IT
          </Label>
          <Label x={806} y={124} size={23}>
            TRADE FOR IT
          </Label>
          <Label x={501} y={527} tone={teal}>
            THE ITEM CAN STAY. THE REASON TO PLAY CAN CHANGE.
          </Label>
        </>
      );
    case "what-things-cost":
      return (
        <>
          <Pipe d="M218 348H776M499 357V488H746" />
          <Plate x={89} y={123} w={231} h={274} />
          <Relic type="coin" x={204} y={248} s={1.23} />
          <Label x={204} y={369}>
            CASH
          </Label>
          <Gear x={498} y={278} r={119} />
          <Plate x={433} y={193} w={130} h={165} />
          <Relic type="crystal" x={498} y={263} s={0.8} tone={teal} />
          <Label x={498} y={338} size={15}>
            TOKENS
          </Label>
          <Plate x={692} y={110} w={231} h={287} tone={ember} />
          <Relic type="helm" x={807} y={247} s={1.4} tone={ember} />
          <Label x={807} y={369}>
            THE ITEM
          </Label>
          <Plate x={660} y={445} w={264} h={88} />
          {[712, 753, 794].map((x) => (
            <Relic key={x} type="coin" x={x} y={477} s={0.28} />
          ))}
          <Label x={789} y={517} size={15}>
            THE REMAINDER
          </Label>
          <Label x={244} y={501} tone={teal}>
            READ ALL THREE NUMBERS
          </Label>
        </>
      );
    case "two-key-lock":
      return (
        <>
          <Arch x={500} y={69} w={275} h={423} />
          <Gear x={500} y={302} r={126} />
          <Plate x={427} y={234} w={146} h={121} />
          <circle cx="468" cy="279" r="13" fill="#060d10" stroke={brass} />
          <circle cx="532" cy="279" r="13" fill="#060d10" stroke={teal} />
          <path d="M464 283v32M528 283v32" stroke={bone} strokeWidth="6" />
          <Relic type="key" x={205} y={268} s={1.5} />
          <Relic type="key" x={795} y={268} s={1.5} tone={teal} />
          <Pipe d="M248 268H380M620 268H752" />
          <Label x={208} y={130} size={23}>
            CATALOG ACCESS
          </Label>
          <Label x={792} y={130} size={23} tone={teal}>
            EARNED FAVOR
          </Label>
          <Plate x={704} y={405} w={183} h={115} tone={teal} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={725 + i * 28}
              y={432}
              width="17"
              height="47"
              fill={teal}
              opacity={0.25 + i * 0.12}
            />
          ))}
          <Label x={795} y={503} size={15}>
            99 HELD · REFILLABLE
          </Label>
          <Label x={499} y={551} tone={ember}>
            THE CLAIM NEEDS BOTH
          </Label>
        </>
      );
    case "abstraction-and-surface":
      return (
        <>
          <Platform x={500} y={424} w={353} />
          <Halo x={500} y={273} r={117} />
          <Armor x={500} y={230} tone={ember} variant={2} />
          {[
            [202, 112, "CASH"],
            [800, 133, "OWNERSHIP"],
            [188, 361, "EFFORT"],
            [818, 389, "TIME"],
          ].map(([x, y, l], i) => (
            <g key={i} transform={`rotate(${i % 2 ? 6 : -6} ${x} ${y})`}>
              <Plate
                x={Number(x) - 105}
                y={Number(y)}
                w={210}
                h={105}
                tone={i % 2 ? teal : brass}
              />
              <Label x={Number(x)} y={Number(y) + 43} size={18}>
                {l}
              </Label>
              {[0, 1, 2].map((j) => (
                <path
                  key={j}
                  d={`M${Number(x) - 60} ${Number(y) + 59 + j * 9}h${120 - j * 25}`}
                  stroke={bone}
                  opacity=".18"
                />
              ))}
            </g>
          ))}
          <path
            d="M304 166L413 212M695 185L590 235M290 402L404 352M713 431L591 368"
            stroke={brass}
            strokeDasharray="3 10"
            fill="none"
          />
          <Label x={500} y={552} tone={teal}>
            THE REWARD IS LOUD. ARE ITS CONDITIONS?
          </Label>
        </>
      );
    default:
      return (
        <>
          <Plate x={66} y={97} w={342} h={394} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Halo
                x={164}
                y={176 + i * 119}
                r={37}
                tone={i % 2 ? ember : teal}
              />
              <path
                d={`M164 ${176 + i * 119}l${i % 2 ? 22 : -18} -21`}
                stroke={bone}
                strokeWidth="3"
              />
              <path
                d={`M229 ${176 + i * 119}h120m-120 13h75`}
                stroke={brass}
                opacity=".4"
              />
            </g>
          ))}
          <Arch x={767} y={75} w={247} h={416} lit />
          {Array.from({ length: 17 }, (_, i) => {
            const x = 674 + noise(i) * 181,
              y = 313 + noise(i + 3) * 140;
            return (
              <path
                key={i}
                d={`M${x} 489Q${x - 18} ${y + 40} ${x + 8} ${y}m-10 66l-20 -19m22 3l22 -27`}
                stroke={i % 3 ? teal : brass}
                fill="none"
                opacity=".55"
                strokeWidth="3"
              />
            );
          })}
          <Person x={534} y={405} s={1.6} />
          <Label x={237} y={541}>
            WHAT WE CAN COUNT
          </Label>
          <Label x={769} y={541} tone={teal}>
            WHY THEY CAME BACK
          </Label>
        </>
      );
  }
}

/** Twenty-one engraved dioramas. Geometry is deterministic; no assets or animation loop. */
function ScenePlate({
  chapter,
  index,
  label,
}: {
  chapter: string;
  index: number;
  label: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 1000 600" role="img" aria-label={label}>
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="42%" r="65%">
          <stop stopColor="#38423b" />
          <stop offset=".65" stopColor="#152025" />
          <stop offset="1" stopColor="#080f13" />
        </radialGradient>
        <linearGradient id={`${id}-shade`} x2="0" y2="1">
          <stop stopColor="#b89051" stopOpacity=".13" />
          <stop offset=".35" stopColor="#061016" stopOpacity="0" />
          <stop offset="1" stopColor="#010609" stopOpacity=".7" />
        </linearGradient>
        <pattern
          id={`${id}-etch`}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 7L7 0" stroke="#d3c395" strokeOpacity=".035" />
        </pattern>
      </defs>
      <rect width="1000" height="600" fill={`url(#${id}-glow)`} />
      <g stroke="#829388" fill="none" opacity=".065">
        {Array.from({ length: 17 }, (_, i) => (
          <path key={i} d={`M${i * 80 - 120} 600L500 180`} />
        ))}
        {[351, 390, 441, 505, 588].map((y) => (
          <path key={y} d={`M0 ${y}H1000`} />
        ))}
      </g>
      <g fill="#708882" opacity=".08">
        {Array.from({ length: 35 }, (_, i) => (
          <rect
            key={i}
            x={noise(i + index * 12) * 1000}
            y={noise(i + 21) * 550}
            width={20 + noise(i + 44) * 100}
            height="1"
          />
        ))}
      </g>
      <rect width="1000" height="600" fill={`url(#${id}-shade)`} />
      <Scene chapter={chapter} />
      <rect
        width="1000"
        height="600"
        fill={`url(#${id}-etch)`}
        pointerEvents="none"
      />
      <path
        d="M22 73V22H73M927 22H978V73M22 527V578H73M927 578H978V527"
        fill="none"
        stroke={brass}
        opacity=".4"
      />
      <g fill={brass} opacity=".3">
        {Array.from({ length: 18 }, (_, i) => (
          <circle
            key={i}
            cx={40 + noise(index * 15 + i) * 920}
            cy={40 + noise(i + 56) * 520}
            r={0.7 + noise(i + 7) * 0.9}
          />
        ))}
      </g>
    </svg>
  );
}

export default memo(ScenePlate);
