import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';

dotenv.config();

// call express with a cast to any to avoid runtime interop issues
const app = express();
const prisma = new PrismaClient();

// Configure CORS for desktop app - allow localhost connections
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

app.use('/auth', authRoutes(prisma));
app.use('/api', apiRoutes(prisma));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
