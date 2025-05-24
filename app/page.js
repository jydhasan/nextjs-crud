"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [minAge, setMinAge] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch("/api/zahidcollection");
      const result = await res.json();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !age.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/zahidcollection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age: parseInt(age) }),
    });

    if (res.ok) {
      const newItem = await res.json();
      setData([...data, { ...newItem, name, age: parseInt(age) }]);
      setName("");
      setAge("");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    const res = await fetch("/api/zahidcollection", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setData(data.filter((item) => item._id !== id));
    }
  };

  const filteredData = data
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (minAge ? item.age >= parseInt(minAge) : true)
    )
    .sort((a, b) => (sortOrder === "asc" ? a.age - b.age : b.age - a.age));

  // Export CSV function
  const exportToCSV = () => {
    const headers = ["Name", "Age"];
    const rows = filteredData.map((item) => [item.name, item.age]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "zahid_collection.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Zahid Collection
      </h1>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6 flex-wrap">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter age"
          required
          className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
        >
          {submitting && (
            <svg
              className="w-4 h-4 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
              />
            </svg>
          )}
          Add
        </button>
      </form>

      {/* Filter, Sort, Search & Export */}
      <div className="flex gap-4 mb-4 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 flex-1 min-w-[150px]"
        />
        <input
          type="number"
          placeholder="Min Age"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 w-24"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 w-40"
        >
          <option value="asc">Sort by Age ↑</option>
          <option value="desc">Sort by Age ↓</option>
        </select>
        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">
          <svg
            className="w-8 h-8 mx-auto animate-spin text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
            />
          </svg>
          Loading...
        </div>
      ) : (
        <ul className="space-y-2">
          {filteredData.map((item) => (
            <li
              key={item._id}
              className="p-3 bg-gray-100 rounded-md shadow flex justify-between items-center hover:bg-gray-200 transition"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">Age: {item.age}</p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
