export default function IncidentsTable({ incidents }) {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">No incidents recorded</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              Monitor
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              Start Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              End Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              Status Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              Reason
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {incidents.map((incident) => (
            <tr key={incident._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-xs">
                <div className="font-medium text-gray-900">{incident.monitor.name}</div>
                <div className="text-xs text-gray-500">{incident.monitor.url}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                {new Date(incident.startTime).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                {incident.endTime ? new Date(incident.endTime).toLocaleString() : 'Ongoing'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                {formatDuration(incident.duration)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                {incident.statusCode || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                {incident.reason || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${incident.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {incident.resolved ? 'Resolved' : 'Ongoing'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDuration(seconds) {
  if (!seconds) return 'N/A';

  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}