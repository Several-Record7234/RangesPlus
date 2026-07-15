export interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: "feat" | "fix" | "change";
    text: string;
  }[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "0.9.3",
    date: "2026-03-11",
    changes: [
      {
        type: "feat",
        text: "**Token size detection** — range rings automatically scale to the token's footprint: 1×1, 2×2, and 3×3+ grid sizes are all handled correctly.",
      },
      {
        type: "fix",
        text: "**Isometric grid scaling** — corrected the Y-scale factor (`1/√3`) and logicalDpi adjustment for isometric and dimetric grids, eliminating ring distortion.",
      },
      {
        type: "fix",
        text: "**Drag race condition** — range ring updates no longer flicker or appear out of position when rapidly dragging a token.",
      },
    ],
  },
];

export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function getUnseenEntries(
  log: ChangelogEntry[],
  lastSeen: string | null,
): ChangelogEntry[] {
  if (!lastSeen) return [];
  return log.filter((e) => compareVersions(e.version, lastSeen) > 0);
}
