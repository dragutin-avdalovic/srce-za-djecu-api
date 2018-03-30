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
router.delete('/volunteers/:id', (req: Request, res: Response) => {
  Volunteer.find({ _id: req.params.id }).remove().exec(function(err: Error, data: {}) {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json({ message: 'successfully removed' });
    }
  });
});

module.exports = router;
