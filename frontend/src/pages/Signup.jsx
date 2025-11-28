import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone
} from "react-icons/fa";

import "./Signup.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    console.log({ username, email, phone, password });
  };

  return (
    <div className="signup-container">

      {/* SIGNUP CARD */}
      <div className="signup-card">
        <div className="signup-logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5956/5956595.png"
            alt="Signup Icon"
          />
          <h2>Create Account</h2>
          <p>Join us and begin your journey</p>
        </div>

        {/* Username */}
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div className="input-group">
          <FaPhone className="input-icon" />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Signup Button */}
        <button className="signup-btn" onClick={handleSignup}>
          Signup
        </button>

        {/* Login Link */}
        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
