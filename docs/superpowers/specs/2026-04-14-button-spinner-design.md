# Button Spinner Design

**Date:** 2026-04-14

## Goal

Add a loading spinner animation to all buttons that trigger async API operations, displayed alongside the existing loading text (not replacing it).

## Spinner Component

- **File:** `dashboard/src/components/Spinner.tsx`
- A 12×12px SVG circle with a visible gap, animated via Tailwind `animate-spin`
- Uses `currentColor` so it inherits the button's text color automatically
- Optional `size` prop (default: 12)

## Placement

- Spinner appears to the **left** of the loading text
- Button content uses `flex items-center gap-2 justify-center` layout
- Pattern: `{loading && <Spinner />}` before the label

## Buttons to Update

| File | Button label | Loading state |
|---|---|---|
| `src/pages/KnowledgeBase.tsx` | GENERATE AGENT PROMPT → | `generating` |
| `src/pages/KnowledgeBase.tsx` | IMPORT SITE → | `scraping` |
| `src/pages/KnowledgeBase.tsx` | EXTRACT WITH AI | `extracting` |
| `src/pages/KnowledgeBase.tsx` | SAVE ALL → | `saving` |
| `src/pages/KnowledgeBase.tsx` | SAVE INSTRUCTIONS | `savingInstructions` |
| `src/pages/AgentSettings.tsx` | SAVE CHANGES | `saving` |
| `src/pages/Login.tsx` | SIGN IN | `loading` |
| `src/pages/Signup.tsx` | CREATE ACCOUNT | `loading` |
| `src/pages/ForgotPassword.tsx` | SEND RESET LINK | `loading` |
| `src/pages/ResetPassword.tsx` | UPDATE PASSWORD | `loading` |
| `src/components/TestChatModal.tsx` | Send (icon-only) | `loading` — spinner replaces arrow SVG |

## Special Case: TestChatModal Send Button

The send button is icon-only (arrow SVG, no text). Since there is no text to keep, the spinner replaces the arrow SVG while `loading` is true. This is the one exception to the "don't replace text" rule — it applies only to text buttons.
