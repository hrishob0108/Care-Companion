import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaNotesMedical,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
} from "react-icons/fa";

import "./AddParent.css";

// Initialize empty medication structure
const emptyMed = () => ({
  name: "",
  dosage: "",
  frequency: "",
  schedule: [{ timeOfDay: "", time: "" }],
  duration: "",
});

export default function AddParent() {
  const { id } = useParams(); // The ID from the URL
  const navigate = useNavigate();
  const editing = Boolean(id); // Check if we're editing an existing member
  console.log(editing);

  // FORM STATE
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Password state
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState([emptyMed()]);
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to determine number of time slots based on frequency
  // Helper function to determine number of time slots based on frequency
  const getFrequencySlots = (frequency) => {
    switch (frequency) {
      case "Once a day":
        return [{ timeOfDay: "Morning", time: "" }];
      case "Twice a day":
        return [
          { timeOfDay: "Morning", time: "" },
          { timeOfDay: "Evening", time: "" },
        ];
      case "Every 4 hours":
        return [
          { timeOfDay: "Morning", time: "" },
          { timeOfDay: "Noon", time: "" },
          { timeOfDay: "Evening", time: "" },
          { timeOfDay: "Night", time: "" },
        ];
      case "Every 8 hours":
        return [
          { timeOfDay: "Morning", time: "" },
          { timeOfDay: "Afternoon", time: "" },
          { timeOfDay: "Evening", time: "" },
        ];
      case "As needed":
        return [{ timeOfDay: "", time: "" }];
      default:
        return [];
    }
  };

  // Prefill the form when editing
  useEffect(() => {
    const fetchMemberData = async () => {
      if (!editing) return;

      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/elderly/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const m = response.data;
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
      } catch (error) {
        setError("Failed to fetch member data");
        console.log("Error in fetching member", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [id, editing]);

  if (loading && editing) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Medication management
  const addMedicationRow = () => setMedications((s) => [...s, emptyMed()]);
  const removeMedicationRow = (idx) =>
    setMedications((s) => s.filter((_, i) => i !== idx));
  const updateMedication = (idx, field, value) =>
    setMedications((s) =>
      s.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  const updateSchedule = (idx, scheduleIdx, field, value) => {
    setMedications((s) =>
      s.map((m, i) => {
        if (i === idx) {
          const newSchedule = [...m.schedule];
          newSchedule[scheduleIdx] = {
            ...newSchedule[scheduleIdx],
            [field]: value,
          };
          return { ...m, schedule: newSchedule };
        }
        return m;
      })
    );
  };

  // Form validation
  const validate = () => {
    if (!name.trim()) return "Name required";
    if (!email.trim()) return "Email required";
    if (!age) return "Age required";
    if (!gender) return "Gender required";
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return alert(err);

    const payload = {
      name,
      email,
      password: password || undefined, // Optional password
      healthData: {
        age: Number(age),
        gender,
        medications: medications
          .filter(
            (m) =>
              m.name ||
              m.dosage ||
              m.frequency ||
              (m.schedule && m.schedule.length > 0)
          )
          .map((med) => ({
            ...med,
            // Make sure schedule is always an array (empty or filled)
            schedule: med.schedule || [],
          })),
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

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return alert("Authorization token missing");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editing) {
        // Update existing member
        const response = await axios.put(
          `http://localhost:3000/api/elderly/${id}`,
          payload,
          config
        );
        alert(response.data.message);
        navigate(`/dashboard`);
      } else {
        // Add new member
        const response = await axios.post(
          "http://localhost:3000/api/create-elderly",
          payload,
          config
        );
        alert(response.data.message);
        navigate(`/dashboard`);
      }
    } catch (error) {
      console.error("Error creating/updating parent:", error);
      alert("An error occurred while saving the parent details.");
    }
  };

  return (
    <div className='addp-root'>
      {/* HEADER */}
      <header className='addp-header'>
        <Link to='/dashboard' className='back-btn'>
          <FaArrowLeft /> Back
        </Link>
        <h2>{editing ? "Edit Parent" : "Add New Parent"}</h2>
      </header>

      {/* MAIN FORM CARD */}
      <form className='addp-card' onSubmit={handleSubmit}>
        <h3 className='addp-title'>Basic Information</h3>

        {/* NAME */}
        <div className='form-group'>
          <label>Name</label>
          <div className='input-wrapper'>
            <FaUser className='field-icon' />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Full name'
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className='form-group'>
          <label>Email</label>
          <div className='input-wrapper'>
            <FaEnvelope className='field-icon' />
            <input
              value={email}
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email address'
            />
          </div>
        </div>

        {/* PASSWORD */}
        {!editing && (
          <div className='form-group'>
            <label>Password</label>
            <div className='input-wrapper'>
              <FaLock className='field-icon' />
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter a new password'
              />
            </div>
          </div>
        )}

        {/* AGE + GENDER */}
        <div className='form-row' style={{ display: "flex", gap: 12 }}>
          <div className='form-group' style={{ flex: 1 }}>
            <label>Age</label>
            <div className='input-wrapper'>
              <FaUser className='field-icon' />
              <input
                type='number'
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder='Age'
                min='0'
              />
            </div>
          </div>

          <div className='form-group' style={{ flex: 1 }}>
            <label>Gender</label>
            <div className='input-wrapper'>
              <FaUser className='field-icon' />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value=''>Select...</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* ALLERGIES */}
        <div className='form-group'>
          <label>Allergies (comma separated)</label>
          <div className='input-wrapper'>
            <FaNotesMedical className='field-icon' />
            <input
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder='e.g. Peanuts, Penicillin'
            />
          </div>
        </div>

        {/* MEDICATIONS */}
        <h3 className='addp-title'>Medications</h3>
        {medications.map((m, idx) => (
          <div key={idx} className='med-box'>
            <div className='med-row'>
              {/* Medication Name */}
              <input
                value={m.name}
                onChange={(e) => updateMedication(idx, "name", e.target.value)}
                placeholder='Medication Name'
              />

              {/* Dosage */}
              <input
                value={m.dosage}
                onChange={(e) =>
                  updateMedication(idx, "dosage", e.target.value)
                }
                placeholder='Dosage'
              />

              {/* Frequency Dropdown */}
              <select
                value={m.frequency}
                onChange={(e) =>
                  updateMedication(idx, "frequency", e.target.value)
                }
              >
                <option value=''>Select Frequency</option>
                <option>Once a day</option>
                <option>Twice a day</option>
                <option>Every 4 hours</option>
                <option>Every 8 hours</option>
                <option>As needed</option>
              </select>

              {/* Duration Dropdown */}
              <select
                value={m.duration}
                onChange={(e) =>
                  updateMedication(idx, "duration", e.target.value)
                }
              >
                <option value=''>Select Duration</option>
                <option>7 days</option>
                <option>14 days</option>
                <option>30 days</option>
                <option>Ongoing</option>
              </select>

              {/* Dynamically Display Time Slots Based on Frequency */}
              {m.frequency && (
                <div>
                  {getFrequencySlots(m.frequency).map(
                    (schedule, scheduleIdx) => (
                      <div key={scheduleIdx} className='schedule-row'>
                        {/* Time of Day Dropdown */}
                        <select
                          value={
                            m.schedule[scheduleIdx]?.timeOfDay ||
                            schedule.timeOfDay
                          }
                          onChange={(e) =>
                            updateSchedule(
                              idx,
                              scheduleIdx,
                              "timeOfDay",
                              e.target.value
                            )
                          }
                        >
                          <option value=''>Select Time of Day</option>
                          <option>Morning</option>
                          <option>Afternoon</option>
                          <option>Evening</option>
                          <option>Night</option>
                        </select>

                        {/* Time Picker */}
                        <input
                          type='time'
                          value={m.schedule[scheduleIdx]?.time || schedule.time}
                          onChange={(e) =>
                            updateSchedule(
                              idx,
                              scheduleIdx,
                              "time",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Remove Button */}
              <button
                type='button'
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

        {/* Add Medication Button */}
        <button
          type='button'
          className='add-med-btn'
          onClick={addMedicationRow}
        >
          <FaNotesMedical /> Add Medication
        </button>

        {/* EMERGENCY CONTACT */}
        <h3 className='addp-title'>Emergency Contact</h3>

        <div className='form-row' style={{ display: "flex", gap: 12 }}>
          <div className='form-group' style={{ flex: 1 }}>
            <label>Contact name</label>
            <div className='input-wrapper'>
              <FaUser className='field-icon' />
              <input
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder='Contact Name'
              />
            </div>
          </div>

          <div className='form-group' style={{ flex: 1 }}>
            <label>Contact phone</label>
            <div className='input-wrapper'>
              <FaPhone className='field-icon' />
              <input
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder='Phone number'
              />
            </div>
          </div>
        </div>

        <button type='submit' className='submit-btn'>
          {editing ? "Save Changes" : "Save Parent Details"}
        </button>
      </form>
    </div>
  );
}
