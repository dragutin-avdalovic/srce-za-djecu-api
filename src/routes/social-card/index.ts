import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

import SocialCard from '../../models/social-card/index.model';

/**
 *
 */
router.get('/social-card', async (req: Request, res: Response) => {
  await SocialCard.find({}).exec(function(err: Error, data: {}) {
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
router.post('/social-card', async (req: Request, res: Response) => {
  const user = new SocialCard(req.body);

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
router.put('/social-card/:id', async (req: Request, res: Response) => {
  await SocialCard.update({ _id: req.params.id }, req.body, function(err: Error, data: {}) {
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
router.delete('/social-card/:id', (req: Request, res: Response) => {
  SocialCard.find({ _id: req.params.id }).remove().exec(function(err: Error, data: {}) {
    if (err) {
      res.json('error happened');
    } else {
      res.json('successfully removed');
    }
  });
});

module.exports = router;