/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ElderDashboard from "./pages/ElderDashboard.jsx";
import AddParent from "./pages/AddParent.jsx";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(role);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const ProtectedRoute = ({ children, role }) => {
    if (userRole !== role) {
      return <Navigate to='/' replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path='/' element={<Home />} />

      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />

      <Route
        path='/dashboard'
        element={
          <ProtectedRoute role='family'>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path='/elder-dashboard'
        element={
          <ProtectedRoute role='elderly'>
            <ElderDashboard />
          </ProtectedRoute>
        }
      />

      <Route path='/add-parent' element={<AddParent />} />

      <Route path='/add-parent/:id' element={<AddParent />} />
    </Routes>
  );
}

export default App;
