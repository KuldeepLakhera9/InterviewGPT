# InterviewGPT — Design System Specification

## Executive Summary

InterviewGPT implements a precision-crafted, monochrome-first design system tailored for technical power users. It balances high-density information display with quiet visual elegance inspired by **Linear**, **Vercel**, **Stripe**, and **Raycast**.

---

## 1. Design Tokens

### 1.1 Dark Theme Primary Color Palette (HSL System)

The interface defaults to a dark mode palette built on Zinc neutrals with targeted accent hues for functional status.

```css
:root {
  /* Neutral Backgrounds & Surfaces */
  --bg-app: HSL(240, 6%, 6%); /* #0f0f11 - Main canvas */
  --bg-surface-1: HSL(240, 5%, 9%); /* #17171a - Cards & Sidebar */
  --bg-surface-2: HSL(240, 5%, 13%); /* #202024 - Input fields & Modals */
  --bg-surface-hover: HSL(240, 5%, 16%); /* #28282d - Active states */

  /* Borders & Dividers */
  --border-subtle: HSL(240, 4%, 16%); /* Ultra-clean borders */
  --border-strong: HSL(240, 4%, 25%);

  /* Typography Colors */
  --text-primary: HSL(0, 0%, 98%); /* High contrast primary text */
  --text-secondary: HSL(240, 4%, 65%); /* Muted labels & secondary info */
  --text-tertiary: HSL(240, 4%, 45%); /* Placeholder text & hotkey badges */

  /* Functional Status Accents */
  --accent-primary: HSL(212, 100%, 55%); /* Electric Blue (CTA & Active Focus) */
  --status-success: HSL(142, 71%, 45%); /* Emerald (Passed tests / Mastered skills) */
  --status-warning: HSL(38, 92%, 50%); /* Amber (Filler word warning / High WPM) */
  --status-danger: HSL(0, 84%, 60%); /* Rose Red (Failed tests / Mic error) */
}
```

### 1.2 Typography System

- **Primary Interface Font**: `Inter` (Variable Font, weight 400 to 700).
- **Code & Monospace Font**: `JetBrains Mono` (Weights 400, 500, 600).

```css
/* Typography Scale */
--font-xs: 0.75rem / 1rem; /* 12px / 16px - Micro badges & Hotkeys */
--font-sm: 0.875rem / 1.25rem; /* 14px / 20px - Secondary body & Table cell */
--font-base: 1rem / 1.5rem; /* 16px / 24px - Standard body text */
--font-lg: 1.125rem / 1.75rem; /* 18px / 28px - Card headers & Modal titles */
--font-xl: 1.5rem / 2rem; /* 24px / 32px - Section headings */
--font-2xl: 2.25rem / 2.5rem; /* 36px / 40px - Scorecard Overall Score Display */
```

### 1.3 Spacing & Radius Scale

- **Spacing Unit**: 4px base (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`).
- **Border Radius**:
  - `radius-sm`: `4px` (Hotkey badges, micro tags).
  - `radius-md`: `6px` (Buttons, Inputs, Code editor shell).
  - `radius-lg`: `10px` (Cards, Scorecard panels, Command Menu modal).

---

## 2. Core UI Component Specifications

### 2.1 Button Component Matrix

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Primary CTA    │ Background: --accent-primary | Text: White | 6px radius│
│ Secondary      │ Background: --bg-surface-2 | Border: --border-subtle   │
│ Ghost / Minimal│ Background: Transparent | Hover: --bg-surface-hover     │
│ Danger         │ Background: --status-danger | Text: White             │
└─────────────────────────────────────────────────────────────────────────┘
```

#### States & Micro-interactions

- **Active Focus**: `outline: 2px solid var(--accent-primary)`, `outline-offset: 2px`.
- **Press Effect**: `transform: scale(0.98)` with `100ms ease-out` transition.

---

### 2.2 Command Menu Overlay (`<CommandKPalette />`)

Raycast-style command menu appearing centered on screen with backdrop blur:

- **Dimensions**: Fixed width `640px`, max height `420px`.
- **Visual Spec**:
  - Backdrop: `rgba(0, 0, 0, 0.75)` with `backdrop-filter: blur(8px)`.
  - Container: `--bg-surface-1`, border `--border-strong`, shadow `0 20px 40px rgba(0,0,0,0.5)`.
- **Keyboard Behavior**: `ArrowDown` / `ArrowUp` to navigate list, `Enter` to select, `Esc` to close.

---

### 2.3 Interactive Audio Waveform Visualizer (`<AudioWaveform />`)

Renders live candidate microphone input volume in real time using HTML5 Canvas:

- **Bar Count**: 32 dynamic vertical bars.
- **Bar Width & Gap**: Width `3px`, gap `2px`.
- **Idle Color**: `--text-tertiary`.
- **Active Speaking Color**: Gradient transition from `--accent-primary` to `--status-success` based on amplitude.

---

### 2.4 Scorecard Gauge & Pillar Card (`<ScorecardGauge />`)

Displays score metrics with high visual impact:

- **Overall Score Radial Gauge**: 120px circular SVG arc meter displaying score (e.g. `86.4`).
- **Pillar Progress Bars**: Horizontal bar with indicator mark for candidate performance vs target role benchmark.
  - Score ≥ 80: `--status-success` (Emerald).
  - Score 60-79: `--status-warning` (Amber).
  - Score < 60: `--status-danger` (Rose).

---

## 3. Accessibility Standards (WCAG 2.1 AA Compliance)

1. **Color Contrast Ratio**: All body text must maintain a minimum contrast ratio of **4.5:1** against surface backgrounds; large headings maintain **3:1**.
2. **Keyboard Focus Management**: Every interactive element features an explicit focus-visible state. Modals trap focus; closing a modal restores focus to the triggering element.
3. **Screen Reader Live Regions (`aria-live`)**:
   - Live interview audio captions use `aria-live="polite"` to announce interviewer questions without interrupting screen reader navigation.
   - Micro-telemetry warnings (e.g., filler word alerts) use `aria-live="assertive"` for immediate screen reader awareness.
