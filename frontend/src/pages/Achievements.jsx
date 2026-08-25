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
    const saved = localStorage.getItem(
      "studentSenseiCompletedQuests"
    );

    return saved ? Number(saved) : 0;
  };

  const getFocusSessions = () => {
    const saved = localStorage.getItem(
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
        "Complete your first quest and begin your adventure.",
      requirement: "Complete 1 quest",
      unlocked: completedQuests >= 1,
      reward: "+25 XP",
    },

    {
      id: "first-focus",
      icon: "⛏️",
      title: "First Focus",
      description:
        "Complete your first Focus Mine session.",
      requirement: "Complete 1 focus session",
      unlocked: focusSessions >= 1,
      reward: "+25 XP",
    },

    {
      id: "xp-1000",
      icon: "⭐",
      title: "Rising Adventurer",
      description:
        "Reach 1000 XP through quests and focus sessions.",
      requirement: "Reach 1000 XP",
      unlocked: xp >= 1000,
      reward: "+100 XP",
    },

    {
      id: "forest",
      icon: "🌲",
      title: "Forest Explorer",
      description:
        "Unlock the next region of your study world.",
      requirement: "Reach Level 3",
      unlocked: xp >= 500,
      reward: "Forest Plains",
    },

    {
      id: "village",
      icon: "🏡",
      title: "Village Builder",
      description:
        "Grow your study world by reaching a major milestone.",
      requirement: "Reach 900 XP",
      unlocked: xp >= 900,
      reward: "+150 XP",
    },

    {
      id: "quest-warrior",
      icon: "🗡️",
      title: "Quest Warrior",
      description:
        "Complete multiple quests and prove your consistency.",
      requirement: "Complete 5 quests",
      unlocked: completedQuests >= 5,
      reward: "+100 XP",
    },

    {
      id: "focus-master",
      icon: "⛏️",
      title: "Focus Master",
      description:
        "Build a strong focus habit through repeated sessions.",
      requirement: "Complete 10 focus sessions",
      unlocked: focusSessions >= 10,
      reward: "+200 XP",
    },

    {
      id: "study-legend",
      icon: "💎",
      title: "Study Legend",
      description:
        "Reach the next major stage of your StudentSENSEI journey.",
      requirement: "Reach 2000 XP",
      unlocked: xp >= 2000,
      reward: "Legendary Status",
    },
  ];

  // =========================================
  // SYNC DATA
  // =========================================

  useEffect(() => {
    const syncData = () => {
      setXp(getXP());
      setCompletedQuests(getCompletedQuests());
      setFocusSessions(getFocusSessions());
    };

    syncData();

    window.addEventListener("focus", syncData);
    window.addEventListener("storage", syncData);

    return () => {
      window.removeEventListener("focus", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, []);

  // =========================================
  // COUNTS
  // =========================================

  const unlockedCount = achievementList.filter(
    (achievement) => achievement.unlocked
  ).length;

  const totalAchievements = achievementList.length;

  const progressPercent =
    totalAchievements > 0
      ? (unlockedCount / totalAchievements) * 100
      : 0;

  // =========================================
  // PLAYER LEVEL
  // =========================================

  const playerLevel = Math.floor(xp / 250) + 1;

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="achievements-page">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <nav className="achievements-navbar">

        <button
          className="achievements-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <div className="achievements-logo">
          Student<span>SENSEI</span>
        </div>

        <div className="achievements-level">

          <small>YOUR LEVEL</small>

          <strong>
            {playerLevel}
          </strong>

        </div>

      </nav>


      {/* =========================================
          HERO
      ========================================= */}

      <header className="achievements-header">

        <p className="achievements-eyebrow">
          🏆 YOUR TROPHIES
        </p>

        <h1>
          Achievements
        </h1>

        <p>
          Complete quests, master your focus,
          and unlock your study milestones.
        </p>

      </header>


      {/* =========================================
          SUMMARY
      ========================================= */}

      <section className="achievement-summary">

        <div className="summary-item">

          <div className="summary-icon">
            ⭐
          </div>

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

          <div className="summary-icon">
            ⚔️
          </div>

          <div>
            <small>
              QUESTS COMPLETED
            </small>

            <strong>
              {completedQuests}
            </strong>
          </div>

        </div>


        <div className="summary-item">

          <div className="summary-icon">
            ⛏️
          </div>

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


      {/* =========================================
          ACHIEVEMENT PROGRESS
      ========================================= */}

      <section className="achievement-progress">

        <div className="achievement-progress-header">

          <div>
            <small>
              ACHIEVEMENT PROGRESS
            </small>

            <h2>
              {unlockedCount} / {totalAchievements}
            </h2>
          </div>

          <strong>
            {Math.round(progressPercent)}%
          </strong>

        </div>


        <div className="achievement-progress-bar">

          <div
            style={{
              width: `${progressPercent}%`,
            }}
          />

        </div>


        <p>
          {unlockedCount === totalAchievements
            ? "🏆 All achievements unlocked!"
            : `${totalAchievements - unlockedCount} achievements remaining`}
        </p>

      </section>


      {/* =========================================
          ACHIEVEMENT GRID
      ========================================= */}

      <main className="achievement-grid">

        {achievementList.map((achievement) => (

          <article
            key={achievement.id}
            className={`achievement-card ${
              achievement.unlocked
                ? "unlocked"
                : "locked"
            }`}
          >

            {/* CARD ICON */}

            <div className="achievement-icon">

              {achievement.unlocked
                ? achievement.icon
                : "🔒"}

            </div>


            {/* CARD CONTENT */}

            <div className="achievement-content">

              <div className="achievement-title-row">

                <span className="achievement-number">
                  ACHIEVEMENT
                </span>

                {achievement.unlocked && (
                  <span className="unlocked-badge">
                    UNLOCKED
                  </span>
                )}

              </div>


              <h2>
                {achievement.title}
              </h2>


              <p>
                {achievement.description}
              </p>


              <div className="achievement-footer">

                <small>
                  {achievement.unlocked
                    ? `✓ ${achievement.requirement}`
                    : `🔒 ${achievement.requirement}`}
                </small>

                <span className="achievement-reward">
                  {achievement.reward}
                </span>

              </div>

            </div>

          </article>

        ))}

      </main>


      {/* =========================================
          SENSEI MESSAGE
      ========================================= */}

      <section className="achievement-sensei">

        <div className="sensei-achievement-icon">
          🧙
        </div>


        <div className="achievement-sensei-message">

          <small>
            YOUR SENSEI
          </small>

          <h2>
            Every achievement tells a story.
          </h2>

          <p>
            Keep completing quests and mastering
            your focus. Your world grows with you.
          </p>

        </div>


        <button
          onClick={() => navigate("/quests")}
        >
          ⚔️ Continue Questing →
        </button>

      </section>

    </div>
  );
}

export default Achievements;