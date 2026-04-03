# ZarFlow — Personal Finance Dashboard

A clean, interactive finance dashboard built as part of a frontend developer internship assignment. The goal was to create something that feels genuinely useful not just a list of boxes ticking requirements, but an interface someone would actually want to open every day to understand their money.

---

## What it does

ZarFlow gives you a bird's-eye view of your financial life across three main areas:

**Dashboard** — the first thing you see. Summary cards show your total balance, income, expenses, and savings rate at a glance. Below that, an area chart tracks your monthly balance trend over time, and a donut chart breaks down where your money is going by category.

**Transactions** — a full table of every transaction with search, filtering by type and category, date range picking, and sorting by any column. Admins can add new transactions, edit existing ones, and delete records. Everything you'd expect from a real finance tool.

**Insights** — the part that actually makes the data meaningful. Cards surface your top spending category, best saving month, highest spending month, and average monthly expenses. Two bar charts let you compare spending across categories and see how each month stacked up against the others. A written observations section ties it all together in plain language.

---

## Getting started

Clone the repo and install dependencies:

```bash
git clone https://github.com/Badejomichael/zarflow.git
cd finance-dashboard
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you should see the dashboard immediately with pre-loaded mock data.

To build for production:

```bash
npm run build
npm start
```

---

## Tech stack

| Thing | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Industry standard, great DX |
| Language | TypeScript | Catches the dumb mistakes early |
| Styling | Tailwind CSS + inline styles | Tailwind for layout, inline for component-specific design tokens |
| Animations | Framer Motion | Smooth, spring-based transitions throughout |
| Charts | Recharts | Composable, plays well with React |
| Icons | React Icons (Remix Icon set) | Consistent, clean icon language |
| State | React Context + hooks | Right-sized for this scope(no Redux needed) |
| Persistence | localStorage | Transactions survive a page refresh |

---

## Project structure

```
app/
├── page.tsx                  # Main page, composes the three views
├── layout.tsx                # Root layout, wraps everything in AppProvider
├── globals.css               # Design tokens, fonts, base styles
├── context/
│   └── AppContext.tsx        # Global state - transactions, filters, role, UI
├── types/
│   └── index.ts              # Shared TypeScript interfaces
├── data/
│   └── mockData.ts           # 51 transactions across 6 months
└── components/
    ├── layout/
    │   ├── Sidebar.tsx       # Desktop nav + mobile drawer
    │   └── Header.tsx        # Top bar with tab nav and role switcher
    ├── dashboard/
    │   ├── SummaryCards.tsx
    │   ├── BalanceTrendChart.tsx
    │   └── SpendingBreakdownChart.tsx
    ├── transactions/
    │   ├── TransactionFilters.tsx
    │   ├── TransactionTable.tsx
    │   └── AddTransactionModal.tsx
    ├── insights/
    │   └── InsightsSection.tsx
    └── ui/
        └── CustomSelect.tsx  # Reusable styled dropdown
```

---

## Role-based UI

There's a role switcher in the top-right corner of the header. Switch between **Admin** and **Viewer** to see how the UI adapts:

- **Admin** — can add transactions via the button in the transactions table, edit any existing record by clicking the pencil icon, and delete records with the bin icon.
- **Viewer** — all the data is visible and fully browsable, but the action buttons are hidden. No accidental edits.

This is purely frontend simulation, no backend auth. It's meant to demonstrate how UI behaviour changes based on role, which is exactly what the assignment asked for.

---

## Design decisions

A few things I made deliberate choices about and want to be transparent about:

**No native `<select>` elements.** The OS-native dropdown is impossible to style consistently across browsers and would have broken the dark theme immediately. Every dropdown in the app is a custom-built component using a `div`-based list with Framer Motion animations, outside-click dismissal, and keyboard support (Escape to close).

**Inline styles over Tailwind classes for component-level design.** Tailwind is great for layout and spacing, but when a component has many conditional style states — active/inactive, open/closed, income/expense — inline styles make the logic much easier to follow in one place. The global CSS handles fonts, colour tokens, and base resets.

**The modal centering fix.** Framer Motion owns the `transform` CSS property on any `motion.div` it animates. If you also set `transform: translate(-50%, -50%)` for centering on the same element, Motion overwrites it during the animation. The solution is a static flex wrapper div that handles centering, with the animated panel sitting inside it. Motion can animate freely without fighting the positioning.

**localStorage for persistence.** Transactions you add or edit survive a page refresh. If you want to reset to the original mock data, open your browser's DevTools, go to Application → Local Storage, and delete the `fd_transactions` key.

---

## What I'd add with more time

These didn't make it in but would be the natural next steps:

- **Export to JSON** alongside the existing CSV export
- **Budget targets** — set a monthly limit per category and get a visual warning when you're close
- **Dark/light mode toggle** — the design language is built on CSS variables so this would be a relatively clean addition
- **Recurring transaction detection** — the mock data already has patterns (same salary every 5th, same rent every 7th) that could be surfaced automatically
- **A real backend** — swap localStorage for an API, add actual auth, persist across devices

---

## Notes for reviewers

The mock data covers January through June 2025 — 51 transactions spread across income categories (Salary, Freelance, Investment) and expense categories (Rent, Food & Dining, Transport, Shopping, Healthcare, Entertainment, Utilities, Education). The data was designed to have realistic patterns so the insights section has something meaningful to say.

All state management runs through a single `AppContext`. It's not over-engineered(no reducers, no action types, just `useState` and `useMemo` with stable `useCallback` references). For an app of this scope, that's the right call.

If anything looks off or you have questions about any of the decisions, I'm happy to walk through it.
