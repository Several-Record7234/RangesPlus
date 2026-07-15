# RangesPlus — Progress

## ⚠ INCOMING BRIEF (portfolio, 2026-06-23): Restore the hollow typecheck gate

**Problem.** `npm run build`'s typecheck step is **hollow** — it checks zero files, so type errors ship undetected (esbuild strips types without checking them).

**Why.** The root `tsconfig.json` is solution-style (`"files": []` + `references` to `tsconfig.app.json` / `tsconfig.node.json`). Bare `tsc` compiles the empty `files` array and does **not** descend into referenced projects (that requires build mode, `-b`). The build (`"build": "tsc && vite build"`) runs bare `tsc`, so it always exits 0.

**Confirm (optional).** `npx tsc` (exit 0, no output) vs `npx tsc -b` (real check, reports errors) disagree.

**Fix (one word).** In `package.json`, change the build script's `tsc` → `tsc -b`:
`"build": "tsc -b && vite build"`
No `composite: true` needed; if the referenced configs already set `noEmit: true`, `tsc -b` emits nothing. (If `tsc -b` complains about emit/composite, set `noEmit: true` in `tsconfig.app.json` and `tsconfig.node.json`.) Do not change the tsconfig shape.

**Budget a clearing pass.** Flipping this on surfaces latent errors esbuild ignored. Recurring categories: SDK 3.1.0 `Item` is a flat interface — `readonly id`/`type`, no `image`/`grid` (those live on `Image extends Item`): `item.id = x` → TS2540, `image.image`/`image.grid` → TS2339, `Extract<Item,{image,grid}>` → `never`; fix with `isImage()` narrowing or `as Image`, build copies via `buildImage(...)`. Also `noUnusedLocals/Parameters` (TS6133), `useState` literal narrowing (annotate `useState<number>(4)`, TS2345), stale type-only imports (TS2305). (RangesPlus is MUI, so also watch for stale MUI type imports.)

**Verify.** `npm run build` now fails on any type error and passes only when the code genuinely typechecks.

**Note.** `tsconfig.app.json` likely has `"exclude": ["src/**/*.test.ts"]`, so test files stay unchecked even after this fix.

Portfolio context: audited 2026-06-23. Forms + RangesPlus were the only hollow projects; Sending had no gate at all. See the portfolio-oversight "Typecheck-gate integrity" check.

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

- [ ] Include What's New modal files in next commit: `src/changelog.ts`, `src/whatsNew.tsx`, `whats-new.html`, modified `vite.config.js`, `src/background/main.ts`
- [ ] Final testing pass on dimetric grids
- [ ] Decide v0.9.2 → v1.0.0 promotion

## Security — Dependency Audit (2026-03-26, portfolio overseer)

**1 high severity** — `picomatch 4.0.0–4.0.3` (build tooling dep, not runtime)
- CVE: ReDoS via extglob quantifiers (GHSA-c2c7-rcm5-vvqj)
- CVE: Method injection in POSIX character classes (GHSA-3v7f-55p6-f55p)
- Fix: `npm audit fix` (no breaking changes)
- [ ] Run `npm audit fix`, verify build + tests pass, commit package-lock.json

## Housekeeping — Next Session

- [ ] Apply standard `.claude/settings.json` baseline template (see Recommendation B in `c:\Coding\agent-permissions-audit.md`)
