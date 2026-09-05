import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Focus from "./pages/Focus";
import World from "./pages/World";
import Quests from "./pages/Quests";
import Achievements from "./pages/Achievements";
import Login from "./pages/Login";
import EmailLogin from "./pages/EmailLogin";
import Register from "./pages/Register";

import "./App.css";

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("studentSenseiLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((response) => {
        if (response.ok) {
          setBackendStatus("connected");
        } else {
          setBackendStatus("failed");
        }
      })
      .catch(() => {
        setBackendStatus("failed");
      });
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        {backendStatus !== "connected" && (
          <div className="backend-status">
            {backendStatus === "checking"
              ? "Checking backend..."
              : "Backend connection failed"}
          </div>
        )}

        <Routes>
          {/* Authentication */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/email-login"
            element={<EmailLogin />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected Application */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/focus"
            element={
              <ProtectedRoute>
                <Focus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quests"
            element={
              <ProtectedRoute>
                <Quests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/world"
            element={
              <ProtectedRoute>
                <World />
              </ProtectedRoute>
            }
          />

          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            }
          />

          {/* Unknown route */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;