import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getNextQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.query;

    // Get recently answered question IDs to avoid repetition
    const answeredQuestionIds = await prisma.userAnswer.findMany({
      where: { userId },
      select: { questionId: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const excludeIds = answeredQuestionIds.map(a => a.questionId);

    const where = {
      id: { notIn: excludeIds }
    };

    if (category) {
      where.category = category;
    }

    const questionCount = await prisma.question.count({ where });

    if (questionCount === 0) {
      return res.status(404).json({ error: 'No questions available' });
    }

    // Get a random question
    const skip = Math.floor(Math.random() * questionCount);

    const question = await prisma.question.findFirst({
      where,
      skip,
      select: {
        id: true,
        content: true,
        type: true,
        category: true,
        difficulty: true,
        allAnswers: true
      }
    });

    if (!question) {
      return res.status(404).json({ error: 'No questions found' });
    }

    // Parse JSON string to object
    question.allAnswers = JSON.parse(question.allAnswers);

    res.json({ question });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ error: 'Failed to get question' });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;
    const { selectedAnswers, timeSpent } = req.body;

    if (!selectedAnswers || !Array.isArray(selectedAnswers)) {
      return res.status(400).json({ error: 'Invalid answer format' });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const correctAnswers = JSON.parse(question.correctAnswers);

    // Check if answer is correct
    const isCorrect =
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every(ans => correctAnswers.includes(ans));

    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = question.type === 'SINGLE' ? 10 : 15;
    }

    // Save user answer
    await prisma.userAnswer.create({
      data: {
        userId,
        questionId,
        selectedAnswers: JSON.stringify(selectedAnswers),
        isCorrect,
        pointsEarned,
        timeSpent: timeSpent || 0
      }
    });

    // Update user points
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: pointsEarned }
      }
    });

    res.json({
      isCorrect,
      pointsEarned,
      correctAnswers,
      explanation: question.explanation
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
};
