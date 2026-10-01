"use client";

import { useState } from "react";
import { successProbability } from "@/lib/sanctuary/types";
import styles from "./reader.module.css";

export function ProbabilityLab() {
  const [chance, setChance] = useState(5);
  const [attempts, setAttempts] = useState(20);
  const probability = successProbability(chance, attempts);
  return <section className={styles.lab} aria-label="Hypothetical loot probability model">
    <p className={styles.eyebrow}>Interactive model · hypothetical, independent attempts</p>
    <h2>How long can bad luck last?</h2>
    <div className={styles.controls}>
      <label>Chance per attempt <strong>{chance}%</strong><input type="range" min="1" max="20" value={chance} onChange={event => setChance(Number(event.target.value))} /></label>
      <label>Number of attempts <strong>{attempts}</strong><input type="range" min="1" max="100" value={attempts} onChange={event => setAttempts(Number(event.target.value))} /></label>
    </div>
    <div className={styles.probabilityBar} role="img" aria-label={`${(probability * 100).toFixed(1)} percent probability of at least one success`}><span style={{width:`${probability * 100}%`}} /></div>
    <div className={styles.results} aria-live="polite"><div><strong>{(probability * 100).toFixed(1)}%</strong><span>At least one success</span></div><div><strong>{((1 - probability) * 100).toFixed(1)}%</strong><span>Still no success</span></div></div>
    <p className={styles.small}>P(at least one) = 1 − (1 − p)ⁿ. The chance stays fixed; attempts are independent. No guarantee, changing odds or real game drop rate is modeled.</p>
  </section>;
}

const packs = [{tokens:500,cents:699},{tokens:1000,cents:1349},{tokens:2800,cents:3399}];
const cad = (cents:number) => new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD",currencyDisplay:"code"}).format(cents/100);
export function PriceLab() {
  const [cost,setCost] = useState(2400);
  const [packIndex,setPackIndex] = useState(2);
  const pack = packs[packIndex];
  const remainder = pack.tokens-cost;
  return <section className={styles.lab} aria-label="Historical CAD currency pack illustration">
    <p className={styles.eyebrow}>Interactive illustration · historical CAD prices</p>
    <h2>The item price is only one number.</h2>
    <div className={styles.controls}>
      <label>Hypothetical item price <strong>{cost.toLocaleString("en-CA")} Platinum</strong><input type="range" min="100" max="2800" step="100" value={cost} onChange={event=>setCost(Number(event.target.value))}/></label>
      <label>One pack purchase<select value={packIndex} onChange={event=>setPackIndex(Number(event.target.value))}>{packs.map((p,i)=><option key={p.tokens} value={i}>{p.tokens.toLocaleString("en-CA")} Platinum · {cad(p.cents)}</option>)}</select></label>
    </div>
    <div className={styles.results} aria-live="polite"><div><strong>{cad(pack.cents)}</strong><span>Cash for selected pack</span></div><div><strong>{Math.abs(remainder).toLocaleString("en-CA")} PT</strong><span>{remainder>=0?"Balance after item":"Still needed for item"}</span></div></div>
    <p className={styles.small}>Zero starting balance. One pack only; this does not find the cheapest combination. Pack prices come from the owner’s historical CAD screenshot. The item is hypothetical; taxes and present-day prices are not estimated.</p>
  </section>;
}
