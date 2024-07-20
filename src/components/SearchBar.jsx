import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [rollNo, setRollNo] = useState("");
  const [batchYear, setBatchYear] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(rollNo, batchYear);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-6">
      <input
        type="text"
        placeholder="Enter Roll Number"
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
        className="p-2 border border-gray-300 rounded"
        required
      />
      <select
        value={batchYear}
        onChange={(e) => setBatchYear(e.target.value)}
        className="p-2 border border-gray-300 rounded"
        required
      >
        <option value="">Select Batch Year</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
      </select>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
