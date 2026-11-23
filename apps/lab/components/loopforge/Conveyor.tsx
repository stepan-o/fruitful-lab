"use client";
import { useEffect, useId, useRef, useState } from "react";
import { motionKey, usePreference } from "@/lib/stepanoskin/preferences";
import styles from "./loopforge.module.css";
export default function Conveyor({ quiet = false }: { quiet?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const patternId = useId();
  const [enabled] = usePreference(motionKey);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      typeof IntersectionObserver === "undefined" ||
      typeof matchMedia === "undefined"
    )
      return;
    let visible = false;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setActive(visible && !document.hidden && !media.matches && enabled);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(node);
    document.addEventListener("visibilitychange", update);
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      media.removeEventListener("change", update);
    };
  }, [enabled]);
  return (
    <div
      ref={ref}
      className={`${styles.conveyor} ${quiet ? styles.quiet : ""}`}
      data-running={active}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1200 106" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern
            id={patternId}
            width="24"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M1 1H22V10H1Z"
              fill="#3a4140"
              stroke="#8d825c"
              strokeWidth=".65"
            />
            <path d="M4 3H19" stroke="#afb4a2" strokeOpacity=".28" />
          </pattern>
        </defs>
        <path
          d="M45 82V103M1155 82V103M350 82V103M850 82V103"
          stroke="#5b5d51"
          strokeWidth="6"
        />
        <rect
          x="24"
          y="42"
          width="1152"
          height="42"
          rx="21"
          fill="#0d161a"
          stroke="#827653"
          strokeWidth="2"
        />
        <g className={styles.belt}>
          <rect
            x="-24"
            y="42"
            width="1248"
            height="11"
            fill={`url(#${patternId})`}
          />
        </g>
        <g className={styles.returnBelt}>
          <rect
            x="-24"
            y="73"
            width="1248"
            height="10"
            fill={`url(#${patternId})`}
          />
        </g>
        {Array.from({ length: 25 }, (_, i) => (
          <g key={i} transform={`translate(${45 + i * 46.25} 63)`}>
            <circle r="16" fill="#182125" stroke="#7e775b" />
            <g className={styles.roller}>
              <path d="M-12 0H12M0-12V12" stroke="#666a58" />
              <circle r="5" fill="#9b8a5f" />
              <circle r="2" fill="#121b1e" />
            </g>
          </g>
        ))}
        <path d="M32 59H1168M32 68H1168" stroke="#384545" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g
            className={styles.cargo}
            key={i}
            style={{ animationDelay: `-${i * 6}s` }}
          >
            <path
              d="M-28 41V14L-18 5H18L28 14V41Z"
              fill="#263a3d"
              stroke="#b6a274"
            />
            <path
              d="M-18 33V17L-10 11H10L18 17V33Z"
              fill="#789a8f"
              fillOpacity=".3"
              stroke="#80b4aa"
            />
            <path d="M-11 25H11M0 15V34" stroke="#b0cec0" strokeWidth="1" />
            <path d="M-31 38H31V42H-31Z" fill="#a29165" />
          </g>
        ))}
      </svg>
    </div>
  );
}
