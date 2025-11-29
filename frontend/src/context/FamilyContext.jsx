/* eslint-disable react-refresh/only-export-components */
// src/context/FamilyContext.jsx
import React, { createContext, useEffect, useState } from "react";

// simple id generator (replace with uuid if you prefer)
const makeId = () => `${Date.now()}-${Math.floor(Math.random() * 9000)}`;

export const FamilyContext = createContext();

export function FamilyProvider({ children }) {
  const [familyMembers, setFamilyMembers] = useState(() => {
    try {
      const raw = localStorage.getItem("cc_family");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cc_family", JSON.stringify(familyMembers));
    } catch {
      console.log("Failed to save family members to localStorage");
    }
  }, [familyMembers]);

  const addMember = (member) => {
    const newMember = { id: makeId(), ...member };
    setFamilyMembers((s) => [newMember, ...s]);
    return newMember; // useful to immediately navigate to it
  };

  const updateMember = (id, patch) => {
    setFamilyMembers((s) =>
      s.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  };

  const removeMember = (id) => {
    setFamilyMembers((s) => s.filter((m) => m.id !== id));
  };

  const getMember = (id) => familyMembers.find((m) => m.id === id) || null;

  return (
    <FamilyContext.Provider
      value={{
        familyMembers,
        addMember,
        updateMember,
        removeMember,
        getMember,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}
