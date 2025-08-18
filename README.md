# Marmol-Radziner Construction BP (Modern iOS UI + Gotham)

A sleek, mobile-first training app for luxury residential construction. This package includes:
- Modern iPhone-like UI (glass cards, icon tiles, gradients)
- Icon tab bar + haptics + view transitions
- Role-track badges, skeleton loaders, iOS pull-to-refresh
- Prisma + PostgreSQL (Neon-ready)
- **Gotham font integrated** (bring your licensed .woff2 files)

## Quick start
```bash
npm install
cp .env.example .env   # fill DATABASE_URL and DIRECT_DATABASE_URL
npm run db:push
npm run db:seed
npm run dev
```
Open http://localhost:3000

## Deploy on Vercel
1. Push to GitHub, import the repo in Vercel.
2. Env vars (Project → Settings → Environment Variables):
   - `DATABASE_URL` → Neon pooled URI
   - `DIRECT_DATABASE_URL` → Neon direct URI
3. Build command runs Prisma push + seed automatically using package.json scripts.

## Gotham font
Put your licensed files here:
```
public/fonts/gotham/Gotham-Book.woff2
public/fonts/gotham/Gotham-Medium.woff2
public/fonts/gotham/Gotham-Bold.woff2
```
Gotham is licensed—this repo does **not** include the binaries.
