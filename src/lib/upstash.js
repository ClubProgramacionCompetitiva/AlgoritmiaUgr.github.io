import { kv } from '@vercel/kv';

// Usando Vercel KV (wrapper de Upstash Redis)
// Simplifica la configuración y es más ligero
export const redis = kv;

export default redis;
