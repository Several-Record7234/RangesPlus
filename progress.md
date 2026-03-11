# RangesPlus — Progress

## Current State (v0.9.2, last commit 2026-03-09)

- Rangefinder tool with 4 shape types: square, circular, rhombus, ovoid
- Automatic grid type detection: square, isometric, dimetric
- Isometric label positioning (45 degrees clockwise, top-right edge)
- buildCurve() used for rhombus shapes
- 82% / 81.6% range-undersizing corrections applied
- Isometric shader support for range rings
- Material-UI + React 19 + OBR SDK v3.1

## Recent History

- Label position adjustments for isometric grids
- Range scaling corrections (81.6% undersizing fix)
- onToolDown race condition fix
- Project renamed from earlier name to RangesPlus

## Next Steps

- [ ] Decide whether v0.9.2 → v1.0.0 promotion is warranted
- [ ] Any remaining edge cases on dimetric grids?
