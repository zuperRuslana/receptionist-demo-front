# Button Spinners Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a rotating spinner animation next to loading text on all async-operation buttons across the dashboard.

**Architecture:** A single shared `Spinner` SVG component is imported into each file that has an async button. Each button renders `{<loadingState> && <Spinner />}` to the left of its existing loading text. No loading text is changed. The TestChatModal send button (icon-only, no text) is the single exception — it swaps its arrow SVG for the spinner while loading.

**Tech Stack:** React, TypeScript, Tailwind CSS (`animate-spin`), Vite dev server

---

## File Map

| Action | File |
|--------|------|
| Create | `src/components/Spinner.tsx` |
| Modify | `src/pages/KnowledgeBase.tsx` |
| Modify | `src/pages/AgentSettings.tsx` |
| Modify | `src/pages/Login.tsx` |
| Modify | `src/pages/Signup.tsx` |
| Modify | `src/pages/ForgotPassword.tsx` |
| Modify | `src/pages/ResetPassword.tsx` |
| Modify | `src/components/TestChatModal.tsx` |

---

### Task 1: Create the Spinner component

**Files:**
- Create: `dashboard/src/components/Spinner.tsx`

- [ ] **Step 1: Create the file**

```tsx
interface SpinnerProps {
  size?: number
}

const Spinner = ({ size = 12 }: SpinnerProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    className="animate-spin flex-shrink-0"
  >
    <circle
      cx="6"
      cy="6"
      r="4.5"
      stroke="currentColor"
      strokeOpacity="0.3"
      strokeWidth="1.5"
    />
    <path
      d="M10.5 6a4.5 4.5 0 0 0-4.5-4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default Spinner
```

- [ ] **Step 2: Verify `animate-spin` is available**

Run: `grep -r "animate-spin" /Users/Student/dashboard/node_modules/tailwindcss/lib/ | head -3`

Expected: matches found (it's a built-in Tailwind utility — if not found, the Tailwind version is very old and you'll need to add a `@keyframes spin` to `index.css` instead).

- [ ] **Step 3: Commit**

```bash
cd /Users/Student/dashboard
git add src/components/Spinner.tsx
git commit -m "feat: add shared Spinner component"
```

---

### Task 2: KnowledgeBase — GENERATE AGENT PROMPT button

**Files:**
- Modify: `dashboard/src/pages/KnowledgeBase.tsx` (line ~441)

The current button:
```tsx
<button onClick={generatePrompt} disabled={generating} className="font-mono text-[10px] text-[#F0EDE6] px-4 py-2 rounded-full tracking-[1px] transition-colors hover:brightness-90" style={{ background: generating ? '#6A9C79' : '#4A7C59' }}>
  {generating ? 'GENERATING...' : 'GENERATE AGENT PROMPT →'}
</button>
```

- [ ] **Step 1: Add Spinner import at the top of the file**

After the existing imports, add:
```tsx
import Spinner from '../components/Spinner'
```

- [ ] **Step 2: Update the button**

Replace the button with:
```tsx
<button onClick={generatePrompt} disabled={generating} className="flex items-center gap-2 font-mono text-[10px] text-[#F0EDE6] px-4 py-2 rounded-full tracking-[1px] transition-colors hover:brightness-90" style={{ background: generating ? '#6A9C79' : '#4A7C59' }}>
  {generating && <Spinner />}
  {generating ? 'GENERATING...' : 'GENERATE AGENT PROMPT →'}
</button>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/KnowledgeBase.tsx
git commit -m "feat: add spinner to Generate Agent Prompt button"
```

---

### Task 3: KnowledgeBase — SAVE INSTRUCTIONS button

**Files:**
- Modify: `dashboard/src/pages/KnowledgeBase.tsx` (line ~687)

The current button:
```tsx
<button
  onClick={saveCustomInstructions}
  disabled={savingInstructions}
  className="font-mono text-[10px] text-[#F0EDE6] px-4 py-2 rounded-lg tracking-[1px] transition-colors"
  style={{ background: savedInstructions ? '#4A7C59' : savingInstructions ? '#6A9C79' : '#1A1A18' }}
>
  {savingInstructions ? 'SAVING...' : savedInstructions ? 'SAVED ✓' : 'SAVE INSTRUCTIONS'}
</button>
```

- [ ] **Step 1: Update the button**

