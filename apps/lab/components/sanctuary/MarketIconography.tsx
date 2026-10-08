import {useId} from "react";
import type {ComputeId, MarketRole} from "@/lib/sanctuary/market-map";
import s from "./market-map.module.css";

/** Original engraved silhouettes, paired with persistent HTML names. */
export function ComputingGlyph({kind}:{kind:ComputeId}) {
 const cloud=kind==="gfn"||kind==="ps-cloud"||kind==="xbox-cloud";
 return <svg className={s.routeGlyph} viewBox="0 0 32 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  {kind==="pc"?<><path d="M2 5h19v14H2Zm7 14v4m-5 0h14M24 3h6v21h-6Z"/><path d="M5 8h13M27 6v2m-1 6h2m-2 4h2"/></>:null}
  {kind==="ps5"?<><path d="M11 2c3 8 2 15 0 23l7-2c2-9 2-14 0-20Zm9 0 5 2c-2 9-1 16 1 20l-6-1"/><path d="M13 25h15M16 16v5M2 19h7m-4-3v6"/></>:null}
  {kind==="xbox"?<><path d="m11 2 15 3v20l-15-3Zm0 0L5 5v19l6-2m0-20v20m3-15 9 2m-9 2 9 2m-6 4v4"/><circle cx="21" cy="19" r="1"/></>:null}
  {cloud?<><path d="M2 3h17v6H2Zm0 8h17v6H2Z"/><path d="M5 6h6m-6 8h6m4-8h1m-1 8h1M7 19v4h11"/><path d="m15 20 3 3-3 3"/>{kind==="gfn"?<><path d="M22 14h9v8h-9Zm4 8v3m-3 0h6"/><path d="m25 17 3 1-3 2Z" fill="currentColor" stroke="none"/></>:kind==="ps-cloud"?<><path d="M21 15h8l2 9-4-2h-4l-4 2Zm2 2h4v4h-4"/><path d="M20 19h2m6 0h2"/></>:<><path d="M23 16h4c2 0 4 6 3 8-1 1-3-2-4-2h-3c-1 0-3 3-4 2-1-2 1-8 4-8Z"/><path d="M21 19h3m-1-1v3m4-2h1"/></>}</>:null}
 </svg>;
}

function Controller({x=0,y=0}:{x?:number;y?:number}) {
 return <g transform={`translate(${x} ${y})`}><path d="M5 0h19c6 0 12 18 8 22-4 3-8-7-12-7h-9c-4 0-8 10-12 7C-5 18-1 0 5 0Z" fill="#aaa98f" stroke="#e0c58e"/><path d="M4 6h7M7.5 2.5v7" stroke="#19313a" strokeWidth="2"/><circle cx="24" cy="5" r="1.4" fill="#254f51"/><circle cx="27" cy="8" r="1.4" fill="#254f51"/><circle cx="13" cy="11" r="2.6" fill="#19313a"/><circle cx="21" cy="11" r="2.6" fill="#19313a"/></g>;
}

function Cover({variant=0}:{variant?:number}) {
 return <g>
  <path d="M0 0h34v43H0Z" fill={variant===1?"#395858":"#233e49"}/>
  <circle cx="25" cy="9" r="5" fill="#b9a278"/>
  {variant===0?<><path d="M0 40 8 18l6 9 7-15 13 28" fill="#13242c"/><path d="m17 43 6-25 2 25" fill="#a38c62"/><path d="m6 34 7-7m13 6 5 6" stroke="#65827a"/></>:variant===1?<><path d="M0 38V21h7v-7h6v10h4V9h6v16h6v-8h5v26H0Z" fill="#112b32"/><path d="M19 15v13M9 27v7m20-11v13" stroke="#afae7c"/><path d="M2 43 16 31l15 12" fill="#657b69"/></>:<><path d="M0 22 8 16l8 4 9-8 9 7v24H0Z" fill="#1c353d"/><path d="m5 43 13-20 10 20" fill="#b49b6d"/><path d="m18 26 1 5m1 4 1 6" stroke="#1c353d" strokeWidth="1.5"/></>}
 </g>;
}

