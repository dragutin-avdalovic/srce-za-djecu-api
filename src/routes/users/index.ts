import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();
import User from '../../models/users/index.model';

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
  })
});

/**
 *
 */
router.post('/users', async (req: Request, res: Response) => {
  console.log(req.body)
  const user = new User(req.body);

  await user.save(function(err: Error, data: {}) {
    if (err) {
      res.json('error happened');
    } else {
      res.json('successfully saved');
    }
  });

  // const promise = user.save();
  // assert.ok(promise instanceof Promise);
  //
  // promise.then(function (doc) {
  //   assert.equal(doc.name, "Guns N' Roses");
  // });
});

/**
 *
 */
router.put('/users/:id', (req: Request, res: Response) => {
  res.send('Edit user');
});

/**
 *
 */
router.delete('/users/:id', (req: Request, res: Response) => {
  res.send('Delete user');
});

module.exports = router;
