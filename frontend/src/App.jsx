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

  const backendConnected =
    backendStatus ===
    "Backend connected successfully";

  return (
    <BrowserRouter>

      {/* =====================================
          BACKEND STATUS
      ===================================== */}

      <div
        style={{
          position: "fixed",
          top: "18px",
          right: "18px",
          zIndex: 9999,

          padding: "9px 15px",

          borderRadius: "10px",

          background: backendConnected
            ? "#22c55e"
            : "#f59e0b",

          color: "white",

          fontSize: "12px",

          fontWeight: "700",

          boxShadow:
            "0 6px 18px rgba(0,0,0,0.3)",

          border: "1px solid rgba(255,255,255,0.15)",

          maxWidth: "220px",

          textAlign: "center",

          pointerEvents: "none",
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