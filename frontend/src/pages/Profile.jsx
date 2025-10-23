import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Profile</h1>

      <div className="card space-y-4 sm:space-y-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
            Name
          </label>
          <p className="text-base sm:text-lg font-medium">{user?.name}</p>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <p className="text-base sm:text-lg break-all">{user?.email}</p>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
            Membership Tier
          </label>
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-lg text-sm sm:text-base font-medium">
            {user?.subscriptionTier}
          </span>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
            Total Points
          </label>
          <p className="text-xl sm:text-2xl font-bold text-primary">{user?.points}</p>
        </div>

        <div className="pt-4 sm:pt-6 border-t">
          <button
            onClick={handleLogout}
            className="btn-secondary w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
