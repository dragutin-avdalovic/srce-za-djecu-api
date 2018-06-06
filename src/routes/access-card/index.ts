import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

import AccessCard from '../../models/access-card/index.model';

/**
 *
 */
router.get('/access-card', async (req: Request, res: Response) => {
  await AccessCard.find({}).sort([['updatedAt', -1]]).exec(function(err: Error, data: {}) {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json(data);
    }
  });
});

/**
 *
 */
router.post('/access-card', async (req: Request, res: Response) => {
  const user = new AccessCard(req.body);

  await user.save(function(err: Error, data: {}) {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json({ message: 'successfully saved' });
    }
  });
});

/**
 *
 */
router.put('/access-card/:id', async (req: Request, res: Response) => {
  await AccessCard.update({ _id: req.params.id }, req.body, function(err: Error, data: {}) {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json({ message: 'successfully edited' });
    }
  });
});

/**
 *
 */
router.put('/access-card/:id/notes', async (req: Request, res: Response) => {
  await AccessCard.update({ _id: req.params.id }, { $push: { notes: req.body } }, function(err: Error, data: {}) {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json({ message: 'successfully added note' });
    }
  });
});

/**
 *
 */
router.delete('/access-card/:id', (req: Request, res: Response) => {
  AccessCard.find({ _id: req.params.id }).remove().exec(function(err: Error, data: {}) {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json({ message: 'successfully removed' });
    }
  });
});

module.exports = router;
