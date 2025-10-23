import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import components
import QuestionCard from '../components/questions/QuestionCard';
import AnswerFeedback from '../components/questions/AnswerFeedback';
import ProgressCard from '../components/progress/ProgressCard';

describe('UI Components Test Suite', () => {
  describe('QuestionCard Component', () => {
    const mockQuestion = {
      id: '1',
      content: 'What is the normal adult heart rate?',
      type: 'SINGLE',
      category: 'Physiological Integrity',
      difficulty: 'EASY',
      allAnswers: ['60-100 bpm', '40-80 bpm', '80-120 bpm', '100-140 bpm']
    };

    it('should render question content correctly', () => {
      render(
        <QuestionCard
          question={mockQuestion}
          selectedAnswers={[]}
          onAnswerSelect={vi.fn()}
          onSubmit={vi.fn()}
        />
      );

      expect(screen.getByText('What is the normal adult heart rate?')).toBeInTheDocument();
      expect(screen.getByText(/Physiological Integrity/)).toBeInTheDocument();
    });

    it('should render all answer options', () => {
      render(
        <QuestionCard
          question={mockQuestion}
          selectedAnswers={[]}
          onAnswerSelect={vi.fn()}
          onSubmit={vi.fn()}
        />
      );

      mockQuestion.allAnswers.forEach(answer => {
        expect(screen.getByText(answer)).toBeInTheDocument();
      });
    });
  });

  describe('AnswerFeedback Component', () => {
    it('should display correct feedback for correct answers', () => {
      const feedback = {
        isCorrect: true,
        pointsEarned: 10,
        correctAnswers: ['60-100 bpm'],
        explanation: 'The normal adult heart rate ranges from 60-100 beats per minute.'
      };

      render(<AnswerFeedback feedback={feedback} onNext={vi.fn()} />);

      expect(screen.getByText('Correct!')).toBeInTheDocument();
      expect(screen.getByText(/10 points/)).toBeInTheDocument();
    });

    it('should display incorrect feedback for wrong answers', () => {
      const feedback = {
        isCorrect: false,
        pointsEarned: 0,
        correctAnswers: ['60-100 bpm'],
        explanation: 'The normal adult heart rate ranges from 60-100 beats per minute.'
      };

      render(<AnswerFeedback feedback={feedback} onNext={vi.fn()} />);

      expect(screen.getByText('Incorrect')).toBeInTheDocument();
      expect(screen.getByText(/Correct answer/)).toBeInTheDocument();
    });
  });

  describe('ProgressCard Component', () => {
    it('should render title and value correctly', () => {
      render(<ProgressCard title="Total Points" value={450} color="blue" />);

      expect(screen.getByText('Total Points')).toBeInTheDocument();
      expect(screen.getByText('450')).toBeInTheDocument();
    });

    it('should apply correct color styling', () => {
      render(<ProgressCard title="Total Points" value={450} color="blue" />);

      const valueElement = screen.getByText('450');
      expect(valueElement).toHaveClass('text-blue-600');
    });
  });

  describe('UI Component Integration', () => {
    it('should render multiple components without errors', () => {
      const question = {
        id: '1',
        content: 'Test question',
        type: 'SINGLE',
        category: 'Test Category',
        difficulty: 'EASY',
        allAnswers: ['A', 'B', 'C', 'D']
      };

      const feedback = {
        isCorrect: true,
        pointsEarned: 10,
        correctAnswers: ['A'],
        explanation: 'Test explanation'
      };

      const { container } = render(
        <div>
          <QuestionCard
            question={question}
            selectedAnswers={[]}
            onAnswerSelect={vi.fn()}
            onSubmit={vi.fn()}
          />
          <AnswerFeedback feedback={feedback} onNext={vi.fn()} />
          <ProgressCard title="Points" value={100} color="blue" />
        </div>
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('UI Accessibility', () => {
    it('should have accessible buttons', () => {
      const question = {
        id: '1',
        content: 'Test question',
        type: 'SINGLE',
        category: 'Test',
        difficulty: 'EASY',
        allAnswers: ['A', 'B']
      };

      render(
        <QuestionCard
          question={question}
          selectedAnswers={['A']}
          onAnswerSelect={vi.fn()}
          onSubmit={vi.fn()}
        />
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should have accessible feedback buttons', () => {
      const feedback = {
        isCorrect: true,
        pointsEarned: 10,
        correctAnswers: ['A'],
        explanation: 'Test'
      };

      render(<AnswerFeedback feedback={feedback} onNext={vi.fn()} />);

      const nextButton = screen.getByRole('button', { name: /next question/i });
      expect(nextButton).toBeInTheDocument();
    });
  });

  describe('UI State Management', () => {
    it('should handle empty selected answers', () => {
      const question = {
        id: '1',
        content: 'Test',
        type: 'SINGLE',
        category: 'Test',
        difficulty: 'EASY',
        allAnswers: ['A', 'B']
      };

      render(
        <QuestionCard
          question={question}
          selectedAnswers={[]}
          onAnswerSelect={vi.fn()}
          onSubmit={vi.fn()}
        />
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit when answer is selected', () => {
      const question = {
        id: '1',
        content: 'Test',
        type: 'SINGLE',
        category: 'Test',
        difficulty: 'EASY',
        allAnswers: ['A', 'B']
      };

      render(
        <QuestionCard
          question={question}
          selectedAnswers={['A']}
          onAnswerSelect={vi.fn()}
          onSubmit={vi.fn()}
        />
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).not.toBeDisabled();
    });
  });
});
