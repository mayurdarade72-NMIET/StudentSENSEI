import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Quests.css";

function Quests() {
  const navigate = useNavigate();

  // =========================================
  // BACKEND
  // =========================================

  const API_URL = "http://127.0.0.1:8000";

  // =========================================
  // CONSTANTS
  // =========================================

  const MAX_QUESTS = 10;

  const CUSTOM_QUESTS_KEY =
    "studentSenseiCustomQuests";

  const CUSTOM_XP_KEY =
    "studentSenseiCustomXP";

  // =========================================
  // XP
  // =========================================

  const [xp, setXp] = useState(0);

  const [customXp, setCustomXp] = useState(() => {
    return (
      Number(
        localStorage.getItem(CUSTOM_XP_KEY)
      ) || 0
    );
  });

  // =========================================
  // QUESTS
  // =========================================

  const [quests, setQuests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [backendError, setBackendError] =
    useState(false);

  // =========================================
  // ADD QUEST MODAL
  // =========================================

  const [showAddQuest, setShowAddQuest] =
    useState(false);

  const [questTitle, setQuestTitle] =
    useState("");

  const [questDescription, setQuestDescription] =
    useState("");

  const [questDate, setQuestDate] =
    useState("");

  const [questTime, setQuestTime] =
    useState("");

  const [questDifficulty, setQuestDifficulty] =
    useState("easy");

  const [formError, setFormError] =
    useState("");

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
      // BACKEND TASKS
      // ---------------------------------------

      const formattedTasks =
        data.tasks.map((task) => ({
          id: `backend-${task.id}`,

          backendId: task.id,

          source: "backend",

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

          dueDate:
            task.task_date || "",

          dueTime:
            "",
        }));

      // ---------------------------------------
      // LOAD CUSTOM QUESTS
      // ---------------------------------------

      const savedCustomQuests =
        localStorage.getItem(
          CUSTOM_QUESTS_KEY
        );

      let customQuests = [];

      if (savedCustomQuests) {
        try {
          const parsed =
            JSON.parse(
              savedCustomQuests
            );

          if (Array.isArray(parsed)) {
            customQuests = parsed;
          }
        } catch (error) {
          console.error(
            "Custom quest data error:",
            error
          );

          localStorage.removeItem(
            CUSTOM_QUESTS_KEY
          );
        }
      }

      // ---------------------------------------
      // COMBINE BACKEND + CUSTOM
      // ---------------------------------------

      setQuests([
        ...formattedTasks,
        ...customQuests,
      ]);

      setBackendError(false);
    } catch (error) {
      console.error(
        "Daily tasks API error:",
        error
      );

      setBackendError(true);

      // ---------------------------------------
      // BACKEND OFFLINE
      // ---------------------------------------
      // Still show custom quests.
      // ---------------------------------------

      const savedCustomQuests =
        localStorage.getItem(
          CUSTOM_QUESTS_KEY
        );

      let customQuests = [];

      if (savedCustomQuests) {
        try {
          const parsed =
            JSON.parse(
              savedCustomQuests
            );

          if (Array.isArray(parsed)) {
            customQuests = parsed;
          }
        } catch (error) {
          console.error(
            "Custom quest data error:",
            error
          );
        }
      }

      setQuests(customQuests);
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

      setCustomXp(
        Number(
          localStorage.getItem(
            CUSTOM_XP_KEY
          )
        ) || 0
      );
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
  // SAVE CUSTOM QUESTS
  // =========================================

  useEffect(() => {
    const customQuests =
      quests.filter(
        (quest) =>
          quest.source === "custom"
      );

    localStorage.setItem(
      CUSTOM_QUESTS_KEY,
      JSON.stringify(customQuests)
    );
  }, [quests]);

  // =========================================
  // ADD QUEST
  // =========================================

  const addQuest = () => {
    setFormError("");

    // ---------------------------------------
    // LIMIT
    // ---------------------------------------

    if (quests.length >= MAX_QUESTS) {
      setFormError(
        `You can have a maximum of ${MAX_QUESTS} quests.`
      );

      return;
    }

    // ---------------------------------------
    // TITLE
    // ---------------------------------------

    const cleanTitle =
      questTitle.trim();

    if (!cleanTitle) {
      setFormError(
        "Please enter a quest title."
      );

      return;
    }

    // ---------------------------------------
    // XP
    // ---------------------------------------

    const difficultyXP = {
      easy: 5,
      medium: 10,
      hard: 15,
    };

    // ---------------------------------------
    // NEW QUEST
    // ---------------------------------------

    const newQuest = {
      id:
        `custom-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      source: "custom",

      title:
        cleanTitle,

      description:
        questDescription.trim() ||
        "Complete this learning task.",

      icon:
        "📜",

      xp:
        difficultyXP[
          questDifficulty
        ],

      completed:
        false,

      dueDate:
        questDate || "",

      dueTime:
        questTime || "",

      difficulty:
        questDifficulty,

      createdAt:
        new Date().toISOString(),
    };

    setQuests((previous) => [
      ...previous,
      newQuest,
    ]);

    // ---------------------------------------
    // RESET FORM
    // ---------------------------------------

    setQuestTitle("");
    setQuestDescription("");
    setQuestDate("");
    setQuestTime("");
    setQuestDifficulty("easy");
    setFormError("");
    setShowAddQuest(false);
  };

  // =========================================
  // CLOSE ADD QUEST MODAL
  // =========================================

  const closeAddQuest = () => {
    setShowAddQuest(false);

    setQuestTitle("");
    setQuestDescription("");
    setQuestDate("");
    setQuestTime("");
    setQuestDifficulty("easy");
    setFormError("");
  };

  // =========================================
  // DELETE CUSTOM QUEST
  // =========================================

  const deleteQuest = (questId) => {
    const quest =
      quests.find(
        (item) =>
          item.id === questId
      );

    if (
      !quest ||
      quest.source !== "custom"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this quest?"
      );

    if (!confirmed) {
      return;
    }

    setQuests((previous) =>
      previous.filter(
        (item) =>
          item.id !== questId
      )
    );
  };

  // =========================================
  // COMPLETE QUEST
  // =========================================

  const completeQuest = (questId) => {
    const quest =
      quests.find(
        (item) =>
          item.id === questId
      );

    if (
      !quest ||
      quest.completed
    ) {
      return;
    }

    // ---------------------------------------
    // CUSTOM QUEST XP
    // ---------------------------------------

    if (
      quest.source === "custom"
    ) {
      const currentCustomXP =
        Number(
          localStorage.getItem(
            CUSTOM_XP_KEY
          )
        ) || 0;

      const newCustomXP =
        currentCustomXP +
        quest.xp;

      localStorage.setItem(
        CUSTOM_XP_KEY,
        String(newCustomXP)
      );

      setCustomXp(
        newCustomXP
      );
    }

    // ---------------------------------------
    // MARK COMPLETE
    // ---------------------------------------

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

    setQuests(
      updatedQuests
    );

    // ---------------------------------------
    // REWARD
    // ---------------------------------------

    setReward({
      title:
        quest.title,

      xp:
        quest.xp,
    });

    // ---------------------------------------
    // REFRESH BACKEND XP
    // ---------------------------------------

    setTimeout(() => {
      loadStudent();
    }, 500);

    // ---------------------------------------
    // AUTO CLOSE
    // ---------------------------------------

    setTimeout(() => {
      setReward(null);
    }, 7000);
  };

  // =========================================
  // PROGRESS
  // =========================================

  const completedCount =
    quests.filter(
      (quest) =>
        quest.completed
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
      totalQuests -
        completedCount,
      0
    );

  // =========================================
  // QUEST SLOT COUNT
  // =========================================

  const remainingSlots =
    Math.max(
      MAX_QUESTS -
        totalQuests,
      0
    );

  // =========================================
  // DISPLAY XP
  // =========================================

  const displayedXP =
    xp + customXp;

  // =========================================
  // DATE FORMATTER
  // =========================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return null;
    }

    const parsedDate =
      new Date(
        `${date}T00:00:00`
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // CONFETTI
  // =========================================

  const createConfetti = () => {
    return Array.from({
      length: 120,
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
            ⭐ {displayedXP} XP
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
          ACTION BAR
      ===================================== */}

      <section className="quest-action-bar">

        <div>

          <small>
            QUEST BOARD
          </small>

          <strong>
            {totalQuests} / {MAX_QUESTS}
          </strong>

          <span>
            {remainingSlots} slots remaining
          </span>

        </div>

        <button
          className="add-quest-button"
          disabled={
            totalQuests >= MAX_QUESTS
          }
          onClick={() => {
            setFormError("");
            setShowAddQuest(true);
          }}
        >
          ➕ Add Quest
        </button>

      </section>


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
            {Math.round(
              progressPercent
            )}
            %
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
          {completedCount ===
            totalQuests &&
          totalQuests > 0
            ? "All daily quests completed!"
            : `${remainingQuests} quest${
                remainingQuests ===
                1
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
              Add your first quest and start your adventure.
            </span>

            <button
              onClick={() =>
                setShowAddQuest(true)
              }
            >
              ➕ Add Your First Quest
            </button>

          </div>

        ) : (

          quests.map(
            (
              quest,
              index
            ) => (

              <article
                key={quest.id}
                className={`quest-card ${
                  quest.completed
                    ? "completed"
                    : ""
                }`}
              >

                <div className="quest-number">
                  {String(
                    index + 1
                  ).padStart(
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
                        {quest.source ===
                        "custom"
                          ? "YOUR QUEST"
                          : "DAILY QUEST"}
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


                  {/* --------------------------------
                      OPTIONAL DATE / TIME
                  -------------------------------- */}

                  {(quest.dueDate ||
                    quest.dueTime) && (

                    <div className="quest-schedule">

                      {quest.dueDate && (
                        <span>
                          📅{" "}
                          {formatDate(
                            quest.dueDate
                          )}
                        </span>
                      )}

                      {quest.dueTime && (
                        <span>
                          ⏰{" "}
                          {quest.dueTime}
                        </span>
                      )}

                    </div>

                  )}


                  {/* --------------------------------
                      OPTIONAL TIME MESSAGE
                  -------------------------------- */}

                  {quest.source ===
                    "custom" &&
                    !quest.dueTime && (
                      <div className="quest-flexible-time">
                        🕐 No specific time
                      </div>
                    )}

                </div>


                {/* =================================
                    ACTIONS
                ================================= */}

                <div className="quest-card-actions">

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


                  {quest.source ===
                    "custom" && (

                    <button
                      className="delete-quest-button"
                      onClick={() =>
                        deleteQuest(
                          quest.id
                        )
                      }
                      title="Delete quest"
                    >
                      🗑️
                    </button>

                  )}

                </div>

              </article>

            )
          )

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
              navigate(
                "/world"
              )
            }
          >
            🌍 Explore Your World
          </button>

        </section>

      )}


      {/* =====================================
          ADD QUEST MODAL
      ===================================== */}

      {showAddQuest && (

        <div
          className="add-quest-overlay"
          onClick={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddQuest();
            }

          }}
        >

          <div className="add-quest-modal">

            {/* =================================
                HEADER
            ================================= */}

            <div className="add-quest-header">

              <div>

                <p>
                  📜 QUEST CREATION
                </p>

                <h2>
                  Add New Quest
                </h2>

                <span>
                  Create something you want
                  to remember and complete.
                </span>

              </div>

              <button
                type="button"
                className="close-quest-modal"
                onClick={
                  closeAddQuest
                }
              >
                ✕
              </button>

            </div>


            {/* =================================
                TITLE
            ================================= */}

            <div className="quest-form-group">

              <label>
                Quest title *
              </label>

              <input
                type="text"
                value={
                  questTitle
                }
                onChange={(event) =>
                  setQuestTitle(
                    event.target.value
                  )
                }
                placeholder="e.g. Study Physics Chapter 3"
                maxLength={100}
              />

            </div>


            {/* =================================
                DESCRIPTION
            ================================= */}

            <div className="quest-form-group">

              <label>
                Description
                <span>
                  Optional
                </span>
              </label>

              <textarea
                value={
                  questDescription
                }
                onChange={(event) =>
                  setQuestDescription(
                    event.target.value
                  )
                }
                placeholder="What do you want to accomplish?"
                maxLength={500}
              />

            </div>


            {/* =================================
                DATE
            ================================= */}

            <div className="quest-form-group">

              <label>
                Due date
                <span>
                  Optional
                </span>
              </label>

              <input
                type="date"
                value={
                  questDate
                }
                onChange={(event) =>
                  setQuestDate(
                    event.target.value
                  )
                }
              />

            </div>


            {/* =================================
                TIME
            ================================= */}

            <div className="quest-form-group">

              <label>
                Specific time
                <span>
                  Optional
                </span>
              </label>

              <input
                type="time"
                value={
                  questTime
                }
                onChange={(event) =>
                  setQuestTime(
                    event.target.value
                  )
                }
              />

              <div className="quest-form-help">
                Leave this empty if you only want to remember the task.
              </div>

            </div>


            {/* =================================
                DIFFICULTY
            ================================= */}

            <div className="quest-form-group">

              <label>
                Difficulty
              </label>

              <div className="difficulty-options">

                {/* EASY */}

                <button
                  type="button"
                  className={
                    questDifficulty ===
                    "easy"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setQuestDifficulty(
                      "easy"
                    )
                  }
                >
                  <span>
                    ⭐
                  </span>

                  <strong>
                    Easy
                  </strong>

                  <small>
                    +5 XP
                  </small>
                </button>


                {/* MEDIUM */}

                <button
                  type="button"
                  className={
                    questDifficulty ===
                    "medium"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setQuestDifficulty(
                      "medium"
                    )
                  }
                >
                  <span>
                    ⭐⭐
                  </span>

                  <strong>
                    Medium
                  </strong>

                  <small>
                    +10 XP
                  </small>
                </button>


                {/* HARD */}

                <button
                  type="button"
                  className={
                    questDifficulty ===
                    "hard"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setQuestDifficulty(
                      "hard"
                    )
                  }
                >
                  <span>
                    ⭐⭐⭐
                  </span>

                  <strong>
                    Hard
                  </strong>

                  <small>
                    +15 XP
                  </small>
                </button>

              </div>

            </div>


            {/* =================================
                FLEXIBLE TIME INFO
            ================================= */}

            <div className="quest-flexible-info">

              <span>
                🕐
              </span>

              <div>

                <strong>
                  Study on your terms
                </strong>

                <p>
                  Date and time are optional.
                  Add only what you need.
                </p>

              </div>

            </div>


            {/* =================================
                FORM ERROR
            ================================= */}

            {formError && (

              <div className="quest-form-error">
                ⚠️ {formError}
              </div>

            )}


            {/* =================================
                ACTIONS
            ================================= */}

            <div className="add-quest-actions">

              <button
                type="button"
                className="cancel-quest-button"
                onClick={
                  closeAddQuest
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-quest-button"
                onClick={
                  addQuest
                }
              >
                ⚔️ Create Quest
              </button>

            </div>

          </div>

        </div>

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