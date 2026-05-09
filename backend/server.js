import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reportsRouter from './routes/reports.js';

dotenv.config();

console.log("GEMINI_API_KEY exists?", !!process.env.GEMINI_API_KEY);
console.log("First 5 chars:", process.env.GEMINI_API_KEY?.slice(0,5));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reports', reportsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});