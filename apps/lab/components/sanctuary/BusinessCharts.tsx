"use client";
import {useState} from "react";
import {platformRows,platformTotals,platformSource,cloudModes,cloudRequirementSource,cloudMilestones} from "@/lib/sanctuary/industry-data";
import s from "./business-atlas.module.css";
const yen=(n:number)=>(n/1000).toLocaleString("en-US",{maximumFractionDigits:1,minimumFractionDigits:1});
export function PlatformRevenue(){
 const [share,setShare]=useState(false);const [selected,setSelected]=useState(3);
 const width=(value:number,year:number)=>share?value/platformTotals[year]*100:value/1500000*100;
 return <figure className={s.chart} aria-labelledby="platform-revenue-title">
  <figcaption><p className={s.kicker}>Sony · Game & Network Services</p><h2 id="platform-revenue-title">A console is one line<br/><em>in the business.</em></h2><p>Reported segment sales · FY24 and FY25</p></figcaption>
  <div className={s.chartControls} role="group" aria-label="Revenue chart units"><button type="button" aria-pressed={!share} onClick={()=>setShare(false)}>Billions of yen</button><button type="button" aria-pressed={share} onClick={()=>setShare(true)}>Share of segment</button></div>
  <div className={s.legend}><span><i/> FY24 · year to Mar 2025</span><span><i/> FY25 · year to Mar 2026</span></div>
  <div className={s.axis} aria-hidden="true"><span>0</span><span>{share?"50%":"¥750bn"}</span><span>{share?"100%":"¥1,500bn"}</span></div>
  <div className={s.bars}>{platformRows.map((row,i)=><button className={s.revenueRow} key={row.label} type="button" aria-pressed={selected===i} onClick={()=>setSelected(i)} aria-label={`${row.label}: FY24 ${share?`${(row.values[0]/platformTotals[0]*100).toFixed(1)} percent of segment`: `${yen(row.values[0])} billion yen`}; FY25 ${share?`${(row.values[1]/platformTotals[1]*100).toFixed(1)} percent of segment`:`${yen(row.values[1])} billion yen`}. Show category definition.`}><span className={s.barLabel}>{row.label}</span><span className={s.tracks}>{row.values.map((value,year)=><span className={s.track} key={year}><span className={s.bar} style={{width:`${width(value,year)}%`}}/><span className={s.barNumber}>{share?`${(value/platformTotals[year]*100).toFixed(1)}%`:yen(value)}</span></span>)}</span></button>)}</div>
  <div className={s.chartReadout} aria-live="polite"><strong>{platformRows[selected].label}</strong><p>{platformRows[selected].note}</p></div>
  <p className={s.footnote}>Select a row for its definition. FY25 segment total: ¥{yen(platformTotals[1])}bn. Accounts include intersegment sales and royalties as well as product and service sales; they are not gross player spending. Published rounding leaves a ¥1m difference between FY25 detail and total.</p>
  <p className={s.source}><a href={platformSource} target="_blank" rel="noreferrer">Source: Sony FY2025 Q4 supplement, p. 12 ↗</a> · Shares calculated from reported totals. This report does not isolate cloud revenue.</p>
 </figure>;
}
export function CloudFigures(){
 const [mode,setMode]=useState(1);const current=cloudModes[mode];
 return <section className={s.cloudFigures} aria-label="Cloud gaming in numbers">
  <figure className={s.chart} aria-labelledby="cloud-envelope-title"><figcaption><p className={s.kicker}>GeForce NOW · selected Windows streaming modes</p><h2 id="cloud-envelope-title">The constraint<br/><em>moves.</em></h2><p>Published bandwidth requirements · Mbps</p></figcaption>
   <div className={s.cloudAxis} aria-hidden="true"><span>0</span><span>25</span><span>50 Mbps</span></div>
   <div className={s.cloudBars} role="group" aria-label="Select a streaming mode">{cloudModes.map((item,i)=><button className={s.cloudRow} type="button" key={item.label} aria-pressed={mode===i} aria-label={`${item.label}, ${item.fps} frames per second, ${item.mbps} megabits per second`} onClick={()=>setMode(i)}><span>{item.label}<small>{item.fps} FPS</small></span><span className={s.cloudTrack}><i style={{width:`${item.mbps/50*100}%`}}/><b>{item.mbps}</b></span></button>)}</div>
   <div className={s.cloudReadout} aria-live="polite"><div><strong>{current.mbps}<small>Mbps</small></strong><p>{current.size}<br/>{current.fps} frames per second</p></div><div><strong>&lt;80<small>ms</small></strong><p>Required network latency<br/>to NVIDIA’s data center</p></div></div>
   <p className={s.footnote}>Bandwidth and delay are separate requirements. These are supported stream modes, not guaranteed game frame rates or measured data use. Total input-to-display delay also includes processing. Compatible devices and appropriate plans are required.</p><p className={s.source}><a href={cloudRequirementSource} target="_blank" rel="noreferrer">Source: NVIDIA system requirements ↗</a> · Checked 5 Oct 2026</p>
  </figure>
  <figure className={s.chart} aria-labelledby="cloud-reach-title"><figcaption><p className={s.kicker}>Historical reach · company-reported milestones</p><h2 id="cloud-reach-title">Millions found<br/><em>another way in.</em></h2><p>GeForce NOW members · reported lower bounds</p></figcaption>
   <div className={s.reachAxis} aria-hidden="true"><span>0</span><span>15m</span><span>30m</span></div>
   {cloudMilestones.map(item=><div className={s.reachRow} key={item.date}><span>{item.date}</span><div><i style={{width:`${item.value/30*100}%`}}/><strong>{item.label}</strong></div></div>)}
   <p className={s.footnote}>The open ends mean “more than.” These historical member counts include no published active/paying split here. They show reach, not subscription revenue, profitability or a measured increase in game sales. They are not a current user count.</p>
   <p className={s.source}>{cloudMilestones.map(item=><a key={item.date} href={item.url} target="_blank" rel="noreferrer">{item.date} disclosure ↗ </a>)}</p>
  </figure>
 </section>;
}
