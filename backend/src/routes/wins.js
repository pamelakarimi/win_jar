const express = require('express');
const prisma = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Every route in this file needs a logged-in user.
router.use(requireAuth);

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function todayString() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" (UTC)
}

// GET /wins  -> all my wins, newest first
router.get('/', async (req, res, next) => {
  try {
    const wins = await prisma.win.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    });
    res.json(wins);
  } catch (err) {
    next(err);
  }
});

// GET /wins/random  -> THE SHAKE! one random win
// NOTE: this must stay ABOVE "/:id", otherwise "random" is treated as an id.
router.get('/random', async (req, res, next) => {
  try {
    const count = await prisma.win.count({ where: { userId: req.userId } });
    if (count === 0) {
      return res.status(404).json({ error: 'Your jar is empty. Add your first win!' });
    }

    const skip = Math.floor(Math.random() * count);
    const win = await prisma.win.findFirst({
      where: { userId: req.userId },
      skip,
      orderBy: { id: 'asc' },
    });
    res.json(win);
  } catch (err) {
    next(err);
  }
});

// POST /wins  -> add a win
router.post('/', async (req, res, next) => {
  try {
    const { text, emoji, date } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }
    if (text.length > 280) {
      return res.status(400).json({ error: 'Text must be 280 characters or less' });
    }
    if (date && !DATE_REGEX.test(date)) {
      return res.status(400).json({ error: 'Date must look like YYYY-MM-DD' });
    }

    const win = await prisma.win.create({
      data: {
        text: text.trim(),
        emoji: emoji || null,
        date: date || todayString(),
        userId: req.userId,
      },
    });
    res.status(201).json(win);
  } catch (err) {
    // P2002 = Prisma's "unique rule broken" (already a win for that day)
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'You already logged a win for that day' });
    }
    next(err);
  }
});

// PUT /wins/:id  -> edit a win
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const { text, emoji } = req.body;
    if (text !== undefined && (!text.trim() || text.length > 280)) {
      return res.status(400).json({ error: 'Text must be 1-280 characters' });
    }

    // updateMany with userId makes sure you can only edit YOUR wins.
    const result = await prisma.win.updateMany({
      where: { id, userId: req.userId },
      data: {
        ...(text !== undefined && { text: text.trim() }),
        ...(emoji !== undefined && { emoji: emoji || null }),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Win not found' });
    }

    const win = await prisma.win.findUnique({ where: { id } });
    res.json(win);
  } catch (err) {
    next(err);
  }
});

// DELETE /wins/:id  -> remove a win
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const result = await prisma.win.deleteMany({
      where: { id, userId: req.userId },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Win not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
