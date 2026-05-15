import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function Jobs() {

  const [loading, setLoading] = useState(false);

  const { token, role } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");

  const [location, setLocation] = useState("");

  const fetchJobs = async () => {
    setLoading(true);

    try {
      const response = await API.get(
        `/jobs/?search=${search}&location=${location}`
      );

      setJobs(response.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const applyJob = async (jobId) => {

    try {

      await API.post(
        `/applications/apply/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Applied successfully");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Application failed"
      );
    }
  };

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">
        Job Listings
      </h1>

      <p className="text-gray-500 mb-6">
        Find and apply for your dream job
      </p>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 mb-4">
          Loading jobs...
        </p>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">

        <input
          type="text"
          placeholder="Search role"
          className="border p-2 rounded w-full md:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          className="border p-2 rounded w-full md:w-auto"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={fetchJobs}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Search
        </button>

      </div>

      {/* Jobs List */}
      <div className="grid gap-4">

        {jobs.map((job) => (

          <div
            key={job.id}
            className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition"
          >

            <h2 className="text-xl font-bold text-gray-800">
              {job.title}
            </h2>

            <p className="mt-2 text-gray-600">
              {job.description}
            </p>

            <p className="mt-2 text-gray-600">
              📍 {job.location}
            </p>

            <p className="text-gray-600">
              💰 {job.salary}
            </p>

            {/* Apply Button */}
            {role === "candidate" && (

              <button
                onClick={() => applyJob(job.id)}
                className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                Apply
              </button>

            )}

          </div>

        ))}

      </div>

      {/* Empty State */}
      {!loading && jobs.length === 0 && (
        <p className="text-gray-500 mt-6">
          No jobs found
        </p>
      )}

    </div>
  );
}

export default Jobs;