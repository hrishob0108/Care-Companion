import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaPills, FaClock, FaSync } from "react-icons/fa";
import "./ElderDashboard.css";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5 },
  }),
};

export default function ElderlyDashboard() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/medications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMedications(response.data);
        setLoading(false);
        setLastSync(new Date());
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchMedications();

    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  // Function to get schedule items with status based on current time
  const getScheduleItems = () => {
    if (!medications.length) return [];

    const allSchedules = [];

    medications.forEach((med) => {
      med.schedule.forEach((schedule) => {
        const [hours, minutes] = schedule.time.split(":").map(Number);
        const scheduleTime = new Date();
        scheduleTime.setHours(hours, minutes, 0, 0);

        allSchedules.push({
          id: `${med.id}-${schedule.time}`,
          title: `${med.name} - ${schedule.timeOfDay}`,
          time: schedule.time,
          timeOfDay: schedule.timeOfDay,
          scheduleTime: scheduleTime,
          medication: med.name,
          dosage: med.dosage,
        });
      });
    });

    // Sort by time
    return allSchedules.sort((a, b) => a.scheduleTime - b.scheduleTime);
  };

  // Function to get status for a schedule item
  const getScheduleStatus = (scheduleTime) => {
    const now = currentTime;
    const scheduleDate = new Date(scheduleTime);

    // Set tolerance windows (in minutes)
    const takenWindow = 30; // 30 minutes after scheduled time to mark as "taken"
    const dueSoonWindow = 15; // 15 minutes before scheduled time to mark as "due soon"

    const timeDiff = (scheduleDate - now) / (1000 * 60); // difference in minutes

    if (timeDiff < -takenWindow) {
      return { status: "missed", label: "Missed", variant: "missed" };
    } else if (timeDiff < 0) {
      return { status: "taken", label: "Taken", variant: "ok" };
    } else if (timeDiff <= dueSoonWindow) {
      return { status: "dueSoon", label: "Due soon", variant: "wait" };
    } else {
      return { status: "scheduled", label: "Scheduled", variant: "scheduled" };
    }
  };

  // Function to get dot color based on status
  const getDotColor = (status) => {
    switch (status) {
      case "taken":
        return "dot-green";
      case "dueSoon":
        return "dot-amber";
      case "missed":
        return "dot-red";
      default:
        return "dot-gray";
    }
  };

  // Function to format time since last sync
  const getTimeSinceSync = () => {
    const diff = Math.floor((new Date() - lastSync) / 1000 / 60);
    if (diff === 0) return "just now";
    if (diff === 1) return "1 min ago";
    return `${diff} min ago`;
  };

  const scheduleItems = getScheduleItems();

  if (loading) {
    return <div>Loading medications...</div>;
  }

  return (
    <div className='elderly-dash-root'>
      <nav className='elderly-dash-nav'>
        <h1>CareCompanion</h1>
        <div className='nav-links'>
          <a href='/elderly-dashboard'>Dashboard</a>
          <a href='/elderly-profile'>Profile</a>
          <a href='/elderly-settings'>Settings</a>
        </div>
      </nav>

      <main className='elderly-dash-content'>
        {/* Hero Panel */}
        <motion.div
          className='hero-panel'
          initial='hidden'
          animate='visible'
          custom={1}
          variants={fadeUp}
        >
          <div className='panel-header'>Today · Medication schedule</div>
          <div className='panel-list'>
            {scheduleItems.length === 0 ? (
              <div className='panel-item'>
                <div className='dot dot-gray' />
                <div>
                  <div className='item-title'>No medications scheduled</div>
                  <div className='item-meta'>Check back later</div>
                </div>
                <span className='item-status'>No schedule</span>
              </div>
            ) : (
              scheduleItems.map((item) => {
                const status = getScheduleStatus(item.scheduleTime);
                return (
                  <div className='panel-item' key={item.id}>
                    <div className={`dot ${getDotColor(status.status)}`} />
                    <div>
                      <div className='item-title'>{item.title}</div>
                      <div className='item-meta'>
                        {item.time} ·{" "}
                        {status.status === "taken"
                          ? "Taken"
                          : status.status === "missed"
                          ? "Missed"
                          : "Awaiting"}
                      </div>
                    </div>
                    <span className={`item-status ${status.variant}`}>
                      {status.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <div className='panel-footer'>
            <FaSync className='sync-icon' />
            Caregiver view is up to date · Last sync {getTimeSinceSync()}
          </div>
        </motion.div>

        {/* Existing Medication List
        <h2>Your Medications</h2>
        {medications.length === 0 ? (
          <div className='empty-box'>
            <FaPills className='empty-icon' />
            <h3>No medications assigned</h3>
            <p>There are no medications assigned to you at the moment.</p>
          </div>
        ) : (
          <div className='medication-list'>
            {medications.map((med, idx) => (
              <div className='medication-card' key={idx}>
                <h4>{med.name}</h4>
                <p>{med.dosage}</p>
                <p>
                  <strong>Frequency:</strong> {med.frequency}
                </p>
                <p>
                  <strong>Duration:</strong> {med.duration}
                </p>

                <div className='schedule'>
                  {med.schedule.map((schedule, scheduleIdx) => (
                    <div key={scheduleIdx} className='schedule-item'>
                      <FaClock />
                      <span>
                        {schedule.timeOfDay} at {schedule.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )} */}
      </main>
    </div>
  );
}
