import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function CandidateDashboard() {
  const { token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [resume, setResume] = useState(null);

  // State for profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Fetch Profile using the /me GET endpoint
  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(res.data.name);
      setEmail(res.data.email);
    } catch (err) {
      console.log("Error fetching profile:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await API.get("/applications/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile(); 
    fetchApplications();
  }, []);

  // Update ONLY email using the /update-email PUT endpoint
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    try {
      await API.put(
        "/profile/update-email",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Email updated successfully");
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  const uploadResume = async () => {
    if (!resume) {
      alert("Select a file");
      return;
    }
    const formData = new FormData();
    formData.append("resume", resume);
    try {
      await API.post("/profile/upload-resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Resume uploaded");
    } catch (error) {
      console.log(error);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-4">
        Candidate Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Account Settings</h2>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Locked)</label>
              <input
                type="text"
                value={name}
                disabled 
                className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors shadow-sm"
            >
              Update Email
            </button>
          </form>
        </div>

        {/* Resume Upload */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Professional Resume</h2>
          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept=".pdf"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
              onChange={(e) => setResume(e.target.files[0])}
            />
            <button
              onClick={uploadResume}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Upload New Resume
            </button>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Applications</h2>
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.application_id} className="bg-white border p-5 rounded-lg shadow-sm flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{app.job_title}</h3>
                <p className="text-sm text-gray-600">📍 {app.location} | 💰 {app.salary}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' : 
                  app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CandidateDashboard;