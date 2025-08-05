import express from 'express';

// const app = express();
// const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Hello from Express.js!');
// });

// app.listen(port, () => {
//   console.log(`App is running at http://localhost:${port}`);
// });

import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateDB } from './config/database.js';
import routes from './src/Routes/index.js'

dotenv.config(); // Load .env

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5174;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend
  credentials: true,
}));

// 🔧 FIXED: Serve static files with proper path
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

app.use(express.json());
app.use(cookieParser());-
// Connect DB
authenticateDB();
app.use(routes)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

});



