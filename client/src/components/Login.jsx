import React, { useContext, useState } from "react";
import { api } from "../axios.config.js";
import { UserContext } from "../context/UserContext"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
// Adjust the path as necessary

export default function Login() {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { userData, token } = response.data;
        login(userData);

        if (token) localStorage.setItem("token", token);
        localStorage.setItem("userId", userData.id);

        navigate("/notes"); // Redirect to student/doctor/admin as per your logic
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white px-6">
      <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row items-center">
        {/* Left Illustration + Heading */}
        <div className="w-full md:w-1/2 text-center flex flex-col justify-center items-center px-4 mb-8 md:mb-0">
          <h1 className="text-5xl font-bold mb-8 text-black">Welcome Back</h1>
          <img
            src="/sign-up.jpg"
            alt="Login Visual"
            className="max-w-xs md:max-w-sm w-full h-auto object-contain"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 px-4">
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full mt-4 p-4 bg-[#27dec0] text-white font-semibold rounded-lg hover:bg-[#20c0a8] transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
