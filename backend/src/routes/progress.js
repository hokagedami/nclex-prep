import express from 'express';
import { getDashboard } from '../controllers/progressController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, getDashboard);

export default router;
