# Marmol-Radziner Construction BP

A Next.js + Prisma training app tailored to luxury residential construction. Includes:
- Admin UI (Basic Auth: `Shawn` / `Quiz0810` by default) for questions, divisions, standards, and leaderboard.
- Quick Access to OSHA videos, ICC Building Codes, and Standards.
- User onboarding dialog to capture name/email for leaderboard.
- Vercel Blob upload (set `BLOB_READ_WRITE_TOKEN`) with base64 fallback.

## Getting Started
1. Create a Neon Postgres database and set:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/db?sslmode=require"
DIRECT_DATABASE_URL="postgresql://USER:PASSWORD@HOST/db?sslmode=require"
```
2. `npm install`
3. `npm run dev` for local dev, or `npm run build` for production build.

The build script runs Prisma `db push` and seeds minimal data.
