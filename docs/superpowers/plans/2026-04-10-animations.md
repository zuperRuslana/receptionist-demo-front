# Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add subtle, functional CSS animations to all dashboard components — page load stagger, skeleton loader, chart bar growth, modal transitions, active state transitions, and button press feedback.

**Architecture:** Pure CSS keyframes defined in `src/index.css`, custom Tailwind animation utilities registered in `tailwind.config.js`, then applied component-by-component. No new dependencies.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v3, Vite

---

## File Map

| File | Change |
|---|---|
| `src/index.css` | Add `fadeUp`, `barGrow`, `shimmer` keyframes |
| `tailwind.config.js` | Extend `animation` + `keyframes` with the three animations |
| `src/pages/Home.tsx` | Add `animate-fadeUp` + `animationDelay` to card wrappers |
| `src/components/AgentCard.tsx` | Replace loading text block with shimmer skeleton |
| `src/components/ResolutionChart.tsx` | Add `animate-barGrow` + `animationDelay` + `transformOrigin` to bars |
| `src/components/ChatModal.tsx` | Remove early return, add transition classes conditioned on `open` prop |
| `src/components/TestChatModal.tsx` | Add `isVisible` state + `handleClose` for entry/exit animation |
| `src/components/Sidebar.tsx` | Add `duration-150 ease-in-out` to button `className` |
| `src/components/TopBar.tsx` | Add `duration-150 ease-in-out` to nav button `className` |
| `src/pages/Login.tsx` | Add `active:scale-[0.97] transition-[colors,transform] duration-100` to submit button |
| `src/pages/Signup.tsx` | Add `active:scale-[0.97] transition-[colors,transform] duration-100` to submit button |

---

## Task 1: Add keyframes to index.css and tailwind.config.js

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Add keyframes to src/index.css**

Open `src/index.css`. After the `@tailwind utilities;` line, append:

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

The full file should look like:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Barlow+Condensed:wght@600;700&family=Barlow:wght@300;400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Barlow', sans-serif;
  background: #F0EDE6;
  color: #1A1A18;
}

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

- [ ] **Step 2: Register animation utilities in tailwind.config.js**

Replace the contents of `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        condensed: ["'Barlow Condensed'", 'sans-serif'],
      },
      gridTemplateColumns: {
        'dashboard': '200px 1fr',
      },
      gridTemplateRows: {
        'dashboard': '48px 1fr',
      },
      animation: {
        'fadeUp':  'fadeUp 400ms ease-out both',
        'barGrow': 'barGrow 400ms cubic-bezier(0.34,1.56,0.64,1) both',
        'shimmer': 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Verify dev server still compiles**

```bash
cd /Users/Student/dashboard && npm run dev
```

Expected: Vite starts with no errors. Open `http://localhost:5173` — dashboard looks unchanged.

- [ ] **Step 4: Commit**

```bash
cd /Users/Student/dashboard
git add src/index.css tailwind.config.js
git commit -m "feat: add fadeUp, barGrow, shimmer animation keyframes"
```

---

## Task 2: Home.tsx — page load stagger

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Add animate-fadeUp and animationDelay to card wrappers**

Replace the contents of `src/pages/Home.tsx` with:

