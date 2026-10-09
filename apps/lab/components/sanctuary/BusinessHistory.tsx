"use client";

import { useId, useState } from "react";
import { businessHistory } from "@/lib/sanctuary/business-history";
import type { EvidenceSource } from "@/lib/sanctuary/types";
import { useLivingPlate } from "./plates/useLivingPlate";
import s from "./business-history.module.css";

const sourceLabels: Record<string, string> = {
  "pong-tavern": "Pong’s debut", "alcorn-oral": "Alcorn’s account",
  "home-cartridge-history": "Atari’s cartridge library", "sony-ps1-creators": "Sony’s 1997 report",
  "halo-bungie-acquisition": "Bungie acquisition", "halo-macworld-recollection": "Lehto’s recollection",
  "valve-deck-booklet": "Valve’s Steam history", "netflix-streaming-launch": "Netflix’s launch",
  "game-pass-release-history": "Game Pass expansion", "gfn-reach-2023": "GeForce NOW history",
  "gfn-membership-terms": "Computing & game rights", "halo-playstation-release": "Halo’s 2026 release",
};

/** Original objects, not reproductions of product artwork or interfaces. */
function MilestoneObject({ kind, prefix }: { kind: string; prefix: string }) {
  const metal = `url(#${prefix}-metal)`;
  const glass = `url(#${prefix}-glass)`;
  const wood = `url(#${prefix}-wood)`;
  return <svg viewBox="0 0 280 190" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${prefix}-metal`} x2=".7" y2="1"><stop stopColor="#827366"/><stop offset=".48" stopColor="#302f30"/><stop offset="1" stopColor="#121619"/></linearGradient>
      <linearGradient id={`${prefix}-glass`} x2=".8" y2="1"><stop stopColor="#346368"/><stop offset=".45" stopColor="#122d35"/><stop offset="1" stopColor="#0a111b"/></linearGradient>
      <linearGradient id={`${prefix}-wood`} x2=".8" y2="1"><stop stopColor="#95623c"/><stop offset=".55" stopColor="#533726"/><stop offset="1" stopColor="#241d1b"/></linearGradient>
      <radialGradient id={`${prefix}-light`}><stop stopColor="#e1a857" stopOpacity=".19"/><stop offset="1" stopColor="#e1a857" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="140" cy="100" rx="138" ry="95" fill={`url(#${prefix}-light)`}/>
    <g fill="none" stroke="#bba083" opacity=".13"><path d="M18 159H262M37 174H243M56 185H224M140 138L62 185M140 138L219 185"/><path d="M27 22h12m-12 0v12m226-12h-12m12 0v12"/></g>
    <ellipse cx="140" cy="166" rx="88" ry="12" fill="#06090b" opacity=".8"/>
    {kind === "coin" ? <g strokeLinejoin="round">
      <path d="M91 23L171 23 194 36 194 163 166 171 91 158 91 101 102 87 91 51Z" fill={wood} stroke="#b28b5b"/>
      <path d="M171 23L194 36 194 163 166 171 166 102 178 85 170 51Z" fill="#262526" stroke="#74604a"/>
      <path d="M96 28H166V48H96Z" fill="#191717" stroke="#8a6e4d"/>
      <path d="M108 37H153M113 41H148" stroke="#e5c08a" strokeWidth="2"/>
      <path d="M102 55H163L171 85H111Z" fill="#0a151a" stroke="#a3a59a"/>
      <path d="M111 59H159L165 81H117Z" fill={glass}/>
      <g className={s.signal} stroke="#b6dbc8" strokeWidth="3"><path d="M121 67v9m32-9v9"/><path d="M139 62v16" strokeDasharray="2 3" strokeWidth="1"/><circle cx="143" cy="71" r="2" fill="#e5deb4" stroke="none"/></g>
      <path d="M111 87L171 87 161 106 92 102Z" fill={metal} stroke="#b09772"/>
      <ellipse cx="112" cy="96" rx="6" ry="3" fill="#b0a38b"/><ellipse cx="148" cy="98" rx="6" ry="3" fill="#b0a38b"/>
      <path d="M100 110L158 114V159L100 151Z" fill="#272625" stroke="#705b42"/>
      <path d="M119 119L141 121V146L119 143Z" fill="#14191b" stroke="#ad916a"/>
      <path d="M126 127L135 128" stroke="#e1b978" strokeWidth="2"/>
      <circle cx="129" cy="136" r="2" fill="#a38864"/>
      <path d="M179 48V158M185 51V156" stroke="#936943" opacity=".5"/>
      <g transform="translate(62 135)"><ellipse rx="12" ry="13" fill="#a4793e" stroke="#e2c184"/><ellipse rx="8" ry="9" fill="none" stroke="#f1cc7d"/><path d="M0-5V5m-3-8L0-5" stroke="#e7c58f" strokeWidth="2"/></g>
    </g> : null}
    {kind === "cartridge" ? <g strokeLinejoin="round">
      <path d="M58 30L195 30 212 41 212 118 197 127 57 117Z" fill={wood} stroke="#b6966d"/>
      <path d="M195 30L212 41V118L197 127Z" fill="#302824"/>
      <rect x="64" y="36" width="114" height="77" rx="8" fill="#151b1d" stroke="#ba9a6d"/>
      <rect x="71" y="43" width="100" height="63" rx="12" fill={glass}/>
      <g fill="none" stroke="#78c6b7" strokeWidth="2" className={s.signal}><path d="M78 93L89 80 98 87 112 65 132 89 155 73 165 90M75 99H166"/><path d="M112 63L124 73"/></g>
      <circle cx="189" cy="53" r="6" fill={metal} stroke="#b3a17d"/><circle cx="189" cy="75" r="5" fill={metal} stroke="#b3a17d"/>
      <path d="M184 90h10m-10 4h10m-10 4h10m-10 4h10" stroke="#8b8069"/>
      <path d="M70 128L165 128 181 143 181 160H61V143Z" fill={metal} stroke="#a39072"/>
      <path d="M61 151H181V160H61Z" fill={wood}/>
      <path d="M74 140H165M83 144H145" stroke="#090f14" strokeWidth="3"/>
      <path d="M103 119H136V139H103Z" fill="#353432" stroke="#b6a081"/>
      <path d="M107 123H132V130H107Z" fill="#c18c58"/>
      <path d="M188 154L216 147 230 156 201 165Z" fill="#2b3030" stroke="#9e9176"/><path d="M207 154V137" stroke="#c1b493" strokeWidth="4"/><circle cx="207" cy="135" r="5" fill="#402f28"/>
      <path d="M197 165C187 174 172 173 165 162" fill="none" stroke="#8d8273"/>
    </g> : null}
    {kind === "platform" ? <g strokeLinejoin="round">
      <g transform="translate(165 40) rotate(7)"><path d="M0 0H47V87H0Z" fill="#394f57" stroke="#b8a78a"/><path d="M5 6H42V61H5Z" fill={glass}/><path d="M8 58L20 21 38 58Z" fill="#bfa579"/><path d="M8 69H37M8 75H29" stroke="#c2b496"/></g>
      <g transform="translate(62 31) rotate(-9)"><path d="M0 0H50V90H0Z" fill="#342a2b" stroke="#b8a78a"/><path d="M6 7H44V67H6Z" fill="#614234"/><path d="M9 62L24 28 41 62Z" fill="#b7a17b"/><circle cx="26" cy="18" r="7" fill="#d4b682"/><path d="M8 77H40M8 82H28" stroke="#c2b496"/></g>
      <path d="M83 119L185 114 211 143 207 165 77 167 63 148Z" fill={metal} stroke="#b9b2a3"/>
      <path d="M63 148L207 145M77 167V153" stroke="#706e64"/>
      <ellipse cx="139" cy="137" rx="33" ry="17" fill="#666960" stroke="#aea995"/>
      <ellipse cx="139" cy="135" rx="30" ry="14" fill="#383f3b" stroke="#d1b47e"/><ellipse cx="139" cy="135" rx="7" ry="3" fill="#d1b47e"/>
      <circle cx="84" cy="143" r="4" fill="#8aab9c"/><path d="M98 156h23m39-1h23" stroke="#0b1115" strokeWidth="4"/>
      <path d="M112 106L105 88 121 73 145 72 166 88 158 107 146 96 124 96Z" fill="#1e3038" stroke="#b0ac92"/>
      <path d="M119 83v12m-6-6h12" stroke="#c0b18c" strokeWidth="3"/><circle cx="151" cy="84" r="3" fill="#b97156"/><circle cx="157" cy="92" r="3" fill="#8dbda7"/>
      <path d="M137 101C134 111 119 108 113 119" fill="none" stroke="#9a8d74"/>
    </g> : null}
    {kind === "online" ? <g strokeLinejoin="round">
      <path d="M123 131V154L106 163H177L158 152V131" fill={metal} stroke="#877966"/>
      <rect x="42" y="30" width="190" height="110" rx="5" fill={metal} stroke="#b0a58a"/>
      <rect x="49" y="37" width="176" height="94" fill={glass}/>
      <path d="M49 49H225M97 50V131" stroke="#688e8d"/>
      <circle cx="56" cy="43" r="2" fill="#d2a264"/><circle cx="63" cy="43" r="2" fill="#a05d4e"/><circle cx="70" cy="43" r="2" fill="#70a9a0"/>
      <path d="M57 59h27m-27 7h22m-22 7h25m-25 17h29m-29 7h18" stroke="#9baca2" strokeWidth="2" opacity=".8"/>
      <rect x="105" y="57" width="111" height="36" fill="#554134"/><path d="M110 89L129 66 147 84 178 64 211 89" fill="#b89b69"/><circle cx="197" cy="66" r="5" fill="#e2bd7c"/>
      {[0,1,2].map(i=><g key={i}><rect x={105+i*39} y="100" width="33" height="23" fill={i===1?'#745040':'#42616a'}/><path d={`M${110+i*39} 118l8-12 11 12`} fill="#9da88c"/></g>)}
      <path d="M93 174H189L182 165H100Z" fill={metal} stroke="#9d8e72"/>
      <path d="M28 72H12v84h45M250 52h14v100h-28" fill="none" stroke="#8caf9d" strokeDasharray="4 4" className={s.signal}/>
    </g> : null}
    {kind === "catalog" ? <g strokeLinejoin="round">
      <path d="M55 53L188 33 217 50 217 153 85 173 55 155Z" fill="#172930" stroke="#9ba493"/>
      <path d="M55 53L85 71 217 50M85 71V173" fill="none" stroke="#b6956c"/>
      <path d="M96 83L205 65V88L96 106Z" fill="#6d5140"/>
      <path d="M105 88L151 80M105 94L180 81" stroke="#ddbd82" strokeWidth="2"/>
      {[0,1,2].map(i=><g key={i} transform={`translate(${97+i*37} ${116-i*6})`}><path d="M0 0L28-5V37L0 42Z" fill={i===1?'#915b43':'#406b70'} stroke="#b7a680"/><path d="M4 30L12 9 24 27Z" fill="#c0ad85"/></g>)}
      <path d="M66 65v57m0 8v11" stroke="#b7966b"/>
      <g className={s.signal}><circle cx="191" cy="42" r="25" fill="#1a211f" stroke="#b6a374"/><path d="M202 35a13 13 0 1 0 2 15m-2-15v-8m0 8h-8" fill="none" stroke="#c7b985" strokeWidth="2"/><path d="M190 34v9l6 3" stroke="#83b8a4" strokeWidth="2" fill="none"/></g>
    </g> : null}
    {kind === "cloud" ? <g strokeLinejoin="round">
      <path d="M53 25L123 25 140 37V132L124 144 53 136Z" fill={metal} stroke="#b4a38a"/><path d="M123 25L140 37V132L124 144Z" fill="#111d23"/>
      {[0,1,2,3].map(i=><g key={i}><rect x="61" y={36+i*23} width="54" height="18" rx="2" fill="#1c2a30" stroke="#63736f"/><path d={`M67 ${43+i*23}h27m-27 4h27`} stroke="#83958b"/><circle cx="106" cy={44+i*23} r="2" fill="#91d4b0" className={s.signal}/></g>)}
      <path d="M125 119H158V97H184" fill="none" stroke="#7bb7b2" strokeWidth="2" strokeDasharray="5 4" className={s.signal}/>
      <path d="M156 102L237 110V157L156 149Z" fill={metal} stroke="#b4a38a"/>
      <path d="M162 109L231 116V149L162 142Z" fill={glass}/>
      <path d="M167 139L183 119 199 134 214 124 226 145" fill="#709e97"/><path d="M156 149L237 157 223 174 134 164Z" fill="#323f44" stroke="#9ca69b"/>
      <path d="M158 155L223 161M153 159L216 165" stroke="#77918c"/>
      <path d="M170 38c-12-17-35 1-25 16-15 12-1 26 12 23h67c22 0 23-28 5-31-3-22-36-24-42-8-5-4-10-4-17 0Z" fill="#203b43" stroke="#82b6b1"/><path d="M180 48v16m-7-7l7 7 7-7M197 63V47m-7 7l7-7 7 7" fill="none" stroke="#c5c4a2" strokeWidth="2"/>
    </g> : null}
  </svg>;
}

export default function BusinessHistory({ sources }: { sources: EvidenceSource[] }) {
  const [selected, setSelected] = useState(0);
  const id = useId().replace(/:/g, "");
  const ref = useLivingPlate<HTMLElement>();
  const era = businessHistory[selected];
  return <section id="business-history" ref={ref} data-playing="false" className={s.history} aria-labelledby={`${id}-title`}>
    <header className={s.header}><p className={s.kicker}>1972 → 2026 · Selected milestones</p><h2 id={`${id}-title`}>From the coin slot to the cloud.</h2><p>New ways to sell entertainment accumulate. The earlier ones keep earning.</p></header>
    <ol className={s.timeline} aria-label="Explore the business history">
      {businessHistory.map((item, index) => <li key={item.id}>
        <button type="button" aria-pressed={selected === index} aria-controls={`${id}-reading`} onClick={() => setSelected(index)}>
          <span className={s.date}>{item.date}</span>
          <div className={s.object}><MilestoneObject kind={item.id} prefix={`${id}-${item.id}`}/></div>
          <span className={s.label}>{item.label}</span><span className={s.index} aria-hidden="true">0{index+1} <span>↗</span></span>
        </button>
      </li>)}
    </ol>
    <div id={`${id}-reading`} className={s.reading} aria-live="polite" aria-atomic="true">
      <div><p className={s.kicker}>{era.date} · {era.example}</p><h3>{era.label}</h3><p>{era.body}</p></div>
      <div className={s.stake}><p>{era.stake}</p><div className={s.sources}>{era.sources.map(sourceId => {
        const source = sources.find(item => item.id === sourceId);
        return source ? <a key={source.id} href={source.url} target="_blank" rel="noreferrer" title={source.title}>{sourceLabels[source.id] ?? source.title} ↗</a> : null;
      })}</div></div>
    </div>
    <p className={s.note}>Select a milestone to explore it. Dates mark these examples, not the invention or replacement of a business model.</p>
  </section>;
}
