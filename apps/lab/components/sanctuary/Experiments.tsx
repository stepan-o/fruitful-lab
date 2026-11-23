"use client";
import { useState } from "react";
import { successProbability } from "@/lib/sanctuary/types";
import { Readout } from "./plates/Controls";
import s from "./exhibits.module.css";

export function ProbabilityLab() {
  const [chance, setChance] = useState(5);
  const [attempts, setAttempts] = useState(20);
  const probability = successProbability(chance, attempts);
  const y = (n: number) => 244 - successProbability(chance, n) * 204;
  const points = Array.from(
    { length: 101 },
    (_, n) => `${62 + n * 5.9},${y(n).toFixed(2)}`,
  ).join(" ");
  return (
    <section aria-label="Hypothetical loot probability model">
      <p className={s.instruction}>
        Independent attempts, fixed odds. Move the controls to see how an
        individual chance becomes a cumulative probability.
      </p>
      <div className={s.labControls}>
        <label>
          Chance per attempt <strong>{chance}%</strong>
          <input
            type="range"
            min="1"
            max="20"
            value={chance}
            onChange={(e) => setChance(Number(e.target.value))}
          />
        </label>
        <label>
          Number of attempts <strong>{attempts}</strong>
          <input
            type="range"
            min="1"
            max="100"
            value={attempts}
            onChange={(e) => setAttempts(Number(e.target.value))}
          />
        </label>
      </div>
      <div
        className={s.scopeFrame}
        tabIndex={0}
        aria-label="Probability chart; scroll sideways on a narrow screen"
      >
        <svg
          className={s.scope}
          viewBox="0 0 720 310"
          role="img"
          aria-label={`${(probability * 100).toFixed(1)} percent chance of at least one success in ${attempts} attempts at ${chance} percent per attempt`}
        >
          {[0, 25, 50, 75, 100].map((n) => (
            <g key={n}>
              <path
                d={`M62 ${244 - n * 2.04}H652`}
                stroke="#b89b5e"
                opacity=".16"
              />
              <text
                x="48"
                y={249 - n * 2.04}
                textAnchor="end"
                fill="#94a99f"
                fontSize="12"
              >
                {n}%
              </text>
            </g>
          ))}
          <path
            d={`M62 244L${points.replaceAll(" ", " L")}L652 244Z`}
            fill="#4d9189"
            opacity=".13"
          />
          <polyline
            points={points}
            fill="none"
            stroke="#87c0ad"
            strokeWidth="3"
          />
          <path
            d={`M${62 + attempts * 5.9} 244V${y(attempts)}`}
            stroke="#e8b16a"
            strokeDasharray="4 5"
          />
          <circle
            cx={62 + attempts * 5.9}
            cy={y(attempts)}
            r="6"
            fill="#f4d7a0"
            stroke="#18282a"
            strokeWidth="3"
          />
          {[0, 20, 40, 60, 80, 100].map((n) => (
            <text
              key={n}
              x={62 + n * 5.9}
              y="271"
              textAnchor="middle"
              fill="#a8b2a2"
              fontSize="12"
            >
              {n}
            </text>
          ))}
          <text x="62" y="20" fill="#c1bb9e" fontSize="12">
            CHANCE OF AT LEAST ONE SUCCESS
          </text>
          <text x="652" y="294" textAnchor="end" fill="#b69d71" fontSize="12">
            ATTEMPTS →
          </text>
        </svg>
      </div>
      <div
        className={s.oddsSplit}
        role="img"
        aria-label={`${(probability * 100).toFixed(1)} percent at least one success; ${((1 - probability) * 100).toFixed(1)} percent still no success`}
      >
        <i style={{ width: `${probability * 100}%` }} />
      </div>
      <div className={s.modelResults} aria-live="polite">
        <div>
          <strong>{(probability * 100).toFixed(1)}%</strong>
          <span>At least one success</span>
        </div>
        <div>
          <strong>{((1 - probability) * 100).toFixed(1)}%</strong>
          <span>Still no success</span>
        </div>
      </div>
      <Readout tag="MORE ATTEMPTS DO NOT CREATE A GUARANTEE">
        The curve rises because there are more opportunities. The next attempt
        still has a {chance}% chance.
      </Readout>
      <p className={s.footnote}>
        P(at least one) = 1 − (1 − p)ⁿ. Hypothetical, independent attempts; no
        pity rule, changing odds or real game drop rate is modeled.
      </p>
    </section>
  );
}
const packs = [
  { tokens: 500, cents: 699 },
  { tokens: 1000, cents: 1349 },
  { tokens: 2800, cents: 3399 },
];
const cad = (cents: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    currencyDisplay: "code",
  }).format(cents / 100);
export function PriceLab() {
  const [cost, setCost] = useState(2400);
  const [packIndex, setPackIndex] = useState(2);
  const pack = packs[packIndex],
    remainder = pack.tokens - cost;
  return (
    <section aria-label="Historical CAD currency pack illustration">
      <p className={s.instruction}>
        Trace one pack through the exchange. Historical CAD pack prices; a
        hypothetical item and zero starting balance.
      </p>
      <div className={s.labControls}>
        <label>
          Hypothetical item price{" "}
          <strong>{cost.toLocaleString("en-CA")} Platinum</strong>
          <input
            type="range"
            min="100"
            max="2800"
            step="100"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </label>
        <label>
          One pack purchase
          <select
            value={packIndex}
            onChange={(e) => setPackIndex(Number(e.target.value))}
          >
            {packs.map((p, i) => (
              <option key={p.tokens} value={i}>
                {p.tokens.toLocaleString("en-CA")} Platinum · {cad(p.cents)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={s.exchange}>
        <div className={s.cash}>
          <small>CASH ENTERS</small>
          <strong>{cad(pack.cents)}</strong>
          <span>one selected pack</span>
        </div>
        <div className={s.vials}>
          {[
            [pack.tokens, "Pack balance"],
            [cost, "Item needs"],
            [Math.abs(remainder), remainder >= 0 ? "Left over" : "Shortfall"],
          ].map(([n, label], i) => (
            <div key={label}>
              <div className={s.vial} data-short={i === 2 && remainder < 0}>
                <i style={{ height: `${(Number(n) / 2800) * 100}%` }} />
                <strong>{Number(n).toLocaleString("en-CA")}</strong>
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={s.modelResults} aria-live="polite">
        <div>
          <strong>{cad(pack.cents)}</strong>
          <span>Cash for selected pack</span>
        </div>
        <div>
          <strong>{Math.abs(remainder).toLocaleString("en-CA")} PT</strong>
          <span>
            {remainder >= 0 ? "Balance after item" : "Still needed for item"}
          </span>
        </div>
      </div>
      <Readout
        tag={
          remainder >= 0
            ? "PACK COVERS THE ITEM"
            : "THIS PACK DOES NOT COVER THE ITEM"
        }
      >
        {remainder >= 0
          ? `The item consumes ${cost.toLocaleString("en-CA")} Platinum. ${remainder.toLocaleString("en-CA")} stays inside the system.`
          : `The displayed cash amount buys this pack, but another ${(-remainder).toLocaleString("en-CA")} Platinum would still be needed.`}
      </Readout>
      <p className={s.footnote}>
        All three token columns use the same 0–2,800 scale. Zero starting
        balance. One pack only; this does not find the cheapest combination.
        Pack prices come from the owner’s historical CAD screenshot. Taxes and
        present-day prices are not estimated.
      </p>
    </section>
  );
}
