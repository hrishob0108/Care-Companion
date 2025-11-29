// src/pages/AddParent.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaNotesMedical,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
} from "react-icons/fa";

import { FamilyContext } from "../context/FamilyContext";
import "./AddParent.css";

const emptyMed = () => ({ name: "", dosage: "", schedule: "" });

export default function AddParent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addMember, updateMember, getMember } = useContext(FamilyContext);

  const editing = Boolean(id);

  // FORM STATE
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState([emptyMed()]);
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // PREFILL WHEN EDITING
  useEffect(() => {
    if (!editing) return;

    const m = getMember(id);
    if (!m) {
      navigate("/dashboard");
      return;
    }

    setName(m.name || "");
    setEmail(m.email || "");
    setAge(m.healthData?.age ?? "");
    setGender(m.healthData?.gender ?? "");
    setAllergies((m.healthData?.allergies || []).join(", "));
    setMedications(
      m.healthData?.medications?.length
        ? m.healthData.medications.map((x) => ({ ...x }))
        : [emptyMed()]
    );
    setEmergencyName(m.healthData?.emergencyContact?.name || "");
    setEmergencyPhone(m.healthData?.emergencyContact?.phone || "");
  }, [id, editing]);

  // MEDICATION MANAGEMENT
  const addMedicationRow = () => setMedications((s) => [...s, emptyMed()]);
  const removeMedicationRow = (idx) =>
    setMedications((s) => s.filter((_, i) => i !== idx));
  const updateMedication = (idx, field, value) =>
    setMedications((s) =>
      s.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );

  // VALIDATION
  const validate = () => {
    if (!name.trim()) return "Name required";
    if (!email.trim()) return "Email required";
    if (!age) return "Age required";
    if (!gender) return "Gender required";
    return null;
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return alert(err);

    const payload = {
      name,
      email,
      password: password || undefined,
      role: "elderly",
      healthData: {
        age: Number(age),
        gender,
        medications: medications.filter((m) => m.name || m.dosage || m.schedule),
        allergies: allergies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        emergencyContact: {
          name: emergencyName.trim(),
          phone: emergencyPhone.trim(),
        },
      },
    };

    if (editing) {
      updateMember(id, payload);
      navigate("/dashboard");
    } else {
      const created = addMember(payload);
      navigate(`/add-parent/${created.id}`);
    }
  };

  return (
    <div className="addp-root">
      {/* HEADER */}
      <header className="addp-header">
        <Link to="/dashboard" className="back-btn">
          <FaArrowLeft /> Back
        </Link>
        <h2>{editing ? "Edit Parent" : "Add New Parent"}</h2>
      </header>

      {/* MAIN FORM CARD */}
      <form className="addp-card" onSubmit={handleSubmit}>
        <h3 className="addp-title">Basic Information</h3>

        {/* NAME */}
        <div className="form-group">
          <label>Name</label>
          <div className="input-wrapper">
            <FaUser className="field-icon" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label>Email</label>
          <div className="input-wrapper">
            <FaEnvelope className="field-icon" />
            <input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label>{editing ? "New Password (optional)" : "Password"}</label>
          <div className="input-wrapper">
            <FaLock className="field-icon" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={editing ? "Leave blank to keep current" : "Password"}
            />
          </div>
        </div>

        {/* AGE + GENDER */}
        <div className="form-row" style={{ display: "flex", gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Age</label>
            <div className="input-wrapper">
              <FaUser className="field-icon" />
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                min="0"
              />
            </div>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Gender</label>
            <div className="input-wrapper">
              <FaUser className="field-icon" />
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select...</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* ALLERGIES */}
        <div className="form-group">
          <label>Allergies (comma separated)</label>
          <div className="input-wrapper">
            <FaNotesMedical className="field-icon" />
            <input
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Peanuts, Penicillin"
            />
          </div>
        </div>

        {/* MEDICATIONS */}
        <h3 className="addp-title">Medications</h3>

        {medications.map((m, idx) => (
          <div key={idx} className="med-box">
            <div className="med-row">
              <input
                value={m.name}
                onChange={(e) => updateMedication(idx, "name", e.target.value)}
                placeholder="Medication"
              />
              <input
                value={m.dosage}
                onChange={(e) => updateMedication(idx, "dosage", e.target.value)}
                placeholder="Dosage"
              />
              <input
                value={m.schedule}
                onChange={(e) => updateMedication(idx, "schedule", e.target.value)}
                placeholder="Schedule"
              />
              <button
                type="button"
                onClick={() => removeMedicationRow(idx)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="add-med-btn"
          onClick={addMedicationRow}
        >
          <FaNotesMedical /> Add medication
        </button>

        {/* EMERGENCY CONTACT */}
        <h3 className="addp-title">Emergency Contact</h3>

        <div className="form-row" style={{ display: "flex", gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Contact name</label>
            <div className="input-wrapper">
              <FaUser className="field-icon" />
              <input
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="Contact Name"
              />
            </div>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Contact phone</label>
            <div className="input-wrapper">
              <FaPhone className="field-icon" />
              <input
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          {editing ? "Save Changes" : "Save Parent Details"}
        </button>
      </form>
    </div>
  );
}
