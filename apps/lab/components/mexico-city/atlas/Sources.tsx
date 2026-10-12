import { SOURCES, REVIEWED } from "@/lib/mexico-city/atlas/content";
import { useLocale } from "@/lib/mexico-city/locale";
export default function Sources({ ids }: { ids: readonly string[] }) {
  const { locale } = useLocale();
  return (
    <details className="at-sources">
      <summary>
        {locale === "es" ? "Fuentes y contexto" : "Sources and context"} ↗
      </summary>
      <p>
        {locale === "es" ? "Revisión editorial" : "Editorial review"}:{" "}
        {REVIEWED}
      </p>
      <ul>
        {[...new Set(ids)].map((id) => {
          const s = SOURCES[id] ?? { url: id, title: new URL(id).hostname };
          return (
            <li key={id}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title} ↗
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
