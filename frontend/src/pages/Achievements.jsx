import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Achievements.css";

function Achievements() {
  const navigate = useNavigate();

  // =========================================
  // GET PLAYER DATA
  // =========================================

  const getXP = () => {
    const savedXP = localStorage.getItem("studentSenseiXP");
    return savedXP ? Number(savedXP) : 750;
  };

  const getCompletedQuests = () => {
    const saved =
      localStorage.getItem(
        "studentSenseiCompletedQuests"
      );

    return saved ? Number(saved) : 0;
  };

  const getFocusSessions = () => {
    const saved =
      localStorage.getItem(
        "studentSenseiSessions"
      );

    return saved ? Number(saved) : 0;
  };

  const [xp, setXp] = useState(getXP());

  const [completedQuests, setCompletedQuests] =
    useState(getCompletedQuests());

  const [focusSessions, setFocusSessions] =
    useState(getFocusSessions());

  // =========================================
  // ACHIEVEMENTS
  // =========================================

  const achievementList = [
    {
      id: "first-quest",
      icon: "⚔️",
      title: "First Quest",
      description:
        "Complete your first quest.",
      requirement:
        "Complete 1 quest",
      unlocked:
        completedQuests >= 1,
    },

    {
      id: "first-focus",
      icon: "⛏️",
      title: "First Focus",
      description:
        "Complete your first Focus Mine session.",
      requirement:
        "Complete 1 focus session",
      unlocked:
        focusSessions >= 1,
    },

    {
      id: "xp-1000",
      icon: "⭐",
      title: "Rising Adventurer",
      description:
        "Reach 1000 XP.",
      requirement:
        "Reach 1000 XP",
      unlocked:
        xp >= 1000,
    },

    {
      id: "forest",
      icon: "🌲",
      title: "Forest Explorer",
      description:
        "Unlock the Growing Forest.",
      requirement:
        "Reach 800 XP",
      unlocked:
        xp >= 800,
    },

    {
      id: "village",
      icon: "🏡",
      title: "Village Builder",
      description:
        "Unlock your first village.",
      requirement:
        "Reach 900 XP",
      unlocked:
        xp >= 900,
    },
  ];

  // =========================================
  // SYNC DATA
  // =========================================

  useEffect(() => {
    const syncData = () => {
      setXp(getXP());
      setCompletedQuests(
        getCompletedQuests()
      );
      setFocusSessions(
        getFocusSessions()
      );
    };

    syncData();

    window.addEventListener(
      "focus",
      syncData
    );

    return () => {
      window.removeEventListener(
        "focus",
        syncData
      );
    };
  }, []);

  // =========================================
  // COUNTS
  // =========================================

  const unlockedCount =
    achievementList.filter(
      (achievement) =>
        achievement.unlocked
    ).length;

  const totalAchievements =
    achievementList.length;

  const progressPercent =
    (unlockedCount /
      totalAchievements) *
    100;

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="achievements-page">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="achievements-navbar">

        <div className="achievements-logo">
          Student<span>SENSEI</span>
        </div>

        <div className="achievements-nav">

          <span>
            🏆 {unlockedCount} /{" "}
            {totalAchievements}
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

      <header className="achievements-header">

        <p>
          🏆 YOUR TROPHIES
        </p>

        <h1>
          Achievements
        </h1>

        <span>
          Complete quests, master your focus,
          and grow your world.
        </span>

      </header>


      {/* =====================================
          PLAYER SUMMARY
      ===================================== */}

      <section className="achievement-summary">

        <div className="summary-item">

          <span>
            ⭐
          </span>

          <div>

            <small>
              EXPERIENCE
            </small>

            <strong>
              {xp} XP
            </strong>

          </div>

        </div>


        <div className="summary-item">

          <span>
            ⚔️
          </span>

          <div>

            <small>
              QUESTS
            </small>

            <strong>
              {completedQuests}
            </strong>

          </div>

        </div>


        <div className="summary-item">

          <span>
            ⛏️
          </span>

          <div>

            <small>
              FOCUS SESSIONS
            </small>

            <strong>
              {focusSessions}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================
          ACHIEVEMENT PROGRESS
      ===================================== */}

      <section className="achievement-progress">

        <div className="achievement-progress-header">

          <strong>
            ACHIEVEMENT PROGRESS
          </strong>

          <span>
            {unlockedCount} /{" "}
            {totalAchievements}
          </span>

        </div>

        <div className="achievement-progress-bar">

          <div
            style={{
              width:
                `${progressPercent}%`,
            }}
          ></div>

        </div>

        <p>
          {unlockedCount ===
          totalAchievements
            ? "🏆 All achievements unlocked!"
            : `${totalAchievements -
                unlockedCount} achievements remaining`}
        </p>

      </section>


      {/* =====================================
          ACHIEVEMENT GRID
      ===================================== */}

      <main className="achievement-grid">

        {achievementList.map(
          (achievement) => (

            <article
              key={achievement.id}
              className={`achievement-card ${
                achievement.unlocked
                  ? "unlocked"
                  : "locked"
              }`}
            >

              {/* ICON */}

              <div className="achievement-icon">

                {achievement.unlocked
                  ? achievement.icon
                  : "🔒"}

              </div>


              {/* CONTENT */}

              <div className="achievement-content">

                <div className="achievement-title">

                  <h2>
                    {achievement.title}
                  </h2>

                  {achievement.unlocked && (
                    <span>
                      UNLOCKED
                    </span>
                  )}

                </div>

                <p>
                  {achievement.description}
                </p>

                <small>
                  {achievement.requirement}
                </small>

              </div>

            </article>

          )
        )}

      </main>


      {/* =====================================
          SENSEI
      ===================================== */}

      <section className="achievement-sensei">

        <div className="sensei-achievement-icon">
          🧙
        </div>

        <div>

          <small>
            YOUR SENSEI
          </small>

          <h2>
            Every achievement tells a story.
          </h2>

          <p>
            Keep completing quests and
            mastering your focus.
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/quests")
          }
        >
          ⚔️ Continue Questing
        </button>

      </section>

    </div>
  );
}

export default Achievements;