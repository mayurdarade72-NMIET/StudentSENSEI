import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // =========================================
  // BACKEND STUDENT DATA
  // =========================================

  const [student, setStudent] = useState(null);

  // =========================================
  // LOCAL DATA
  // =========================================

  const getCompletedQuests = () => {
    const saved = localStorage.getItem(
      "studentSenseiCompletedQuests"
    );

    return saved ? Number(saved) : 0;
  };

  const getSessions = () => {
    const saved = localStorage.getItem(
      "studentSenseiSessions"
    );

    return saved ? Number(saved) : 0;
  };

  const [completedQuests, setCompletedQuests] =
    useState(getCompletedQuests());

  const [sessions, setSessions] =
    useState(getSessions());

  // =========================================
  // FETCH STUDENT FROM BACKEND
  // =========================================

  const fetchStudent = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/student"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch student"
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          "Backend returned an error"
        );
      }

      setStudent(data.student);

    } catch (error) {
      console.error(
        "Student API error:",
        error
      );
    }
  };

  // =========================================
  // SYNC LOCAL DATA
  // =========================================

  const syncLocalData = () => {
    setCompletedQuests(
      getCompletedQuests()
    );

    setSessions(
      getSessions()
    );
  };

  // =========================================
  // LOAD DATA
  // =========================================

  useEffect(() => {
    fetchStudent();
    syncLocalData();

    const handleFocus = () => {
      fetchStudent();
      syncLocalData();
    };

    const handleStorage = () => {
      syncLocalData();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  // =========================================
  // PLAYER DATA
  // =========================================

  // Backend is the source of truth for XP.
  const xp = student?.xp ?? 0;

  const level =
    student?.level ??
    Math.floor(xp / 250) + 1;

  const playerName =
    student?.name ?? "Student";

  const coins =
    student?.coins ?? 0;

  const backendWorld =
    student?.current_world ?? "";

  // =========================================
  // LEVEL PROGRESS
  // =========================================

  const levelStartXP =
    (level - 1) * 250;

  const levelEndXP =
    level * 250;

  const levelProgress = Math.min(
    Math.max(
      ((xp - levelStartXP) /
        (levelEndXP - levelStartXP)) *
        100,
      0
    ),
    100
  );

  // =========================================
  // WORLD
  // =========================================

  let worldName =
    backendWorld || "Starting Land";

  // Fallback world progression if the
  // backend does not provide a world.

  if (!backendWorld) {
    if (xp >= 900) {
      worldName = "Village";
    } else if (xp >= 800) {
      worldName = "Growing Forest";
    } else {
      worldName = "Starting Land";
    }
  }

  // =========================================
  // QUEST PROGRESS
  // =========================================

  const savedQuests =
    localStorage.getItem(
      "studentSenseiQuests"
    );

  let quests = [];

  try {
    quests = savedQuests
      ? JSON.parse(savedQuests)
      : [];
  } catch (error) {
    console.error(
      "Quest data error:",
      error
    );

    quests = [];
  }

  const todayCompleted =
    quests.filter(
      (quest) => quest.completed
    ).length;

  const totalQuests =
    quests.length || 4;

  const questProgress =
    totalQuests > 0
      ? (todayCompleted / totalQuests) * 100
      : 0;

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="dashboard-page">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          Student<span>SENSEI</span>
        </div>

        <div className="dashboard-nav-actions">

          <button
            onClick={() =>
              navigate("/quests")
            }
          >
            ⚔️ Quests
          </button>

          <button
            onClick={() =>
              navigate("/world")
            }
          >
            🌍 World
          </button>

          <button
            onClick={() =>
              navigate("/achievements")
            }
          >
            🏆 Achievements
          </button>

        </div>

      </nav>


      {/* =====================================
          HERO
      ===================================== */}

      <header className="dashboard-hero">

        <div>

          <p className="dashboard-eyebrow">
            🌱 WELCOME BACK, ADVENTURER
          </p>

          <h1>
            Ready to level up?
          </h1>

          <p className="dashboard-subtitle">
            Welcome back, {playerName}.
            Complete quests, focus your mind,
            and build your world.
          </p>

        </div>

        <div className="dashboard-level-badge">

          <span>
            LEVEL
          </span>

          <strong>
            {level}
          </strong>

        </div>

      </header>


      {/* =====================================
          XP CARD
      ===================================== */}

      <section className="dashboard-xp-card">

        <div className="xp-card-top">

          <div>

            <small>
              EXPERIENCE
            </small>

            <h2>
              ⭐ {xp} XP
            </h2>

          </div>

          <span>
            LEVEL {level}
          </span>

        </div>

        <div className="dashboard-xp-bar">

          <div
            style={{
              width: `${levelProgress}%`,
            }}
          ></div>

        </div>

        <p>
          {Math.max(
            levelEndXP - xp,
            0
          )}{" "}
          XP until Level{" "}
          {level + 1}
        </p>

      </section>


      {/* =====================================
          MAIN ACTIONS
      ===================================== */}

      <main className="dashboard-grid">

        {/* =================================
            QUESTS
        ================================= */}

        <article className="dashboard-card quests-card">

          <div className="dashboard-card-icon">
            ⚔️
          </div>

          <div className="dashboard-card-content">

            <span>
              DAILY ADVENTURES
            </span>

            <h2>
              Today's Quests
            </h2>

            <p>
              {todayCompleted} / {totalQuests} quests
              completed
            </p>

            <div className="mini-progress">

              <div
                style={{
                  width: `${questProgress}%`,
                }}
              ></div>

            </div>

          </div>

          <button
            onClick={() =>
              navigate("/quests")
            }
          >
            View Quests →
          </button>

        </article>


        {/* =================================
            FOCUS
        ================================= */}

        <article className="dashboard-card focus-card">

          <div className="dashboard-card-icon">
            ⛏️
          </div>

          <div className="dashboard-card-content">

            <span>
              FOCUS MINE
            </span>

            <h2>
              Deep Focus
            </h2>

            <p>
              Complete a focus session and earn XP.
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/focus")
            }
          >
            Start Focus →
          </button>

        </article>


        {/* =================================
            WORLD
        ================================= */}

        <article className="dashboard-card world-card">

          <div className="dashboard-card-icon">
            🌍
          </div>

          <div className="dashboard-card-content">

            <span>
              YOUR WORLD
            </span>

            <h2>
              {worldName}
            </h2>

            <p>
              Your world grows as you earn XP.
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/world")
            }
          >
            Explore →
          </button>

        </article>


        {/* =================================
            ACHIEVEMENTS
        ================================= */}

        <article className="dashboard-card achievement-card">

          <div className="dashboard-card-icon">
            🏆
          </div>

          <div className="dashboard-card-content">

            <span>
              MILESTONES
            </span>

            <h2>
              Achievements
            </h2>

            <p>
              Track your trophies and unlock
              new milestones.
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/achievements")
            }
          >
            View Trophies →
          </button>

        </article>

      </main>


      {/* =====================================
          STATS
      ===================================== */}

      <section className="dashboard-stats">

        <div className="dashboard-stat">

          <span>
            ⭐
          </span>

          <div>

            <small>
              TOTAL XP
            </small>

            <strong>
              {xp}
            </strong>

          </div>

        </div>


        <div className="dashboard-stat">

          <span>
            ⚔️
          </span>

          <div>

            <small>
              QUESTS COMPLETED
            </small>

            <strong>
              {completedQuests}
            </strong>

          </div>

        </div>


        <div className="dashboard-stat">

          <span>
            ⛏️
          </span>

          <div>

            <small>
              FOCUS SESSIONS
            </small>

            <strong>
              {sessions}
            </strong>

          </div>

        </div>


        <div className="dashboard-stat">

          <span>
            🌍
          </span>

          <div>

            <small>
              CURRENT WORLD
            </small>

            <strong>
              {worldName}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================
          SENSEI MESSAGE
      ===================================== */}

      <section className="dashboard-sensei">

        <div className="sensei-avatar">
          🧙
        </div>

        <div className="sensei-message">

          <small>
            YOUR SENSEI
          </small>

          <h2>
            Every small step makes your world
            stronger.
          </h2>

          <p>
            Complete a quest or start a focus
            session to continue your journey.
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/quests")
          }
        >
          Begin Adventure ⚔️
        </button>

      </section>

    </div>
  );
}

export default Dashboard;