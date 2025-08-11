// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const OMDB_KEY = process.env.OMDB_API_KEY;
if (!OMDB_KEY) {
  console.error('❌ Missing OMDB_API_KEY in .env file');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Search OMDb by title
app.get('/api/search', async (req, res) => {
  const { q, type } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing search query (q)' });

  try {
    const url = new URL('http://www.omdbapi.com/');
    url.searchParams.set('apikey', OMDB_KEY);
    url.searchParams.set('s', q);
    if (type) url.searchParams.set('type', type);

    const r = await fetch(url.toString());
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching from OMDb' });
  }
});

// Get OMDb details by IMDb ID
app.get('/api/title', async (req, res) => {
  const { i } = req.query;
  if (!i) return res.status(400).json({ error: 'Missing IMDb ID (i)' });

  try {
    const url = new URL('http://www.omdbapi.com/');
    url.searchParams.set('apikey', OMDB_KEY);
    url.searchParams.set('i', i);
    url.searchParams.set('plot', 'short');

    const r = await fetch(url.toString());
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching from OMDb' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