```tsx
import AgentCard from '../components/AgentCard'
import ResolutionChart from '../components/ResolutionChart'
import StatsGrid from '../components/StatsGrid'
import KnowledgeBase from './KnowledgeBase'
import ChatModal from '../components/ChatModal'

interface HomeProps {
  modalOpen: boolean
  onOpenModal: () => void
  onCloseModal: () => void
}

const Home = ({ modalOpen, onCloseModal }: HomeProps) => (
  <div className="p-5 grid grid-cols-[300px_1fr] gap-4 items-start">

    {/* ── Left column ── */}
    <div className="flex flex-col gap-[14px]">
      <div className="animate-fadeUp" style={{ animationDelay: '0ms' }}>
        <AgentCard />
      </div>
      <div className="animate-fadeUp" style={{ animationDelay: '80ms' }}>
        <ResolutionChart />
      </div>
      <div
        className="animate-fadeUp bg-[#FAF8F3] rounded-[14px] p-4"
        style={{ animationDelay: '160ms', border: '0.5px solid #CCC9C0' }}
      >
        <div className="font-mono text-[9px] text-[#999] tracking-[1.2px] mb-2">
          LOGIC ARCHITECTURE
        </div>
        <p className="text-xs text-[#5C5C58] leading-[1.65] mb-2.5">
          Trained on Glow Beauty Clinic's full service catalog, pricing, booking flow, and
          promotional rules. Optimized for sales conversion and client satisfaction.
        </p>
        <span className="font-mono text-[10px] text-[#B85C38] underline cursor-pointer tracking-[0.5px]">
          READ AGENT MANIFEST →
        </span>
      </div>
    </div>

    {/* ── Right column ── */}
    <div className="flex flex-col gap-4">
      <div className="animate-fadeUp" style={{ animationDelay: '80ms' }}>
        <StatsGrid />
      </div>
      <div className="animate-fadeUp" style={{ animationDelay: '160ms' }}>
        <KnowledgeBase />
      </div>
    </div>

    <ChatModal open={modalOpen} onClose={onCloseModal} />
  </div>
)

export default Home
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:5173`. Navigate away from `/` and back (e.g. click Knowledge Base in the sidebar, then Home). Cards should cascade in with a gentle fade-up stagger.

- [ ] **Step 3: Commit**

```bash
cd /Users/Student/dashboard
git add src/pages/Home.tsx
git commit -m "feat: add page load fade-up stagger to Home cards"
```

---

## Task 3: AgentCard.tsx — shimmer skeleton while loading

**Files:**
- Modify: `src/components/AgentCard.tsx`

- [ ] **Step 1: Replace the loading text block with shimmer skeleton shapes**

In `src/components/AgentCard.tsx`, find the `{loading ? (...) : (...)}` block and replace just the loading branch. The full return JSX should be:

```tsx
return (
  <div
    className="bg-[#FAF8F3] rounded-[14px] overflow-hidden"
    style={{ border: '0.5px solid #CCC9C0' }}
  >
    <div
      className="h-40"
      style={{ background: 'linear-gradient(135deg, #7BAE8A 0%, #C4A882 50%, #D4876A 100%)' }}
    />

    <div className="p-4">
      <div className="font-mono text-[11px] text-[#CCC9C0] tracking-[4px] mb-1">+ + + +</div>
      <div className="font-mono text-[9px] text-[#999] tracking-[1px] mb-1.5">
        REPRESENTATIVE ID / 001-A
      </div>

      {loading ? (
        <div className="flex flex-col gap-2 mt-1">
          {/* Name placeholder */}
          <div
            className="h-7 w-32 rounded animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, #E8E4DB 25%, #F0EDE6 50%, #E8E4DB 75%)',
              backgroundSize: '200% 100%',
            }}
          />
          {/* Role placeholder */}
          <div
            className="h-2.5 w-20 rounded animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, #E8E4DB 25%, #F0EDE6 50%, #E8E4DB 75%)',
              backgroundSize: '200% 100%',
            }}
          />
          {/* Status chip placeholder */}
          <div
            className="h-5 w-24 rounded animate-shimmer mt-1"
            style={{
              background: 'linear-gradient(90deg, #E8E4DB 25%, #F0EDE6 50%, #E8E4DB 75%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      ) : (
        <>
          <div className="font-condensed text-[30px] font-bold text-[#1A1A18] leading-[1.05] tracking-[-0.5px] uppercase mb-1">
            {agent.name || 'AI Assistant'}
          </div>
          <div className="font-mono text-[9px] text-[#888780] tracking-[0.5px] mb-2.5">
            {roleLabel[agent.role] || agent.role}
          </div>
          <div className={`inline-flex items-center gap-1.5 font-mono text-[9px] border px-2.5 py-1 rounded-[2px] tracking-[1px] ${s.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </div>
        </>
      )}
    </div>
  </div>
)
```

- [ ] **Step 2: Verify in browser**

Hard-refresh `http://localhost:5173`. On initial load you should see shimmering placeholder bars in the AgentCard before the agent name appears.

To see it clearly: in `AgentCard.tsx` temporarily change `setLoading(false)` inside `finally` to a `setTimeout(() => setLoading(false), 2000)`, verify the skeleton, then revert.

- [ ] **Step 3: Commit**

