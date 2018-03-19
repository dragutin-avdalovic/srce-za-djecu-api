import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

import AccessCard from '../../models/access-card/index.model';

/**
 *
 */
router.get('/access-card', async (req: Request, res: Response) => {
  await AccessCard.find({}).exec(function(err: Error, data: {}) {
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
router.post('/access-card', async (req: Request, res: Response) => {
  const user = new AccessCard(req.body);

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
router.put('/access-card/:id', async (req: Request, res: Response) => {
  await AccessCard.update({ _id: req.params.id }, req.body, function(err: Error, data: {}) {
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
router.delete('/access-card/:id', (req: Request, res: Response) => {
  AccessCard.find({ _id: req.params.id }).remove().exec(function(err: Error, data: {}) {
    if (err) {
      res.json('error happened');
    } else {
      res.json('successfully removed');
    }
  });
});

module.exports = router;
