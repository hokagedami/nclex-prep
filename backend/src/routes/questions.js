import express from 'express';
import { getNextQuestion, submitAnswer } from '../controllers/questionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/next', authMiddleware, getNextQuestion);
router.post('/:id/answer', authMiddleware, submitAnswer);

export default router;
