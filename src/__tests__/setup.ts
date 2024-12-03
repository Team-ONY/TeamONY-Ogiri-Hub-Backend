import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

process.env.OPENAI_API_KEY = 'test-api-key';
process.env.API_KEY = 'test-api-key';
process.env.NODE_ENV = 'test';
