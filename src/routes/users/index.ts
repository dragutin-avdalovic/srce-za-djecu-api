import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();
import User from '../../models/users/index.model'

/**
 *
 */
router.get('/users', (req: Request, res: Response) => {
  res.json({
    name: 'test'
  });
});

/**
 *
 */
router.post('/users', (req: Request, res: Response) => {
  const user = new User(req.body);

  user.save(function(err: Error, data: {}) {
    if (err) res.json('error happened');

    res.json('successfully saved');
  });
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
