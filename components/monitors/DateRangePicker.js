import { useState } from "react";

export default function DateRangePicker({ onRangeChange }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      onRangeChange(new Date(startDate), new Date(endDate));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-auto flex items-end space-x-2">
      <div>
        <label className="block text-xs text-gray-600 mb-1">Start Date</label>
        <input
          type="date"
          className="w-20 lg:w-full p-2 border text-xs border-gray-300 rounded-lg"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">End Date</label>
        <input
          type="date"
          className="w-20 lg:w-full p-2 border text-xs border-gray-300 rounded-lg"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="cursor-pointer hover:bg-blue-600 transition-colors p-2 bg-blue-500 text-white text-sm rounded-lg"
      >
        Apply
      </button>
    </form>
  );
}