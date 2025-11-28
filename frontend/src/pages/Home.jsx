import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPills, FaUserFriends, FaClock } from "react-icons/fa";
import "./Home.css";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Home() {
  return (
    <div className="home-root">
      {/* NAVBAR */}
      <header className="nav-shell">
        <nav className="nav">
          <div className="nav-left">
            <div className="logo-mark">✚</div>
            <span className="logo-text">CareCompanion</span>
          </div>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="nav-link-ghost">
              Log in
            </Link>
            <Link to="/signup" className="nav-link-solid">
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="page">
        {/* HERO */}
        <section className="hero">
          <motion.div
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <p className="eyebrow">For seniors, families & clinicians</p>
            <h1>Quietly keeping track of everyday care.</h1>
            <p className="hero-sub">
              CareCompanion helps seniors stay on top of medications and daily
              check-ins, while giving families a calm, live view of how things
              are going.
            </p>

            <div className="hero-ctas">
              <Link to="/signup" className="btn-primary">
                Start free
              </Link>
              <Link to="/about" className="btn-ghost">
                View how it works
              </Link>
            </div>

            <p className="hero-footnote">
              No complex setup. Designed to be comfortable for ages 60+.
            </p>
          </motion.div>

          <motion.div
            className="hero-panel"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
          >
            <div className="panel-header">
              Today · Medication schedule
            </div>
            <div className="panel-list">
              <div className="panel-item">
                <div className="dot dot-green" />
                <div>
                  <div className="item-title">Morning tablets</div>
                  <div className="item-meta">08:00 · Taken</div>
                </div>
                <span className="item-status ok">On time</span>
              </div>
              <div className="panel-item">
                <div className="dot dot-amber" />
                <div>
                  <div className="item-title">Blood pressure check</div>
                  <div className="item-meta">09:30 · Awaiting</div>
                </div>
                <span className="item-status wait">Due soon</span>
              </div>
              <div className="panel-item">
                <div className="dot dot-gray" />
                <div>
                  <div className="item-title">Evening dose</div>
                  <div className="item-meta">20:00</div>
                </div>
                <span className="item-status">Scheduled</span>
              </div>
            </div>
            <div className="panel-footer">
              Caregiver view is up to date · Last sync 2 min ago
            </div>
          </motion.div>
        </section>

        {/* THREE COLUMNS */}
        <section className="tri-section">
          <motion.div
            className="tri-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <FaPills className="tri-icon" />
            <h3>Clear medication days</h3>
            <p>
              Simple schedules, large text and gentle reminders that fit easily
              into everyday life.
            </p>
          </motion.div>

          <motion.div
            className="tri-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={1}
            variants={fadeUp}
          >
            <FaUserFriends className="tri-icon" />
            <h3>Shared with family</h3>
            <p>
              A calm dashboard for children, relatives or caregivers to keep an
              eye on things from anywhere.
            </p>
          </motion.div>

          <motion.div
            className="tri-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={2}
            variants={fadeUp}
          >
            <FaClock className="tri-icon" />
            <h3>Daily rhythm, not alerts</h3>
            <p>
              Built to support a steady routine, not overwhelm with
              notifications or technical details.
            </p>
          </motion.div>
        </section>

        {/* SIMPLE STRIP */}
        <section className="strip">
          <p>Designed for independent living, with gentle support in the background.</p>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta">
          <div className="final-inner">
            <h2>Bring everyone onto the same page.</h2>
            <p>
              One place for medications, check-ins and updates — quiet,
              structured and easy to understand.
            </p>
            <div className="final-actions">
              <Link to="/signup" className="btn-primary">
                Create an account
              </Link>
              <Link to="/contact" className="btn-ghost">
                Talk to us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} CareCompanion</span>
        <div className="footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
