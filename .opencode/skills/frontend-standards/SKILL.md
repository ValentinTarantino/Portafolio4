---
name: frontend-standards
description: Design and code contract for this portfolio's front-end. Use when implementing, reviewing or optimizing any UI: colors, typography, spacing, radii, shadows, breakpoints, i18n, themes and checklists.
---

# Frontend Standards — Portfolio

React 18 + Vite + plain CSS per component. Bilingual (ES/EN via
`src/locales/`). Themes: dark default, light via `lamp-light-mode` class on
`<html>` — every change must look right in BOTH.

## Tokens (source of truth until `tokens.css` exists)

- `--bg-dark:#0c0c0c; --bg-mid:#1a1a2e; --bg-rich:#16213e`
- `--text:#f1f5f9; --muted:#94a3b8` (minimum contrast 4.5:1 for text)
- `--brand-a:#667eea; --brand-b:#764ba2` (accents, CTAs)
- `--gold:#d4af37` (featured ONLY) · `--success:#22c55e`
- Light surfaces: `#ffffff` / `#f1f5f9`, light accent `#3b82f6→#1d4ed8`
- Type: Inter (UI) + JetBrains Mono (code). Sizes: 12/14/16/20/24/32/48/64.
  Weights 400/600/800.
- Spacing: 4/8/16/24/32/64/96. Sections 96px desktop / 64px mobile.
- Radii: 8 (tags) / 12 (inputs) / 16 (cards) / 20 (panels) / pill (buttons).
- Shadows: sm `0 2px 8px rgba(0,0,0,.2)` / md `0 8px 24px` / lg `0 16px 48px`.
- Glass (single recipe): `rgba(255,255,255,.04)` + `blur(12px)` + 1px border
  `rgba(255,255,255,.08)`.
- Container 1200px, side padding 24px (16px mobile).
- Breakpoints ONLY: 480 / 768 / 1024 / 1280.

## Hard rules

1. No new `!important`. Fix specificity instead.
2. No new hex/rgba outside these tokens. No new font families.
3. Every user-facing string in `es.js` AND `en.js` (same keys).
4. Visible `:focus-visible` on all interactive elements; targets ≥ 44px.
5. Honor `prefers-reduced-motion`; no infinite decorative animations.
6. Images: WebP preferred, `loading="lazy"` + `decoding="async"` below fold,
   explicit size or `aspect-ratio`.
7. Grids must not overflow at 320px: use `minmax(min(100%,Npx),1fr)`.
8. Modals: `role="dialog"` + `aria-modal`, Escape closes, focus trap + restore.
9. No dead code: remove unused imports/files instead of `void` hacks.
10. Run `npm run build` and keep it green.

## Change checklist (verify before finishing)

- [ ] Dark + light screenshots mentally verified
- [ ] 360px / 768px / 1024px: no overflow, no clipped text
- [ ] Keyboard: Tab order sane, focus visible, Escape works
- [ ] ES + EN strings present
- [ ] No console errors, build passes
