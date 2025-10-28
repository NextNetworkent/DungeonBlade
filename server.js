const express = require('express');
const fs = require('fs').promises;
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// File to store messages
const messagesFile = 'messages.json';

// Initialize messages file if it doesn't exist
async function initMessages() {
  try {
    await fs.access(messagesFile);
  } catch {
    await fs.writeFile(messagesFile, JSON.stringify([]));
  }
}
initMessages();

// Get all messages
app.get('/messages', async (req, res) => {
  const messages = JSON.parse(await fs.readFile(messagesFile));
  res.json(messages);
});

// Post a new message
app.post('/messages', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Message required');
  const messages = JSON.parse(await fs.readFile(messagesFile));
  messages.push({ text, timestamp: new Date().toISOString() });
  await fs.writeFile(messagesFile, JSON.stringify(messages));
  res.status(201).send('Posted');
});

// Serve frontend files
app.use(express.static('public'));

// Start server (bind to 0.0.0.0 for Render)
app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
