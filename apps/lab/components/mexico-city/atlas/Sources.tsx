import { SOURCES } from "@/lib/mexico-city/atlas/content";
import { useLocale } from "@/lib/mexico-city/locale";
export default function Sources({
  ids,
  compact = false,
}: {
  ids: readonly string[];
  compact?: boolean;
}) {
  const { locale } = useLocale();
  return (
    <aside
      className={compact ? "at-citations" : "at-sources"}
      aria-label={locale === "es" ? "Fuentes" : "Sources"}
    >
      <span>{locale === "es" ? "Fuentes" : "Sources"}</span>
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
    </aside>
  );
}
