import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { generateImage } from '../services/openai';
import type { ImageGenerationRequest } from '../types';

const app = new Hono();

const schema = z.object({
  prompt: z.string().min(1, 'プロンプトは必須です'),
});

app.post('/generate', zValidator('json', schema), async (c) => {
  try {
    const { prompt } = await c.req.valid('json');
    const imageUrl = await generateImage(prompt);
    return c.json({ imageUrl });
  } catch (error) {
    console.error('画像生成エラー:', error);
    return c.json({ error: '画像生成に失敗しました' }, 500);
  }
});

export { app as imageRoutes };
