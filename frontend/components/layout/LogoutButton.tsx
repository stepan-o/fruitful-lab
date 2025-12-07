"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors; we'll still push to root
    } finally {
      router.push("/");
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      className="rounded-md border border-[#0B132B] bg-white px-3 py-2 text-sm font-medium text-[#0B132B] hover:bg-[#DFDFDF]"
      aria-label="Log out"
    >
      {loading ? "Logging out…" : "Log out"}
    </button>
  );
}
