import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Focus from "./pages/Focus";
import World from "./pages/World";
import Quests from "./pages/Quests";
import Achievements from "./pages/Achievements";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================
            DASHBOARD
        ===================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* =====================================
            FOCUS MINE
        ===================================== */}

        <Route
          path="/focus"
          element={<Focus />}
        />


        {/* =====================================
            QUESTS
        ===================================== */}

        <Route
          path="/quests"
          element={<Quests />}
        />


        {/* =====================================
            WORLD
        ===================================== */}

        <Route
          path="/world"
          element={<World />}
        />


        {/* =====================================
            ACHIEVEMENTS
        ===================================== */}

        <Route
          path="/achievements"
          element={<Achievements />}
        />


        {/* =====================================
            DEFAULT PAGE
        ===================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* =====================================
            UNKNOWN ROUTES
        ===================================== */}

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