function Storefront({accessId}:{accessId:string}) {
 const sony=accessId.startsWith("ps-");
 const xbox=["xbox-store","pc-pass","ultimate"].includes(accessId);
 const portrait=accessId==="epic"||sony;
 const name=accessId==="steam"?"STEAM":accessId==="battle"?"BATTLE.NET":accessId==="gog"?"GOG":accessId==="epic"?"EPIC GAMES":sony?(accessId==="ps-plus"?"PS PLUS":"PLAYSTATION"):xbox?(accessId==="xbox-store"?"XBOX":"GAME PASS"):"STORE";
 return <>
  <path d="M24 120 27 24l160-8 4 97Z" fill="#091a23" stroke="#c5aa74" strokeWidth="1.5"/>
  <g transform="matrix(1 -.05 0 1 33 29)">
   <path d="M0 0h147v82H0Z" fill={sony?"#26434d":xbox?"#263e34":"#183b48"}/>
   <path d="M0 0h147v16H0Z" fill="#0c242e"/>
   <circle cx="8" cy="8" r="3" fill="#c9b787"/>
   <text x="16" y="11" fill="#d6d5b9" fontSize="7" fontFamily="Arial,sans-serif" letterSpacing="1">{name}</text>
   <path d="M102 6h37v5h-37" fill="#486166"/><circle cx="107" cy="8" r="2" fill="none" stroke="#becab3" strokeWidth=".7"/>
   {portrait?<>
    {[0,1,2].map(i=><g key={i} transform={`translate(${10+i*44} 21)`}><Cover variant={i}/><path d="M0 48h28m-28 5h16" stroke="#9fb7a6" strokeWidth="1.5"/></g>)}
   </>:<>
    <g transform="translate(7 22) scale(2.55 .98)"><Cover variant={xbox?2:accessId==="battle"?0:1}/></g>
    <path d="M100 24h35m-35 6h30m-30 7h34m-34 6h23" stroke="#8bafa0" strokeWidth="2"/>
    <path d="M100 53h36v9h-36Z" fill="#809268"/><path d="M104 57h26" stroke="#e1d4a4"/>
    {[0,1,2].map(i=><g key={i}><path d={`M${7+i*45} 70h39v9h-39Z`} fill={i===0?"#5c7b70":"#385751"}/><path d={`M${11+i*45} 74h24`} stroke="#8aa396"/></g>)}
   </>}
   <g className={s.cursor}><path d="m109 48 1 15 4-5 5 3 2-3Z" fill="#eadab5" stroke="#18323a"/></g>
  </g>
  <path d="m94 118-1 13-21 9 67-3-22-9-1-11" fill="#304a49" stroke="#a89d73"/>
  <path d="M44 128 68 120m76 4 17-8" stroke="#597d71" opacity=".5"/>
 </>;
}

