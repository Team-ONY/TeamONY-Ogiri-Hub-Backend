import { Request, Response, NextFunction } from 'express';
import env from '../config/env';

export const validateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== env.API_KEY) {
    res.status(401).json({ error: '無効なAPIキーです' });
    return;
  }

  next();
};
