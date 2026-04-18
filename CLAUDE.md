# Life Calculator

## Stack
- Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion
- Deployed to Vercel at macedo.app/life-calculator
- All client-side computation, no backend/database
- npm (not pnpm)

## Commands
- `npm run dev` — start dev server
- `npx tsc --noEmit` — type check
- `npm run build` — production build

## Architecture
- `/src/lib/` — pure calculation logic, country data, types, permalink encoding
- `/src/components/calculator/` — Phase 1 input components (QuestionFlow)
- `/src/components/reveal/` — Phase 2 staggered reveal components
- `/src/components/play/` — Phase 3 interactive slider components
- `/src/hooks/useCalculator.ts` — central state management
- `/src/app/life-calculator/` — main route, /filipe, /methodology, /og

## Key rules
- All question copy, formulas, and methodology are **locked** — see the PRD
- Tone: warm, honest, editorial, non-moralizing. No confetti, no celebration.
- The calculator uses `percentLived` rounded to integer ("roughly 45%", never "45.3%")
- Modifier formulas must match the PRD exactly — they are in `/src/lib/modifiers.ts`
