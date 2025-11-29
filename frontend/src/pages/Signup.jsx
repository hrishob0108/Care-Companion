import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

import axios from "axios";
import { jwtDecode } from "jwt-decode";

import "./Signup.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/signup", {
        name: username,
        email: email,
        password: password,
        mobileNumber: phone,
      });

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      console.log(response.data);
      const token = response.data.token;

      // Save the token and role in localStorage
      localStorage.setItem("token", token);

      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      localStorage.setItem("role", role);

      if (role == "elderly") {
        navigate("/elder-dashboard");
      } else if (role == "family") {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.error || "Something went wrong. Please try again."
        );
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signup-container'>
      {/* SIGNUP CARD */}
      <div className='signup-card'>
        <div className='signup-logo'>
          <img
            src='https://cdn-icons-png.flaticon.com/512/5956/5956595.png'
            alt='Signup Icon'
          />
          <h2>Create Account</h2>
          <p>Join us and begin your journey</p>
        </div>

        {/* Username */}
        <div className='input-group'>
          <FaUser className='input-icon' />
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className='input-group'>
          <FaEnvelope className='input-icon' />
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div className='input-group'>
          <FaPhone className='input-icon' />
          <input
            type='tel'
            placeholder='Phone Number'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

        {/* Error Message */}
        {error && <p className='error-message'>{error}</p>}

        {/* Signup Button */}
        <button
          className='signup-btn'
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Signup"}
        </button>

        {/* Login Link */}
        <p className='login-text'>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  );
}
