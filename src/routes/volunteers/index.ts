import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

import Volunteer from '../../models/volunteer/index.model';

/**
 *
 */
router.get('/volunteers', async (req: Request, res: Response) => {
  await Volunteer.find({}).exec(function(err: Error, data: {}) {
    if (err) {
      res.json('error happened');
    } else {
      res.json(data);
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
      res.json('error happened');
    } else {
      res.json('successfully saved');
    }
  });
});

/**
 *
 */
router.put('/volunteers/:id', async (req: Request, res: Response) => {
  await Volunteer.update({ _id: req.params.id }, req.body, function(err: Error, data: {}) {
    if (err) {
      res.json('error happened');
    } else {
      res.json('successfully edited');
    }
  });
});

/**
 *
 */
router.delete('/volunteers/:id', (req: Request, res: Response) => {
  Volunteer.find({ _id: req.params.id }).remove().exec(function(err: Error, data: {}) {
    if (err) {
      res.json('error happened');
    } else {
      res.json('successfully removed');
    }
  });
});

module.exports = router;