function Hardware({kind}:{kind:ComputeId}) {
 const cloud=kind==="gfn"||kind==="ps-cloud"||kind==="xbox-cloud";
 if(cloud)return <>
  <path d="M29 35 88 15l53 18-59 22Z" fill="#526758" stroke="#b9a476"/><path d="M29 35v91l53 20V55Zm53 20 59-22v90l-59 23Z" fill="#172e36" stroke="#a59a75"/>
  <path d="m88 59 47-17v72l-47 17Z" fill="#071b24" stroke="#5c7b70"/>
  {[0,1,2,3,4].map(i=><g key={i} transform={`translate(0 ${i*13})`}><path d="m92 64 39-14v9l-39 14Z" fill="#365249" stroke="#829781" strokeWidth=".6"/><path d="m95 66 22-8m-22 11 22-8" stroke="#101f28"/><circle className={s.activity} cx="125" cy="57" r="1.7" fill="#e0d795" style={{animationDelay:`${i*-.71}s`}}/></g>)}
  <path d="M38 48v72m8-69v72m8-69v72m8-69v72m8-69v72" stroke="#678779" strokeWidth="1.3"/>
  <path d="m41 40 35 13m-41-5 3 2m0 71-3-1" stroke="#c9b385"/>
  <path d="M144 45v44q0 8 8 8h12" fill="none" stroke="#7bbaac" strokeWidth="2"/><path d="m146 55 6 3-6 3" fill="#c6d1a2" className={s.activity}/>
  {kind==="ps-cloud"?<g transform="translate(123 100)"><path d="m0 0 55-7 8 29-15-6-29 3-15 8Z" fill="#adbba9" stroke="#dfcc9d"/><path d="m12 0 30-4 1 24-29 3Z" fill="#193945" stroke="#758f82"/><path d="m18 15 6-8 13 12-17 2Z" fill="#7f9e88"/><path d="M3 9h8M7 5v8m42-12 6 2m-3-5v9" stroke="#25484e" strokeWidth="2"/></g>:<g transform="translate(126 92)"><path d="m0 0 50-6 2 34-52 6Z" fill="#102731" stroke="#b5a679"/><path d="m4 4 41-5 1 24-42 5Z" fill="#3a6665"/><path d="m18 14 12 4-12 8Z" fill="#c7c598"/><path d="m0 35 53-6 16 8-55 8Z" fill="#58766c" stroke="#a7a47a"/><path d="m10 36 36-4 8 3-36 5Z" fill="#18373b"/></g>}
  <text x="106" y="31" textAnchor="middle" fill="#d4c69b" fontSize="7" fontFamily="Arial,sans-serif" transform="rotate(-18 106 31)">{kind==="gfn"?"NVIDIA":kind==="ps-cloud"?"SONY":"XBOX"}</text>
 </>;
 if(kind==="ps5")return <>
  <ellipse cx="110" cy="139" rx="41" ry="11" fill="#142a30" stroke="#a79c76"/>
  <path d="M96 24 121 17q17 53 6 116l-30 9Z" fill="#172d38" stroke="#729b9e"/>
  <path d="M86 16q19 11 19 25v96l-22 4q13-46 3-125Z" fill="#b8c0b1" stroke="#dfd2b0"/>
  <path d="M127 12 143 20q-8 48 6 114l-23 5q8-75 1-127Z" fill="#c7c8b4" stroke="#e3d8b6"/>
  <path d="M109 43v75" stroke="#83c6ce" strokeWidth="2" className={s.activity}/><path d="M133 105v21" stroke="#223540" strokeWidth="2"/>
  <Controller x={46} y={124}/>
 </>;
 if(kind==="xbox")return <>
  <path d="m77 28 46-14 34 16-46 15Z" fill="#446653" stroke="#b4a578"/><path d="M77 28v100l34 20V45Zm34 17 46-15v99l-46 19Z" fill="#142c30" stroke="#9b9c75"/>
  {[0,1,2,3].map(i=><g key={i}>{[0,1,2,3].map(j=><ellipse key={j} cx={89+i*9+j*5} cy={28-i*2+j*2.5} rx="2.3" ry="1.2" fill="#091b22"/>)}</g>)}
  <path d="M121 83v32m-39-77v84m6-80v84" stroke="#5f806e"/><circle cx="143" cy="49" r="3" fill="#c6d6a3" className={s.activity}/><path d="m142 119 5-2" stroke="#bcbb8f"/>
  <Controller x={43} y={126}/>
 </>;
 return <>
  <path d="m109 29 38-13 37 18-39 14Z" fill="#577366" stroke="#b2a175"/><path d="M109 29v98l36 19V48Zm36 19 39-14v97l-39 15Z" fill="#132c33" stroke="#a49a76"/>
  <path d="m114 40 25 13v75l-25-13Z" fill="#213f45" stroke="#577c72"/>
  <path d="m117 72 18 9v7l-18-9m0 9 18 9v7l-18-9" stroke="#ad9c70" strokeWidth="3"/><path d="m118 48 11 6v13l-11-5Z" fill="#547263" stroke="#80947b"/>
  {[65,96,125].map(y=><g key={y}><ellipse cx="164" cy={y} rx="13" ry="13.5" fill="#0a2029" stroke="#688f82"/><ellipse cx="164" cy={y} rx="9" ry="10" fill="none" stroke="#a3b98c" opacity=".7"/><path d={`m160 ${y-5} 8 10m-8 0 8-10`} stroke="#5b857b"/><circle className={s.activity} cx="164" cy={y} r="3" fill="#a7c6a2"/></g>)}
  <path d="m25 40 77-12v63L25 106Z" fill="#0b212c" stroke="#b8a67a"/><path d="m31 46 65-10v48l-65 13Z" fill="#33555c"/><path d="m33 89 20-19 12 6 18-23 12 28-62 14Z" fill="#172e3b"/><path d="m56 102 1 20-17 8 47-8-18-3v-17" fill="#46685d" stroke="#a9a47c"/><path d="m36 137 42-10 26 9-44 11Z" fill="#294d4b" stroke="#a7a17b"/><path d="m42 137 33-7m-26 11 34-7" stroke="#668779"/>
 </>;
}

