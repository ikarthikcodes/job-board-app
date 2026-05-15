import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

      const response = await API.post(
        "/auth/login",
        formData
      );

      login(
        response.data.token,
        response.data.role
      );

      if (response.data.role === "employer") {

        navigate("/employer");

      } else {

        navigate("/candidate");
      }

    } catch (error) {

      console.log(error);

      alert("Login failed");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border rounded-lg space-y-4"
      >

        <h1 className="text-2xl font-bold">
          Login
        </h1>

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

        <button
          className="w-full bg-black text-white p-2 rounded"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;