import { neon } from '@netlify/neon'

// Netlify DB (Neon Postgres) client
// The DATABASE_URL env var is automatically injected by Netlify when
// a Netlify DB is provisioned for this site.
export const sql = neon(process.env['DATABASE_URL']!)
