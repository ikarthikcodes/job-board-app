import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function EmployerDashboard() {

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: ""
  });

  const fetchJobs = async () => {

    try {

      const res = await API.get("/jobs/");

      setJobs(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Create job
  const createJob = async () => {

    try {

      await API.post(
        "/jobs/create",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Job created");

      fetchJobs();

    } catch (err) {
      console.log(err);
      alert("Failed");
    }
  };

  const deleteJob = async (jobId) => {

    try {

      await API.delete(`/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Job deleted");

      fetchJobs();

    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Employer Dashboard
      </h1>

      {/* Create Job Form */}

      <div className="border p-4 rounded mb-6">

        <h2 className="text-xl font-bold mb-4">
          Create Job
        </h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Description"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Location"
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Salary"
          onChange={(e) =>
            setForm({ ...form, salary: e.target.value })
          }
        />

        <button
          onClick={createJob}
          className="bg-black text-white px-4 py-2"
        >
          Create Job
        </button>

      </div>

      {/* Jobs List */}

      <div>

        <h2 className="text-xl font-bold mb-4">
          Your Jobs
        </h2>

        {jobs.map((job) => (

          <div
            key={job.id}
            className="border p-4 mb-4 rounded"
          >

            <h3 className="font-bold">
              {job.title}
            </h3>

            <p>{job.location}</p>

            <p>{job.salary}</p>

            {/* View Applicants */}
            <button
              onClick={() => navigate(`/job/${job.id}/applicants`)}
              className="text-blue-500"
            >
            View Applicants
            </button>

            <button
              onClick={() => deleteJob(job.id)}
              className="text-red-500 ml-3"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default EmployerDashboard;