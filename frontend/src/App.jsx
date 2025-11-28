import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddParent from "./pages/AddParent.jsx";

import { FamilyProvider } from "./context/FamilyContext";

function App() {
  return (
    <FamilyProvider>
      <Routes>
        {/* Redirect root to dashboard OR keep your homepage */}
        <Route path="/" element={<Home />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Add Parent (create mode) */}
        <Route path="/add-parent" element={<AddParent />} />

        {/* Add Parent (edit mode → parent clicked) */}
        <Route path="/add-parent/:id" element={<AddParent />} />
      </Routes>
    </FamilyProvider>
  );
}

export default App;
