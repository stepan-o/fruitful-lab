import { memo } from "react";
import { Screw, WoodGrain } from "./plates/ArcadeMaterials";
import s from "./business-history.module.css";

const animated = (name: string) => `${s.motion} ${name}`;

/** Purposeful period studies, not authentic captures or exact product replicas. */
function MilestoneObject({ kind, prefix }: { kind: string; prefix: string }) {
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
    {kind === "coin" ? <g strokeLinejoin="round">
      <path d="M76 19l115-4 47 23v158l-41 21-117-17v-65l17-28-12-77Z" fill={paint("wood")} stroke="#b89762" strokeWidth="1.2"/>
      <path d="M191 15l47 23v158l-41 21v-72l15-31-18-86Z" fill="#302a23" stroke="#726143"/>
      <path d="M200 35l29 12v139l-26 13V149l14-33Z" fill={paint("hatch")}/>
      <path d="M76 19l115-4 47 23-44-8-115 4Z" fill="#1b2325" stroke="#847c62"/>
      <path d="M85 34l103-3 17 82-15 33-105-11 18-25Z" fill={paint("yellow")} stroke="#ebcc6d"/>
      <path d="M87 34l16 76-17 25M188 33l15 79-15 30" stroke="#e4c561" fill="none"/>
      <text x="124" y="50" fontFamily="monospace" fontSize="12" fontWeight="700" letterSpacing="2" fill="#22251c">PONG</text>
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
      <Screw x={176} y={184} r={1}/><path d="M85 179l70 8" stroke="#bf8b56" strokeWidth=".6"/>
      <ellipse cx="59" cy="205" rx="11" ry="3" fill="#bd954d" stroke="#e9c476"/><ellipse cx="59" cy="202" rx="11" ry="3" fill="#bb9953" stroke="#e9c476"/>
      <ellipse cx="44" cy="213" rx="10" ry="3" fill="#ba8c43" stroke="#e9c476"/>
      <path d="M240 190c21 7 17 22 37 20" fill="none" stroke="#807a60" strokeWidth="1.5"/>
    </g> : null}
    {kind === "cartridge" ? <g strokeLinejoin="round">
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
    {kind === "platform" ? <g strokeLinejoin="round">
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
    {kind === "online" ? <g strokeLinejoin="round">
      <path d="M43 18h212l17 16v128l-21 12H41Z" fill={paint("plastic")} stroke="#adbaa6"/><path d="M255 18l17 16v128l-21 12Z" fill="#394a49"/>
      <rect x="51" y="25" width="207" height="132" rx="6" fill="#0d2127" stroke="#bbb99a"/>
      <g clipPath={paint("desktop")}>
        <rect x="59" y="32" width="190" height="117" fill="#314f56"/>
        <rect x="137" y="41" width="108" height="91" fill="#c2ba9e" stroke="#263d3d"/><path d="M137 41h108v15H137Z" fill="#854232"/><text x="146" y="52" fill="#ebd8b6" fontFamily="Arial" fontSize="8" fontWeight="700">WATCH INSTANTLY</text>
        <rect x="147" y="63" width="85" height="46" fill="#14252c"/><path d="M153 104l21-26 12 12 12-21 27 36Z" fill="#9d8360"/><circle cx="214" cy="75" r="6" fill="#cda668"/><path d="M185 81l12 7-12 7Z" fill="#ead1a4" className={animated(s.playLight)}/>
        <path d="M149 117h71m-71 5h49" stroke="#7c796c" strokeWidth="2"/>
        <rect x="64" y="51" width="104" height="87" fill="#394334" stroke="#97a182"/><path d="M65 52h102v13H65Z" fill="#647054"/>
        <text x="70" y="61" fontFamily="Arial" fontSize="7" fontWeight="700" fill="#e1ddc0">MY GAMES</text><path d="M152 57h5m5-2l4 4m-4 0l4-4" stroke="#c6ccb0"/>
        {[0,1,2].map(i=><g key={i}><rect x="71" y={72+i*16} width="11" height="11" fill={['#a68b55','#63848a','#a26b51'][i]}/><path d={`M87 ${76+i*16}h66m-66 4h40`} stroke="#a9b495" strokeWidth="1.5"/><circle cx="158" cy={77+i*16} r="2" fill="#9ab476" className={i===1?animated(s.statusLight):undefined}/></g>)}
        <rect x="72" y="124" width="82" height="5" fill="#1b2928"/><rect x="72" y="124" width="75" height="5" fill="#a5b989" className={animated(s.download)}/>
        <path d="M160 114v13l4-4 5 6 3-2-5-6 5-1Z" fill="#dfdac3" stroke="#102029" strokeWidth=".6" className={animated(s.pointer)}/>
        <rect x="59" y="32" width="190" height="117" fill={paint("reflection")}/>
      </g>
      <path d="M123 174v11l-21 13h99l-19-14v-10" fill={paint("plastic")} stroke="#94a899"/>
      <circle cx="239" cy="163" r="2" fill="#afc18e"/>
      <path d="M53 201h157l18 18H37Z" fill={paint("plastic")} stroke="#b2b9a2"/><path d="M55 207h152m-145 5h148" stroke="#263c41" strokeWidth="3"/>
      <path d="M78 203v13m13-13v13m13-13v13m13-13v13m13-13v13m13-13v13m13-13v13m13-13v13m13-13v13" stroke="#6c8079"/>
      <path d="M263 189c-12-9-22-3-19 5" fill="none" stroke="#8eab9c"/><ellipse cx="250" cy="205" rx="12" ry="17" fill={paint("plastic")} stroke="#b5bba4"/><path d="M250 189v12m-10-1h20" stroke="#405957"/>
    </g> : null}
    {kind === "catalog" ? <g strokeLinejoin="round">
      <path d="M66 155l-15 28m196-28l19 28" stroke="#718b87" strokeWidth="5"/>
      <rect x="36" y="22" width="247" height="139" rx="4" fill="#122129" stroke="#97b3a4" strokeWidth="1.2"/>
      <g clipPath={paint("catalog")}>
        <rect x="43" y="29" width="234" height="124" fill="#102932"/>
        <path d="M43 29h234v24H43Z" fill="#263e35"/><circle cx="58" cy="42" r="6" fill="#8da957"/><path d="M55 39l6 6m0-6l-6 6" stroke="#d5e0b4"/><text x="73" y="44" fontFamily="Arial" fontSize="8" letterSpacing="1" fill="#e2ddbd">GAME LIBRARY</text>
        {[0,1,2,3].map(i=><g key={i} transform={`translate(${52+i*58} 61)`}>
          <rect width="50" height="73" fill={['#4d615b','#3d535f','#674739','#575d36'][i]}/>
          {i===0?<><circle cx="29" cy="19" r="11" fill="#bcb181"/><path d="M0 70l12-40 8 9 10-22 20 45" fill="#182f31"/><path d="M26 62l8-18 6 18" fill="#d0b77f"/></>:i===1?<><path d="M0 65V28h8v-9h9v19h10V12h7v32h7V23h9v50Z" fill="#8da599"/><path d="M21 73l7-21h8l7 21" fill="#182c34"/></>:i===2?<><circle cx="27" cy="24" r="14" fill="#c8a275"/><path d="M7 73l7-29 20-6 11 35" fill="#192c32"/><path d="M18 42l6-17 11 18" fill="#576a68"/></>:<><path d="M0 66l17-24 9 7 18-27 6 45" fill="#9fa675"/><path d="M5 73l20-17 25 17" fill="#1d3437"/></>}
          <path d="M6 65h34m-34 4h22" stroke="#e0c8a0" strokeWidth="1.5"/>
        </g>)}
        <rect x="51" y="60" width="52" height="75" fill="none" stroke="#b8da88" strokeWidth="2" className={animated(s.catalogSelect)}/>
        <path d="M54 145h40m8 0h7m7 0h7" stroke="#9aaf98" strokeWidth="2"/>
        <rect x="43" y="29" width="234" height="124" fill={paint("reflection")}/>
      </g>
      <path d="M66 188l118-4 21 10-6 17-141 1v-15Z" fill={paint("plastic")} stroke="#b7c4ad"/><path d="M59 199l141-4-1 16-141 1Z" fill="#6f837d"/>
      <path d="M70 203h65" stroke="#142830" strokeWidth="3"/>
      {Array.from({length:16},(_,i)=><path key={i} d={`M${114+i*4} 190l7 4`} stroke="#31484b" strokeWidth=".7"/>)}
      <circle cx="184" cy="202" r="3" fill="#d3d9b6"/>
      <g transform="translate(219 184) scale(.8)"><path d="M0 0q4-8 15-6l12 4 15-4q12-1 16 9l8 20q1 11-8 11L43 20H22L6 34q-11 1-8-12Z" fill={paint("black")} stroke="#a4b8a0"/><circle cx="13" cy="6" r="6" fill="#81978c"/><circle cx="40" cy="17" r="6" fill="#81978c"/><path d="M21 12v12m-6-6h12" stroke="#a6b29b" strokeWidth="3"/><circle cx="47" cy="3" r="3" fill="#b6ba7b"/><circle cx="56" cy="10" r="3" fill="#8bbbac"/><circle cx="37" cy="3" r="2" fill="#8198ba"/></g>
    </g> : null}
    {kind === "cloud" ? <g strokeLinejoin="round">
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
      <path d="M184 191l111 14-17 19-120-18Z" fill={paint("plastic")} stroke="#b3c3ac"/><path d="M185 198l96 11m-101-6l96 11" stroke="#233d44" strokeWidth="2"/><path d="M205 210l28 4-3 4-31-5Z" fill="#6d9690"/>
      <path d="M186 77h87l12 13v14h-99Z" fill={paint("black")} stroke="#648e88"/><path d="M190 98h77m-77-5h77" stroke="#789f99" strokeWidth=".8"/><circle cx="276" cy="98" r="2" fill="#bad595" className={animated(s.statusLight)}/>
      <path d="M200 76l-8-34m68 34l7-34" stroke="#607c78" strokeWidth="3"/><path d="M231 69q-13-10-26 0m37-8q-24-18-46 0m37 15h-4" fill="none" stroke="#99c8b4" strokeWidth="1.5" className={animated(s.wifi)}/>
    </g> : null}
  </svg>;
}

export default memo(MilestoneObject);
