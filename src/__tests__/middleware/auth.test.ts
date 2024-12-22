import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { Hono } from 'hono';
import { validateApiKey } from '../../middleware/auth';
import env from '../../config/env';

describe('Auth Middleware', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.use('*', validateApiKey);
    app.get('/', (c) => c.text('認証成功'));
  });

  it('有効なAPIキーで認証が成功すること', async () => {
    const res = await app.request('/', {
      headers: { 'x-api-key': env.API_KEY },
    });

    expect(res.status).toBe(200);
    expect(await res.text()).toBe('認証成功');
  });

  it('無効なAPIキーでエラーを返すこと', async () => {
    const res = await app.request('/', {
      headers: { 'x-api-key': 'invalid-key' },
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: '無効なAPIキーです' });
  });
});
