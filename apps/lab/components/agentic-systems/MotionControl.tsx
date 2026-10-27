"use client";
import { motionKey, usePreference } from "@/lib/stepanoskin/preferences";
export default function MotionControl() {
 const [motion, setMotion] = usePreference(motionKey);
 return <button type="button" aria-pressed={motion} onClick={() => setMotion(!motion)}>{motion ? "Pause motion" : "Enable motion"}</button>;
}
