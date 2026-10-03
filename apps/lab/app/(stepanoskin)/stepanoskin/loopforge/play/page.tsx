import Conveyor from "@/components/loopforge/Conveyor";
import Chrome from "@/components/loopforge/Chrome";
import Director from "@/components/loopforge/Director";
import styles from "@/components/loopforge/loopforge.module.css";
export const metadata = {
  title: "Director’s console · Loopforge",
  description:
    "An eight-shift factory simulation. Truth stays clean. Story gets messy.",
};
export default function Page() {
  return (
    <div className={styles.page}>
      <Chrome />
      <Director />
      <footer className={styles.footer}>
        <span>LOOPFORGE / TEACHING PROTOTYPE</span>
        <span>Truth stays clean. Story gets messy.</span>
      </footer>
      <div className={styles.perimeter}>
        <Conveyor quiet />
      </div>
    </div>
  );
}
