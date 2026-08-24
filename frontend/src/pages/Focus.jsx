import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Focus.css";

function Focus() {
  const navigate = useNavigate();

  // =========================================
  // SESSION SETTINGS
  // =========================================

  // TEST DEFAULT: 1 minute
  // Change this later if needed.
  const DEFAULT_DURATION = 1;

  // Custom duration limits
  const MIN_DURATION = 1;
  const MAX_DURATION = 180;

  // XP earned for every completed 30 minutes
  const XP_PER_30_MINUTES = 5;

  // =========================================
  // TIMER STATE
  // =========================================

  const [selectedDuration, setSelectedDuration] =
    useState(DEFAULT_DURATION);

  const [customMinutes, setCustomMinutes] =
    useState(String(DEFAULT_DURATION));

  const [timeLeft, setTimeLeft] = useState(
    DEFAULT_DURATION * 60
  );

  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  // =========================================
  // CALCULATE SESSION XP
  // =========================================

  const sessionXP =
    Math.floor(selectedDuration / 30) *
    XP_PER_30_MINUTES;

  // =========================================
  // MINING STATE
  // =========================================

  const [blocks, setBlocks] = useState(0);

  const maxBlocks = 100;

  const miningProgress = Math.min(
    (blocks / maxBlocks) * 100,
    100
  );

  // =========================================
  // CHANGE SESSION DURATION
  // =========================================

  const changeDuration = (minutes) => {
    if (isRunning || completed) {
      return;
    }

    const safeMinutes = Math.min(
      Math.max(minutes, MIN_DURATION),
      MAX_DURATION
    );

    setSelectedDuration(safeMinutes);
    setCustomMinutes(String(safeMinutes));
    setTimeLeft(safeMinutes * 60);
  };

  // =========================================
  // CUSTOM MINUTES
  // =========================================

  const handleCustomMinutesChange = (event) => {
    if (isRunning || completed) {
      return;
    }

    const value = event.target.value;

    if (value === "") {
      setCustomMinutes("");
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    let minutes = Number(value);

    if (minutes > MAX_DURATION) {
      minutes = MAX_DURATION;
    }

    setCustomMinutes(String(minutes));

    if (minutes >= MIN_DURATION) {
      setSelectedDuration(minutes);
      setTimeLeft(minutes * 60);
    }
  };

  // =========================================
  // CUSTOM INPUT BLUR
  // =========================================

  const handleCustomMinutesBlur = () => {
    if (isRunning || completed) {
      return;
    }

    let minutes = Number(customMinutes);

    if (
      !Number.isFinite(minutes) ||
      minutes < MIN_DURATION
    ) {
      minutes = MIN_DURATION;
    }

    if (minutes > MAX_DURATION) {
      minutes = MAX_DURATION;
    }

    setCustomMinutes(String(minutes));
    setSelectedDuration(minutes);
    setTimeLeft(minutes * 60);
  };

  // =========================================
  // TIMER
  // =========================================

  useEffect(() => {
    if (!isRunning || completed) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);

          setIsRunning(false);
          setCompleted(true);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, completed]);

  // =========================================
  // SESSION COMPLETION
  // =========================================

  useEffect(() => {
    if (!completed) {
      return;
    }

    const alreadyRewarded =
      sessionStorage.getItem(
        "focusSessionRewarded"
      );

    if (alreadyRewarded === "true") {
      return;
    }

    // =========================================
    // GET CURRENT XP
    // =========================================

    const currentXP =
      Number(
        localStorage.getItem("studentSenseiXP")
      ) || 750;

    // =========================================
    // ADD DURATION-BASED XP
    // =========================================

    const newXP = currentXP + sessionXP;

    localStorage.setItem(
      "studentSenseiXP",
      String(newXP)
    );

    // =========================================
    // SAVE SESSION COUNT
    // =========================================

    const sessions =
      Number(
        localStorage.getItem(
          "studentSenseiSessions"
        )
      ) || 0;

    localStorage.setItem(
      "studentSenseiSessions",
      String(sessions + 1)
    );

    // =========================================
    // SAVE BLOCKS
    // =========================================

    const totalBlocks =
      Number(
        localStorage.getItem(
          "studentSenseiBlocks"
        )
      ) || 0;

    localStorage.setItem(
      "studentSenseiBlocks",
      String(totalBlocks + blocks)
    );

    // =========================================
    // PREVENT DUPLICATE REWARD
    // =========================================

    sessionStorage.setItem(
      "focusSessionRewarded",
      "true"
    );
  }, [completed, blocks, sessionXP]);

  // =========================================
  // TIMER FORMAT
  // =========================================

  const minutes = Math.floor(
    timeLeft / 60
  )
    .toString()
    .padStart(2, "0");

  const seconds = (
    timeLeft % 60
  )
    .toString()
    .padStart(2, "0");

  // =========================================
  // START MINING
  // =========================================

  const startMining = () => {
    if (completed) {
      return;
    }

    if (
      !selectedDuration ||
      selectedDuration < MIN_DURATION
    ) {
      changeDuration(MIN_DURATION);
    }

    setIsRunning(true);
  };

  // =========================================
  // END SESSION
  // =========================================

  const endSession = () => {
    setIsRunning(false);
    navigate("/dashboard");
  };

  // =========================================
  // MINE BLOCK
  // =========================================

  const mineBlock = () => {
    if (!isRunning || completed) {
      return;
    }

    setBlocks((previous) => {
      if (previous >= maxBlocks) {
        return previous;
      }

      return previous + 1;
    });
  };

  // =========================================
  // RESET SESSION
  // =========================================

  const resetSession = () => {
    sessionStorage.removeItem(
      "focusSessionRewarded"
    );

    setTimeLeft(selectedDuration * 60);
    setBlocks(0);
    setIsRunning(false);
    setCompleted(false);
  };

  // =========================================
  // CONTINUE ADVENTURE
  // =========================================

  const continueAdventure = () => {
    navigate("/dashboard");
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="focus-page">

      {/* =====================================
          NAVIGATION BAR
      ===================================== */}

      <nav className="focus-navbar">

        <div className="focus-logo">
          Student<span>SENSEI</span>
        </div>

        <div className="focus-nav-right">

          <span>
            ⛏️ MINING SESSION
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

      <section className="focus-header">

        <p>
          ⛏️ THE FOCUS MINE
        </p>

        <h1>
          Focus Session
        </h1>

        <span>
          Stay focused. Great things are mined
          with patience.
        </span>

      </section>


      {/* =====================================
          MAIN MINE
      ===================================== */}

      <main className="mine-container">

        <div className="mine-background">

          <div className="mine-rock rock-one">
            🪨
          </div>

          <div className="mine-rock rock-two">
            🪨
          </div>

          <div className="mine-rock rock-three">
            🪨
          </div>

          <div className="mine-lamp lamp-one">
            🔥
          </div>

          <div className="mine-lamp lamp-two">
            🔥
          </div>

          <div className="mine-player">
            🧑‍💻
          </div>

          <div className="mine-cart">
            🛒
          </div>

        </div>


        {/* =================================
            TIMER PANEL
        ================================= */}

        <section className="timer-panel">

          <p>
            ⛏️ MINING SESSION
          </p>

          {/* =================================
              SESSION DURATION
          ================================= */}

          {!isRunning && !completed && (

            <div className="duration-selector">

              <p className="duration-label">
                SESSION DURATION
              </p>

              <div className="duration-buttons">

                <button
                  type="button"
                  className={
                    selectedDuration === 15
                      ? "duration-button active"
                      : "duration-button"
                  }
                  onClick={() =>
                    changeDuration(15)
                  }
                >
                  15m
                </button>

                <button
                  type="button"
                  className={
                    selectedDuration === 30
                      ? "duration-button active"
                      : "duration-button"
                  }
                  onClick={() =>
                    changeDuration(30)
                  }
                >
                  30m
                </button>

                <button
                  type="button"
                  className={
                    selectedDuration === 45
                      ? "duration-button active"
                      : "duration-button"
                  }
                  onClick={() =>
                    changeDuration(45)
                  }
                >
                  45m
                </button>

                <button
                  type="button"
                  className={
                    selectedDuration === 60
                      ? "duration-button active"
                      : "duration-button"
                  }
                  onClick={() =>
                    changeDuration(60)
                  }
                >
                  60m
                </button>

                <button
                  type="button"
                  className={
                    selectedDuration === 90
                      ? "duration-button active"
                      : "duration-button"
                  }
                  onClick={() =>
                    changeDuration(90)
                  }
                >
                  90m
                </button>

              </div>

              {/* =================================
                  CUSTOM DURATION
              ================================= */}

              <div className="custom-duration">

                <label htmlFor="customMinutes">
                  Custom minutes
                </label>

                <input
                  id="customMinutes"
                  type="number"
                  min={MIN_DURATION}
                  max={MAX_DURATION}
                  step="1"
                  value={customMinutes}
                  onChange={
                    handleCustomMinutesChange
                  }
                  onBlur={
                    handleCustomMinutesBlur
                  }
                  disabled={
                    isRunning || completed
                  }
                />

              </div>

              <small className="duration-help">
                Choose between 1 and 180 minutes
              </small>

            </div>

          )}

          {/* =================================
              TIMER
          ================================= */}

          <div className="timer">
            {minutes}:{seconds}
          </div>

          <p className="focus-message">

            {completed
              ? "The session is complete!"
              : isRunning
              ? "Stay focused. Keep mining..."
              : "Ready to enter the mine?"}

          </p>

          {/* START */}

          {!isRunning && !completed && (

            <button
              className="start-mining-button"
              onClick={startMining}
            >
              ⛏️ Start Mining
            </button>

          )}

          {/* MINE BLOCK */}

          {isRunning && (

            <button
              className="mine-button"
              onClick={mineBlock}
            >
              ⛏️ Mine Block
            </button>

          )}

          {/* END SESSION */}

          {isRunning && (

            <button
              className="end-session-button"
              onClick={endSession}
            >
              End Session
            </button>

          )}

        </section>


        {/* =================================
            BLOCKS MINED
        ================================= */}

        <section className="blocks-card">

          <div className="blocks-header">

            <div>

              <p>
                🧱 BLOCKS MINED
              </p>

              <h2>
                {blocks} / {maxBlocks}
              </h2>

            </div>

            <strong>
              {Math.round(miningProgress)}%
            </strong>

          </div>

          <div className="blocks-progress">

            <div
              className="blocks-progress-fill"
              style={{
                width: `${miningProgress}%`,
              }}
            ></div>

          </div>

        </section>


        {/* =================================
            REWARD CARDS
        ================================= */}

        <section className="reward-grid">

          <div className="reward-card">

            <span>
              ⭐
            </span>

            <strong>
              +{sessionXP} XP
            </strong>

            <small>
              Session Reward
            </small>

          </div>

          <div className="reward-card">

            <span>
              🧱
            </span>

            <strong>
              {blocks}
            </strong>

            <small>
              Blocks Mined
            </small>

          </div>

          <div className="reward-card">

            <span>
              🔥
            </span>

            <strong>
              +1
            </strong>

            <small>
              Focus Streak
            </small>

          </div>

          <div className="reward-card">

            <span>
              💎
            </span>

            <strong>
              +10
            </strong>

            <small>
              Mining Energy
            </small>

          </div>

        </section>

      </main>


      {/* =====================================
          COMPLETION OVERLAY
      ===================================== */}

      {completed && (

        <div className="completion-overlay">

          {/* CONFETTI */}

          <div className="confetti-container">

            {Array.from({
              length: 500,
            }).map(
              (_, index) => (

                <span
                  key={index}
                  className="confetti"
                  style={{
                    "--x": `${Math.random() * 100}vw`,
                    "--delay": `${Math.random() * 2}s`,
                    "--rotation": `${Math.random() * 360}deg`,
                  }}
                ></span>

              )
            )}

          </div>


          {/* COMPLETION POPUP */}

          <div className="completion-popup">

            <div className="completion-icon">
              🏆
            </div>

            <p className="completion-label">
              QUEST COMPLETE
            </p>

            <h2>
              Mining Session Complete!
            </h2>

            <p>
              Incredible work, Adventurer.
              You stayed focused and completed
              your mining session.
            </p>


            {/* COMPLETION REWARDS */}

            <div className="completion-rewards">

              {/* SESSION DURATION */}

              <div>

                <span>
                  ⏱️
                </span>

                <strong>
                  {selectedDuration} min
                </strong>

                <small>
                  Duration
                </small>

              </div>


              {/* XP */}

              <div>

                <span>
                  ⭐
                </span>

                <strong>
                  +{sessionXP} XP
                </strong>

                <small>
                  XP Earned
                </small>

              </div>


              {/* BLOCKS */}

              <div>

                <span>
                  🧱
                </span>

                <strong>
                  {blocks}
                </strong>

                <small>
                  Blocks Mined
                </small>

              </div>

            </div>


            {/* CONTINUE */}

            <button
              className="continue-button"
              onClick={continueAdventure}
            >
              ⚔️ Continue Adventure
            </button>


            {/* MINE AGAIN */}

            <button
              className="reset-button"
              onClick={resetSession}
            >
              🔄 Mine Again
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Focus;