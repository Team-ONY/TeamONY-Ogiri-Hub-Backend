import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { imageRoutes } from './routes/image';
import { validateApiKey } from './middleware/auth';
import env from './config/env';

const app = new Hono();

// ミドルウェアの設定
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://your-production-domain.com',
    ],
    allowMethods: ['POST'],
    allowHeaders: ['Content-Type', 'x-api-key'],
  })
);

// ヘルスチェック
app.get('/health', (c) => c.json({ status: 'OK' }));

// APIルート
app.use('/api/image/*', validateApiKey);
app.route('/api/image', imageRoutes);

// サーバー起動
const port = parseInt(env.PORT);
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
