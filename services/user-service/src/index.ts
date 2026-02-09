import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from './config/db.js'; // Ensure the path is correct

const app = express();
const PORT = process.env.PORT || 3001;

// Standard Senior Middleware
app.use(helmet()); // Protects headers
app.use(cors());   // Allows frontend access
app.use(express.json()); // Parses incoming JSON

// Health Check: The "Golden Ticket" for Microservices
app.get('/health', async (req, res) => {
  try {
    // A simple query to check if the DB adapter is working
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'UP', service: 'user-service', db: 'CONNECTED' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'DOWN', db: 'DISCONNECTED' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 User Service live at http://localhost:${PORT}`);
});