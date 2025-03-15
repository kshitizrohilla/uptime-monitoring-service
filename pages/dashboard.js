import { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from "../components/monitors/StatusBadge";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import IncidentsTable from "../components/incidents/IncidentsTable";

import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie || '';
  const { token } = parse(cookies);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function Dashboard() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    up: 0,
    down: 0,
    pending: 0,
  });

  const [incidents, setIncidents] = useState([]);
  const [incidentsLoading, setIncidentsLoading] = useState(true);

  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        const response = await axios.get("/api/monitors");
        setMonitors(response.data);

        const total = response.data.length;
        const up = response.data.filter((m) => m.status === "up").length;
        const down = response.data.filter((m) => m.status === "down").length;
        const pending = response.data.filter((m) => m.status === "pending").length;

        setStats({ total, up, down, pending });
      } catch (error) {
        console.error("Failed to fetch monitors", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchIncidents = async () => {
      try {
        const response = await axios.get("/api/incidents");
        setIncidents(response.data);
      } catch (error) {
        console.error("Failed to fetch incidents", error);
      } finally {
        setIncidentsLoading(false);
      }
    };

    fetchMonitors();
    fetchIncidents();
  }, []);

  return (
    <>
      <Topbar />
      <div className="p-4 m-auto mt-20 w-full md:w-3/4">
        <h1 className="text-xl font-bold mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xs font-semibold text-gray-700">Total Monitors</h3>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xs font-semibold text-gray-700">Up</h3>
            <p className="text-xl font-bold text-green-500">{stats.up}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xs font-semibold text-gray-700">Down</h3>
            <p className="text-xl font-bold text-red-500">{stats.down}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xs font-semibold text-gray-700">Pending</h3>
            <p className="text-xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Recent Monitors</h2>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : monitors.length === 0 ? (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-gray-500 mb-4">You don't have any monitors yet.</p>
            <Link
              href="/monitors"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
            >
              Create your first monitor
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg">
            <div className="overflow-x-auto shadow-md">

              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                      Monitor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                      Last Checked
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monitors.slice(0, 5).map((monitor) => (
                    <tr
                      key={monitor._id}
                      className="hover:bg-gray-50 transition-colors duration-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                        <div className="text-sm font-medium text-gray-900">{monitor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                        <StatusBadge status={monitor.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                        <div className="text-xs text-gray-500 truncate">{monitor.url}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">
                        {monitor.lastChecked ? new Date(monitor.lastChecked).toLocaleString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
            {monitors.length > 5 && (
              <div className="mt-4 text-center">
                <Link href="/monitors" className="text-blue-500 hover:underline text-xs">
                  View all monitors
                </Link>
              </div>
            )}
          </div>
        )}

        <h2 className="text-xl font-bold mt-6 mb-4">Recent Incidents</h2>

        {incidentsLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : incidents.length === 0 ? (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-gray-500 mb-4">No incidents recorded yet.</p>
            <Link
              href="/incidents"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
            >
              View all incidents
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg">
            <IncidentsTable incidents={incidents.slice(0, 5)} />
            {incidents.length > 5 && (
              <div className="mt-4 text-center">
                <Link href="/incidents" className="text-blue-500 hover:underline text-xs">
                  View all incidents
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
