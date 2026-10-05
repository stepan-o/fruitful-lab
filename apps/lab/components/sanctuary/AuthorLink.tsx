import Link from "next/link";
import styles from "./author-link.module.css";

/** The author remains the route home across the cover, chapters and credits. */
export default function AuthorLink({backLabel="Back to menu"}:{backLabel?:string}) {
 return <Link className={styles.identity} href="/stepanoskin" aria-label={`Stepan Oskin — ${backLabel}`} title={backLabel}>
  <span className={styles.mark} aria-hidden="true"><span>SO</span></span>
  <span className={styles.name}><span className={styles.arrow} aria-hidden="true">←</span> STEPAN OSKIN</span>
 </Link>;
}
