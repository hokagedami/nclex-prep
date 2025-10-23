import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-primary" onClick={closeMobileMenu}>
            NCLEX Prep
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-primary transition">
              Dashboard
            </Link>
            <Link to="/quiz" className="text-gray-700 hover:text-primary transition">
              Practice
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-primary transition">
              Profile
            </Link>

            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300">
              <div className="text-sm">
                <div className="font-medium">{user?.name?.split(' ')[0]}</div>
                <div className="text-gray-500">{user?.points} points</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-primary transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* User Info */}
              <div className="px-4 py-2 bg-gray-50 rounded-md">
                <div className="font-medium text-gray-900">{user?.name?.split(' ')[0]}</div>
                <div className="text-sm text-gray-500">{user?.points} points</div>
              </div>

              {/* Navigation Links */}
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/quiz"
                className="px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition"
                onClick={closeMobileMenu}
              >
                Practice
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition"
                onClick={closeMobileMenu}
              >
                Profile
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-left text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
