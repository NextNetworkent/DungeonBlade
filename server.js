const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['https://dungeonblade.onrender.com', 'https://nextnetworkent.github.io'],  // Your sites
  methods: ['GET', 'POST']
}));
app.use(express.json());
app.use(express.static('public'));  // Serve your HTML files

// Messages file
const messagesFile = path.join(__dirname, 'messages.json');

// Initialize messages file
async function initMessages() {
  try {
    await fs.access(messagesFile);
  } catch {
    await fs.writeFile(messagesFile, JSON.stringify([]));
  }
}
initMessages();

// GET all messages
app.get('/messages', async (req, res) => {
  try {
    const data = await fs.readFile(messagesFile, 'utf8');
    const messages = JSON.parse(data);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// POST new message
app.post('/messages', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Message text required' });
    }
    const data = await fs.readFile(messagesFile, 'utf8');
    const messages = JSON.parse(data);
    messages.push({
      text: text.trim(),
      timestamp: new Date().toISOString()
    });
    await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2));
    res.status(201).json({ message: 'Posted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Serve other static pages (about.html, game.html)
app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});
app.get('/game.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
