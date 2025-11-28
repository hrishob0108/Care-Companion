import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaUserShield
} from "react-icons/fa";

import "./Login.css";

export default function Login() {
  const [role, setRole] = useState("");

  return (
    <div className="login-container">

      {/* LOGIN CARD */}
      <div className="login-card">
        <div className="login-logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966485.png"
            alt="Logo"
          />
          <h2>Welcome Back</h2>
          <p>Login to continue your journey</p>
        </div>

        {/* Username */}
        <div className="input-group">
          <FaUser className="input-icon" />
          <input type="text" placeholder="Username" />
        </div>

        {/* Password */}
        <div className="input-group">
          <FaLock className="input-icon" />
          <input type="password" placeholder="Password" />
        </div>

       

        

        {/* Login Button */}
        <button className="login-btn">Login</button>

        {/* Signup Link */}
        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
}