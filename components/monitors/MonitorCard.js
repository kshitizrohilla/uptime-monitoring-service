import Link from "next/link";
import StatusBadge from "./StatusBadge";
import axios from "axios";

export default function MonitorCard({ monitor, onDelete }) {
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this monitor?")) {
      try {
        await axios.delete(`/api/monitors/${monitor._id}`);
        onDelete(monitor._id);
      } catch (error) {
        const message = error.response.data.message;
        console.log(error);
        alert(message);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/monitors/${monitor._id}`} className="block">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg truncate">{monitor.name}</h3>
          <StatusBadge status={monitor.status} />
        </div>

        <p className="text-blue-600 text-sm truncate mb-3">{monitor.url}</p>

        <div className="flex justify-between text-xs text-gray-500">
          <span>
            Interval: {monitor.interval}m
            <br />
            Last checked: {monitor.lastChecked ? new Date(monitor.lastChecked).toLocaleTimeString() : 'Never'}
          </span>
          <button onClick={handleDelete} className="cursor-pointer border p-2 rounded-full text-red-600 text-xs font-medium hover:bg-red-600 transition-colors hover:text-white">Delete Monitor</button>
        </div>
      </Link>
    </div>
  );
}