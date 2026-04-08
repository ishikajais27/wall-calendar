# 📅 Wall Calendar — Interactive React Component

A polished, feature rich wall calendar built with **Next.js 14 (App Router)** and vanilla React no UI library dependencies. Designed to feel like a physical wall calendar while being fully interactive on both desktop and mobile.

---

## ✨ Features

### Core Requirements

- **Wall Calendar Aesthetic** — Hero image panel with month-specific emoji, gradient, and year typography, paired with a clean date grid below
- **Day Range Selector** — Click to set a start date, click again to set the end. Visual states for start, end, in-range, and live hover-preview
- **Integrated Notes** — Per-date notes with a mood picker (😊😐😔🔥🌿✨), saved instantly to `localStorage`. Dots on calendar cells indicate existing notes
- **Fully Responsive** — Card-based layout that stacks gracefully on mobile; all interactions work on touch screens

### Bonus Features

- **8 Theme Backgrounds** — Switchable illustrated backgrounds (local `/bg/bg1–8.png`) each paired with a matching accent color system via a `THEMES` map
- **Flip Animation** — Month transitions use a `fadeFlip` CSS keyframe animation (420ms), gated by a `flipping` flag to prevent rapid firing
- **Holiday Markers** — Indian public holidays pre-mapped as `YYYY-M-D` keys; marked with a red dot on the grid and visible via `title` tooltip
- **Quick-Select Chips** — One-click selection for _Today_, _This Week_, _Next 7 Days_, and _Full Month_
- **Notes Tab** — Separate tab view listing all saved notes sorted by date, each clickable to jump back to that date on the calendar
- **Year Picker** — Dropdown spanning ±5 years from current year; month navigation auto-rolls the year
- **Cat Clock Widget** — A floating analog clock (SVG) with a decorative black cat sitting on top, toggled via a fixed button; second/minute/hour hands update every second
- **Keyboard Navigation** — Arrow keys move focus between day cells; `Escape` clears the selection
- **`localStorage` Persistence** — Notes, moods, and selected background index all persist across sessions via a custom `useLocalStorageSync` hook

---

## 🗂 Project Structure

```
├── app/
│   ├── layout.js          # Google Fonts (Poppins, Caveat, Playfair Display), global CSS vars
│   ├── page.js            # Root page — renders <Calendar /> and <SheepClock />
│   └── globals.css        # Keyframe animations, body centering, box-sizing reset
│
└── components/
    ├── Calendar.jsx        # Core component — all state, theme, grid logic, note editor
    ├── CalendarGrid.jsx    # Memoized grid — day headers, range banner, keyboard handler
    ├── DateCell.jsx        # Memoized cell — visual states (start/end/range/preview/note/holiday)
    ├── HeroImage.jsx       # Month hero panel — gradient + emoji + year/month label
    ├── NotesPanel.jsx      # (Stub — notes panel is inline in Calendar.jsx)
    └── SheepClock.jsx      # Floating analog SVG clock with cat illustration
```

---

## 🧠 Technical Decisions

| Decision                                | Rationale                                                                                                               |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `memo` on `CalendarGrid` and `DateCell` | Prevents full grid re-renders on hover state changes in the parent                                                      |
| `useMemo` for day array                 | Recalculates only when `month` or `year` changes, not on every render                                                   |
| `useLocalStorageSync` custom hook       | Centralizes SSR-safe `localStorage` reads/writes with a single setState interface                                       |
| CSS-in-JS (inline styles) over Tailwind | Dynamic theme values (accent colors, borders) can't be expressed with static Tailwind classes without `safelist` hacks  |
| Date keys as `YYYY-M-D` strings         | Compact, collision-free key format for notes/moods maps; avoids timezone-shifted ISO strings                            |
| `flipping` guard on month nav           | Prevents animation jank if user clicks arrows rapidly                                                                   |
| SVG clock as a component                | Zero dependencies; fully customizable; animates via JS-computed degrees rather than CSS transitions to avoid jump at 0° |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Install & Run

```bash
git clone <your-repo-url>
cd wall-calendar
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Optional: Background Images

Place 8 background images named `bg1.png` through `bg8.png` in the `/public/bg/` directory to enable the theme switcher. The calendar falls back gracefully to solid colors if images are absent.

---

## 📦 Dependencies

```json
{
  "next": "16.2",
  "react": "^19.2.4",
  "react-dom": "^19.2.4"
}
```

No external component libraries. No CSS frameworks beyond Tailwind for global resets.

---

## 🎥 Demo

> [text](https://wall-calendar-swart.vercel.app/)

> https://drive.google.com/file/d/1Viqs04tCQvcyqW_4y0PBnCoCidZoUeJk/view?usp=drive_link

---

## 📌 Notes on Scope

- **No backend.** All data lives in `localStorage`.
- **No third-party calendar library.** The date grid, range logic, and holiday map are hand-rolled.
- Holidays are seeded for Indian public holidays (2026). Easily extensible via the `HOLIDAYS` object in `Calendar.jsx`.
