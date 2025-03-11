import { useState } from "react";
import axios from "axios";

export default function CreateMonitorModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    method: "GET",
    interval: 5,
    timeout: 30,
    expectedStatusCode: 200
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/monitors", formData);
      const monitorId = response.data._id;

      await axios.post(`/api/monitors/${monitorId}/check`);

      onSuccess();
      onClose();

      setFormData({
        name: "",
        url: "",
        method: "GET",
        interval: 5,
        timeout: 30,
        expectedStatusCode: 200
      });
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-base font-semibold mb-4">Create New Monitor</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1.5 rounded-lg mb-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-gray-700 text-xs mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg text-xs"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 text-xs mb-1">URL</label>
            <input
              type="url"
              className="w-full p-2 border border-gray-300 rounded-lg text-xs"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-gray-700 text-xs mb-1">Method</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-xs mb-1">Expected Status</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                value={formData.expectedStatusCode}
                onChange={(e) => setFormData({ ...formData, expectedStatusCode: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-gray-700 text-xs mb-1">Interval (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                value={formData.interval}
                onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs mb-1">Timeout (seconds)</label>
              <input
                type="number"
                min="5"
                max="120"
                className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-1.5">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer p-2 border border-gray-300 rounded-lg text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="cursor-pointer p-2 bg-blue-500 text-white rounded-lg text-xs"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Monitor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}