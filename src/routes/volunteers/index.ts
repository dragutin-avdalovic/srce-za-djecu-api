import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

import Volunteer from '../../models/volunteer/index.model';

/**
 *
 */
router.get('/volunteers', async (req: Request, res: Response) => {
  await Volunteer.find({}).sort([['updatedAt', -1]]).exec(function(err: Error, data: {}) {
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
router.post('/volunteers', async (req: Request, res: Response) => {
  const user = new Volunteer(req.body);

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
router.put('/volunteers/:id', async (req: Request, res: Response) => {
  await Volunteer.update({ _id: req.params.id }, req.body, function(err: Error, data: {}) {
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
router.put('/volunteers/:id/notes', async (req: Request, res: Response) => {
  await Volunteer.update({ _id: req.params.id }, { $push: { notes: req.body } }, function(err: Error, data: {}) {
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
router.delete('/volunteers/:id', (req: Request, res: Response) => {
  Volunteer.find({ _id: req.params.id }).remove().exec(function(err: Error, data: {}) {
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
router.delete('/volunteers/:id/notes/:noteId', (req: Request, res: Response) => {
  Volunteer.update({ _id: req.params.id }, { $pull: { notes: { _id: req.params.noteId } } }, function(err: Error, data: {}) {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json({ message: 'successfully removed item' });
    }
  });
});

module.exports = router;
