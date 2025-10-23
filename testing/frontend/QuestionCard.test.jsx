import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionCard from './QuestionCard';

describe('QuestionCard', () => {
  const mockQuestion = {
    id: '1',
    content: 'What is the normal adult heart rate?',
    type: 'SINGLE',
    category: 'Physiological Integrity',
    difficulty: 'EASY',
    allAnswers: ['60-100 bpm', '40-80 bpm', '80-120 bpm', '100-140 bpm']
  };

  it('should render question content', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedAnswers={[]}
        onAnswerSelect={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('What is the normal adult heart rate?')).toBeInTheDocument();
  });

  it('should display question metadata', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedAnswers={[]}
        onAnswerSelect={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText(/Physiological Integrity/)).toBeInTheDocument();
    expect(screen.getByText(/EASY/)).toBeInTheDocument();
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

    expect(screen.getByText('60-100 bpm')).toBeInTheDocument();
    expect(screen.getByText('40-80 bpm')).toBeInTheDocument();
    expect(screen.getByText('80-120 bpm')).toBeInTheDocument();
    expect(screen.getByText('100-140 bpm')).toBeInTheDocument();
  });

  it('should call onAnswerSelect when answer is clicked (single choice)', () => {
    const onAnswerSelect = vi.fn();
    render(
      <QuestionCard
        question={mockQuestion}
        selectedAnswers={[]}
        onAnswerSelect={onAnswerSelect}
        onSubmit={vi.fn()}
      />
    );

    const firstAnswer = screen.getByText('60-100 bpm');
    fireEvent.click(firstAnswer);

    expect(onAnswerSelect).toHaveBeenCalledWith(['60-100 bpm']);
  });

  it('should allow multiple selections for MULTIPLE type questions', () => {
    const multipleQuestion = { ...mockQuestion, type: 'MULTIPLE' };
    const onAnswerSelect = vi.fn();

    render(
      <QuestionCard
        question={multipleQuestion}
        selectedAnswers={['60-100 bpm']}
        onAnswerSelect={onAnswerSelect}
        onSubmit={vi.fn()}
      />
    );

    const secondAnswer = screen.getByText('40-80 bpm');
    fireEvent.click(secondAnswer);

    expect(onAnswerSelect).toHaveBeenCalledWith(['60-100 bpm', '40-80 bpm']);
  });

  it('should highlight selected answers', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedAnswers={['60-100 bpm']}
        onAnswerSelect={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const selectedButton = screen.getByText('60-100 bpm').closest('button');
    expect(selectedButton).toHaveClass('bg-primary');
  });

  it('should disable submit button when no answer selected', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedAnswers={[]}
        onAnswerSelect={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when answer is selected', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedAnswers={['60-100 bpm']}
        onAnswerSelect={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('should call onSubmit when submit button is clicked', () => {
    const onSubmit = vi.fn();
    render(
      <QuestionCard
        question={mockQuestion}
        selectedAnswers={['60-100 bpm']}
        onAnswerSelect={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalled();
  });

  it('should show submitting state when submitting is true', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedAnswers={['60-100 bpm']}
        onAnswerSelect={vi.fn()}
        onSubmit={vi.fn()}
        submitting={true}
      />
    );

    expect(screen.getByText(/submitting/i)).toBeInTheDocument();
  });
});
