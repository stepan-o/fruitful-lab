import SupervisorAtlas from "@/components/loopforge/SupervisorAtlas";
import styles from "@/components/loopforge/supervisor-atlas.module.css";
import { supervisorAssets } from "@/lib/loopforge/supervisor-assets";

export const metadata = { title: "Supervisor × room · Loopforge Game Design" };

export default async function Page({ searchParams }: {
  searchParams: Promise<{ room?: string | string[] }>;
}) {
  const { room } = await searchParams;
  return <main id="supervisor-atlas-root" className={styles.frame}>
    <SupervisorAtlas assets={supervisorAssets} initialRoom={typeof room === "string" ? room : undefined} />
  </main>;
}
