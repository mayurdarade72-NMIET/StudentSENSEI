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

  const [reward, setReward] =
    useState(null);

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

      // ---------------------------------------
      // Convert backend tasks into frontend
      // quest objects.
      // ---------------------------------------

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
  // REFRESH DATA WHEN RETURNING
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

    // =======================================
    // TEMPORARY FRONTEND COMPLETION
    // =======================================

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

    // =======================================
    // SHOW REWARD
    // =======================================

    setReward({
      title: quest.title,
      xp: quest.xp,
    });

    // =======================================
    // REFRESH STUDENT DATA
    // =======================================

    setTimeout(() => {
      loadStudent();
    }, 500);

    // =======================================
    // CLOSE REWARD
    // =======================================

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

  const progressPercent =
    quests.length === 0
      ? 0
      : (completedCount /
          quests.length) *
        100;

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

        <header className="quests-header">

          <p>
            ⚔️ DAILY ADVENTURES
          </p>

          <h1>
            Loading Quests...
          </h1>

          <span>
            Connecting to StudentSENSEI backend.
          </span>

        </header>

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

          <span>
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
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: 9999,
          padding: "8px 14px",
          borderRadius: "8px",
          background:
            backendError
              ? "#ef4444"
              : "#22c55e",
          color: "white",
          fontSize: "12px",
          fontWeight: "700",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {backendError
          ? "Backend error"
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
          PROGRESS
      ===================================== */}

      <section className="quest-progress">

        <div>

          <strong>
            DAILY PROGRESS
          </strong>

          <span>
            {completedCount} /{" "}
            {quests.length} Completed
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

      </section>


      {/* =====================================
          QUEST LIST
      ===================================== */}

      <main className="quest-list">

        {quests.length === 0 ? (

          <div className="all-quests-complete">

            <div>
              📭
            </div>

            <h2>
              No Quests Available
            </h2>

            <p>
              Your Sensei hasn't assigned any
              quests yet.
            </p>

          </div>

        ) : (

          quests.map((quest) => (

            <article
              key={quest.id}
              className={`quest-card ${
                quest.completed
                  ? "completed"
                  : ""
              }`}
            >

              <div className="quest-icon">
                {quest.icon}
              </div>

              <div className="quest-details">

                <div className="quest-title-row">

                  <h2>
                    {quest.title}
                  </h2>

                  <span>
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

          <div>
            🏆
          </div>

          <h2>
            All Quests Complete!
          </h2>

          <p>
            Amazing work, Adventurer.
            Come back tomorrow for new quests.
          </p>

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

          {/* CONFETTI */}

          <div className="quest-confetti-container">

            <div className="confetti-cannon cannon-left">
              💥
            </div>

            <div className="confetti-cannon cannon-right">
              💥
            </div>

            {createConfetti()}

          </div>


          {/* POPUP */}

          <div className="quest-reward">

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

            <strong>
              +{reward.xp} XP
            </strong>

            <button
              onClick={() =>
                setReward(null)
              }
            >
              ⚔️ Continue
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Quests;