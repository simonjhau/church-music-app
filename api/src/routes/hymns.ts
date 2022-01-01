import express, { NextFunction, Request, Response } from 'express';
import { addHymn, deleteHymn } from '../middleware/hymns';
import { getHymn, getHymns, updateHymn } from '../models/hymns';
const router = express.Router();

// Todo - input sanitisation

// Add new hymn
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const hymnParams = req.body;
    if (!hymnParams.name) {
      res.status(400).send('Missing hymn name parameter');
      return;
    }

    next();
  },
  addHymn
);

// Get list of hymns that match search query
router.get('/', async (req: Request, res: Response) => {
  const query = req.query.q;
  if (query) {
    const hymns = await getHymns(query as string);
    res.json(hymns);
  } else {
    res.status(400).send('No query parameter sent');
  }
});

// Get hymn data for requested hymn ID
router.get('/:id', async (req: Request, res: Response) => {
  const hymnId = req.params.id;
  try {
    const hymns = await getHymn(hymnId);
    res.status(200).json(hymns);
  } catch (e) {
    res.status(400).send(`Error getting hymn ${hymnId}: ${e}`);
  }
});

// Delete hymn
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
      res.status(400).send('Missing hymn id parameter');
      return;
    }

    next();
  },
  deleteHymn
);

// Update hymn
router.put('/:id', async (req: Request, res: Response) => {
  const hymnId = req.params.id;
  const hymnParams = req.body;
  if (!hymnParams.name) {
    res.status(400).send('Missing hymn name parameter');
    return;
  }

  try {
    await updateHymn(
      hymnId,
      hymnParams.name,
      hymnParams.altName,
      hymnParams.lyrics
    );
    res.location(`/hymns/${hymnId}`);
    res.status(200).json('Hymn saved sucessfully');
  } catch (e) {
    res.status(500).json(`Error saving hymn: ${e}`);
  }
});

export default router;
