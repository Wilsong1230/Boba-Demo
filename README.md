# Boba Bay

A portfolio demo site for a fictional craft boba tea shop. Built to showcase frontend skills with smooth animations, responsive layout, and interactive UI patterns — no backend required.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** — `@theme {}` token system
- **Framer Motion** — page transitions, staggered lists, layout animations
- **React Context + useReducer** — cart, order builder, rewards state
- **Vitest + React Testing Library** — unit tests for core logic
- **Google Fonts** — Yeseva One, Plus Jakarta Sans, Caveat

## Pages

| Route | Description |
|---|---|
| `/` | Home — animated sticker-book hero with floating cups and marquee strip |
| `/menu` | Menu — featured drink hero, category filter chips, staggered drink grid |
| `/order` | Order — 4-step stepper (drink → size → customize → review) with live preview |
| `/cart` | Cart — pickup-first layout with time slots, animated running total, confetti confirmation |
| `/rewards` | Rewards — stamp card, Bean Bucks balance, activity feed with demo interactions |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm test
```

11 tests across price utilities, CartContext, and OrderContext.

## Notes

All data is static — no API calls, no database. Cart, order, and rewards state live in React Context and reset on page refresh. The site is intentionally a demo: interactions are mocked and the "Place Order" flow ends with a confetti animation.
