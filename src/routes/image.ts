import express from 'express';
import { body, validationResult } from 'express-validator';
import { generateImage } from '../services/openai';
import type { ImageGenerationRequest, ImageGenerationResponse, ErrorResponse } from '../types';

const router = express.Router();

router.post(
  '/generate',
  [body('prompt').notEmpty().withMessage('プロンプトは必須です')],
  async (
    req: express.Request<{}, {}, ImageGenerationRequest>,
    res: express.Response<ImageGenerationResponse | ErrorResponse>
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
      }

      const { prompt } = req.body;
      const imageUrl = await generateImage(prompt);

      res.json({ imageUrl });
    } catch (error) {
      console.error('画像生成エラー:', error);
      res.status(500).json({ error: '画像生成に失敗しました' });
    }
  }
);

export default router;
