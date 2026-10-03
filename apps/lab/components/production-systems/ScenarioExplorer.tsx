"use client";

import { useState } from "react";
import { scenarios } from "@/lib/production-systems/content";
import styles from "@/app/(stepanoskin)/stepanoskin/production-systems/profile.module.css";

export default function ScenarioExplorer() {
  const [selected, setSelected] = useState<string>(scenarios[0].id);
  const scenario = scenarios.find(item => item.id === selected) ?? scenarios[0];

  return <div className={styles.explorer}>
    <noscript><style>{"[data-production-scenarios] { display: none; }"}</style><p className={styles.scenarioDisclaimer}>An example from education.</p></noscript>
    <fieldset className={styles.scenarioChoices} data-production-scenarios>
      <legend>Explore an application</legend>
      <div>{scenarios.map(item => <label key={item.id}>
        <input type="radio" name="application" value={item.id} checked={item.id === selected} onChange={() => setSelected(item.id)} />
        <span>{item.label}</span>
      </label>)}</div>
    </fieldset>
    <div className={styles.scenarioBody} aria-live="polite" aria-atomic="true">
      <div className={styles.scenarioUnit}><span className={styles.smallLabel}>The production unit</span><h3>{scenario.unit}</h3><p>{scenario.description}</p></div>
      <dl className={styles.metricGrid}>
        <div><dt><span aria-hidden="true">↳</span> Local signals</dt><dd>{scenario.local}</dd></div>
        <div><dt><span aria-hidden="true">◎</span> Global objective</dt><dd>{scenario.global}</dd></div>
        <div><dt><span aria-hidden="true">⊣</span> Guardrails</dt><dd>{scenario.guardrail}</dd></div>
      </dl>
      <div className={styles.decision}><span className={styles.smallLabel}>An example decision</span><p>{scenario.decision}</p></div>
      <p className={styles.pitfall}><strong>Interpretation matters.</strong> {scenario.pitfall}</p>
    </div>
    <p className={styles.scenarioDisclaimer}>Illustrative applications of the method; not client results or descriptions of an employer’s systems.</p>
  </div>;
}
