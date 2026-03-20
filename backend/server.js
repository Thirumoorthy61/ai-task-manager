import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const tasks = [];

app.post('/tasks', (req, res) => {
  const { text, priority = 'Medium' } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Task text is required' });
  }

  const task = {
    id: Date.now(),
    text: text.trim(),
    priority: ['High', 'Medium', 'Low'].includes(priority) ? priority : 'Medium',
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  return res.status(201).json(task);
});

app.get('/tasks', (_req, res) => {
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
