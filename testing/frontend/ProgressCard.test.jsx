import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressCard from './ProgressCard';

describe('ProgressCard', () => {
  it('should render title', () => {
    render(<ProgressCard title="Total Points" value={450} color="blue" />);

    expect(screen.getByText('Total Points')).toBeInTheDocument();
  });

  it('should render value', () => {
    render(<ProgressCard title="Total Points" value={450} color="blue" />);

    expect(screen.getByText('450')).toBeInTheDocument();
  });

  it('should apply correct color class for blue', () => {
    const { container } = render(<ProgressCard title="Total Points" value={450} color="blue" />);

    const valueElement = screen.getByText('450');
    expect(valueElement).toHaveClass('text-blue-600');
    expect(valueElement).toHaveClass('bg-blue-50');
  });

  it('should apply correct color class for green', () => {
    const { container } = render(<ProgressCard title="Questions" value={35} color="green" />);

    const valueElement = screen.getByText('35');
    expect(valueElement).toHaveClass('text-green-600');
    expect(valueElement).toHaveClass('bg-green-50');
  });

  it('should apply correct color class for purple', () => {
    const { container } = render(<ProgressCard title="Accuracy" value="85%" color="purple" />);

    const valueElement = screen.getByText('85%');
    expect(valueElement).toHaveClass('text-purple-600');
    expect(valueElement).toHaveClass('bg-purple-50');
  });

  it('should render string values', () => {
    render(<ProgressCard title="Accuracy" value="85%" color="purple" />);

    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should render number values', () => {
    render(<ProgressCard title="Total Points" value={450} color="blue" />);

    expect(screen.getByText('450')).toBeInTheDocument();
  });

  it('should have card styling', () => {
    const { container } = render(<ProgressCard title="Total Points" value={450} color="blue" />);

    const card = container.firstChild;
    expect(card).toHaveClass('card');
  });
});
