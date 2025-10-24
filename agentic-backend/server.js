import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './src/chatRouter.js';

dotenv.config();

// Create Express app
const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api', chatRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// prepare proper curl command
// curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"message":"Hello, how are you?"}'

