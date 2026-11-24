import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pulseApiRouter } from './src/server/routes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API endpoints
app.use('/api', pulseApiRouter);

// Serve static frontend in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`KenyaOne Pulse server listening on http://0.0.0.0:${PORT}`);
});
