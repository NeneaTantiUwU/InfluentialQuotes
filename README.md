# Citate Influente

A prototype Next.js app that collects memorable quotes from influential
historical, artistic and scientific figures. The UI is in Romanian, and the
design follows a manuscript/archival theme where each quote category carries
its own accent color (ink) instead of one app-wide brand color.

## Status

Work in progress. Pages and content are edited frequently and some routes
referenced elsewhere in the app (e.g. the "Citate" nav link and the navbar
search, which both point to `/citate`) may not currently exist on disk —
check `src/app` before relying on them.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Plain CSS Modules — no CSS framework
- [Supabase](https://supabase.com) (Postgres) is the intended data layer once
  quotes move out of hardcoded arrays — see `AGENTS.md` for conventions

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## Project structure

- `src/app/` — routes (App Router)
  - `/` — Acasă (home)
  - `/despre-noi` — Despre Noi (about)
- `src/components/` — shared UI (`Navbar`, `Footer`)

See `AGENTS.md` for coding conventions used in this repo.
