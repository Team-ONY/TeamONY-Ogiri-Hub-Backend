import OpenAI from 'openai';
import env from '../config/env';

const createOpenAIClient = () => {
  console.log('Using API key type:', env.OPENAI_API_KEY?.substring(0, 7));

  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const openai = createOpenAIClient();

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural',
    });

    if (!response.data[0]?.url) {
      throw new Error('画像URLの生成に失敗しました');
    }

    return response.data[0].url;
  } catch (err) {
    const error = err as Error & {
      type?: string;
      status?: number;
    };

    console.error('OpenAI API Error Details:', {
      error,
      message: error.message,
      type: error.type,
      status: error.status,
    });
    throw error;
  }
};
