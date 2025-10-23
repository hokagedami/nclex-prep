import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/progress/StatsCard';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
    // Refresh user data to ensure points are up to date
    refreshUser();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.get('/progress/dashboard');
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Ready to continue your NCLEX preparation?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Points"
          value={stats?.totalPoints || 0}
          color="blue"
        />
        <StatsCard
          title="Questions Completed"
          value={stats?.totalQuestions || 0}
          color="green"
        />
        <StatsCard
          title="Overall Accuracy"
          value={`${stats?.accuracy || 0}%`}
          color="purple"
        />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Performance by Category</h2>
        {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
          <div className="space-y-4">
            {stats.categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{cat.category}</span>
                  <span className="text-gray-600">
                    {cat.correct}/{cat.total} ({cat.accuracy}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${cat.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Start practicing to see your progress!
          </p>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/quiz')}
          className="btn-primary text-lg px-8 py-4"
        >
          Start Practice Session
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
