# Animation Design — Dashboard

**Date:** 2026-04-10  
**Project:** `dashboard` (React + TypeScript + Tailwind, Vite)  
**Scope:** Subtle, functional animations across all components. No new dependencies.

---

## Approach

Pure CSS keyframes + Tailwind utility classes. All keyframes defined once in `src/index.css`. No animation library added.

**Style:** Subtle & Functional — micro-interactions and entrance animations that reinforce the data without competing with it.

---

## Shared Keyframes (src/index.css)

Three keyframes added globally:

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes barGrow {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
```

Tailwind `theme.extend.animation` in `tailwind.config.js` exposes:
- `animate-fadeUp` — 400ms ease-out
- `animate-barGrow` — 400ms cubic-bezier(0.34, 1.56, 0.64, 1), transform-origin bottom
- `animate-shimmer` — 1.4s linear infinite

---

## Component Animations

### Home.tsx — Page load stagger
Cards fade up on every route entry. Animation delay applied via inline `style`:

| Element | Delay |
|---|---|
| AgentCard | 0ms |
| ResolutionChart | 80ms |
| Logic card | 160ms |
| StatsGrid | 80ms |
| KnowledgeBase | 160ms |

Class: `animate-fadeUp` on each card wrapper div.

### AgentCard.tsx — Skeleton loading
While `loading === true`, replace the name/role/status block with shimmer placeholder bars:
- Name line: `h-7 w-32 rounded bg-[#E8E4DB] animate-shimmer`
- Role line: `h-3 w-20 rounded bg-[#E8E4DB] animate-shimmer`
- Status chip: `h-5 w-24 rounded bg-[#E8E4DB] animate-shimmer`

Shimmer gradient: `linear-gradient(90deg, #E8E4DB 25%, #F0EDE6 50%, #E8E4DB 75%)`, `background-size: 200% 100%`.

### ResolutionChart.tsx — Bars grow in on mount
Each bar div gets:
- `style={{ transformOrigin: 'bottom' }}`
- `className="... animate-barGrow"`
- Inline `animationDelay`: index × 60ms (0ms, 60ms, 120ms, 180ms, 240ms, 300ms)

### ChatModal.tsx & TestChatModal.tsx — Fade + scale on open/close
Both modals use a two-state pattern:
1. `open` prop controls whether the modal is in the DOM (existing behaviour).
2. Add `isVisible` state that becomes `true` one `requestAnimationFrame` tick after mount, and `false` before unmount — giving CSS transitions a starting state to animate from.

Backdrop: `transition-opacity duration-200`, opacity `0` → `0.4`.  
Panel: `transition-[opacity,transform] duration-200`, `opacity-0 scale-[0.97]` → `opacity-100 scale-100`.

### Sidebar.tsx & TopBar.tsx — Active state transition
Both already apply `transition-colors`. Add `duration-150 ease-in-out` to the button className so the dark background pill animates in rather than snapping.

### Login.tsx, Signup.tsx, Sidebar buttons — Press feedback
Add to every primary/interactive button:
```
active:scale-[0.97] transition-transform duration-100
```
Affects: Login submit, Signup submit, all Sidebar nav buttons, TopBar nav buttons.

---

## Files Changed

| File | Change |
|---|---|
| `src/index.css` | Add 3 keyframes + shimmer gradient variable |
| `tailwind.config.js` | Extend `animation` with fadeUp, barGrow, shimmer |
| `src/pages/Home.tsx` | Add `animate-fadeUp` + delays to card wrappers |
| `src/components/AgentCard.tsx` | Replace loading text with shimmer skeleton |
| `src/components/ResolutionChart.tsx` | Add `animate-barGrow` + delays to bars |
| `src/components/ChatModal.tsx` | Add `isVisible` state + CSS transition classes |
| `src/components/TestChatModal.tsx` | Same as ChatModal |
| `src/components/Sidebar.tsx` | Add `duration-150 ease-in-out` to button transitions |
| `src/components/TopBar.tsx` | Add `duration-150 ease-in-out` to nav button transitions |
| `src/pages/Login.tsx` | Add `active:scale-[0.97] transition-transform duration-100` to submit button |
| `src/pages/Signup.tsx` | Same as Login |

---

## Out of Scope

- No scroll-triggered animations (IntersectionObserver) — the dashboard layout doesn't scroll meaningfully.
- No Framer Motion or other animation libraries.
- No changes to routing or page structure.
