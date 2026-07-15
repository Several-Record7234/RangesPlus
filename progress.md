# RangesPlus — Progress

## ✓ RESOLVED (2026-07-15): Hollow typecheck gate restored

The build's `tsc` step checked zero files (root `tsconfig.json` is solution-style: `"files": []` + references, and bare `tsc` does not descend into referenced projects). Fixed by switching the build script to `tsc -b` (commit `59444db`). `tsc -b` descended without needing `composite: true`. Fixing this also surfaced a latent bug: `tsconfig.node.json` included the non-existent `vite.config.ts` (project uses `vite.config.js`), giving the node sub-project zero inputs and an error under build mode; repointed to `vite.config.js` + `allowJs`. Verified genuine: an injected `TS2322` fails the build (exit 2), clean code passes. Build mode now emits `*.tsbuildinfo` (gitignored). No latent app-code type errors surfaced (the clearing pass was clean).

---

## Current State (v0.9.2, 2026-03-11)

- Rangefinder tool with 4 shape types: square, circular, rhombus, ovoid
- Automatic grid type detection: square, isometric, dimetric
- Isometric label positioning (45° clockwise from top on perimeter)
- buildCurve() for rhombus shapes (closed curve, tension 0)
- Precise isometric yScale: `1/√3` (was truncated 0.5775)
- logicalDpi correction for iso/dimetric ring scaling
- Token size detection: rings scale to 1x1, 2x2, 3x3+ token footprints
- setupReady promise eliminates drag race condition
- Vite plugin stamps package.json version into manifest.json at build
- Material-UI v7 + React 19 + OBR SDK v3.1

## Session 2026-03-11 — Changes

### Features
- Dynamic token grid size detection for range ring radius offset
- Version stamping: package.json → manifest.json via Vite closeBundle plugin

### Bug Fixes
- buildCurve() replaces buildLine() for rhombus (`.points()` not on LineBuilder)
- setupReady promise pattern fixes click-drag free-ranging mode
- Label positioning moved from 0° to 45° CW on iso shapes

### Code Review Fixes
- getMetadata: structural validation for object values (key existence + type match)
- Isometric yScale: `1 / Math.sqrt(3)` replaces truncated `0.5775`
- syncSettings: `fired` guards prevent double-firing; shared promise dedup
- NumberField: added `numberToText` to useLayoutEffect deps
- RingItem + Controls: useEffect syncs localName when ring.name changes externally
- ThemeSelector: color swatch keys use array index instead of RGB sum
- MUI Switch: v4 `$checked`/`$track` selectors updated to v5+ class names
- OBRContextProvider: 3 serial useEffect fetches → single Promise.all

## Next Steps

- [x] Include What's New modal files (`src/changelog.ts`, `src/whatsNew.tsx`, `vite.config.js`, `src/background/main.ts`) — committed `4de3c84`, pushed
- [x] Restore the hollow typecheck gate (`tsc -b`) — commit `59444db`, pushed
- [ ] Final testing pass on dimetric grids
- [ ] Decide v0.9.2 → v1.0.0 promotion
- [ ] Consider renaming the What's New modal ID to the standardised `com.several-record.rangesplus` namespace (currently `dev.rangesplus.whats-new`); low priority, cosmetic

## Security — Dependency Audit (2026-03-26, portfolio overseer)

**1 high severity** — `picomatch 4.0.0–4.0.3` (build tooling dep, not runtime)
- CVE: ReDoS via extglob quantifiers (GHSA-c2c7-rcm5-vvqj)
- CVE: Method injection in POSIX character classes (GHSA-3v7f-55p6-f55p)
- Fix: `npm audit fix` (no breaking changes)
- [ ] Run `npm audit fix`, verify build + tests pass, commit package-lock.json

## Housekeeping — Next Session

- [x] `.claude/settings.json` untracked and gitignored (2026-07-15, commit `4962727`); permission allowlist applied locally
