export default function UptimeChart({ checks }) {
  const last24Hours = [...Array(24)].map((_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - 23 + i);
    return date.getHours();
  });

  const hourStatus = {};

  checks.forEach(check => {
    const hour = new Date(check.timestamp).getHours();
    if (!hourStatus[hour] || check.timestamp > hourStatus[hour].timestamp) {
      hourStatus[hour] = check;
    }
  });

  return (
    <div className="flex items-end h-20 space-x-1 overflow-x-auto">
      {last24Hours.map(hour => {
        const check = hourStatus[hour];
        const status = check ? check.status : 'unknown';

        let bgColor = 'bg-gray-300';
        if (status === 'up') bgColor = 'bg-green-500';
        if (status === 'down') bgColor = 'bg-red-500';

        return (
          <div key={hour} className="flex flex-col items-center flex-1">
            <div className={`w-4 lg:w-10 h-10 ${bgColor} rounded-t`}></div>
            <div className="text-xs mt-2">{hour}</div>
          </div>
        );
      })}
    </div>
  );
}