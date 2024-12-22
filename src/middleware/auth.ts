import { Context, Next } from 'hono';
import env from '../config/env';

export const validateApiKey = async (c: Context, next: Next) => {
  const apiKey = c.req.header('x-api-key');

  if (!apiKey || apiKey !== env.API_KEY) {
    return c.json({ error: '無効なAPIキーです' }, 401);
  }

  await next();
};