```bash
cd /Users/Student/dashboard
git add src/components/AgentCard.tsx
git commit -m "feat: add shimmer skeleton to AgentCard loading state"
```

---

## Task 4: ResolutionChart.tsx — bars grow in on mount

**Files:**
- Modify: `src/components/ResolutionChart.tsx`

- [ ] **Step 1: Add animate-barGrow, transformOrigin, and staggered delays to bars**

Replace the contents of `src/components/ResolutionChart.tsx` with:

```tsx
const bars = [
  { day: 'Mon', h: 35 },
  { day: 'Tue', h: 58 },
  { day: 'Wed', h: 82 },
  { day: 'Thu', h: 62 },
  { day: 'Fri', h: 48 },
  { day: 'Sat', h: 70 },
]

const ResolutionChart = () => (
  <div
    className="bg-[#FAF8F3] rounded-[14px] px-5 py-[18px]"
    style={{ border: '0.5px solid #CCC9C0' }}
  >
    {/* Header row: title + average */}
    <div className="flex justify-between items-baseline mb-4">
      <span className="text-sm font-medium text-[#1A1A18]">Resolution Rate</span>
      <span className="font-mono text-[11px] text-[#999]">94% Avg</span>
    </div>

    {/* Bar chart — 80px tall, bars grow from the bottom */}
    <div className="flex items-end gap-2 h-20 mb-2">
      {bars.map((b, i) => (
        <div key={b.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <div
            className="w-full rounded-t-[6px] animate-barGrow"
            style={{
              height: `${b.h}%`,
              background: 'linear-gradient(180deg, #D3D1C7 0%, #E8E4DB 100%)',
              transformOrigin: 'bottom',
              animationDelay: `${i * 60}ms`,
            }}
          />
          <span className="text-[11px] text-[#999]">{b.day}</span>
        </div>
      ))}
    </div>

    {/* Divider */}
    <div className="my-3" style={{ borderTop: '0.5px solid #CCC9C0' }} />

    {/* Description */}
    <p className="text-xs text-[#888] leading-[1.6]">
      Mary Jane resolved 48 conversations this week. Escalation rate: 6%.
    </p>
  </div>
)

export default ResolutionChart
```

- [ ] **Step 2: Verify in browser**

Navigate to Home. The 6 bars should spring up from the bottom in sequence, left-to-right, each 60ms apart.

- [ ] **Step 3: Commit**

```bash
cd /Users/Student/dashboard
git add src/components/ResolutionChart.tsx
git commit -m "feat: animate ResolutionChart bars on mount"
```

---

## Task 5: ChatModal.tsx — fade + scale on open/close

**Files:**
- Modify: `src/components/ChatModal.tsx`

- [ ] **Step 1: Remove early return and add transition classes**

Find the top of the `ChatModal` component render. Replace:

```tsx
if (!open) return null

return (
  // Backdrop — clicking it directly (not the modal card) closes it
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center"
    style={{ background: 'rgba(26,26,24,0.55)' }}
    onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
  >
    {/* Modal card: 700px wide, 560px tall, 2-column grid */}
    <div
      className="bg-[#FAF8F3] rounded-[14px] w-[700px] max-w-[95vw] h-[560px] grid grid-cols-[230px_1fr] overflow-hidden"
      style={{ border: '0.5px solid #CCC9C0' }}
    >
```

With:

