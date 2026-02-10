import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import postRoute from './routes/postRoute.js';
import { prisma } from './config/db.js';


const app = express();
const PORT = process.env.PORT || 3001;
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoute);

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'UP', service: 'post-service', db: 'CONNECTED' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'DOWN', db: 'DISCONNECTED' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Post Service live at http://localhost:${PORT}`);
});