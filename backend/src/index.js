// Entry point: creates the server and plugs everything together.
require('dotenv').config(); // loads values from .env

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const winRoutes = require('./routes/wins');

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in .env - copy .env.example to .env first.');
  process.exit(1);
}

const app = express();

app.use(cors());          // lets your web app (another origin) call this API
app.use(express.json());  // lets us read JSON sent in request bodies

// Health check: open http://localhost:3000 to see it work
app.get('/', (req, res) => {
  res.json({ message: 'Win Jar API is running 🫙' });
});

app.use('/auth', authRoutes);
app.use('/wins', winRoutes);

// Unknown URL
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Any error passed with next(err) lands here
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Win Jar API listening on http://localhost:${PORT}`);
});
