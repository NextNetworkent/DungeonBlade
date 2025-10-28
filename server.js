const express = require('express');
const cors = require('cors');          // <-- NEW
const fs = require('fs').promises;
const app = express();
const port = process.env.PORT || 3000;

// ---- CORS: allow your GitHub Pages site ----
app.use(cors({
  origin: ['https://dungeonblade.github.io'],   // <-- CHANGE THIS
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
// -------------------------------------------

app.use(express.json());

// File to store messages
const messagesFile = 'messages.json';

// Initialize file if it does not exist
async function initMessages() {
  try { await fs.access(messagesFile); }
  catch { await fs.writeFile(messagesFile, JSON.stringify([])); }
}
initMessages();

// GET all messages
app.get('/messages', async (req, res) => {
  const messages = JSON.parse(await fs.readFile(messagesFile));
  res.json(messages);
});

// POST a new message
app.post('/messages', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Message required');
  const messages = JSON.parse(await fs.readFile(messagesFile));
  messages.push({ text, timestamp: new Date().toISOString() });
  await fs.writeFile(messagesFile, JSON.stringify(messages));
  res.status(201).send('Posted');
});

// Serve the static HTML (public folder)
app.use(express.static('public'));

// Bind to 0.0.0.0 for Render
app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
