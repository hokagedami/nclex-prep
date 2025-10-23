function ProgressCard({ title, value, color }) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    red: 'text-red-600 bg-red-50'
  };

  return (
    <div className="card">
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${colorClasses[color] || colorClasses.blue}`}>
        {value}
      </p>
    </div>
  );
}

export default ProgressCard;
