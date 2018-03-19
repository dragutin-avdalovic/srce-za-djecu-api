import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

/**
 *
 */
router.get('/download', async (req: Request, res: Response) => {
  res.json({
    message: 'ok'
  });
});
