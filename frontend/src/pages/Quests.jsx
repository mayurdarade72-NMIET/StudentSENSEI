import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Quests.css";

function Quests() {
  const navigate = useNavigate();

  // =========================================
  // XP
  // =========================================

  const getXP = () => {
    const savedXP =
      localStorage.getItem("studentSenseiXP");

    return savedXP ? Number(savedXP) : 750;
  };

  const [xp, setXp] = useState(getXP);

  // =========================================
  // DEFAULT DAILY QUESTS
  // =========================================

  const defaultQuests = [
    {
      id: 1,
      title: "Complete 10 Math Problems",
      description:
        "Solve today's mathematics practice problems.",
      icon: "⚔️",
      xp: 100,
      completed: false,
    },

    {
      id: 2,
      title: "Study Physics Chapter",
      description:
        "Read and understand one physics chapter.",
      icon: "📖",
      xp: 150,
      completed: false,
    },

    {
      id: 3,
      title: "Practice Programming",
      description:
        "Practice Python for 45 minutes.",
      icon: "💻",
      xp: 200,
      completed: false,
    },

    {
      id: 4,
      title: "Complete Focus Session",
      description:
        "Enter the Focus Mine and complete one session.",
      icon: "⛏️",
      xp: 100,
      completed: false,
    },
  ];

  // =========================================
  // REAL DATE
  // =========================================

  const getToday = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================================
  // LOAD DAILY QUESTS
  // =========================================

  const loadDailyQuests = () => {
    const today = getToday();

    const savedDate =
      localStorage.getItem(
        "studentSenseiQuestDate"
      );

    const savedQuests =
      localStorage.getItem(
        "studentSenseiQuests"
      );

    // -----------------------------------------
    // NEW DAY
    // -----------------------------------------

    if (savedDate !== today) {
      localStorage.setItem(
        "studentSenseiQuestDate",
        today
      );

      localStorage.setItem(
        "studentSenseiQuests",
        JSON.stringify(defaultQuests)
      );

      return defaultQuests;
    }

    // -----------------------------------------
    // SAME DAY
    // -----------------------------------------

    if (savedQuests) {
      try {
        return JSON.parse(savedQuests);
      } catch {
        localStorage.setItem(
          "studentSenseiQuests",
          JSON.stringify(defaultQuests)
        );

        return defaultQuests;
      }
    }

    // -----------------------------------------
    // FIRST VISIT
    // -----------------------------------------

    localStorage.setItem(
      "studentSenseiQuestDate",
      today
    );

    localStorage.setItem(
      "studentSenseiQuests",
      JSON.stringify(defaultQuests)
    );

    return defaultQuests;
  };

  const [quests, setQuests] =
    useState(loadDailyQuests);

  // =========================================
  // REWARD POPUP
  // =========================================

  const [reward, setReward] =
    useState(null);

  // =========================================
  // CHECK FOR NEW DAY
  // =========================================

  useEffect(() => {
    const checkNewDay = () => {
      const savedDate =
        localStorage.getItem(
          "studentSenseiQuestDate"
        );

      const today = getToday();

      if (savedDate !== today) {
        const freshQuests =
          defaultQuests.map(
            (quest) => ({
              ...quest,
              completed: false,
            })
          );

        localStorage.setItem(
          "studentSenseiQuestDate",
          today
        );

        localStorage.setItem(
          "studentSenseiQuests",
          JSON.stringify(freshQuests)
        );

        setQuests(freshQuests);
      }
    };

    checkNewDay();

    // Check when user returns to the tab
    window.addEventListener(
      "focus",
      checkNewDay
    );

    // Also check periodically so the reset
    // can happen even if the page remains open.
    const interval = setInterval(
      checkNewDay,
      60000
    );

    return () => {
      window.removeEventListener(
        "focus",
        checkNewDay
      );

      clearInterval(interval);
    };
  }, []);

  // =========================================
  // SYNC XP
  // =========================================

  useEffect(() => {
    const syncXP = () => {
      setXp(getXP());
    };

    syncXP();

    window.addEventListener(
      "focus",
      syncXP
    );

    return () => {
      window.removeEventListener(
        "focus",
        syncXP
      );
    };
  }, []);

  // =========================================
  // SAVE QUESTS
  // =========================================

  useEffect(() => {
    localStorage.setItem(
      "studentSenseiQuests",
      JSON.stringify(quests)
    );
  }, [quests]);

  // =========================================
  // COMPLETE QUEST
  // =========================================

  const completeQuest = (questId) => {
    const quest = quests.find(
      (item) => item.id === questId
    );

    if (!quest || quest.completed) {
      return;
    }

    // -----------------------------------------
    // ADD XP
    // -----------------------------------------

    const currentXP = getXP();

    const newXP =
      currentXP + quest.xp;

    localStorage.setItem(
      "studentSenseiXP",
      String(newXP)
    );

    setXp(newXP);

    // -----------------------------------------
    // MARK QUEST COMPLETE
    // -----------------------------------------

    const updatedQuests =
      quests.map(
        (item) =>
          item.id === questId
            ? {
                ...item,
                completed: true,
              }
            : item
      );

    setQuests(updatedQuests);

    // -----------------------------------------
    // TOTAL COMPLETED QUESTS
    // -----------------------------------------

    const totalCompleted =
      Number(
        localStorage.getItem(
          "studentSenseiCompletedQuests"
        )
      ) || 0;

    localStorage.setItem(
      "studentSenseiCompletedQuests",
      String(
        totalCompleted + 1
      )
    );

    // -----------------------------------------
    // SHOW REWARD
    // -----------------------------------------

    setReward({
      title: quest.title,
      xp: quest.xp,
    });

    // -----------------------------------------
    // CLOSE REWARD
    // -----------------------------------------

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
        ></span>
      );
    });
  };

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
          ></div>

        </div>

      </section>


      {/* =====================================
          QUEST LIST
      ===================================== */}

      <main className="quest-list">

        {quests.map((quest) => (

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

        ))}

      </main>


      {/* =====================================
          ALL QUESTS COMPLETE
      ===================================== */}

      {completedCount ===
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