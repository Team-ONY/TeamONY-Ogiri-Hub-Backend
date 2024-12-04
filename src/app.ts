import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import imageRoutes from './routes/image';
import { validateApiKey } from './middleware/auth';
import env from './config/env';

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = {
  development: ['http://localhost:5173', 'http://localhost:4173'],
  production: ['https://your-production-domain.com'],
};

const currentOrigins =
  process.env.NODE_ENV === 'production' ? allowedOrigins.production : allowedOrigins.development;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || currentOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
    credentials: true,
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
