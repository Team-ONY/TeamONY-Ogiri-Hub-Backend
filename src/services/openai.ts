import OpenAI from 'openai';
import env from '../config/env';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const generateImage = async (prompt: string): Promise<string> => {
  const safePrompt = `Create a photorealistic image: 
    ${prompt}
    Style: High-quality photography, detailed, realistic lighting, natural colors.
    Quality: Professional photography, 4K resolution, sharp focus.
    Render: Photorealistic, detailed textures, natural shadows and highlights.`;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: safePrompt,
    n: 1,
    size: '1024x1024',
    quality: 'hd',
    style: 'natural',
  });

  if (!response.data[0]?.url) {
    throw new Error('画像URLの生成に失敗しました');
  }

  return response.data[0].url;
};
