import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true }
    });

    const answers = await prisma.userAnswer.findMany({
      where: { userId },
      include: {
        question: {
          select: { category: true }
        }
      }
    });

    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

    // Calculate category breakdown
    const categoryMap = {};
    answers.forEach(answer => {
      const category = answer.question.category;
      if (!categoryMap[category]) {
        categoryMap[category] = { total: 0, correct: 0 };
      }
      categoryMap[category].total++;
      if (answer.isCorrect) {
        categoryMap[category].correct++;
      }
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, stats]) => ({
      category,
      total: stats.total,
      correct: stats.correct,
      accuracy: Math.round((stats.correct / stats.total) * 100)
    }));

    res.json({
      totalQuestions,
      correctAnswers,
      accuracy,
      totalPoints: user.points,
      categoryBreakdown
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
};
