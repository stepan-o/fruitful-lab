import type { VisualSourceLink } from "@/lib/sanctuary/visual-sources";
import s from "./visual-sources.module.css";

export default function VisualSources({ records }: { records: VisualSourceLink[] }) {
  if (!records.length) return null;
  return (
    <details className={s.sources} id="visual-sources">
      <summary><span>Visual sources & use</span><small>{records.length} {records.length === 1 ? "record" : "records"}</small></summary>
      <ul className={s.records}>
        {records.map(record => (
          <li key={record.id}>
            <h3>{record.title}</h3>
            <div className={s.links}>
              {record.sourceUrl ? <a href={record.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Source for ${record.title}`}>Source ↗</a> : null}
              <a href={record.recordHref} aria-label={`Rights and use record for ${record.title}`}>Rights & use record →</a>
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}
