import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      const token = response.data.token;
      const decodedToken = jwtDecode(token);

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      localStorage.setItem("token", token);
      localStorage.setItem("role", decodedToken.role);

      if (decodedToken.role === "elderly") {
        navigate("/elder-dashboard");
      } else if (decodedToken.role === "family") {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        <div className='login-logo'>
          <img
            src='https://cdn-icons-png.flaticon.com/512/2966/2966485.png'
            alt='Logo'
          />
          <h2>Welcome Back</h2>
          <p>Login to continue your journey</p>
        </div>

        {/* Email */}
        <div className='input-group'>
          <FaUser className='input-icon' />
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className='input-group'>
          <FaLock className='input-icon' />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button className='login-btn' onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Error Message */}
        {errorMessage && <p className='error-message'>{errorMessage}</p>}

        {/* Signup Link */}
        <p className='signup-text'>
          Don't have an account? <Link to='/signup'>Create Account</Link>
        </p>
      </div>
    </div>
  );
}
