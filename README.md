# SetClapp Digital Business Card

The React app runs on Vercel. A Vercel Function serves the API. Shared company, employee, card and account data is encrypted and saved in Vercel Blob. Uploaded PNG, JPG, WebP and GIF images are also saved in Vercel Blob. Browser localStorage holds only the login session and UI preferences.

## Vercel setup

1. Import `anarism03/digitalbusinesscard` into Vercel with the Vite preset. Use `npm ci`, `npm run build`, and `dist`.
2. In the project's **Storage** tab, create a **public Vercel Blob** store and connect it to Production. Vercel supplies Blob credentials to its Functions automatically.
3. In **Settings → Environment Variables**, set `AUTH_SECRET` to a random secret of at least 32 characters and `INITIAL_ADMIN_PASSWORD` to a strong temporary password. Add both to Production. Do not prefix them with `VITE_`. Keep `AUTH_SECRET` unchanged after data is saved because changing it makes saved data unreadable.
4. Redeploy after connecting the store and setting the variables. Encrypted sample records are created in `mock-db/state.enc` on the first API request. Images appear under `images/` after upload.
5. Sign in at `/login?mode=super-admin` with `superadmin@setclapp.example` and `INITIAL_ADMIN_PASSWORD`, then change the password. Sample company and employee accounts also start with `INITIAL_ADMIN_PASSWORD` until changed or reset.

The old browser-only demo's `setclapp-qa-demo-v1` localStorage data is **not** imported automatically. The new Blob store starts with the original sample companies and employees.

Vercel Hobby includes **1 GB Blob storage** and **10 GB monthly Blob data transfer**, rather than 10 GB of stored files. See [Vercel Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing).

## Local development

Install dependencies with `npm ci`. To run the API locally, link the Vercel project, pull environment variables with `vercel env pull .env.local`, and run `vercel dev`. A plain Vite server does not run the `/api` Function. Keep `.env.local` out of Git.

Run `npm test` for server route checks and `npm run build` for TypeScript and the production bundle.
