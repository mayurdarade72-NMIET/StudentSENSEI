import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";
import Focus from "./pages/Focus";
import World from "./pages/World";
import Quests from "./pages/Quests";
import Achievements from "./pages/Achievements";

function App() {
  // =========================================
  // BACKEND CONNECTION TEST
  // =========================================

  const [backendStatus, setBackendStatus] =
    useState("Checking backend...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setBackendStatus(
            "Backend connected successfully"
          );
        } else {
          setBackendStatus(
            "Backend responded, but returned an error"
          );
        }
      })
      .catch((error) => {
        console.error(
          "Backend connection error:",
          error
        );

        setBackendStatus(
          "Backend connection failed"
        );
      });
  }, []);

  return (
    <BrowserRouter>

      {/* =====================================
          TEMPORARY BACKEND STATUS
      ===================================== */}

      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: 9999,
          padding: "8px 14px",
          borderRadius: "8px",
          background:
            backendStatus ===
            "Backend connected successfully"
              ? "#22c55e"
              : "#f59e0b",
          color: "white",
          fontSize: "12px",
          fontWeight: "700",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {backendStatus}
      </div>


      {/* =====================================
          ROUTES
      ===================================== */}

      <Routes>

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* FOCUS MINE */}

        <Route
          path="/focus"
          element={<Focus />}
        />


        {/* QUESTS */}

        <Route
          path="/quests"
          element={<Quests />}
        />


        {/* WORLD */}

        <Route
          path="/world"
          element={<World />}
        />


        {/* ACHIEVEMENTS */}

        <Route
          path="/achievements"
          element={<Achievements />}
        />


        {/* DEFAULT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* UNKNOWN ROUTES */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;