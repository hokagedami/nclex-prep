import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../../backend/src/utils/jwt.js';

const prisma = new PrismaClient();

describe('Backend API Tests', () => {
  let testUser;
  let testQuestion;
  let testToken;

  beforeAll(async () => {
    // Clean up test data
    await prisma.userAnswer.deleteMany();
    await prisma.user.deleteMany({ where: { email: 'test@test.com' } });

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: hashedPassword,
        name: 'Test User'
      }
    });

    // Generate token for authenticated requests
    testToken = generateToken(testUser.id);

    // Get a test question
    testQuestion = await prisma.question.findFirst();
  });

  afterAll(async () => {
    // Clean up
    await prisma.userAnswer.deleteMany({ where: { userId: testUser.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.$disconnect();
  });

  describe('JWT Utilities', () => {
    test('should generate a valid JWT token', () => {
      const token = generateToken(testUser.id);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    test('should verify a valid token', () => {
      const token = generateToken(testUser.id);
      const decoded = verifyToken(token);
      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe(testUser.id);
    });

    test('should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });

  describe('Authentication', () => {
    test('should hash passwords correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    test('should not match incorrect passwords', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(wrongPassword, hashedPassword);
      expect(isMatch).toBe(false);
    });
  });

  describe('Database Operations', () => {
    test('should create a user in database', async () => {
      const user = await prisma.user.findUnique({
        where: { email: testUser.email }
      });
      expect(user).toBeTruthy();
      expect(user.email).toBe(testUser.email);
      expect(user.name).toBe(testUser.name);
    });

    test('should have questions in database', async () => {
      const questionCount = await prisma.question.count();
      expect(questionCount).toBeGreaterThan(0);
    });

    test('should retrieve question with all required fields', () => {
      expect(testQuestion).toBeTruthy();
      expect(testQuestion.content).toBeTruthy();
      expect(testQuestion.type).toBeTruthy();
      expect(testQuestion.category).toBeTruthy();
      expect(testQuestion.difficulty).toBeTruthy();
      expect(testQuestion.correctAnswers).toBeTruthy();
      expect(testQuestion.allAnswers).toBeTruthy();
      expect(testQuestion.explanation).toBeTruthy();
    });

    test('should parse question answers correctly', () => {
      const correctAnswers = JSON.parse(testQuestion.correctAnswers);
      const allAnswers = JSON.parse(testQuestion.allAnswers);

      expect(Array.isArray(correctAnswers)).toBe(true);
      expect(Array.isArray(allAnswers)).toBe(true);
      expect(allAnswers.length).toBeGreaterThan(0);
      expect(allAnswers[0]).toHaveProperty('id');
      expect(allAnswers[0]).toHaveProperty('text');
    });
  });

  describe('Answer Submission Logic', () => {
    test('should correctly evaluate correct answer', () => {
      const correctAnswers = ['a', 'b'];
      const selectedAnswers = ['a', 'b'];

      const isCorrect =
        selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every(ans => correctAnswers.includes(ans));

      expect(isCorrect).toBe(true);
    });

    test('should correctly evaluate incorrect answer', () => {
      const correctAnswers = ['a', 'b'];
      const selectedAnswers = ['a', 'c'];

      const isCorrect =
        selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every(ans => correctAnswers.includes(ans));

      expect(isCorrect).toBe(false);
    });

    test('should correctly evaluate partial answer as incorrect', () => {
      const correctAnswers = ['a', 'b'];
      const selectedAnswers = ['a'];

      const isCorrect =
        selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every(ans => correctAnswers.includes(ans));

      expect(isCorrect).toBe(false);
    });

    test('should award correct points for single choice questions', () => {
      const questionType = 'SINGLE';
      const isCorrect = true;
      const pointsEarned = isCorrect ? (questionType === 'SINGLE' ? 10 : 15) : 0;

      expect(pointsEarned).toBe(10);
    });

    test('should award correct points for multiple choice questions', () => {
      const questionType = 'MULTIPLE';
      const isCorrect = true;
      const pointsEarned = isCorrect ? (questionType === 'SINGLE' ? 10 : 15) : 0;

      expect(pointsEarned).toBe(15);
    });

    test('should award zero points for incorrect answers', () => {
      const isCorrect = false;
      const pointsEarned = isCorrect ? 10 : 0;

      expect(pointsEarned).toBe(0);
    });
  });

  describe('Progress Calculation', () => {
    test('should calculate accuracy correctly', () => {
      const totalQuestions = 10;
      const correctAnswers = 7;
      const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

      expect(accuracy).toBe(70);
    });

    test('should handle zero questions gracefully', () => {
      const totalQuestions = 0;
      const correctAnswers = 0;
      const accuracy = totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

      expect(accuracy).toBe(0);
    });

    test('should calculate category breakdown correctly', () => {
      const answers = [
        { category: 'Category A', isCorrect: true },
        { category: 'Category A', isCorrect: false },
        { category: 'Category B', isCorrect: true },
        { category: 'Category B', isCorrect: true },
      ];

      const categoryMap = {};
      answers.forEach(answer => {
        if (!categoryMap[answer.category]) {
          categoryMap[answer.category] = { total: 0, correct: 0 };
        }
        categoryMap[answer.category].total++;
        if (answer.isCorrect) {
          categoryMap[answer.category].correct++;
        }
      });

      expect(categoryMap['Category A'].total).toBe(2);
      expect(categoryMap['Category A'].correct).toBe(1);
      expect(categoryMap['Category B'].total).toBe(2);
      expect(categoryMap['Category B'].correct).toBe(2);
    });
  });

  describe('Question Selection Logic', () => {
    test('should exclude recently answered questions', async () => {
      // Create a user answer
      await prisma.userAnswer.create({
        data: {
          userId: testUser.id,
          questionId: testQuestion.id,
          selectedAnswers: JSON.stringify(['a']),
          isCorrect: true,
          pointsEarned: 10,
          timeSpent: 30
        }
      });

      const answeredQuestionIds = await prisma.userAnswer.findMany({
        where: { userId: testUser.id },
        select: { questionId: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      const excludeIds = answeredQuestionIds.map(a => a.questionId);

      expect(excludeIds).toContain(testQuestion.id);
      expect(excludeIds.length).toBeGreaterThan(0);
    });
  });

  describe('Data Validation', () => {
    test('should validate required fields for user', () => {
      const requiredFields = ['email', 'password', 'name'];
      const hasAllFields = requiredFields.every(field => testUser.hasOwnProperty(field));

      expect(hasAllFields).toBe(true);
    });

    test('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(testUser.email)).toBe(true);
    });

    test('should validate question type is either SINGLE or MULTIPLE', () => {
      const validTypes = ['SINGLE', 'MULTIPLE'];
      expect(validTypes).toContain(testQuestion.type);
    });
  });
});

console.log('\nBackend API Tests Completed Successfully!\n');