Replace with:
```tsx
<button
  onClick={saveCustomInstructions}
  disabled={savingInstructions}
  className="flex items-center gap-2 font-mono text-[10px] text-[#F0EDE6] px-4 py-2 rounded-lg tracking-[1px] transition-colors"
  style={{ background: savedInstructions ? '#4A7C59' : savingInstructions ? '#6A9C79' : '#1A1A18' }}
>
  {savingInstructions && <Spinner />}
  {savingInstructions ? 'SAVING...' : savedInstructions ? 'SAVED ✓' : 'SAVE INSTRUCTIONS'}
</button>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/KnowledgeBase.tsx
git commit -m "feat: add spinner to Save Instructions button"
```

---

### Task 4: KnowledgeBase — IMPORT SITE button

**Files:**
- Modify: `dashboard/src/pages/KnowledgeBase.tsx` (line ~827)

The current button:
```tsx
<button
  onClick={scrapeWebsite}
  disabled={scraping || !websiteUrl.trim()}
  className="font-mono text-[10px] text-[#F0EDE6] px-4 py-3 rounded-[10px] transition-opacity whitespace-nowrap"
  style={{ background: '#1A1A18', opacity: scraping || !websiteUrl.trim() ? 0.5 : 1 }}
>
  {scraping ? 'IMPORTING...' : 'IMPORT SITE →'}
</button>
```

- [ ] **Step 1: Update the button**

Replace with:
```tsx
<button
  onClick={scrapeWebsite}
  disabled={scraping || !websiteUrl.trim()}
  className="flex items-center gap-2 font-mono text-[10px] text-[#F0EDE6] px-4 py-3 rounded-[10px] transition-opacity whitespace-nowrap"
  style={{ background: '#1A1A18', opacity: scraping || !websiteUrl.trim() ? 0.5 : 1 }}
>
  {scraping && <Spinner />}
  {scraping ? 'IMPORTING...' : 'IMPORT SITE →'}
</button>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/KnowledgeBase.tsx
git commit -m "feat: add spinner to Import Site button"
```

---

### Task 5: KnowledgeBase — EXTRACT WITH AI button

**Files:**
- Modify: `dashboard/src/pages/KnowledgeBase.tsx` (line ~851)

The current button:
```tsx
<button
  onClick={extract}
  disabled={extracting || !rawText.trim()}
  className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] text-[#F0EDE6] px-5 py-[10px] rounded-lg tracking-[1px] transition-opacity"
  style={{ background: '#1A1A18', opacity: extracting || !rawText.trim() ? 0.5 : 1 }}
>
  {extracting ? 'EXTRACTING...' : 'EXTRACT WITH AI'}
  {!extracting && <span className="text-[9px] text-[#666]"></span>}
</button>
```

- [ ] **Step 1: Update the button**

Replace with:
```tsx
<button
  onClick={extract}
  disabled={extracting || !rawText.trim()}
  className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] text-[#F0EDE6] px-5 py-[10px] rounded-lg tracking-[1px] transition-opacity"
  style={{ background: '#1A1A18', opacity: extracting || !rawText.trim() ? 0.5 : 1 }}
>
  {extracting && <Spinner />}
  {extracting ? 'EXTRACTING...' : 'EXTRACT WITH AI'}
  {!extracting && <span className="text-[9px] text-[#666]"></span>}
</button>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/KnowledgeBase.tsx
git commit -m "feat: add spinner to Extract with AI button"
```

---

### Task 6: KnowledgeBase — SAVE ALL button

**Files:**
- Modify: `dashboard/src/pages/KnowledgeBase.tsx` (line ~885)

The current button:
```tsx
<button onClick={saveAll} disabled={saving} className="font-mono text-[10px] text-[#F0EDE6] px-4 py-[7px] rounded-full cursor-pointer hover:brightness-90 transition-all" style={{ background: saving ? '#6A9C79' : '#4A7C59' }}>
  {saving ? 'SAVING...' : 'SAVE ALL →'}
</button>
```

- [ ] **Step 1: Update the button**

Replace with:
```tsx
<button onClick={saveAll} disabled={saving} className="flex items-center gap-2 font-mono text-[10px] text-[#F0EDE6] px-4 py-[7px] rounded-full cursor-pointer hover:brightness-90 transition-all" style={{ background: saving ? '#6A9C79' : '#4A7C59' }}>
  {saving && <Spinner />}
  {saving ? 'SAVING...' : 'SAVE ALL →'}
</button>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/KnowledgeBase.tsx
git commit -m "feat: add spinner to Save All button"
```

---

### Task 7: AgentSettings — SAVE CHANGES button

**Files:**
- Modify: `dashboard/src/pages/AgentSettings.tsx` (line ~352)

- [ ] **Step 1: Add Spinner import**

After the existing imports, add:
```tsx
import Spinner from '../components/Spinner'
```

- [ ] **Step 2: Update the button**

