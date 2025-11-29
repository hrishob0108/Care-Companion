// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaUsers, FaHome } from "react-icons/fa";
import { FamilyContext } from "../context/FamilyContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { familyMembers } = useContext(FamilyContext);

  return (
    <div className="dash-root">
      <nav className="dash-nav">
        <div className="dash-left">
          <FaHome className="dash-logo" />
          <span className="dash-title">CareCompanion</span>
        </div>

        <div className="dash-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
        </div>
      </nav>

      <main className="dash-content">
        <div className="dash-header">
          <h2>Your Family Members</h2>
          <Link to="/add-parent" className="add-btn">
            <FaUserPlus /> Add Family Member
          </Link>
        </div>

        {familyMembers.length === 0 ? (
          <div className="empty-box">
            <FaUsers className="empty-icon" />
            <h3>No family members added</h3>
            <p>Start by adding a family member to manage their care.</p>
            <Link to="/add-parent" className="empty-add-btn">
              <FaUserPlus /> Add Member
            </Link>
          </div>
        ) : (
          <div className="member-grid">
            {familyMembers.map((m) => (
              <Link
                to={`/add-parent/${m.id}`}
                key={m.id}
                className="member-card" /* clickable card */
              >
                <div className="avatar">{m.name ? m.name.charAt(0) : "?"}</div>
                <h4>{m.name}</h4>
                <p>{m.healthData?.age ? `${m.healthData.age} yrs` : m.relation || ""}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
