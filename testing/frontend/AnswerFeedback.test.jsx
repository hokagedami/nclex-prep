import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AnswerFeedback from './AnswerFeedback';

describe('AnswerFeedback', () => {
  const correctFeedback = {
    isCorrect: true,
    pointsEarned: 10,
    correctAnswers: ['60-100 bpm'],
    explanation: 'The normal adult heart rate ranges from 60-100 beats per minute.'
  };

  const incorrectFeedback = {
    isCorrect: false,
    pointsEarned: 0,
    correctAnswers: ['60-100 bpm'],
    explanation: 'The normal adult heart rate ranges from 60-100 beats per minute.'
  };

  it('should display "Correct!" for correct answers', () => {
    render(<AnswerFeedback feedback={correctFeedback} onNext={vi.fn()} />);

    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('should display "Incorrect" for incorrect answers', () => {
    render(<AnswerFeedback feedback={incorrectFeedback} onNext={vi.fn()} />);

    expect(screen.getByText('Incorrect')).toBeInTheDocument();
  });

  it('should show points earned for correct answers', () => {
    render(<AnswerFeedback feedback={correctFeedback} onNext={vi.fn()} />);

    expect(screen.getByText(/10 points/)).toBeInTheDocument();
  });

  it('should not show points earned for incorrect answers', () => {
    render(<AnswerFeedback feedback={incorrectFeedback} onNext={vi.fn()} />);

    expect(screen.queryByText(/points/)).not.toBeInTheDocument();
  });

  it('should display explanation', () => {
    render(<AnswerFeedback feedback={correctFeedback} onNext={vi.fn()} />);

    expect(screen.getByText(/normal adult heart rate ranges/)).toBeInTheDocument();
  });

  it('should show correct answers for incorrect submissions', () => {
    render(<AnswerFeedback feedback={incorrectFeedback} onNext={vi.fn()} />);

    expect(screen.getByText(/Correct answer/)).toBeInTheDocument();
    expect(screen.getByText(/60-100 BPM/)).toBeInTheDocument();
  });

  it('should not show correct answers section for correct submissions', () => {
    render(<AnswerFeedback feedback={correctFeedback} onNext={vi.fn()} />);

    expect(screen.queryByText(/Correct answer/)).not.toBeInTheDocument();
  });

  it('should display Next Question button', () => {
    render(<AnswerFeedback feedback={correctFeedback} onNext={vi.fn()} />);

    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
  });

  it('should call onNext when Next Question button is clicked', () => {
    const onNext = vi.fn();
    render(<AnswerFeedback feedback={correctFeedback} onNext={onNext} />);

    const nextButton = screen.getByRole('button', { name: /next question/i });
    fireEvent.click(nextButton);

    expect(onNext).toHaveBeenCalled();
  });

  it('should have green styling for correct answers', () => {
    const { container } = render(<AnswerFeedback feedback={correctFeedback} onNext={vi.fn()} />);

    const card = container.querySelector('.card');
    expect(card).toHaveClass('bg-green-50');
  });

  it('should have red styling for incorrect answers', () => {
    const { container } = render(<AnswerFeedback feedback={incorrectFeedback} onNext={vi.fn()} />);

    const card = container.querySelector('.card');
    expect(card).toHaveClass('bg-red-50');
  });
});