Current:
```tsx
<button
  onClick={handleSave}
  disabled={saving}
  className="font-mono text-[11px] tracking-widest px-6 py-3 rounded-lg transition-colors"
  style={{
    background: saved ? '#4A7C59' : '#1A1A18',
    color: '#F0EDE6',
    opacity: saving ? 0.7 : 1,
  }}
>
  {saving ? 'SAVING...' : saved ? 'SAVED ✓' : 'SAVE CHANGES'}
</button>
```

Replace with:
```tsx
<button
  onClick={handleSave}
  disabled={saving}
  className="flex items-center gap-2 font-mono text-[11px] tracking-widest px-6 py-3 rounded-lg transition-colors"
  style={{
    background: saved ? '#4A7C59' : '#1A1A18',
    color: '#F0EDE6',
    opacity: saving ? 0.7 : 1,
  }}
>
  {saving && <Spinner />}
  {saving ? 'SAVING...' : saved ? 'SAVED ✓' : 'SAVE CHANGES'}
</button>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/AgentSettings.tsx
git commit -m "feat: add spinner to Save Changes button"
```

---

### Task 8: Login — SIGN IN button

**Files:**
- Modify: `dashboard/src/pages/Login.tsx` (line ~121)

- [ ] **Step 1: Add Spinner import**

After the existing imports, add:
```tsx
import Spinner from '../components/Spinner'
```

- [ ] **Step 2: Update the button**

Current:
```tsx
<button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full py-3.5 rounded-full flex items-center justify-center gap-3 font-mono text-[11px] tracking-[2px] text-[#F0EDE6] transition-[color,background-color,border-color,transform] duration-100 active:scale-[0.97] hover:brightness-90"
  style={{ background: loading ? '#6A9C79' : '#4A7C59' }}
>
  {loading ? 'SIGNING IN...' : 'SIGN IN'}
  {!loading && (
    <span className="w-6 h-6 rounded-full bg-[#3A6249] flex items-center justify-center text-xs">
      →
    </span>
  )}
</button>
```

Replace with:
```tsx
<button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full py-3.5 rounded-full flex items-center justify-center gap-3 font-mono text-[11px] tracking-[2px] text-[#F0EDE6] transition-[color,background-color,border-color,transform] duration-100 active:scale-[0.97] hover:brightness-90"
  style={{ background: loading ? '#6A9C79' : '#4A7C59' }}
>
  {loading && <Spinner />}
  {loading ? 'SIGNING IN...' : 'SIGN IN'}
  {!loading && (
    <span className="w-6 h-6 rounded-full bg-[#3A6249] flex items-center justify-center text-xs">
      →
    </span>
  )}
</button>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Login.tsx
git commit -m "feat: add spinner to Sign In button"
```

---

### Task 9: Signup — CREATE ACCOUNT button

**Files:**
- Modify: `dashboard/src/pages/Signup.tsx` (line ~257)

- [ ] **Step 1: Add Spinner import**

After the existing imports, add:
```tsx
import Spinner from '../components/Spinner'
```

- [ ] **Step 2: Update the button**

Current:
```tsx
<button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full py-[13px] rounded-full flex items-center justify-center gap-3 font-mono text-[11px] tracking-[2px] text-[#F0EDE6] transition-[color,background-color,border-color,transform] duration-100 active:scale-[0.97] hover:brightness-90"
  style={{ background: loading ? '#6A9C79' : '#4A7C59' }}
>
  {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
  {!loading && (
    <span className="w-[22px] h-[22px] rounded-full bg-[#3A6249] flex items-center justify-center text-[11px]">
      →
    </span>
  )}
</button>
```

Replace with:
```tsx
<button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full py-[13px] rounded-full flex items-center justify-center gap-3 font-mono text-[11px] tracking-[2px] text-[#F0EDE6] transition-[color,background-color,border-color,transform] duration-100 active:scale-[0.97] hover:brightness-90"
  style={{ background: loading ? '#6A9C79' : '#4A7C59' }}
>
  {loading && <Spinner />}
  {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
  {!loading && (
    <span className="w-[22px] h-[22px] rounded-full bg-[#3A6249] flex items-center justify-center text-[11px]">
      →
    </span>
  )}
</button>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Signup.tsx
git commit -m "feat: add spinner to Create Account button"
```

---

### Task 10: ForgotPassword — SEND RESET LINK button

**Files:**
- Modify: `dashboard/src/pages/ForgotPassword.tsx` (line ~52)

- [ ] **Step 1: Add Spinner import**

After the existing imports, add:
```tsx
import Spinner from '../components/Spinner'
```

- [ ] **Step 2: Update the button**

