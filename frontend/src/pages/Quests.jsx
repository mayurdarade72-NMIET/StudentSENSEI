import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Quests.css";

function Quests() {
  const navigate = useNavigate();

  // =========================================
  // BACKEND
  // =========================================

  const API_URL = "http://127.0.0.1:8000";

  // =========================================
  // XP
  // =========================================

  const [xp, setXp] = useState(0);

  // =========================================
  // QUESTS
  // =========================================

  const [quests, setQuests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [backendError, setBackendError] =
    useState(false);

  // =========================================
  // REWARD POPUP
  // =========================================

  const [reward, setReward] = useState(null);

  // =========================================
  // LOAD STUDENT
  // =========================================

  const loadStudent = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/student`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch student"
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          "Student API returned an error"
        );
      }

      setXp(data.student.xp || 0);
      setBackendError(false);

    } catch (error) {
      console.error(
        "Student API error:",
        error
      );

      setBackendError(true);
    }
  };

  // =========================================
  // LOAD DAILY TASKS
  // =========================================

  const loadDailyTasks = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/daily-tasks`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch daily tasks"
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          "Daily tasks API returned an error"
        );
      }

      const formattedTasks =
        data.tasks.map((task) => ({
          id: task.id,

          title:
            task.task_text,

          description:
            "Complete today's learning task.",

          icon: "⚔️",

          xp:
            task.xp_reward,

          completed:
            Boolean(task.completed),

          taskDate:
            task.task_date,
        }));

      setQuests(formattedTasks);
      setBackendError(false);

    } catch (error) {
      console.error(
        "Daily tasks API error:",
        error
      );

      setBackendError(true);

    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    loadStudent();
    loadDailyTasks();
  }, []);

  // =========================================
  // REFRESH WHEN RETURNING TO PAGE
  // =========================================

  useEffect(() => {
    const handleFocus = () => {
      loadStudent();
      loadDailyTasks();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  // =========================================
  // COMPLETE QUEST
  // =========================================

  const completeQuest = async (questId) => {
    const quest = quests.find(
      (item) => item.id === questId
    );

    if (!quest || quest.completed) {
      return;
    }

    const updatedQuests =
      quests.map((item) =>
        item.id === questId
          ? {
              ...item,
              completed: true,
            }
          : item
      );

    setQuests(updatedQuests);

    setReward({
      title: quest.title,
      xp: quest.xp,
    });

    setTimeout(() => {
      loadStudent();
    }, 500);

    setTimeout(() => {
      setReward(null);
    }, 7000);
  };

  // =========================================
  // PROGRESS
  // =========================================

  const completedCount =
    quests.filter(
      (quest) => quest.completed
    ).length;

  const totalQuests =
    quests.length;

  const progressPercent =
    totalQuests === 0
      ? 0
      : (completedCount /
          totalQuests) *
        100;

  const remainingQuests =
    Math.max(
      totalQuests - completedCount,
      0
    );

  // =========================================
  // CONFETTI
  // =========================================

  const createConfetti = () => {
    return Array.from({
      length: 500,
    }).map((_, index) => {
      const fromLeft =
        index % 2 === 0;

      return (
        <span
          key={index}
          className={`quest-confetti ${
            fromLeft
              ? "confetti-left"
              : "confetti-right"
          }`}
          style={{
            "--angle": `${
              fromLeft
                ? Math.random() * 75 - 65
                : Math.random() * 75 + 170
            }deg`,

            "--distance": `${
              Math.random() * 35 + 15
            }vw`,

            "--height": `${
              Math.random() * 55 + 35
            }vh`,

            "--delay": `${
              Math.random() * 0.9
            }s`,

            "--spin": `${
              Math.random() *
                1080 -
              540
            }deg`,

            "--scale": `${
              Math.random() *
                0.7 +
              0.6
            }`,
          }}
        />
      );
    });
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="quests-page">

        <nav className="quests-navbar">

          <div className="quests-logo">
            Student<span>SENSEI</span>
          </div>

          <div className="quest-player-info">

            <span>
              ⭐ Loading XP...
            </span>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Dashboard
            </button>

          </div>

        </nav>

        <main className="quests-loading">

          <div className="loading-orb">
            ⚔️
          </div>

          <p>
            DAILY ADVENTURES
          </p>

          <h1>
            Loading Quests...
          </h1>

          <span>
            Connecting to your adventure.
          </span>

        </main>

      </div>
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="quests-page">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="quests-navbar">

        <div className="quests-logo">
          Student<span>SENSEI</span>
        </div>

        <div className="quest-player-info">

          <span className="quest-xp-badge">
            ⭐ {xp} XP
          </span>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

        </div>

      </nav>


      {/* =====================================
          BACKEND STATUS
      ===================================== */}

      <div
        className={`quest-backend-status ${
          backendError
            ? "backend-error"
            : "backend-connected"
        }`}
      >
        <span className="status-dot"></span>

        {backendError
          ? "Backend connection failed"
          : "Backend connected"}
      </div>


      {/* =====================================
          HEADER
      ===================================== */}

      <header className="quests-header">

        <p>
          ⚔️ DAILY ADVENTURES
        </p>

        <h1>
          Today's Quests
        </h1>

        <span>
          Complete quests. Earn XP. Build your world.
        </span>

      </header>


      {/* =====================================
          QUEST HUD
      ===================================== */}

      <section className="quest-hud">

        <div className="quest-hud-item">

          <small>
            DAILY QUESTS
          </small>

          <strong>
            {totalQuests}
          </strong>

        </div>

        <div className="quest-hud-divider"></div>

        <div className="quest-hud-item">

          <small>
            COMPLETED
          </small>

          <strong>
            {completedCount}
          </strong>

        </div>

        <div className="quest-hud-divider"></div>

        <div className="quest-hud-item">

          <small>
            REMAINING
          </small>

          <strong>
            {remainingQuests}
          </strong>

        </div>

      </section>


      {/* =====================================
          PROGRESS
      ===================================== */}

      <section className="quest-progress">

        <div className="quest-progress-header">

          <div>

            <small>
              DAILY PROGRESS
            </small>

            <strong>
              {completedCount} / {totalQuests}
            </strong>

          </div>

          <span>
            {Math.round(progressPercent)}%
          </span>

        </div>

        <div className="quest-progress-bar">

          <div
            style={{
              width:
                `${progressPercent}%`,
            }}
          />

        </div>

        <p>
          {completedCount === totalQuests &&
          totalQuests > 0
            ? "All daily quests completed!"
            : `${remainingQuests} quest${
                remainingQuests === 1
                  ? ""
                  : "s"
              } remaining today.`}
        </p>

      </section>


      {/* =====================================
          QUEST LIST
      ===================================== */}

      <main className="quest-list">

        {quests.length === 0 ? (

          <div className="all-quests-complete">

            <div className="empty-quest-icon">
              📭
            </div>

            <p>
              DAILY ADVENTURES
            </p>

            <h2>
              No Quests Available
            </h2>

            <span>
              Your Sensei hasn't assigned any
              quests yet.
            </span>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Return to Dashboard
            </button>

          </div>

        ) : (

          quests.map((quest, index) => (

            <article
              key={quest.id}
              className={`quest-card ${
                quest.completed
                  ? "completed"
                  : ""
              }`}
            >

              <div className="quest-number">
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </div>

              <div className="quest-icon">
                {quest.icon}
              </div>

              <div className="quest-details">

                <div className="quest-title-row">

                  <div>

                    <small>
                      DAILY QUEST
                    </small>

                    <h2>
                      {quest.title}
                    </h2>

                  </div>

                  <span className="quest-xp-reward">
                    +{quest.xp} XP
                  </span>

                </div>

                <p>
                  {quest.description}
                </p>

              </div>

              <button
                className="complete-quest-button"
                disabled={
                  quest.completed
                }
                onClick={() =>
                  completeQuest(
                    quest.id
                  )
                }
              >
                {quest.completed
                  ? "✓ COMPLETED"
                  : "COMPLETE"}
              </button>

            </article>

          ))

        )}

      </main>


      {/* =====================================
          ALL QUESTS COMPLETE
      ===================================== */}

      {quests.length > 0 &&
        completedCount ===
          quests.length && (

        <section className="all-quests-complete">

          <div className="completion-trophy">
            🏆
          </div>

          <p>
            QUEST BOARD CLEARED
          </p>

          <h2>
            All Quests Complete!
          </h2>

          <span>
            Amazing work, Adventurer.
            Come back tomorrow for new quests.
          </span>

          <button
            onClick={() =>
              navigate("/world")
            }
          >
            🌍 Explore Your World
          </button>

        </section>

      )}


      {/* =====================================
          REWARD POPUP
      ===================================== */}

      {reward && (

        <div className="quest-reward-overlay">

          <div className="quest-confetti-container">

            <div className="confetti-cannon cannon-left">
              💥
            </div>

            <div className="confetti-cannon cannon-right">
              💥
            </div>

            {createConfetti()}

          </div>


          <div className="quest-reward">

            <div className="reward-glow"></div>

            <div className="reward-icon">
              🏆
            </div>

            <p>
              QUEST COMPLETE
            </p>

            <h2>
              Excellent Work!
            </h2>

            <span>
              {reward.title}
            </span>

            <div className="reward-xp">
              <small>
                REWARD
              </small>

              <strong>
                +{reward.xp} XP
              </strong>
            </div>

            <button
              onClick={() =>
                setReward(null)
              }
            >
              ⚔️ Continue Adventure
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Quests;