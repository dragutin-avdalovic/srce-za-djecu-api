import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

import Donation from '../../models/donation/index.model';

/**
 *
 */
router.get('/donations', async (req: Request, res: Response) => {
  await Donation.find({}).exec(function(err: Error, data: {}) {
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
// router.get('/donations/report', (req: Request, res: Response) => {
//   Donation.find().select({ '__v': 0, '_id': 0}).lean().exec(function(err: Error, data: {}) {
//     if (err) {
//       res.json('error happened');
//     } else {
//       const xls = json2xls(data);
//
//       fs.writeFileSync('data.xlsx', xls, 'binary');
//       res.json('created data.xlsx');
//     }
//   });
// });

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
router.delete('/donations/:id', (req: Request, res: Response) => {
  Donation.find({ _id: req.params.id }).remove().exec(function(err: Error, data: {}) {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json({ message: 'successfully removed' });
    }
  });
});

module.exports = router;
