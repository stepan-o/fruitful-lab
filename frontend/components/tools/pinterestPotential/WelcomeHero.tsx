"use client";

import * as React from "react";

export function WelcomeHero() {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-5">
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-black/5 blur-2xl" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-black/5 blur-2xl" />

            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-sm text-black/60">Pinterest Potential</div>

                    <h1 className="mt-1 text-xl font-semibold leading-tight">
                        See your{" "}
                        <span className="relative inline-block">
              growth
              <span
                  className={[
                      "absolute left-0 right-0 -bottom-1 h-[6px] rounded-full",
                      "bg-gradient-to-r from-black/0 via-black/25 to-black/0",
                      "animate-[shimmer_1.6s_infinite]",
                      "motion-reduce:animate-none",
                  ].join(" ")}
              />
            </span>{" "}
                        snapshot
                    </h1>

                    <p className="mt-2 text-sm text-black/60">
                        8 quick questions • ~60 seconds
                    </p>
                </div>

                {/* Inline SVG hero */}
                <svg
                    width="96"
                    height="96"
                    viewBox="0 0 96 96"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0"
                >
                    <rect x="10" y="18" width="30" height="30" rx="8" fill="currentColor" opacity="0.08" />
                    <rect x="56" y="14" width="30" height="30" rx="8" fill="currentColor" opacity="0.08" />
                    <rect x="20" y="56" width="66" height="20" rx="10" fill="currentColor" opacity="0.08" />
                    <path
                        d="M24 66c8-10 16-14 26-10 10 4 18-2 28-14"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.45"
                    />
                    <circle cx="24" cy="66" r="3" fill="currentColor" opacity="0.6" />
                    <circle cx="50" cy="56" r="3" fill="currentColor" opacity="0.6" />
                    <circle cx="78" cy="42" r="3" fill="currentColor" opacity="0.6" />
                </svg>
            </div>

            <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-30%); opacity: 0.35; }
          50% { transform: translateX(30%); opacity: 0.55; }
          100% { transform: translateX(-30%); opacity: 0.35; }
        }
      `}</style>
        </div>
    );
}
