import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function Applicants() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [apps, setApps] = useState([]);

  const fetchApplicants = async () => {
    try {
      const res = await API.get(`/applications/job/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApps(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const updateStatus = async (appId, status) => {
    try {
      await API.put(
        `/applications/status/${appId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(`Candidate ${status}`);
      fetchApplicants();
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Update failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        Job Applicants
      </h1>

      <div className="grid gap-4">
        {apps.map((a) => (
          <div
            key={a.application_id}
            className="border rounded-lg p-5 shadow-sm bg-white flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {a.candidate_name}
              </p>
              <p className="text-gray-600 mb-2">{a.candidate_email}</p>
              
              {/* View Resume Link styled as a secondary button */}
              <a
                href={`${import.meta.env.VITE_API_URL}/uploads/${app.resume}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline inline-block mb-3 md:mb-0"
              >
                View Resume PDF
              </a>
            </div>

            <div className="flex gap-3 mt-2 md:mt-0">
              {/* Shortlist Button */}
              <button
                onClick={() => updateStatus(a.application_id, "Shortlisted")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
              >
                Shortlist
              </button>

              {/* Reject Button */}
              <button
                onClick={() => updateStatus(a.application_id, "Rejected")}
                className="px-4 py-2 bg-white border border-red-600 text-red-600 hover:bg-red-50 text-sm font-medium rounded-md transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {apps.length === 0 && (
        <p className="text-gray-500 italic">No applicants found for this job.</p>
      )}
    </div>
  );
}

export default Applicants;
