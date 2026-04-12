import type { ReactNode } from "react";
import FlowShell from "@/components/layout/FlowShell";

export default function FlowLayout({ children }: { children: ReactNode }) {
    return <FlowShell>{children}</FlowShell>;
}
