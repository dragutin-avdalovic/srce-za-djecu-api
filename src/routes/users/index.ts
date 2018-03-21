  import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

import User from '../../models/user/index.model';

/**
 *
 */
router.get('/users', async (req: Request, res: Response) => {
  await User.find({}).exec(function(err: Error, data: {}) {
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
// router.get('/users/report', (req: Request, res: Response) => {
//   User.find().select({ '__v': 0, '_id': 0}).lean().exec(function(err: Error, data: {}) {
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
router.post('/users', async (req: Request, res: Response) => {
  const user = new User(req.body);

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
router.put('/users/:id', async (req: Request, res: Response) => {
  await User.update({ _id: req.params.id }, req.body, function(err: Error, data: {}) {
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
router.delete('/users/:id', (req: Request, res: Response) => {
  User.find({ _id: req.params.id }).remove().exec(function(err: Error, data: {}) {
    if (err) {
      res.json('error happened');
    } else {
      res.json('successfully removed');
    }
  });
});

module.exports = router;
