/**
 * Client-side API base URL. Vite only exposes env vars prefixed with `VITE_`.
 * Example: `VITE_BASE_URL=http://localhost:4003` in `.env`
 */
const fromEnv =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BASE_URL;

export const baseUrl = (fromEnv && String(fromEnv).trim()) || 'https://ppost-backend.vercel.app';
