import express from 'express';
const router = express.Router();

import { getHymns, getFilesForHymn } from '../models/hymns.js';

// Todo - input sanitisation

// Get list of hymns that match search query
router.get('/', async (req, res) => {
  const query = req.query.q;
  if (query) {
    const hymns = await getHymns(query);
    res.json(hymns);
  } else {
    res.status(400).send('No query parameter sent');
  }
});

// Update hymn record
router.put('/:id', async (req, res) => {});

export default router;
