import { memo } from "react";
import { Screw, WoodGrain } from "./plates/ArcadeMaterials";
import s from "./business-history.module.css";

const animated = (name: string) => `${s.motion} ${name}`;

/** Purposeful period studies, not authentic captures or exact product replicas. */
function MilestoneObject({ kind, prefix, steamSrc }: { kind: string; prefix: string; steamSrc?: string }) {
  const scene = kind === "coin-modern" ? "coin" : kind === "pc-box" || kind === "console-store" ? "online" : (kind === "cloud-console" || kind === "cloud-early") ? "cloud" : kind;
  const paint = (name: string) => `url(#${prefix}-${name})`;
  return <svg viewBox="0 0 320 230" aria-hidden="true" focusable="false" data-era={kind}>
    <defs>
      <linearGradient id={`${prefix}-wood`} x2="1" y2=".7"><stop stopColor="#9b653f"/><stop offset=".5" stopColor="#583825"/><stop offset="1" stopColor="#2c2420"/></linearGradient>
      <linearGradient id={`${prefix}-yellow`} x2=".8" y2="1"><stop stopColor="#d6b644"/><stop offset=".5" stopColor="#aa8c36"/><stop offset="1" stopColor="#75572b"/></linearGradient>
      <linearGradient id={`${prefix}-metal`} x2=".5" y2="1"><stop stopColor="#d7c7a5"/><stop offset=".35" stopColor="#716c61"/><stop offset=".55" stopColor="#b4a88b"/><stop offset="1" stopColor="#3e4546"/></linearGradient>
      <linearGradient id={`${prefix}-plastic`} x2=".7" y2="1"><stop stopColor="#9da79b"/><stop offset=".45" stopColor="#737d77"/><stop offset="1" stopColor="#414e51"/></linearGradient>
      <linearGradient id={`${prefix}-black`} x2=".7" y2="1"><stop stopColor="#414e4c"/><stop offset=".4" stopColor="#202e32"/><stop offset="1" stopColor="#101b21"/></linearGradient>
      <linearGradient id={`${prefix}-glass`} x2=".7" y2="1"><stop stopColor="#274b51"/><stop offset=".55" stopColor="#122b31"/><stop offset="1" stopColor="#070f16"/></linearGradient>
      <linearGradient id={`${prefix}-reflection`} x2="1" y2="1"><stop stopColor="#d1ddd0" stopOpacity=".14"/><stop offset=".45" stopColor="#9ad5d3" stopOpacity=".02"/><stop offset=".5" stopColor="#b9d2c3" stopOpacity=".15"/><stop offset=".53" stopColor="#97afa8" stopOpacity="0"/></linearGradient>
      <radialGradient id={`${prefix}-warm`}><stop stopColor="#b87939" stopOpacity=".21"/><stop offset="1" stopColor="#bf883e" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${prefix}-cool`}><stop stopColor="#438997" stopOpacity=".22"/><stop offset="1" stopColor="#326c78" stopOpacity="0"/></radialGradient>
      <pattern id={`${prefix}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse"><path d="M-1 1l7 7M3-1l3 3" stroke="#d1b782" strokeWidth=".45" opacity=".14"/></pattern>
      <pattern id={`${prefix}-scan`} width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 1.5h3" stroke="#001015" strokeWidth=".7" opacity=".45"/></pattern>
      <clipPath id={`${prefix}-pong`}><rect x="104" y="62" width="78" height="58" rx="7"/></clipPath>
      <clipPath id={`${prefix}-vcs`}><rect x="79" y="41" width="118" height="81" rx="14"/></clipPath>
      <clipPath id={`${prefix}-cd`}><rect x="98" y="32" width="138" height="84" rx="7"/></clipPath>
      <clipPath id={`${prefix}-desktop`}><rect x="59" y="32" width="190" height="117" rx="3"/></clipPath>
      <clipPath id={`${prefix}-catalog`}><rect x="43" y="29" width="234" height="124" rx="2"/></clipPath>
      <clipPath id={`${prefix}-stream`}><path d="M187 128l101 11v58l-101-12Z"/></clipPath>
    </defs>
    <ellipse cx="161" cy="118" rx="146" ry="107" fill={paint(kind === "coin" || kind === "cartridge" ? "warm" : "cool")}/>
    <g fill="none" stroke="#9b8b67" strokeWidth=".7" opacity=".17"><path d="M18 194h284M28 209h264M60 220h200M160 173l-77 48M160 173l82 48"/><path d="M20 30V20h15m265 10V20h-15"/></g>
    <ellipse cx="163" cy="206" rx="115" ry="13" fill="#050c10" opacity=".8"/>
    {scene === "coin" ? <g strokeLinejoin="round">
      <path d="M76 19l115-4 47 23v158l-41 21-117-17v-65l17-28-12-77Z" fill={paint("wood")} stroke="#b89762" strokeWidth="1.2"/>
      <path d="M191 15l47 23v158l-41 21v-72l15-31-18-86Z" fill="#302a23" stroke="#726143"/>
      <path d="M200 35l29 12v139l-26 13V149l14-33Z" fill={paint("hatch")}/>
      <path d="M76 19l115-4 47 23-44-8-115 4Z" fill="#1b2325" stroke="#847c62"/>
      <path d="M85 34l103-3 17 82-15 33-105-11 18-25Z" fill={paint("yellow")} stroke="#ebcc6d"/>
      <path d="M87 34l16 76-17 25M188 33l15 79-15 30" stroke="#e4c561" fill="none"/>
      <text x="124" y="50" fontFamily="monospace" fontSize="12" fontWeight="700" letterSpacing="2" fill="#22251c">{kind === "coin-modern" ? "PLAY" : "PONG"}</text>
      <rect x="99" y="57" width="89" height="68" rx="9" fill="#0c171a" stroke="#766d40" strokeWidth="2"/>
      <rect x="104" y="62" width="78" height="58" rx="7" fill="#061214"/>
      <g clipPath={paint("pong")}>
        <path d="M143 63v56" stroke="#bac8a6" strokeDasharray="3 3" strokeWidth="1"/>
        <path d="M132 67h-6v8h6v-8m24 0h-6v8h6v-8" fill="none" stroke="#cfd4b3" strokeWidth="1.5"/>
        <rect x="110" y="78" width="3" height="13" fill="#e6e5c5" className={animated(s.pongLeft)}/>
        <rect x="173" y="91" width="3" height="13" fill="#e6e5c5" className={animated(s.pongRight)}/>
        <rect x="116" y="87" width="3" height="3" fill="#fff4c8" className={animated(s.pongBall)}/>
        <rect x="104" y="62" width="78" height="58" fill={paint("scan")}/><rect x="104" y="62" width="78" height="58" fill={paint("reflection")}/>
      </g>
      <path d="M104 124l84 6-8 12-83-8Z" fill={paint("metal")} stroke="#ded0a6" strokeWidth=".6"/>
      <g transform="translate(112 130)"><ellipse cy="2" rx="5" ry="3" fill="#101e21"/><ellipse rx="4" ry="2.4" fill="#d0c8b0"/><path d="M0-2v3" stroke="#474c43"/></g>
      <g transform="translate(173 135)"><ellipse cy="2" rx="5" ry="3" fill="#101e21"/><ellipse rx="4" ry="2.4" fill="#d0c8b0"/><path d="M0-2v3" stroke="#474c43"/></g>
      <path d="M84 145l106 11v48l-106-13Z" fill={paint("wood")} stroke="#79583a"/>
      <g transform="matrix(1 .11 0 1 85 147)"><WoodGrain x={0} y={0} w={103} h={42} vertical/></g>
      <path d="M169 157l15 2v29l-15-2Z" fill={paint("metal")} stroke="#c2ae82" strokeWidth=".6"/><path d="M173 165l7 1m-7 13l7 1" stroke="#152023" strokeWidth="2"/>
      <Screw x={176} y={184} r={1}/>{kind === "coin-modern" ? <g><rect x="166" y="158" width="20" height="26" rx="2" fill="#15373b" stroke="#b3cbb4"/><path d="M171 168q8-7 11 0m-9 3q5-4 7 0m-5 3h2" fill="none" stroke="#b9dcac" strokeWidth="1.5" className={animated(s.statusLight)}/></g> : null}<path d="M85 179l70 8" stroke="#bf8b56" strokeWidth=".6"/>
      <ellipse cx="59" cy="205" rx="11" ry="3" fill="#bd954d" stroke="#e9c476"/><ellipse cx="59" cy="202" rx="11" ry="3" fill="#bb9953" stroke="#e9c476"/>
      <ellipse cx="44" cy="213" rx="10" ry="3" fill="#ba8c43" stroke="#e9c476"/>
      <path d="M240 190c21 7 17 22 37 20" fill="none" stroke="#807a60" strokeWidth="1.5"/>
    </g> : null}
    {scene === "cartridge" ? <g strokeLinejoin="round">
      <path d="M139 28l-36-23m36 23l40-22" stroke="#b8bdad" strokeWidth="1.3"/><circle cx="139" cy="29" r="5" fill={paint("metal")}/>
      <path d="M61 29l174-4 24 19-2 99-178 9-20-17Z" fill={paint("wood")} stroke="#bc9665"/>
      <path d="M235 25l24 19-2 99-22 7Z" fill="#332f28"/>
      <WoodGrain x={68} y={132} w={160} h={11}/>
      <rect x="70" y="34" width="139" height="96" rx="15" fill="#a39978" stroke="#e0c699"/>
      <rect x="77" y="39" width="123" height="85" rx="13" fill="#0b171b" stroke="#4f6055" strokeWidth="2"/>
      <g clipPath={paint("vcs")}>
        <rect x="79" y="41" width="118" height="81" fill="#1c2927"/>
        <path d="M86 53h21v22H90v11h18v27m78-60h-22v22h16v13h-21v22M129 49v16h16v-9m-22 42h23v16" fill="none" stroke="#69764c" strokeWidth="5"/>
        <g className={animated(s.pixelTank)} fill="#dab658"><path d="M110 75h14v13h-14Z"/><path d="M115 72h4v17h-4Zm9 9h9v3h-9Z"/></g>
        <g fill="#93babb"><path d="M166 94h13v13h-13Z"/><path d="M170 90h4v21h-4Zm-10 9h7v3h-7Z"/></g>
        <rect x="132" y="82" width="4" height="2" fill="#ffeeb4" className={animated(s.pixelShot)}/>
        <path d="M159 79l-5-4m9 4v-7m4 8l5-4m-4 8h7m-7 3l5 5" stroke="#e6bd65" className={animated(s.pixelBurst)}/>
        <rect x="79" y="41" width="118" height="81" fill={paint("scan")}/><rect x="79" y="41" width="118" height="81" fill={paint("reflection")}/>
      </g>
      {[54,79].map(y=><g key={y}><circle cx="224" cy={y} r="8" fill="#151f22" stroke="#bfb48f"/><circle cx="224" cy={y} r="5.5" fill={paint("metal")}/><path d={`M224 ${y-5}v5`} stroke="#202d30"/></g>)}
      <path d="M215 97h17m-17 4h17m-17 4h17m-17 4h17m-17 4h17m-17 4h17" stroke="#151e1e" strokeWidth="2"/>
      <path d="M61 157l128-4 27 25-7 24-154 2-8-21Z" fill={paint("black")} stroke="#a89e7c"/>
      <path d="M60 155l129-4 9 15-143 7Z" fill="#232d2c" stroke="#9d845b"/>
      {[66,80,94,155,169,183].map(x=><g key={x}><ellipse cx={x} cy="163" rx="4" ry="2" fill="#050f14"/><path d={`M${x} 162l-2-8`} stroke="#c8c7b4" strokeWidth="2.5"/></g>)}
      <path d="M111 156h31v12h-31Z" fill="#081418" stroke="#b69b65"/>
      <path d="M114 144h26v20h-26Z" fill="#2b3b3b" stroke="#b4aa87"/><path d="M117 146h20v9h-20Z" fill="#a87b48"/><path d="M124 148l4 5 4-5" fill="none" stroke="#e1bd74"/>
      <path d="M60 176l137-5m-137 9l142-5m-142 9l145-5m-145 9l149-5" stroke="#72817a" strokeWidth=".8"/>
      <path d="M56 190l153-3-3 13-146 2Z" fill={paint("wood")} stroke="#bc996b"/><WoodGrain x={65} y={192} w={134} h={8}/>
      <path d="M201 159c24-6 56 15 47 29" fill="none" stroke="#8f9077" strokeWidth="1.5"/>
      <path d="M225 181l39-4 17 14-40 9-20-9Z" fill="#18252a" stroke="#a29879"/><path d="M221 191l20 9 40-9v8l-40 9-20-10Z" fill="#111b21"/>
      <ellipse cx="251" cy="188" rx="8" ry="4" fill="#3b4540"/><path d="M251 189v-20" stroke="#273436" strokeWidth="6"/><ellipse cx="251" cy="166" rx="5" ry="3.5" fill="#758377" stroke="#bac0a6"/><ellipse cx="233" cy="188" rx="4" ry="2.5" fill="#c17942"/>
    </g> : null}
    {scene === "platform" ? <g strokeLinejoin="round">
      <path d="M85 20h162l22 14v99l-16 10H83Z" fill={paint("plastic")} stroke="#b4bb9f"/><path d="M247 20l22 14v99l-16 10Z" fill="#27393d"/>
      <rect x="92" y="27" width="151" height="96" rx="9" fill="#182d33" stroke="#adad8c"/>
      <g clipPath={paint("cd")}>
        <rect x="98" y="32" width="138" height="84" fill={paint("glass")}/>
        <path d="M98 84l23-32 17 14 19-19 17 24 22-16 40 32v28H98Z" fill="#657668"/>
        <path d="M121 52l8 34 9-20m19-19l5 42 12-18m22-16l11 42" fill="#9da284" opacity=".5"/>
        <path d="M157 77h17l51 39h-119Z" fill="#2f4244" stroke="#acb897"/>
        <path d="M163 81l-8 15m11-9l-2 21m8-25l9 26" stroke="#e7c977" strokeWidth="2" className={animated(s.roadLines)}/>
        <g className={animated(s.polygonCar)}><path d="M146 98l9-8h23l10 10-3 12h-38Z" fill="#b17550" stroke="#d2ae71"/><path d="M156 91h21l5 8h-32Z" fill="#142b34"/><path d="M149 107h9m16 0h10" stroke="#e7c492" strokeWidth="2"/></g>
        <path d="M108 42h23m82 0h14" stroke="#d6c79b" strokeWidth="3"/><rect x="98" y="32" width="138" height="84" fill={paint("scan")}/><rect x="98" y="32" width="138" height="84" fill={paint("reflection")}/>
      </g>
      <path d="M116 130h104" stroke="#344647" strokeWidth="3"/><circle cx="233" cy="130" r="2" fill="#adc57e"/>
      <g transform="translate(29 112) rotate(-8)"><path d="M0 0h40v71H0Z" fill="#22313b" stroke="#b8bda6"/><path d="M4 4h32v55H4Z" fill="#634b40"/><path d="M7 54l10-32 15 32" fill="#c3a776"/><circle cx="24" cy="15" r="7" fill="#cbad79"/><path d="M6 63h25" stroke="#d8c59c"/></g>
      <path d="M90 151l122-7 31 32-12 28-156 3-6-24Z" fill={paint("plastic")} stroke="#bac1aa"/>
      <path d="M69 183l164-4-2 25-156 3Z" fill="#495c5d" stroke="#9faa96"/>
      <ellipse cx="153" cy="167" rx="39" ry="19" fill="#747e72" stroke="#c6c3a6"/><ellipse cx="153" cy="167" rx="35" ry="16" fill="none" stroke="#354b4e"/>
      <path d="M118 168q37 29 70 1" fill="none" stroke="#a1aaa0" strokeWidth=".7"/>
      <ellipse cx="94" cy="168" rx="8" ry="4" fill="#90a79b" stroke="#c4c6ac"/><ellipse cx="208" cy="163" rx="8" ry="4" fill="#8a9d96" stroke="#c4c6ac"/>
      <path d="M87 185h24v7H87Zm58-1h24v7h-24Z" fill="#112830" stroke="#8ba59b"/>
      <path d="M93 188h13m46-1h12" stroke="#b9b79b"/>
      <path d="M94 191c-34 15-12 27 27 26s47 4 58-6" fill="none" stroke="#a1afa1" strokeWidth="1.7"/>
      <g transform="translate(186 189) scale(.75)"><path d="M0 0q4-9 16-7l14 5 15-5q13-2 17 7l10 20q2 14-9 14l-17-15H25L7 35q-11 0-8-14Z" fill={paint("plastic")} stroke="#c2c5ad"/><path d="M12 0v17M4 8h17" stroke="#233b43" strokeWidth="5"/><g fill="#293b42" stroke="#9ca28b"><circle cx="49" cy="1" r="3"/><circle cx="57" cy="9" r="3"/><circle cx="41" cy="9" r="3"/><circle cx="49" cy="17" r="3"/></g><circle cx="27" cy="22" r="6" fill="#273c42"/><circle cx="43" cy="22" r="6" fill="#273c42"/></g>
    </g> : null}
    {scene === "online" ? <g strokeLinejoin="round">
      <path d="M43 18h212l17 16v128l-21 12H41Z" fill={paint("plastic")} stroke="#adbaa6"/><path d="M255 18l17 16v128l-21 12Z" fill="#394a49"/>
      <rect x="51" y="25" width="207" height="132" rx="6" fill="#0d2127" stroke="#bbb99a"/>
      <g clipPath={paint("desktop")}>
        {kind === "online" ? <>
          <rect x="59" y="32" width="190" height="117" fill="#454f3d"/>
          <path d="M60 33h188v33H60Z" fill="#59664b"/>
          <text x="98" y="56" fontFamily="Arial" fontWeight="700" fontSize="23" fill="#eef0d8" letterSpacing="1">STEAM</text>
          <path d="M224 42h7m5-3l6 6m-6 0l6-6" stroke="#c5cbb3"/>
          <text x="67" y="76" fontFamily="Arial" fontSize="8" fill="#e0e3ca">STORE</text>
          <path d="M103 67h61v14h-61Z" fill="#6e7959" stroke="#9ca587" strokeWidth=".6"/>
          <text x="109" y="77" fontFamily="Arial" fontSize="8" fill="#f0eed4">MY GAMES</text>
          <text x="177" y="76" fontFamily="Arial" fontSize="8" fill="#d1d6bc">SETTINGS</text>
          <path d="M65 83h178v46H65Z" fill="#30392d" stroke="#798468" strokeWidth=".6"/>
          <path d="M66 86h176v17H66Z" fill="#61734e"/>
          <circle cx="75" cy="94" r="5" fill="#b99456"/><text x="85" y="97" fontFamily="Arial" fontSize="9" fill="#ebe6c9">Half-Life</text>
          <text x="172" y="97" fontFamily="Arial" fontSize="6" fill="#d3dec0">Updating…</text>
          <circle cx="75" cy="113" r="5" fill="#a6b28b"/><text x="85" y="116" fontFamily="Arial" fontSize="9" fill="#d6dfbd">Counter-Strike</text>
          <rect x="69" y="136" width="122" height="5" fill="#253122"/><rect x="69" y="136" width="116" height="5" fill="#b0bd86" className={animated(s.download)}/>
          <text x="201" y="141" fontFamily="Arial" fontSize="6" fill="#bec8aa">ONLINE</text>
          <path d="M169 104v13l4-4 5 6 3-2-5-6 5-1Z" fill="#dfdac3" stroke="#102029" strokeWidth=".6" className={animated(s.pointer)}/>
        </> : kind === "pc-box" ? <>
          <rect x="59" y="32" width="190" height="117" fill="#122d35"/>
          <circle cx="202" cy="61" r="17" fill="#d9c695"/>
          <path d="M59 123l29-37 27 15 35-43 21 29 24-10 54 59v13H59Z" fill="#537674"/>
          <path d="M90 89l18 53 42-84 8 82" fill="#8ea38b"/>
          <path d="M141 130V92h10V81h9v11h11v38m-27-19h24" fill="#142b30" stroke="#adab7b"/>
          <path d="M65 142h56m83 0h35" stroke="#c6b574" strokeWidth="3" className={animated(s.playLight)}/>
          <text x="89" y="49" fontFamily="Georgia" fontSize="11" fill="#ecdbb2" letterSpacing="1">IRON CITADEL</text>
        </> : <>
          <rect x="59" y="32" width="190" height="117" fill="#133448"/>
          <path d="M59 32h190v31H59Z" fill="#195078"/>
          <path d="M68 43h12v13H68Zm3 0v-3a3 3 0 016 0v3" fill="none" stroke="#d3e5df" strokeWidth="1.5"/>
          <text x="86" y="52" fontFamily="Arial" fontSize="13" fill="#e0e9df">PlayStation Store</text>
          {[0,1,2].map(i=><g key={i} transform={`translate(${68+i*59} 71)`}>
            <rect width="52" height="56" fill={["#887349","#3e6476","#8a4b42"][i]} stroke="#7798a0"/>
            <circle cx="32" cy="18" r="10" fill="#d4c196"/><path d="M3 50l12-24 10 13 10-20 14 31" fill="#162e3a"/>
            <path d="M7 47h36" stroke="#d5c59c"/><rect y="61" width="52" height="11" fill="#316289"/><text x="16" y="69" fontFamily="Arial" fontSize="7" fill="#e1e8d5">BUY</text>
          </g>)}
          <rect x="68" y="71" width="52" height="56" fill="none" stroke="#c4d8a6" strokeWidth="2" className={animated(s.playLight)}/>
        </>}
        <rect x="59" y="32" width="190" height="117" fill={paint("reflection")}/>
        {kind === "online" && steamSrc ? <image href={steamSrc} x="68" y="36" width="24" height="24" preserveAspectRatio="xMidYMid meet"/> : null}
      </g>
      <path d="M123 174v11l-21 13h99l-19-14v-10" fill={paint("plastic")} stroke="#94a899"/>
      <circle cx="239" cy="163" r="2" fill="#afc18e"/>
      <path d="M53 201h157l18 18H37Z" fill={paint("plastic")} stroke="#b2b9a2"/><path d="M55 207h152m-145 5h148" stroke="#263c41" strokeWidth="3"/>
      <path d="M78 203v13m13-13v13m13-13v13m13-13v13m13-13v13m13-13v13m13-13v13m13-13v13m13-13v13" stroke="#6c8079"/>
      {kind === "pc-box" ? <g transform="translate(8 99) rotate(-6)">
        <path d="M0 3l8-5h55v103l-8 5H0Z" fill="#8b7250" stroke="#c5ac77"/><path d="M0 3h54v103H0Z" fill="#233a3e"/>
        <path d="M8 12h39v78H8Z" fill="#657b70"/><circle cx="34" cy="29" r="10" fill="#d6c699"/>
        <path d="M9 84l12-48 8 21 18-29v56Z" fill="#19333c"/><text x="11" y="23" fontFamily="Georgia" fontSize="8" fill="#eee0b9">CITADEL</text>
        <path d="M7 95h40" stroke="#bea97d"/><path d="M70 78h34v30H70Z" fill="#2b3739" stroke="#bcb69c"/><path d="M76 79h20v11H76Zm0 20h23v9H76Z" fill="#aeb197"/>
      </g> : null}
      <path d="M263 189c-12-9-22-3-19 5" fill="none" stroke="#8eab9c"/><ellipse cx="250" cy="205" rx="12" ry="17" fill={paint("plastic")} stroke="#b5bba4"/><path d="M250 189v12m-10-1h20" stroke="#405957"/>
    </g> : null}
    {scene === "catalog" ? <g strokeLinejoin="round">
      <path d="M31 45l242-8 15 140-251 9Z" fill="#162a2b" stroke="#5d7d70"/>
      <path d="M42 32l231 7-4 135-236-5Z" fill="#29443b" stroke="#97a27b"/>
      <text x="50" y="25" fontFamily="Arial" fontSize="14" letterSpacing="2" fill="#c3d3ad">THE GAME COLLECTION</text>
      {[0,1,2].map(i=><g key={i} transform={`translate(${35+i*85} 52)`}>
        <g className={animated(`${s.coverLift} ${i===1?s.coverSecond:i===2?s.coverThird:""}`)}>
          <rect x="3" y="5" width="76" height="124" rx="2" fill="#071419" opacity=".8"/>
          <rect width="76" height="120" rx="2" fill={["#765343","#274a59","#665a38"][i]} stroke="#b9ab7e" strokeWidth="1"/>
          {i===0 ? <>
            <circle cx="52" cy="24" r="17" fill="#d1b47b"/><path d="M0 77l14-40 9 23 17-41 17 35 19-18v71H0Z" fill="#403f3c"/>
            <path d="M9 96V54h8v-9h8v9h10v-9h8v9h13v-9h8v9h6v42Z" fill="#172e32" stroke="#b59968" strokeWidth=".7"/>
            <path d="M30 96V75a7 7 0 0114 0v21" fill="#bc8750"/><path d="M12 63h54m-54 10h13m22 0h19m-54 11h13m22 0h19" stroke="#5a6858"/>
            <path d="M36 79v13" stroke="#ead394" className={animated(s.playLight)}/>
            <text x="38" y="108" textAnchor="middle" fontFamily="Georgia" fontSize="10" fill="#ead4a3">ASHEN KEEP</text>
          </> : i===1 ? <>
            <circle cx="50" cy="28" r="22" fill="#9ba995"/><circle cx="56" cy="25" r="18" fill="#5c8180"/>
            <path d="M4 89V32l13-9v49l11-8V45l14-11v37l12-8V46l17-11v65H4Z" fill="#122e3b" stroke="#8cb4af" strokeWidth=".8"/>
            <path d="M14 40v15m20-5v10m26-10v12m-46 1v10" stroke="#b9d8bc" strokeWidth="2"/>
            <path d="M33 90l5-24 8-1 8 25" fill="#b8a675"/><circle cx="42" cy="61" r="5" fill="#d9c699"/>
            <path d="M8 18h4m8-6h3m47 10h3" stroke="#e4dab6" className={animated(s.statusOther)}/>
            <text x="38" y="108" textAnchor="middle" fontFamily="Arial" fontSize="11" letterSpacing="1" fill="#d2e1ce">ORBITAL</text>
          </> : <>
            <circle cx="51" cy="28" r="18" fill="#c5a56f"/><path d="M0 64l15-34 19 19 16-26 26 37v36H0Z" fill="#3e5757"/>
            <path d="M33 57h12l30 41H0Z" fill="#172f36" stroke="#9eaa82"/><path d="M39 62v10m0 5v13" stroke="#d8c580" strokeWidth="2"/>
            <g className={animated(s.polygonCar)}><path d="M16 80l9-12h24l10 12-3 12H19Z" fill="#a96649" stroke="#d9b77b"/><path d="M27 71h20l4 8H23Z" fill="#193b47"/><path d="M22 85h7m17 0h7" stroke="#f2db9b" strokeWidth="2"/></g>
            <text x="38" y="108" textAnchor="middle" fontFamily="Arial" fontSize="10" letterSpacing="1" fill="#eddbb2">NIGHT RUN</text>
          </>}
          <path d="M4 4h68v112H4Z" fill={paint("reflection")}/>
        </g>
      </g>)}
      <path d="M40 181v8h240v-8m-120 8v8" fill="none" stroke="#9caf7f"/>
      <rect x="73" y="198" width="174" height="24" rx="3" fill="#304b36" stroke="#a7b485"/>
      <path d="M91 205a6 6 0 11-4 9m4-9h-5v-5" fill="none" stroke="#d4dfb4" strokeWidth="1.5"/>
      <text x="111" y="214" fontFamily="Arial" fontSize="10" letterSpacing="1" fill="#e4dfb7">ONE MEMBERSHIP</text>
      <path d="M35 179h76" stroke="#d5e3aa" strokeWidth="2" className={animated(s.catalogSelect)}/>
    </g> : null}
    {scene === "cloud" ? <g strokeLinejoin="round">
      <path d="M46 16h92l25 17v159l-22 17-96-13Z" fill={paint("black")} stroke="#73978f"/><path d="M138 16l25 17v159l-22 17Z" fill="#102129"/>
      <path d="M53 24h78v163H53Z" fill="#08161d" stroke="#63877f"/>
      {[0,1,2,3,4].map(i=><g key={i} transform={`translate(59 ${32+i*29})`}>
        <rect width="67" height="24" rx="2" fill={paint("black")} stroke="#597775" strokeWidth=".7"/>
        <path d="M7 5h29m-29 4h29m-29 4h29m-29 4h29" stroke="#93a49a" strokeWidth=".8" opacity=".6"/>
        <circle cx="49" cy="12" r="8" fill="#061219" stroke="#668c8c"/>
        <g transform="translate(49 12)"><g className={animated(s.fan)}><path d="M0-2c-9-12-11 6-2 4C-10 12 9 12 3 3c13 3 6-14-1-5Z" fill="#73938f"/><circle r="2.2" fill="#afbb9b"/></g></g>
        <circle cx="61" cy="7" r="1.6" fill="#b3d68b" className={animated(i%2?s.statusLight:s.statusOther)}/><circle cx="61" cy="15" r="1.2" fill="#b79b60"/>
      </g>)}
      <path d="M144 42l12 8m-12 7l12 8m-12 7l12 8m-12 7l12 8m-12 7l12 8m-12 7l12 8m-12 7l12 8m-12 7l12 8" stroke="#426669" strokeWidth="1"/>
      <path d="M70 200v14h97v-57h19" fill="none" stroke="#35565d" strokeWidth="5"/><path d="M70 200v14h97v-57h19" fill="none" stroke="#78b0a8" strokeWidth="1"/>
      <g className={animated(s.packet)}><rect x="68" y="198" width="4" height="4" fill="#c1efd3"/></g>
      <path d="M184 119l111 12v74l-111-14Z" fill={paint("black")} stroke="#b1c4b3"/>
      <g clipPath={paint("stream")}>
        <path d="M187 128l101 11v58l-101-12Z" fill={paint("glass")}/>
        <circle cx="262" cy="151" r="9" fill="#c7b981"/>
        <path d="M184 181l24-27 9 11 16-22 20 35 13-16 26 28v17H184Z" fill="#3c6668"/>
        <path d="M211 153l6 30 16-40 5 38" fill="#8ba597" opacity=".75"/>
        <g className={animated(s.streamCloud)}><path d="M181 148c14-8 23-2 34-4s17-3 28 6l-7 3-53-2Z" fill="#b4c7b0" opacity=".4"/></g>
        <path d="M230 184l5-17 7 2 2 18" fill="#cfac73"/>
        <path d="M191 132l89 10v7l-89-10Z" fill="#89c8bd" opacity=".13" className={animated(s.streamScan)}/>
      </g>
      {kind === "cloud-console" ? <>
        <path d="M221 198l-8 13m62-7l10 12" stroke="#87a89e" strokeWidth="3"/>
        <g transform="translate(176 187) scale(.6)"><path d="M0 0q4-8 15-6l12 4 15-4q12-1 16 9l8 20q1 11-8 11L43 20H22L6 34q-11 1-8-12Z" fill={paint("plastic")} stroke="#a4b8a0"/><path d="M12 0v17M4 8h17" stroke="#19343e" strokeWidth="4"/><circle cx="44" cy="5" r="3" fill="#254650"/><circle cx="53" cy="12" r="3" fill="#254650"/></g>
      </> : <><path d="M184 191l111 14-17 19-120-18Z" fill={paint("plastic")} stroke="#b3c3ac"/><path d="M185 198l96 11m-101-6l96 11" stroke="#233d44" strokeWidth="2"/><path d="M205 210l28 4-3 4-31-5Z" fill="#6d9690"/></>}

      {kind === "cloud-early" ? <text x="65" y="19" fontFamily="Arial" fontSize="10" fill="#d3b686">2010 · ONLIVE</text> : null}
      <path d="M186 77h87l12 13v14h-99Z" fill={paint("black")} stroke="#648e88"/><path d="M190 98h77m-77-5h77" stroke="#789f99" strokeWidth=".8"/><circle cx="276" cy="98" r="2" fill="#bad595" className={animated(s.statusLight)}/>
      <path d="M200 76l-8-34m68 34l7-34" stroke="#607c78" strokeWidth="3"/><path d="M231 69q-13-10-26 0m37-8q-24-18-46 0m37 15h-4" fill="none" stroke="#99c8b4" strokeWidth="1.5" className={animated(s.wifi)}/>
    </g> : null}
  </svg>;
}

export default memo(MilestoneObject);
