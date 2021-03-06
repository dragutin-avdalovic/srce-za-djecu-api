import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

import Donation from '../../models/donation/index.model';

/**
 *
 */
router.get('/donations', async (req: Request, res: Response) => {
  await Donation.find({}).sort([['updatedAt', -1]]).exec(function(err: Error, data: {}) {
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
router.post('/donations', async (req: Request, res: Response) => {
  const user = new Donation(req.body);

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
router.put('/donations/:id', async (req: Request, res: Response) => {
  await Donation.update({ _id: req.params.id }, req.body, function(err: Error, data: {}) {
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
router.put('/donations/:id/notes', async (req: Request, res: Response) => {
  await Donation.update({ _id: req.params.id }, { $push: { notes: req.body } }, function(err: Error, data: {}) {
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
router.delete('/donations/:id', (req: Request, res: Response) => {
  Donation.find({ _id: req.params.id }).remove().exec(function(err: Error, data: {}) {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json({ message: 'successfully removed' });
    }
  });
});

/**
 *
 */
router.delete('/donations/:id/notes/:noteId', (req: Request, res: Response) => {
  Donation.update({ _id: req.params.id }, { $pull: { notes: { _id: req.params.noteId } } }, function(err: Error, data: {}) {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json({ message: 'successfully removed item' });
    }
  });
});

module.exports = router;
