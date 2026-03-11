# RangesPlus — Progress

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

- [ ] Final testing pass on dimetric grids
- [ ] Decide v0.9.2 → v1.0.0 promotion
