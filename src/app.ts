import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import imageRoutes from './routes/image';
import { validateApiKey } from './middleware/auth';
import env from './config/env';

const app = express();
const port = env.PORT;

// ミドルウェアの設定
app.use(
  cors({
    origin: 'http://localhost:5173', // フロントエンドのURL
    methods: ['POST'],
    allowedHeaders: [
      'Content-Type',
      'x-api-key', // x-api-keyヘッダーを許可
    ],
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

// ルートの設定
app.use('/api/image', validateApiKey, imageRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