export function RoleEngraving({role,computer,accessId}:{role:MarketRole|"player";computer:ComputeId;accessId:string}) {
 const id=useId().replace(/:/g,"");
 const consolePlay=["ps5","ps-cloud","xbox"].includes(computer);
 return <svg viewBox="0 0 210 176" aria-hidden="true" className={s.engraving}>
  <defs><linearGradient id={`${id}-floor`} x2="0.9" y2="1"><stop stopColor="#3b5550"/><stop offset="1" stopColor="#152b33"/></linearGradient></defs>
  <path d="m7 137 96-36 100 36-96 34Z" fill={`url(#${id}-floor)`} stroke="#8b9172"/>
  <path d="m7 137 100 34 96-34v5l-96 33-100-33Z" fill="#0b1e27" stroke="#a28c62" strokeWidth=".8"/>
  <path d="m17 137 86-31 89 31-85 29Z" fill="none" stroke="#708778" strokeWidth=".6"/>
  {[0,1,2,3].map(i=><path key={i} d={`m${26+i*21} ${130-i*7.5} 83 29M${29+i*22} ${145+i*7.5}l82-30`} stroke="#b8b187" strokeWidth=".5" opacity=".2"/>)}
  {role==="make"?<>
   <path d="M22 119V36l73-26 80 27v76l-78 32Z" fill="#142d34" stroke="#658878"/><path d="M96 11v92l-73 24m73-24 78 23" fill="none" stroke="#748b77"/>
   <g transform="matrix(1 -.36 0 1 30 42)"><path d="M0 0h56v58H0Z" fill="#204b50" stroke="#c3ad7b"/><g stroke="#5c807b" strokeWidth=".45">{[12,24,36,48].map(n=><path key={n} d={`M${n} 2v54M2 ${n}h52`}/>)}</g><path d="M7 10h21v16H7Zm26 5h15v26H33ZM7 33h19v16H7Zm21-15h5M17 26v7m9 8h7" fill="none" stroke="#c2cbb0"/><path d="M9 3h25" stroke="#bbaa77"/></g>
   <path d="m110 27 47 17v20l-47-17Z" fill="#293e3d" stroke="#797c61"/><path d="m116 35 10 4m-10 3 30 11m-17-14 22 8" stroke="#b7ae84"/>
   <path d="m43 111 75-28 58 21-75 30Z" fill="#81734f" stroke="#d2b780"/><path d="M45 113v30m128-37v28m-72 0v31" stroke="#89967b" strokeWidth="3"/>
   <path d="m91 50 54 19v38L91 87Z" fill="#0b212c" stroke="#bead7e"/><path d="m96 58 44 15v26L96 83Z" fill="#376363"/><path d="m103 63 26 9v20l-26-9Zm0 10 26 9m-13-14v20m-13-20 26 19" stroke="#a0c3ad" fill="none" strokeWidth=".7"/><path d="M117 97v12l-10 2 26 8-9-7V99" fill="#576f63" stroke="#9c9a77"/>
   <path d="m56 109 25-9 24 8-26 11Z" fill="#c1b78d"/><path d="m63 109 18-5 15 4-18 7Zm17-5-2 11" fill="none" stroke="#4e726b"/>
   <path d="m116 120 14-5 15 5-14 5Z" fill="#31524e" stroke="#a9a67d"/>
   <path d="M53 99V75l17-18" fill="none" stroke="#bba877" strokeWidth="3"/><circle cx="53" cy="75" r="3" fill="#516b5e" stroke="#cab886"/><path d="m64 56 10-3 7 9-19 7Z" fill="#6f8668" stroke="#d2b67c"/><path className={s.lamp} d="m65 68-17 40 39 2-10-45Z" fill="#efd094" opacity=".18"/>
  </>:null}
  {role==="publish"?<>
   <path d="m44 100 111-16 29 18-113 20Z" fill="#334b44" stroke="#b4a074"/><path d="M45 101v22l26 16 113-21v-16M71 122v17" fill="#172f35" stroke="#998f67"/>
   <g transform="matrix(1 -.15 0 1 39 37)"><path d="M0 0h83v54H0Z" fill="#d0c39a" stroke="#e1c995"/><path d="M0 0h83v12H0Z" fill="#47786f"/><path d="M9-4v10m18-10v10m29-10v10m18-10v10" stroke="#ddc68e" strokeWidth="3"/><path d="M9 23h65M9 35h65M9 47h65M26 16v34m19-34v34m19-34v34" stroke="#84917b"/><path d="m33 25 6 4 12-13" fill="none" stroke="#235950" strokeWidth="3"/><circle cx="65" cy="41" r="7" fill="none" stroke="#965c41" strokeWidth="1.5"/></g>
   <g transform="translate(103 70) rotate(-8)"><path d="M0 0h32v51H0Z" fill="#4c6f64" stroke="#cbbb8f"/><path d="M4 4h24v29H4Z" fill="#132e39"/><path d="m7 27 7-15 7 6 5-10v22Z" fill="#779581"/><path d="M5 39h23m-23 5h15" stroke="#c6be93"/><path d="M32 0 40 4v48l-8-1Z" fill="#223d40" stroke="#8f9674"/></g>
   <g transform="translate(145 61) rotate(11)"><path d="m0 5 24-13v31L0 14Z" fill="#a58b56" stroke="#e0c28a"/><ellipse cx="24" cy="7" rx="6" ry="15" fill="#193039" stroke="#b5a36d"/><path d="M0 6h-8v8H0m9 5v12h7V22" fill="#51786a" stroke="#bea976"/><g className={s.activity} stroke="#a8d2b6" fill="none"><path d="M35-2q6 9 0 18m6-25q10 15 0 30"/></g></g>
   <path d="m29 126 31-9 38 15-33 11Z" fill="#c7bd96" stroke="#e3c997"/><path d="m38 126 18-5 28 10-17 5m-19-10 27 10" stroke="#627d6c" fill="none"/>
   {[0,1,2].map(i=><g key={i} transform={`translate(0 ${-i*4})`}><path d="M124 140v4c0 6 28 6 28 0v-4" fill="#9c824a" stroke="#c9af70"/><ellipse cx="138" cy="140" rx="14" ry="4.5" fill="#bdab70" stroke="#e0c690"/></g>)}
  </>:null}
  {role==="access"?<Storefront accessId={accessId}/>:null}
  {role==="compute"?<Hardware kind={computer}/>:null}
  {role==="player"?<>
   <path d="M26 120V34l69-24 90 32v78l-80 28Z" fill="#152f37" stroke="#6f8d7b"/><path d="M95 11v93" stroke="#6c8977"/>
   <path d="m36 40 45-16v42L36 82Z" fill="#315661" stroke="#b7a77a"/><path d="M58 32v42m-21-15 43-16" stroke="#a4aa8a"/><path className={s.rain} d="m42 45-3 9m10 2-3 9m21-28-3 9m12-12-3 9m-9 8-3 9" stroke="#9cbcaf" strokeWidth="1"/>
   <path d="m62 101 68-24 48 19-68 27Z" fill="#7c7151" stroke="#c8b17b"/><path d="M64 103v35m45-15v38m66-64v40" stroke="#8e9d7e" strokeWidth="3"/>
   <path d="m108 41 58 21v39l-58-21Z" fill="#0b1d28" stroke="#c3ae7a"/><path d="m114 48 46 17v28l-46-17Z" fill="#315a60"/><path d="m116 72 9-10 11 12 10-6 12 18-42-15Z" fill="#122e3b"/><path className={s.screenFlare} d="m140 66 2 9 10 5-10-1-1 8-3-11-7-6 9 3Z" fill="#d5c17e"/>
   <path d="m133 89 1 17-9 1 29 11-10-10V94" fill="#4d6d60" stroke="#a8a17a"/>
   <path d="m108 119 17-6 13 5-16 6Z" fill="#214541" stroke="#939e7d"/><ellipse cx="148" cy="115" rx="4" ry="2.5" fill="#baaf85"/>
   <path d="m90 132 2 20m-9 4 9-4 15 7m-15-7-1 10m1-10 12-4" fill="none" stroke="#8c9277" strokeWidth="3"/><path d="m99 128 17 4 3 15 10 4m-22-18 5 17 11 4" fill="none" stroke="#56766b" strokeWidth="5" strokeLinecap="round"/>
   <path d="m95 92 10-4 11 15-5 22-20 1-7-22Z" fill="#7c8d75" stroke="#beb18a"/>
   <g className={s.hand}><path d={consolePlay?"m110 101 7 10 12 7":"m110 101 12 12 20 2"} fill="none" stroke="#b4a17e" strokeWidth="4" strokeLinecap="round"/>{consolePlay?<g transform="translate(122 113) scale(.55)"><Controller/></g>:<ellipse cx="145" cy="115" rx="4" ry="2.5" fill="#cbb68e"/>}</g>
   <path d="m74 102 6-15 18 5 10 32-8 14-27-11Z" fill="#19333d" stroke="#b2a379" strokeWidth="1.5"/><path d="m81 95 7-2 11 27-3 9-16-7Z" fill="#3e625b"/><path d="m76 104-2 18 8 4m14-24 8 17-1 13" fill="none" stroke="#bca36d" strokeWidth="2"/>
   <path d="M91 90v-8l11-3 4 6-2 11Z" fill="#baa582"/><path d="M90 83q-6-14 4-18 12-5 16 8l-4 13-12 3Z" fill="#283e42" stroke="#82917b"/><path d="M94 69q9-4 12 5" stroke="#9ba088" fill="none"/>
  </>:null}
 </svg>;
}
