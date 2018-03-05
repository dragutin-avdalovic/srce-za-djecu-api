import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

/**
 *
 */
router.get('/users', (req: Request, res: Response) => {
  res.send('Show users');
});

/**
 *
 */
router.post('/users', (req: Request, res: Response) => {
  res.send('Create user');
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
