import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/api";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate"
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post("/auth/register", formData);

      alert("Registration successful");

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert("Registration failed");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border rounded-lg space-y-4"
      >

        <h1 className="text-2xl font-bold">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-2"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full border p-2"
          onChange={handleChange}
        >
          <option value="candidate">
            Candidate
          </option>

          <option value="employer">
            Employer
          </option>
        </select>

        <button
          className="w-full bg-black text-white p-2 rounded"
        >
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;