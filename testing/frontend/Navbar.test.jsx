import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../../context/AuthContext';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Navbar', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    points: 450
  };

  const mockAuthContext = {
    user: mockUser,
    loading: false,
    logout: vi.fn()
  };

  it('should render app logo and title', () => {
    renderWithRouter(
      <AuthContext.Provider value={mockAuthContext}>
        <Navbar />
      </AuthContext.Provider>
    );

    expect(screen.getByText('NCLEX Prep')).toBeInTheDocument();
  });

  it('should display navigation links when user is logged in', () => {
    renderWithRouter(
      <AuthContext.Provider value={mockAuthContext}>
        <Navbar />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Practice')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should display user name', () => {
    renderWithRouter(
      <AuthContext.Provider value={mockAuthContext}>
        <Navbar />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should display user points', () => {
    renderWithRouter(
      <AuthContext.Provider value={mockAuthContext}>
        <Navbar />
      </AuthContext.Provider>
    );

    expect(screen.getByText('450 points')).toBeInTheDocument();
  });

  it('should display logout button', () => {
    renderWithRouter(
      <AuthContext.Provider value={mockAuthContext}>
        <Navbar />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should call logout function when logout button is clicked', () => {
    const logout = vi.fn();
    const contextValue = { ...mockAuthContext, logout };

    renderWithRouter(
      <AuthContext.Provider value={contextValue}>
        <Navbar />
      </AuthContext.Provider>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(logout).toHaveBeenCalled();
  });

  it('should not display navigation when user is not logged in', () => {
    const contextValue = { user: null, loading: false, logout: vi.fn() };

    renderWithRouter(
      <AuthContext.Provider value={contextValue}>
        <Navbar />
      </AuthContext.Provider>
    );

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Practice')).not.toBeInTheDocument();
  });

  it('should have link to dashboard', () => {
    renderWithRouter(
      <AuthContext.Provider value={mockAuthContext}>
        <Navbar />
      </AuthContext.Provider>
    );

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/');
  });

  it('should have link to practice/quiz', () => {
    renderWithRouter(
      <AuthContext.Provider value={mockAuthContext}>
        <Navbar />
      </AuthContext.Provider>
    );

    const practiceLink = screen.getByText('Practice').closest('a');
    expect(practiceLink).toHaveAttribute('href', '/quiz');
  });

  it('should have link to profile', () => {
    renderWithRouter(
      <AuthContext.Provider value={mockAuthContext}>
        <Navbar />
      </AuthContext.Provider>
    );

    const profileLink = screen.getByText('Profile').closest('a');
    expect(profileLink).toHaveAttribute('href', '/profile');
  });
});
