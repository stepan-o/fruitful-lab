"use client";

import { ArrowUpRight, Printer } from "lucide-react";
import { linkedInUrl } from "@/lib/production-systems/content";
import { trackCtaClick } from "@/lib/gtm";
import styles from "@/app/(stepanoskin)/stepanoskin/production-systems/profile.module.css";

export default function ProfileActions() {
  return <div className={styles.profileActions}>
    <a className={styles.primaryLink} href={linkedInUrl} onClick={() => trackCtaClick("Connect on LinkedIn")}>Connect on LinkedIn <ArrowUpRight size={17} aria-hidden="true" /></a>
    <noscript><style>{"[data-print-profile] { display: none; }"}</style></noscript>
    <button data-print-profile className={styles.printButton} type="button" onClick={() => { trackCtaClick("Print professional profile"); window.print(); }}><Printer size={16} aria-hidden="true" /> Print profile</button>
  </div>;
}
