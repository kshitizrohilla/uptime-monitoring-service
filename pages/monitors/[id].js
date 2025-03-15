import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Topbar from '@/components/Topbar';
import StatusBadge from "../../components/monitors/StatusBadge";
import UptimeChart from "../../components/monitors/UptimeChart";
import ResponseTimeChart from "../../components/monitors/ResponseTimeChart";
import DateRangePicker from "../../components/monitors/DateRangePicker";

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

export default function MonitorDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [monitor, setMonitor] = useState(null);
  const [checks, setChecks] = useState([]);
  const [uptime, setUptime] = useState({
    last7Days: 0,
    last30Days: 0,
    last365Days: 0
  });

  const fetchMonitorData = async () => {
    if (!id) return;

    try {
      const response = await axios.get(`/api/monitors/${id}`);
      setMonitor(response.data.monitor);
      setChecks(response.data.checks);
      setUptime(response.data.uptime);
    } catch (error) {
      console.error("Failed to fetch monitor data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMonitorData();
    }
  }, [id]);

  const handleDateRangeChange = async (startDate, endDate) => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await axios.get(`/api/monitors/${id}/checks`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      setChecks(response.data.checks);
    } catch (error) {
      console.error("Failed to fetch checks for date range", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMonitor = async () => {
    if (!id) return;

    if (confirm("Are you sure you want to delete this monitor?")) {
      try {
        await axios.delete(`/api/monitors/${id}`);
        router.push("/monitors");
      } catch (error) {
        const message = error.response.data.message;
        console.log(error);
        alert(message);
      }
    }
  };

  const handleManualCheck = async () => {
    if (!id) return;

    try {
      setLoading(true);
      await axios.post(`/api/monitors/${id}/check`);
      fetchMonitorData();
    } catch (error) {
      console.error("Failed to check monitor", error);
      alert("Failed to check monitor");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Loading...</div>
    );
  }

  if (!monitor) {
    return (
      <div className="text-center py-8">Monitor not found</div>
    );
  }

  return (
    <>
      <Topbar />
      <div className="m-auto mt-20 p-4 lg:w-3/4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-sm font-bold">{monitor.name}</h1>
            <p className="text-xs text-gray-500">{monitor.url}</p>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={handleManualCheck}
              className="cursor-pointer p-2 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Check Now
            </button>
            <button
              onClick={handleDeleteMonitor}
              className="cursor-pointer px-2 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Monitor
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">Current Status</h3>
            <div className="flex items-center">
              <StatusBadge status={monitor.status} />
              <span className="ml-2 text-sm font-semibold">
                {monitor.status === "up" ? "Operational" : monitor.status === "down" ? "Down" : "Pending"}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">Last Checked</h3>
            <p className="text-sm font-semibold">
              {monitor.lastChecked ? new Date(monitor.lastChecked).toLocaleString() : 'Never'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">Check Interval</h3>
            <p className="text-sm font-semibold">{monitor.interval} minutes</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">Expected Status</h3>
            <p className="text-sm font-semibold">{monitor.expectedStatusCode}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">Last 24 Hours Status</h2>
          <UptimeChart checks={checks} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold mb-2">Uptime (7 days)</h3>
            <p className="text-xl font-bold text-green-500">{uptime.last7Days.toFixed(2)}%</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold mb-2">Uptime (30 days)</h3>
            <p className="text-xl font-bold text-green-500">{uptime.last30Days.toFixed(2)}%</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold mb-2">Uptime (365 days)</h3>
            <p className="text-xl font-bold text-green-500">{uptime.last365Days.toFixed(2)}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Response Time</h2>
          </div>
          <div className="m-auto mb-6">
            <DateRangePicker onRangeChange={handleDateRangeChange} />
          </div>
          <div className="h-64 m-auto">
            <ResponseTimeChart checks={checks} />
          </div>
        </div>
      </div>
    </>
  );
}