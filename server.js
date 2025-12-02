const express = require('express');
const path = require('path');
const app = express();

// In-memory store (replace with a real DB later if you want)
// We'll keep it simple but make it survive restarts by seeding the welcome message
let messages = [];

// === ADD THIS: Persistent Welcome Message ===
const WELCOME_MESSAGE = {
  text: "Happy Holiday Season from Next Network entertainment!",
  timestamp: new Date().toISOString(),
  id: "welcome-001"  // fixed ID so we can detect it
};

function seedWelcomeMessage() {
  const exists = messages.some(m => m.id === "welcome-001");
  if (!exists) {
    messages.unshift(WELCOME_MESSAGE); // put it at the top
    console.log("Welcome message seeded");
  }
}

// Run on every startup
seedWelcomeMessage();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // your homepage lives here

// API: Get all messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// API: Post a new message
app.post('/messages', (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') return res.status(400).json({ error: "Empty message" });

  const newMsg = {
    text: text.trim(),
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  };

  messages.push(newMsg);
  // Optional: limit to last 200 messages to prevent huge growth
  if (messages.length > 200) messages = messages.slice(-190); // keep welcome + 190 recent

  res.json(newMsg);
});

// Catch-all: serve the homepage for any other route (SPA style)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tavern is open on port ${PORT}`);
});
