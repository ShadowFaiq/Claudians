# Frontend

Frontend app for Claudians built with:

- Next.js (App Router)
- Tailwind CSS v4
- shadcn/ui

## Local Development

From the `frontend` directory:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Setup Reference (Fresh Project)

If you want to recreate this stack from scratch in a new project:

```bash
npx create-next-app@latest frontend --typescript --app --eslint
cd frontend
npm install tailwindcss @tailwindcss/postcss tw-animate-css
npx shadcn@latest init
npx shadcn@latest add button
```

## Key Files

- `app/page.tsx`: dashboard bento grid sketch
- `app/globals.css`: Tailwind and theme tokens
- `components/ui/button.tsx`: shadcn/ui button component
- `components.json`: shadcn/ui configuration
