"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownToLine, ArrowRight, ChartNoAxesCombined, Check, FileText, RefreshCw } from "lucide-react";
import { analyze, addDays, validateScenario, type Analysis } from "@/lib/tools/finance/engine";
import { torontoDate } from "@/lib/tools/finance/data";
import { DEFAULT_SCENARIO, METHOD_VERSION, SOURCE_URL, type RateSnapshot, type Scenario } from "@/lib/tools/finance/types";
import { useToolAnalytics } from "@/lib/hooks/useToolAnalytics";
import { trackFinance } from "@/lib/tools/finance/tracking";
import { RateChart } from "./RateChart";
import styles from "./finance.module.css";

const number = (n: number, digits = 0) => n.toLocaleString("en-CA", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const pesos = (n: number) => `${number(n)} MXN`;
const percent = (n: number) => `${n >= 0 ? "+" : ""}${number(n, 2)}%`;
const STORE = "fruitful_finance_plan_v1";

function StrategyTable({ a, blocked }: { a: Analysis; blocked: boolean }) {
  return <div className={styles.tableWrap}><table><caption>Net pesos after the assumed markup and fees</caption><thead><tr><th>Exchange plan</th><th>Lower scenario</th><th>No-change scenario</th><th>Upper scenario</th><th>Fees (CAD)</th></tr></thead><tbody>
    {a.strategies.filter(row => [0, .5, 1, a.selected.fraction].includes(row.fraction)).map(row => <tr key={row.fraction} data-selected={!blocked && row.fraction === a.selected.fraction}>
      <th scope="row">{row.fraction === 1 ? "All now" : row.fraction === 0 ? "All at deadline" : `${row.fraction * 100}% now / ${100 - row.fraction * 100}% later`}{!blocked && row.fraction === a.selected.fraction && <span className={styles.tableTag}>Suggested</span>}</th>
      {row.feasible ? <><td>{number(row.low)}</td><td>{number(row.middle)}</td><td>{number(row.high)}</td><td>{number(row.feeCad, 2)}</td></> : <td colSpan={4}>Transfer too small for the fee</td>}
    </tr>)}
  </tbody></table></div>;
}
function Audit({ a }: { a: Analysis }) {
  return <><div className={styles.auditGrid}><div><span>No-change model error</span><strong>{a.audit.baselineMae === null ? "Unavailable" : number(a.audit.baselineMae, 4)}</strong><small>MXN/CAD · mean absolute error</small></div><div><span>Trend model error</span><strong>{a.audit.trendMae === null ? "Unavailable" : number(a.audit.trendMae, 4)}</strong><small>MXN/CAD · lower is better</small></div><div><span>80% range: observed coverage</span><strong>{a.audit.coverage === null ? "Unavailable" : `${number(a.audit.coverage, 0)}%`}</strong><small>{a.audit.count} non-overlapping forecast windows</small></div></div><p className={styles.fine}>{a.audit.firstOrigin} to {a.audit.lastOrigin} forecast origins · {Math.max(1, a.modelHorizon)} observations ahead. Each prediction uses only earlier data. {a.audit.count < 12 ? "Too few windows to support the trend challenger at this horizon." : `Trend error improvement: ${percent(a.audit.skill)}. A 10% improvement is an exploratory gate, not proof of predictive skill.`} Coverage is a historical diagnostic, not a calibrated future probability.</p></>;
}
function Sources({ snapshot }: { snapshot: RateSnapshot }) {
  return <div className={styles.sources}><h3>Data you can trace</h3><p><a href={SOURCE_URL} target="_blank" rel="noreferrer">Bank of Canada · FXMXNCAD ↗</a> · {snapshot.observations.length} observations, {snapshot.observations[0].date} to {snapshot.observations[snapshot.observations.length - 1].date}. {snapshot.omitted} unavailable observations omitted; no forward filling.</p><p>Original units: CAD per MXN. Displayed units: MXN per CAD = 1 ÷ source rate. Rates are indicative daily averages, usually published by 16:30 Eastern on Bank business days. Inversion is a derived reference, not an executable quote.</p><p><a href="https://www.bankofcanada.ca/rates/exchange/background-information-on-foreign-exchange-rates/" target="_blank" rel="noreferrer">Publication and methodology</a> · <a href="https://www.bankofcanada.ca/terms/" target="_blank" rel="noreferrer">Source terms</a></p></div>;
}

const BudgetComparison = memo(function BudgetComparison({ snapshot, scenario, today, blocked }: { snapshot: RateSnapshot; scenario: Scenario; today: string; blocked: boolean }) {
  return <div className={styles.tableWrap}><table><caption>Budget sensitivity · suggested allocation and modeled net pesos</caption><thead><tr><th>Budget (CAD)</th><th>Exchange now (CAD)</th><th>Hold (CAD)</th><th>Lower scenario (MXN)</th><th>No change (MXN)</th></tr></thead><tbody>{[1000, 5000, 10000].map(amount => {
    if (scenario.fee >= amount) return <tr key={amount}><th>{number(amount)}</th><td colSpan={4}>Fee exceeds this budget</td></tr>;
    const result = analyze(snapshot, { ...scenario, amount }, today);
    return <tr key={amount}><th>{number(amount)}</th><td>{blocked ? "Paused" : number(amount * result.selected.fraction)}</td><td>{blocked ? "Paused" : number(amount * (1 - result.selected.fraction))}</td><td>{blocked ? "—" : number(result.selected.low)}</td><td>{blocked ? "—" : number(result.selected.middle)}</td></tr>;
  })}</tbody></table><p className={styles.fine}>With no fixed fee, the same percentage plan scales across all three amounts. A fixed fee can change the feasible allocation. These are separate scenarios, not three transfers to add together.</p></div>;
});
const ExtensionComparison = memo(function ExtensionComparison({ snapshot, scenario, today }: { snapshot: RateSnapshot; scenario: Scenario; today: string }) {
  const dates = [0, 30, 60, 90].map(days => addDays(scenario.deadline < today ? today : scenario.deadline, days)).filter(date => date <= addDays(today, 365));
  return <><div className={styles.tableWrap}><table><caption>All-wait comparison for the selected CAD {number(scenario.amount)} budget</caption><thead><tr><th>Exchange by</th><th>Lower (MXN)</th><th>No change (MXN)</th><th>Upper (MXN)</th><th>Trend evidence</th></tr></thead><tbody>{dates.map(deadline => {
    const result = analyze(snapshot, { ...scenario, deadline }, today);
    const wait = result.strategies[0];
    return <tr key={deadline}><th>{deadline}</th><td>{number(wait.low)}</td><td>{number(wait.middle)}</td><td>{number(wait.high)}</td><td>{result.trendSupported ? (result.challenger > result.middle ? "Positive, exploratory" : "Negative, exploratory") : `Not established (${result.audit.count} tests)`}</td></tr>;
  })}</tbody></table></div><p className={styles.fine}>Extra time widens the modeled range; the baseline does not promise more pesos. Extend only if the funds are genuinely flexible and you accept the additional downside. The trend check alone does not establish that waiting beyond January will pay off.</p></>;
});

export default function FinanceWorkspace({ initialSnapshot }: { initialSnapshot: RateSnapshot | null }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const initialToday = torontoDate(new Date(initialSnapshot?.checkedAt ?? new Date().toISOString()));
  const initialScenario = { ...DEFAULT_SCENARIO, deadline: initialToday > DEFAULT_SCENARIO.deadline ? addDays(initialToday, 30) : DEFAULT_SCENARIO.deadline };
  const [scenario, setScenario] = useState<Scenario>(initialScenario);
  const [draft, setDraft] = useState<Scenario>(initialScenario);
  const [view, setView] = useState<"dashboard" | "report">("dashboard");
  const [period, setPeriod] = useState(252);
  const [loading, setLoading] = useState(false);
  const [feedError, setFeedError] = useState("");
  const [inputError, setInputError] = useState("");
  const [message, setMessage] = useState("");
  const [today, setToday] = useState(() => torontoDate(new Date(initialSnapshot?.checkedAt ?? new Date().toISOString())));
  const lastRefresh = useRef(Date.now());
  const inFlight = useRef(false);
  const { trackToolStart } = useToolAnalytics({ toolName: "finance_exchange" });
  const analysis = useMemo(() => snapshot ? analyze(snapshot, scenario, today) : null, [snapshot, scenario, today]);
  const blocked = Boolean(feedError) || Boolean(analysis?.blocked);
  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true; setLoading(true);
    try {
      const response = await fetch("/api/tools/finance/rates", { cache: "no-store", signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error("feed");
      const next: RateSnapshot = await response.json();
      if (!Array.isArray(next.observations) || next.observations.length < 253) throw new Error("feed");
      setSnapshot(next); setToday(torontoDate()); setFeedError(""); lastRefresh.current = Date.now();
    } catch { setFeedError("The rate refresh failed. Any visible data is from the previous check; the decision is paused until a successful refresh."); }
    finally { inFlight.current = false; setLoading(false); }
  }, []);
  useEffect(() => {
    const check = () => { setToday(torontoDate()); if (!document.hidden && Date.now() - lastRefresh.current >= 3600000) void refresh(); };
    const timer = setInterval(check, 60000);
    document.addEventListener("visibilitychange", check);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", check); };
  }, [refresh]);
  function apply() {
    const error = validateScenario(draft) || (draft.deadline > addDays(today, 365) ? "Choose a deadline within the next year." : null);
    if (error) { setInputError(error); return; }
    setScenario({ ...draft }); setInputError(""); setMessage(""); trackToolStart(); trackFinance("scenario_apply");
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify({ scenario })); setMessage("Plan saved on this browser. No background alerts are enabled."); trackFinance("save_plan"); }
    catch { setMessage("This browser could not save the plan."); }
  }
  function restore() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORE) ?? "null");
      if (!stored) { setMessage("There is no saved plan on this browser yet."); return; }
      const next = stored.scenario as Scenario;
      if (!next || validateScenario(next) || next.deadline > addDays(today, 365)) throw new Error("invalid");
      setScenario(next); setDraft(next); setInputError(""); setMessage("Saved plan loaded with its original exchange deadline.");
    } catch { setMessage("The saved plan could not be read. Set your assumptions again."); }
  }
  function exportCsv() {
    if (!snapshot) return;
    const csv = "date,cad_per_mxn_source,mxn_per_cad_derived,source_series\n" + snapshot.observations.map(r => `${r.date},${r.cadPerMxn},${r.mxnPerCad},FXMXNCAD`).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `cad-mxn-boc-${analysis?.last.date}.csv`; anchor.click(); URL.revokeObjectURL(url); trackFinance("export_csv");
  }
  const dirty = JSON.stringify(draft) !== JSON.stringify(scenario);
  const changeDraft = (key: keyof Scenario, value: number | string | boolean | null) => setDraft(previous => ({ ...previous, [key]: value }));
  return <div className={styles.workspace}>
    <header className={styles.topbar}><Link href="/tools" className={styles.brand}><span className={styles.brandMark}><ChartNoAxesCombined size={21} /></span>fruitful lab<span className={styles.brandDivider}>/</span><span>Financial Lab</span></Link><span className={styles.prototype}>Research preview</span></header>
    <main className={styles.main}>
      <div className={styles.heading}><div><p className={styles.eyebrow}>EXCHANGE TIMING · CASE 01</p><h1>A better moment to exchange.</h1><p>Canadian dollars to Mexican pesos. Put the decision in perspective.</p></div><button className={styles.quietButton} onClick={() => { trackFinance("refresh"); void refresh(); }} disabled={loading}><RefreshCw size={15} />{loading ? "Checking…" : "Refresh rates"}</button></div>
      <div className={styles.navigation}><nav aria-label="Financial analysis views"><button aria-pressed={view === "dashboard"} onClick={() => setView("dashboard")}><ChartNoAxesCombined size={16} />Dashboard</button><button aria-pressed={view === "report"} onClick={() => { setView("report"); trackFinance("view_report"); }}><FileText size={16} />Analysis report</button></nav><span className={styles.sourceStatus}><i />Bank of Canada · {analysis ? `Rate dated ${analysis.last.date}` : "Source unavailable"}</span></div>
      {feedError && <p role="alert" className={styles.warning}>{feedError}</p>}
      {!snapshot || !analysis ? <section className={styles.empty}><h2>Reliable data comes first.</h2><p>We couldn’t load the Bank of Canada history. Refresh to try again; a decision will appear once the source is available.</p><button onClick={() => void refresh()} disabled={loading}>Try again</button></section> : <>
        {analysis.blocked && <p role="alert" className={styles.warning}>Decision paused: {analysis.largeGap ? "there is a gap of more than seven calendar days in the recent history." : `the latest observation is ${analysis.ageDays} calendar days old.`} Historical charts remain available.</p>}
        {view === "dashboard" ? <div className={styles.dashboard}>
          <div className={styles.evidence}>
            <section className={styles.decision} aria-labelledby="decision-title"><div><p className={styles.eyebrow}>YOUR DECISION · {analysis.days} DAYS</p><h2 id="decision-title">{blocked ? "Refresh data before deciding" : analysis.action}</h2><p>{blocked ? "Use the history for context. A fresh, complete source is required for a timing suggestion." : analysis.reason}</p><button className={styles.textButton} onClick={() => { setView("report"); trackFinance("view_report"); }}>Read the reasoning <ArrowRight size={15} /></button></div><div className={styles.allocation}><strong>{blocked ? "—" : `${analysis.selected.fraction * 100}%`}</strong><span>exchange now</span><div className={styles.allocationTrack}><i style={{ width: blocked ? "0%" : `${analysis.selected.fraction * 100}%` }} /></div><small>{blocked ? "Decision paused" : `CAD ${number(scenario.amount * analysis.selected.fraction)} of ${number(scenario.amount)}`}</small></div></section>
            <div className={styles.metrics}><section><p>Latest reference rate</p><h2>{number(analysis.middle, 4)} <small>MXN</small></h2><span>for 1 CAD · {percent(analysis.monthChange)} over 21 observations</span></section><section><p>Exchange everything now</p><h2>{number(analysis.now)} <small>MXN</small></h2><span>Illustrative net · {scenario.spread}% markup + CAD {scenario.fee} fee</span></section><section><p>Rate in its one-year history</p><h2>{number(analysis.yearPercentile)}<small>th percentile</small></h2><span>Higher means more pesos · not a forecast</span></section></div>
            <section className={styles.panel}><div className={styles.panelHeader}><div><h2>The rate, and the room to move</h2><p>MXN per CAD · higher is better for you</p></div><div className={styles.segment} aria-label="Chart history">{[[63, "3M"], [252, "1Y"], [800, "All"]].map(([n, label]) => <button key={n} aria-pressed={period === n} onClick={() => setPeriod(Number(n))}>{label}</button>)}</div></div><RateChart observations={snapshot.observations} analysis={analysis} count={period} /></section>
            <section className={styles.panel}><div className={styles.panelHeader}><div><h2>Three ways to make the exchange</h2><p>Same budget. Same assumptions. Different exposure to what comes next.</p></div></div><StrategyTable a={analysis} blocked={blocked} /><p className={styles.fine}>“Later” means {analysis.deadline}. Split plans pay the fixed fee twice. Scenarios use today’s reference and a no-change median, not a provider quote. A higher fee can erase the benefit of splitting.</p></section>
            <section className={styles.panel}><div className={styles.panelHeader}><div><h2>One decision, three budgets</h2><p>CAD 1,000, 5,000 and 10,000 · same deadline, costs and downside tolerance</p></div></div><BudgetComparison snapshot={snapshot} scenario={scenario} today={today} blocked={blocked} /></section>
            <section className={styles.panel}><div className={styles.panelHeader}><div><h2>Would more time help?</h2><p>Compare your deadline with one, two or three extra months.</p></div></div><ExtensionComparison snapshot={snapshot} scenario={scenario} today={today} /></section>
            <section className={styles.panel}><div className={styles.panelHeader}><div><h2>Does the forecast earn its place?</h2><p>We test the trend challenger against a simple no-change forecast.</p></div><span className={styles.subtleTag}>{analysis.trendSupported ? "Exploratory signal" : "Baseline retained"}</span></div><Audit a={analysis} /></section>
          </div>
          <aside className={styles.sidebar}><section className={styles.plan}><p className={styles.eyebrow}>YOUR EXCHANGE</p><h2>Set the decision.</h2><form onSubmit={e => { e.preventDefault(); apply(); }}>
            <label>Amount to exchange <span>CAD</span><input type="number" min="1" max="10000000" step="0.01" value={Number.isNaN(draft.amount) ? "" : draft.amount} onChange={e => changeDraft("amount", e.target.value === "" ? NaN : Number(e.target.value))} required /></label>
            <label>Exchange by<input type="date" value={draft.deadline} max={addDays(today, 365)} onChange={e => changeDraft("deadline", e.target.value)} required /></label>
            <div className={styles.amountPresets} aria-label="Compare budget presets">{[1000, 5000, 10000].map(amount => <button type="button" key={amount} aria-pressed={draft.amount === amount} onClick={() => changeDraft("amount", amount)}>CAD {number(amount)}</button>)}</div>
            <div className={styles.inputPair}><label>Rate markup (%)<input type="number" min="0" max="20" step="0.05" value={Number.isNaN(draft.spread) ? "" : draft.spread} onChange={e => changeDraft("spread", e.target.value === "" ? NaN : Number(e.target.value))} required /></label><label>Fee / transfer (CAD)<input type="number" min="0" step="0.01" value={Number.isNaN(draft.fee) ? "" : draft.fee} onChange={e => changeDraft("fee", e.target.value === "" ? NaN : Number(e.target.value))} required /></label></div>
            <p className={styles.fine}>Illustrative costs. Replace them with your provider’s quote.</p>
            <label>Downside tolerance<select value={draft.lossBudget} onChange={e => changeDraft("lossBudget", Number(e.target.value))}>{[0, 1, 2, 5, 10, 20].map(v => <option value={v} key={v}>{v}% fewer pesos</option>)}</select></label><p className={styles.fine}>Compared with exchanging now, at the model’s lower scenario. Actual losses can exceed this.</p>
            <label>Target rate <span>optional · MXN/CAD</span><input type="number" min="0.0001" max="1000" step="0.0001" placeholder="e.g. 13.0000" value={draft.target ?? ""} onChange={e => changeDraft("target", e.target.value === "" ? null : Number(e.target.value))} /></label><p className={styles.fine}>After markup, before the fixed fee.</p>
            <label className={styles.checkLabel}><input type="checkbox" checked={draft.eventRisk} onChange={e => changeDraft("eventRisk", e.target.checked)} /><span>I want extra caution around news or a policy decision.</span></label>
            {inputError && <p role="alert" className={styles.warning}>{inputError}</p>}<button className={styles.primaryButton} type="submit">{dirty ? "Update analysis" : "Recalculate"}<ArrowRight size={16} /></button>{dirty && <p className={styles.pending}>Results still use the previous assumptions.</p>}
          </form><div className={styles.saveActions}><button onClick={save} disabled={dirty}>Save plan</button><button onClick={restore}>Load saved</button></div>{message && <p role="status" className={styles.fine}>{message}</p>}</section>
          <section className={styles.watch}><h3>What to watch</h3><p>{scenario.target === null ? "Set a target rate to track a level that works for your budget." : analysis.targetMet ? "Your target is met under the assumed markup. Confirm an executable quote." : `Target: ${number(scenario.target, 4)} MXN/CAD. Current after markup: ${number(analysis.middle * (1 - scenario.spread / 100), 4)}.`}</p><ul><li><a href="https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/" target="_blank" rel="noreferrer">Bank of Canada decisions ↗</a></li><li><a href="https://www.banxico.org.mx/publications-and-press/announcements-of-monetary-policy-decisions/monetary-policy-announcements.html" target="_blank" rel="noreferrer">Banco de México decisions ↗</a></li><li>Your provider’s final quote and delivery time</li></ul><p className={styles.fine}>News is not automatically analyzed. Check official releases; use the caution setting for events you consider material. Rates refresh hourly while this page is visible. No background alerts.</p></section>
          </aside>
        </div> : <article className={styles.report}>
          <div className={styles.reportMast}><div><p className={styles.eyebrow}>FINANCIAL LAB / DECISION MEMO</p><h2>CAD → MXN<br />The exchange timing report.</h2><p>Prepared {today} · Rate observed {analysis.last.date} · Method {METHOD_VERSION}</p></div><button className={styles.quietButton} onClick={() => { trackFinance("print_report"); window.print(); }}><ArrowDownToLine size={16} />Print / save PDF</button></div>
          <section className={styles.reportSummary}><p className={styles.eyebrow}>01 / DECISION</p><h3>{blocked ? "Decision paused" : analysis.action}</h3><p>{blocked ? "The data check has not passed. Refresh before using a timing suggestion." : analysis.reason}</p>{!blocked && <p><b>Plan:</b> exchange CAD {number(scenario.amount * analysis.selected.fraction)} now and CAD {number(scenario.amount * (1 - analysis.selected.fraction))} by {analysis.deadline}. Confirm your provider’s delivery time before the deadline.</p>}<p>This is a transparent planning model, not personalized financial advice or a promise of the best exchange date.</p></section>
          <section><p className={styles.eyebrow}>02 / INPUTS & OBSERVED EVIDENCE</p><h3>What this decision is based on</h3><p>Budget: CAD {number(scenario.amount, 2)}. Horizon: {analysis.days} calendar days, ending {analysis.deadline}. Assumed markup: {scenario.spread}%. Fixed fee: CAD {number(scenario.fee, 2)} per transfer. Downside tolerance: {scenario.lossBudget}%. Target: {scenario.target ?? "none"}. Extra event caution: {scenario.eventRisk ? "on" : "off"}.</p><p>At the latest daily reference of {number(analysis.middle, 4)} MXN/CAD, exchanging everything yields an illustrative {pesos(analysis.now)} after those costs. The rate moved {percent(analysis.monthChange)} over 21 observations. It sits at the {number(analysis.yearPercentile)}th percentile of the latest 252 observations. Historical position describes the past; it does not establish fair value or predict a reversal.</p><RateChart observations={snapshot.observations} analysis={analysis} /></section>
          <section><p className={styles.eyebrow}>03 / ALTERNATIVES</p><h3>The cost of leaving the decision open</h3><StrategyTable a={analysis} blocked={blocked} /><p>The no-change scenario has no forecast gain from waiting. Its {analysis.days}-day range is {number(analysis.low, 4)}–{number(analysis.high, 4)} MXN/CAD. Splitting reduces future rate exposure and incurs one extra fixed fee. Markup stays the same for every transfer; provider price tiers, taxes and interest on balances are not modeled.</p></section>
          <section><h3>Compare the three budgets</h3><BudgetComparison snapshot={snapshot} scenario={scenario} today={today} blocked={blocked} /><h3>Consider extending the deadline</h3><ExtensionComparison snapshot={snapshot} scenario={scenario} today={today} /></section>
          <section><p className={styles.eyebrow}>04 / METHOD & VALIDATION</p><h3>Start simple. Make the uncertainty visible.</h3><p>The baseline is a zero-drift random walk in log rates: the median forecast equals the latest reference rate. Sample volatility comes from the last 252 log returns. Bounds are rate × exp(±1.28155 × daily volatility × √h), where h is {analysis.modelHorizon} weekdays from the last observation to the deadline. Weekends are excluded; public holidays are not modeled individually. This nominal 80% interval assumes stable, independent, normally distributed log returns. It can underestimate shocks and changing volatility.</p><p>The challenger projects half the average log change over the last 63 observations. Rolling tests compare both models at the same horizon using only information available at each origin. The challenger can influence timing only with at least 12 non-overlapping windows and at least 10% lower mean absolute error. These are disclosed prototype thresholds, not an independent holdout, a significance test, or evidence of a durable trading edge.</p><Audit a={analysis} /><p>The policy checks data freshness first, then imminent deadlines and a reached target. Otherwise it chooses the smallest feasible allocation from 0%, 25%, 50%, 75% and 100% now that meets the modeled downside tolerance. Without qualifying positive trend evidence, at least 50% is exchanged now. Event caution raises that floor to 75%. All-wait requires a qualifying challenger improvement above 0.5% and sufficient downside tolerance. Zero downside tolerance forces all-now. The interval and payout table always retain the conservative baseline, even when the challenger qualifies.</p></section>
          <section><p className={styles.eyebrow}>05 / CONTEXT & REVIEW</p><h3>What could change the answer</h3><p>Unexpected central-bank decisions, inflation releases, trade-policy changes and shifts in market risk appetite may break the historical pattern. Their direction and size are not inferred here. Review official <a href="https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/">Bank of Canada</a> and <a href="https://www.banxico.org.mx/publications-and-press/announcements-of-monetary-policy-decisions/monetary-policy-announcements.html">Banco de México</a> releases and your actual transfer quote. Your event-risk flag is a judgment input, not a measured signal.</p><p>Revisit after a new daily observation, a material news event, a target being reached, or a provider-fee change. Keep enough time for settlement. This first version monitors only while open; saved plans stay in this browser and do not trigger notifications.</p></section>
        </article>}
        <footer className={styles.footer}><Sources snapshot={snapshot} /><div><button className={styles.quietButton} onClick={exportCsv}><ArrowDownToLine size={15} />Download source history</button><p className={styles.fine}><Check size={12} /> Checked {new Date(snapshot.checkedAt).toLocaleString("en-CA", { timeZone: "America/Toronto" })} Eastern<br />Upstream data cached for up to one hour. No live trading quote.</p></div></footer>
      </>}
    </main>
  </div>;
}