```tsx
return (
  // Backdrop — clicking it directly (not the modal card) closes it
  <div
    className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    style={{ background: 'rgba(26,26,24,0.55)' }}
    onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
  >
    {/* Modal card: 700px wide, 560px tall, 2-column grid */}
    <div
      className={`bg-[#FAF8F3] rounded-[14px] w-[700px] max-w-[95vw] h-[560px] grid grid-cols-[230px_1fr] overflow-hidden transition-[opacity,transform] duration-200 ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'}`}
      style={{ border: '0.5px solid #CCC9C0' }}
    >
```

Everything else in the component stays the same.

- [ ] **Step 2: Verify in browser**

Click any channel in the sidebar. The chat modal should fade + scale in. Click the backdrop or ✕ close — it should fade + scale out before disappearing.

- [ ] **Step 3: Commit**

```bash
cd /Users/Student/dashboard
git add src/components/ChatModal.tsx
git commit -m "feat: add fade+scale transition to ChatModal"
```

---

## Task 6: TestChatModal.tsx — fade + scale on open/close

**Files:**
- Modify: `src/components/TestChatModal.tsx`

- [ ] **Step 1: Add isVisible state and handleClose**

At the top of the `TestChatModal` component, add `isVisible` state and a `handleClose` function. Find the existing imports and state declarations:

```tsx
const [messages, setMessages] = useState<Message[]>([])
const [input, setInput] = useState('')
const [loading, setLoading] = useState(false)
const [agentName, setAgentName] = useState('Agent')
const [sessionId] = useState(() => `test-${Date.now()}`)
const bottomRef = useRef<HTMLDivElement>(null)
```

Replace with:

```tsx
const [messages, setMessages] = useState<Message[]>([])
const [input, setInput] = useState('')
const [loading, setLoading] = useState(false)
const [agentName, setAgentName] = useState('Agent')
const [sessionId] = useState(() => `test-${Date.now()}`)
const [isVisible, setIsVisible] = useState(false)
const bottomRef = useRef<HTMLDivElement>(null)

// Trigger entry animation one frame after mount
useEffect(() => {
  requestAnimationFrame(() => setIsVisible(true))
}, [])

const handleClose = () => {
  setIsVisible(false)
  setTimeout(onClose, 200)
}
```

- [ ] **Step 2: Apply transition classes to backdrop and card, replace onClose with handleClose**

Find the return JSX. Replace:

```tsx
return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(26,26,24,0.55)' }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className="bg-[#FAF8F3] rounded-[14px] flex flex-col overflow-hidden w-full max-w-[520px]"
      style={{ height: '560px', border: '0.5px solid #CCC9C0' }}
    >
```

With:

```tsx
return (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    style={{ background: 'rgba(26,26,24,0.55)' }}
    onClick={(e) => e.target === e.currentTarget && handleClose()}
  >
    <div
      className={`bg-[#FAF8F3] rounded-[14px] flex flex-col overflow-hidden w-full max-w-[520px] transition-[opacity,transform] duration-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'}`}
      style={{ height: '560px', border: '0.5px solid #CCC9C0' }}
    >
```

Then find every `onClick={onClose}` inside the component and replace with `onClick={handleClose}`. There are two: the CLEAR button calls `clearChat` (leave that alone), but the ✕ close button calls `onClose`:

```tsx
// Find:
<button
  onClick={onClose}
  className="font-mono text-[11px] text-[#999] px-2 py-1 rounded-[4px] hover:bg-[#EAE7E0] transition-colors"
  style={{ border: '0.5px solid #CCC9C0' }}
>
  ✕ close
</button>

// Replace with:
<button
  onClick={handleClose}
  className="font-mono text-[11px] text-[#999] px-2 py-1 rounded-[4px] hover:bg-[#EAE7E0] transition-colors"
  style={{ border: '0.5px solid #CCC9C0' }}
>
  ✕ close
</button>
```

- [ ] **Step 3: Verify in browser**

Click "05/ test" in the TopBar. Modal fades + scales in. Click ✕ close or the backdrop — it fades + scales out before unmounting.

- [ ] **Step 4: Commit**

```bash
cd /Users/Student/dashboard
git add src/components/TestChatModal.tsx
git commit -m "feat: add fade+scale entry/exit to TestChatModal"
```

---

## Task 7: Sidebar.tsx + TopBar.tsx — active state transition duration

**Files:**
- Modify: `src/components/Sidebar.tsx`
- Modify: `src/components/TopBar.tsx`

- [ ] **Step 1: Add duration-150 ease-in-out to Sidebar channel buttons**

In `src/components/Sidebar.tsx`, find the channels `button` className. Replace:

```tsx
className={`flex items-center gap-2 px-2 py-[7px] rounded-[6px] text-xs w-full text-left transition-colors ${
  activeChannel === i
    ? 'bg-[#1A1A18] text-[#F0EDE6]'
    : 'text-[#5C5C58] hover:bg-[#D8D4CB]'
}`}
```

With:

```tsx
className={`flex items-center gap-2 px-2 py-[7px] rounded-[6px] text-xs w-full text-left transition-colors duration-150 ease-in-out ${
  activeChannel === i
    ? 'bg-[#1A1A18] text-[#F0EDE6]'
    : 'text-[#5C5C58] hover:bg-[#D8D4CB]'
}`}
```

- [ ] **Step 2: Add duration-150 ease-in-out to Sidebar manage buttons**

Find the manage `button` className. Replace:

```tsx
className={`flex items-center gap-2 px-2 py-[7px] rounded-[6px] text-xs w-full text-left transition-colors ${
  location.pathname === item.path
    ? 'bg-[#1A1A18] text-[#F0EDE6]'
    : 'text-[#5C5C58] hover:bg-[#D8D4CB]'
}`}
```

With:

```tsx
className={`flex items-center gap-2 px-2 py-[7px] rounded-[6px] text-xs w-full text-left transition-colors duration-150 ease-in-out ${
  location.pathname === item.path
    ? 'bg-[#1A1A18] text-[#F0EDE6]'
    : 'text-[#5C5C58] hover:bg-[#D8D4CB]'
}`}
```

- [ ] **Step 3: Add duration-150 ease-in-out to TopBar nav buttons**

In `src/components/TopBar.tsx`, find the nav button className. Replace:

```tsx
className={`font-mono text-[11px] px-3 py-1 rounded tracking-wide transition-colors 
  ${
    item.path && location.pathname === item.path
        ? 'bg-[#F0EDE6] text-[#1A1A18]'
        : 'text-[#666] hover:text-[#F0EDE6]'
}`}
```

With:

```tsx
className={`font-mono text-[11px] px-3 py-1 rounded tracking-wide transition-colors duration-150 ease-in-out ${
  item.path && location.pathname === item.path
    ? 'bg-[#F0EDE6] text-[#1A1A18]'
    : 'text-[#666] hover:text-[#F0EDE6]'
}`}
```

- [ ] **Step 4: Verify in browser**

Click between sidebar items and TopBar nav items. The active background pill and text color should transition smoothly over 150ms instead of snapping.

- [ ] **Step 5: Commit**

```bash
cd /Users/Student/dashboard
git add src/components/Sidebar.tsx src/components/TopBar.tsx
git commit -m "feat: smooth active state transitions in Sidebar and TopBar"
```

---

## Task 8: Login.tsx + Signup.tsx — button press feedback

**Files:**
- Modify: `src/pages/Login.tsx`
- Modify: `src/pages/Signup.tsx`

- [ ] **Step 1: Add press feedback to Login submit button**

In `src/pages/Login.tsx`, find the submit button:

```tsx
<button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full py-3.5 rounded-full flex items-center justify-center gap-3 font-mono text-[11px] tracking-[2px] text-[#F0EDE6] transition-colors"
  style={{ background: loading ? '#6A9C79' : '#4A7C59' }}
>
```

Replace with:

```tsx
<button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full py-3.5 rounded-full flex items-center justify-center gap-3 font-mono text-[11px] tracking-[2px] text-[#F0EDE6] transition-[colors,transform] duration-100 active:scale-[0.97]"
  style={{ background: loading ? '#6A9C79' : '#4A7C59' }}
>
```

- [ ] **Step 2: Add press feedback to Signup submit button**

In `src/pages/Signup.tsx`, find the submit button (it will have `onClick={handleSubmit}` and `disabled={loading}`). Replace `transition-colors` with `transition-[colors,transform] duration-100` and add `active:scale-[0.97]` to its existing `className`.

- [ ] **Step 3: Verify in browser**

Go to `http://localhost:5173/login`. Click (don't release immediately) the Sign In button — it should visibly scale down to 97% while held. Same on the signup page.

- [ ] **Step 4: Commit**

```bash
cd /Users/Student/dashboard
git add src/pages/Login.tsx src/pages/Signup.tsx
git commit -m "feat: add press scale feedback to Login and Signup buttons"
```

---

## Done

All 8 tasks complete. The dashboard now has:
- Staggered fade-up on every page/route load
- Shimmer skeleton on AgentCard while data fetches
- Spring-growth bar animation on ResolutionChart
- Fade + scale open/close on both modals
- Smooth 150ms active transitions in Sidebar and TopBar
- Tactile press feedback on all primary buttons
