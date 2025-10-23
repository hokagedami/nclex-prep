function StatsCard({ title, value, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="card">
      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className={`text-2xl sm:text-3xl font-bold ${colorClasses[color]}`}>
        {value}
      </p>
    </div>
  );
}

export default StatsCard;