Current:
```tsx
<button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full font-mono text-[11px] tracking-widest py-3 rounded-lg text-[#F0EDE6] mb-4"
  style={{ background: loading ? '#6A9C79' : '#1A1A18', opacity: loading ? 0.7 : 1 }}
>
  {loading ? 'SENDING...' : 'SEND RESET LINK'}
</button>
```

Replace with:
```tsx
<button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full flex items-center justify-center gap-2 font-mono text-[11px] tracking-widest py-3 rounded-lg text-[#F0EDE6] mb-4"
  style={{ background: loading ? '#6A9C79' : '#1A1A18', opacity: loading ? 0.7 : 1 }}
>
  {loading && <Spinner />}
  {loading ? 'SENDING...' : 'SEND RESET LINK'}
</button>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/ForgotPassword.tsx
git commit -m "feat: add spinner to Send Reset Link button"
```

---

### Task 11: ResetPassword — UPDATE PASSWORD button

**Files:**
- Modify: `dashboard/src/pages/ResetPassword.tsx` (line ~80)

- [ ] **Step 1: Add Spinner import**

After the existing imports, add:
```tsx
import Spinner from '../components/Spinner'
```

- [ ] **Step 2: Update the button**

Current:
```tsx
<button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full font-mono text-[11px] tracking-widest py-3 rounded-lg text-[#F0EDE6]"
  style={{ background: loading ? '#6A9C79' : '#1A1A18', opacity: loading ? 0.7 : 1 }}
>
  {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
</button>
```

Replace with:
```tsx
<button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full flex items-center justify-center gap-2 font-mono text-[11px] tracking-widest py-3 rounded-lg text-[#F0EDE6]"
  style={{ background: loading ? '#6A9C79' : '#1A1A18', opacity: loading ? 0.7 : 1 }}
>
  {loading && <Spinner />}
  {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
</button>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/ResetPassword.tsx
git commit -m "feat: add spinner to Update Password button"
```

---

### Task 12: TestChatModal — Send button (icon-only exception)

**Files:**
- Modify: `dashboard/src/components/TestChatModal.tsx` (line ~251)

The send button has no text — it shows an arrow SVG. While loading, the spinner replaces the arrow.

- [ ] **Step 1: Add Spinner import**

After the existing imports, add:
```tsx
import Spinner from './Spinner'
```

- [ ] **Step 2: Update the button**

Current:
```tsx
<button
  onClick={sendMessage}
  disabled={loading || !input.trim()}
  className="w-9 h-9 rounded-full bg-[#1A1A18] flex items-center justify-center flex-shrink-0 transition-opacity"
  style={{ opacity: loading || !input.trim() ? 0.4 : 1 }}
>
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M12 7H2M8 3l4 4-4 4" stroke="#F0EDE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</button>
```

Replace with:
```tsx
<button
  onClick={sendMessage}
  disabled={loading || !input.trim()}
  className="w-9 h-9 rounded-full bg-[#1A1A18] flex items-center justify-center flex-shrink-0 transition-opacity text-[#F0EDE6]"
  style={{ opacity: loading || !input.trim() ? 0.4 : 1 }}
>
  {loading ? (
    <Spinner size={14} />
  ) : (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 7H2M8 3l4 4-4 4" stroke="#F0EDE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )}
</button>
```

Note: `text-[#F0EDE6]` is added to the button so `currentColor` in the Spinner SVG picks up the white color.

- [ ] **Step 3: Commit**

```bash
git add src/components/TestChatModal.tsx
git commit -m "feat: add spinner to TestChatModal send button"
```

---

### Task 13: Visual verification

- [ ] **Step 1: Start the dev server**

```bash
cd /Users/Student/dashboard && npm run dev
```

- [ ] **Step 2: Verify each button**

For each page below, trigger a loading state and confirm the spinner appears spinning to the left of the loading text (or replacing the arrow in TestChatModal):

| Page/Component | How to trigger |
|---|---|
| Login | Submit the login form |
| Signup | Submit the signup form |
| ForgotPassword | Submit a forgot-password email |
| ResetPassword | Submit a new password |
| AgentSettings | Click SAVE CHANGES |
| KnowledgeBase → GENERATE AGENT PROMPT | Click the button on the Knowledge Base page |
| KnowledgeBase → SAVE INSTRUCTIONS | Edit and save custom instructions |
| KnowledgeBase → IMPORT SITE | Enter a URL and click IMPORT SITE |
| KnowledgeBase → EXTRACT WITH AI | Paste text and click EXTRACT WITH AI |
| KnowledgeBase → SAVE ALL | After extracting, click SAVE ALL |
| TestChatModal | Open the chat modal and send a message |
