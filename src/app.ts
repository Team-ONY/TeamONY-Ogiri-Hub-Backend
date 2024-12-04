import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import imageRoutes from './routes/image';
import { validateApiKey } from './middleware/auth';
import env from './config/env';

const app = express();
const port = process.env.PORT || 3001;

// ミドルウェアの設定
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // フロントエンドのURL
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
  })
);
app.use(helmet());
app.use(express.json());

// レート制限の設定
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'OK' });
});

// ルートの設定
app.use('/api/image', validateApiKey, imageRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
