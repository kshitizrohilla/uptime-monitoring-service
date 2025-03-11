import { useEffect, useState } from "react";
import axios from "axios";
import MonitorCard from "../../components/monitors/MonitorCard";
import Topbar from '@/components/Topbar';
import CreateMonitorModal from "../../components/monitors/CreateMonitorModal";

export default function Monitors() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMonitors = async () => {
    try {
      const response = await axios.get("/api/monitors");
      setMonitors(response.data);
    } catch (error) {
      console.error("Failed to fetch monitors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  const handleDeleteMonitor = (monitorId) => {
    setMonitors(monitors.filter(monitor => monitor._id !== monitorId));
  };

  return (
    <>
      <Topbar />
      <div className="p-4 m-auto mt-15 w-full lg:mt-20 lg:w-3/4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Monitors</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer p-2 bg-blue-500 font-medium text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Monitor
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : monitors.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">No monitors yet</h3>
            <p className="text-gray-500 mb-6">Create your first monitor to start tracking your website's uptime.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Monitor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monitors.map((monitor) => (
              <MonitorCard
                key={monitor._id}
                monitor={monitor}
                onDelete={handleDeleteMonitor}
              />
            ))}
          </div>
        )}

        <CreateMonitorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchMonitors}
        />
      </div>
    </>);
}