import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Focus.css";

function Focus() {
  const navigate = useNavigate();

  // =========================================
  // SESSION SETTINGS
  // =========================================

  const DEFAULT_DURATION = 25;
  const MIN_DURATION = 1;
  const MAX_DURATION = 180;

  const XP_PER_30_MINUTES = 5;

  // =========================================
  // TIMER STATE
  // =========================================

  const [selectedDuration, setSelectedDuration] =
    useState(DEFAULT_DURATION);

  const [customMinutes, setCustomMinutes] =
    useState(String(DEFAULT_DURATION));

  const [timeLeft, setTimeLeft] =
    useState(DEFAULT_DURATION * 60);

  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  // =========================================
  // MINING STATE
  // =========================================

  const [blocks, setBlocks] = useState(0);

  const maxBlocks = 100;

  const totalSeconds = selectedDuration * 60;

  const elapsedSeconds =
    Math.max(totalSeconds - timeLeft, 0);

  const sessionProgress =
    totalSeconds > 0
      ? Math.min(
          (elapsedSeconds / totalSeconds) * 100,
          100
        )
      : 0;

  const miningProgress = Math.min(
    (blocks / maxBlocks) * 100,
    100
  );

  // =========================================
  // XP
  // =========================================

  const sessionXP =
    Math.floor(selectedDuration / 30) *
    XP_PER_30_MINUTES;

  // =========================================
  // CHANGE DURATION
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
    setBlocks(0);
  };

  // =========================================
  // CUSTOM DURATION
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
      setBlocks(0);
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
    setBlocks(0);
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

          setBlocks((current) =>
            Math.max(current, maxBlocks)
          );

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, completed]);

  // =========================================
  // AUTO MINING PROGRESS
  // =========================================

  useEffect(() => {
    if (!isRunning || completed) {
      return;
    }

    const blockTimer = setInterval(() => {
      setBlocks((previous) => {
        if (previous >= maxBlocks) {
          return previous;
        }

        const expectedBlocks = Math.floor(
          sessionProgress
        );

        return Math.max(
          previous,
          Math.min(expectedBlocks, maxBlocks)
        );
      });
    }, 1000);

    return () => clearInterval(blockTimer);
  }, [
    isRunning,
    completed,
    sessionProgress,
  ]);

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

    const completeSession = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/study-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              duration_minutes: selectedDuration,
              session_type: "pomodoro",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to save study session"
          );
        }

        sessionStorage.setItem(
          "focusSessionRewarded",
          "true"
        );

        console.log(
          "Study session saved successfully:",
          data
        );
      } catch (error) {
        console.error(
          "Study session API error:",
          error
        );
      }
    };

    completeSession();
  }, [completed, selectedDuration]);

  // =========================================
  // TIMER FORMAT
  // =========================================

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (timeLeft % 60)
    .toString()
    .padStart(2, "0");

  // =========================================
  // START
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
  // PAUSE
  // =========================================

  const pauseMining = () => {
    setIsRunning(false);
  };

  // =========================================
  // END SESSION
  // =========================================

  const endSession = () => {
    setIsRunning(false);
    navigate("/dashboard");
  };

  // =========================================
  // RESET
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
  // CONTINUE
  // =========================================

  const continueAdventure = () => {
    navigate("/dashboard");
  };

  // =========================================
  // TIMER RING
  // =========================================

  const ringStyle = {
    "--progress": `${sessionProgress}%`,
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="focus-page">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="focus-navbar">

        <div className="focus-logo">
          Student<span>SENSEI</span>
        </div>

        <div className="focus-nav-right">

          <span>
            ⛏️ FOCUS MINE
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
          MAIN
      ===================================== */}

      <main className="mine-container">

        {/* ===================================
            MINE SCENE
        =================================== */}

        <section className="mine-background">

          <div className="mine-title">
            <span>FOCUS MINE</span>
            <strong>
              {isRunning
                ? "MINING IN PROGRESS"
                : completed
                ? "SESSION COMPLETE"
                : "READY TO MINE"}
            </strong>
          </div>

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

          <div className="mine-ore ore-one">
            💎
          </div>

          <div className="mine-ore ore-two">
            💎
          </div>

          <div className="mine-floor" />

        </section>

        {/* ===================================
            TIMER PANEL
        =================================== */}

        <section className="timer-panel">

          <p className="timer-panel-label">
            ⛏️ MINING SESSION
          </p>

          {/* DURATION */}

          {!isRunning && !completed && (

            <div className="duration-selector">

              <p className="duration-label">
                SESSION DURATION
              </p>

              <div className="duration-buttons">

                {[15, 25, 30, 45, 60, 90].map(
                  (duration) => (

                    <button
                      key={duration}
                      type="button"
                      className={
                        selectedDuration ===
                        duration
                          ? "duration-button active"
                          : "duration-button"
                      }
                      onClick={() =>
                        changeDuration(duration)
                      }
                    >
                      {duration}m
                    </button>

                  )
                )}

              </div>

              <div className="custom-duration">

                <label htmlFor="customMinutes">
                  Custom
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

                <span>minutes</span>

              </div>

              <small className="duration-help">
                Choose between 1 and 180 minutes
              </small>

            </div>

          )}

          {/* TIMER */}

          <div
            className="timer-ring"
            style={ringStyle}
          >

            <div className="timer-ring-inner">

              <span className="timer-small-label">
                {completed
                  ? "COMPLETE"
                  : isRunning
                  ? "FOCUSING"
                  : "READY"}
              </span>

              <div className="timer">
                {minutes}:{seconds}
              </div>

              <span className="timer-duration">
                {selectedDuration} minute session
              </span>

            </div>

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
              ⛏️ Start Focus
            </button>

          )}

          {/* PAUSE */}

          {isRunning && (

            <div className="active-controls">

              <button
                className="pause-button"
                onClick={pauseMining}
              >
                ⏸ Pause
              </button>

              <button
                className="end-session-button"
                onClick={endSession}
              >
                End Session
              </button>

            </div>

          )}

          {/* PAUSED */}

          {!isRunning &&
            !completed &&
            timeLeft <
              selectedDuration * 60 && (

              <button
                className="resume-button"
                onClick={startMining}
              >
                ▶ Resume Focus
              </button>

            )}

        </section>

        {/* ===================================
            PROGRESS
        =================================== */}

        <section className="blocks-card">

          <div className="blocks-header">

            <div>

              <p>
                🧱 MINING PROGRESS
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
            />

          </div>

          <p className="blocks-help">
            Keep your focus active to mine
            more blocks.
          </p>

        </section>

        {/* ===================================
            REWARD GRID
        =================================== */}

        <section className="reward-grid">

          <div className="reward-card">

            <span>⭐</span>

            <strong>
              +{sessionXP} XP
            </strong>

            <small>
              Session Reward
            </small>

          </div>

          <div className="reward-card">

            <span>🧱</span>

            <strong>
              {blocks}
            </strong>

            <small>
              Blocks Mined
            </small>

          </div>

          <div className="reward-card">

            <span>🔥</span>

            <strong>
              +1
            </strong>

            <small>
              Focus Streak
            </small>

          </div>

          <div className="reward-card">

            <span>💎</span>

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
          COMPLETION
      ===================================== */}

      {completed && (

        <div className="completion-overlay">

          <div className="confetti-container">

            {Array.from({
              length: 100,
            }).map((_, index) => (

              <span
                key={index}
                className="confetti"
                style={{
                  "--x": `${Math.random() * 100}vw`,
                  "--delay": `${Math.random() * 2}s`,
                  "--rotation": `${Math.random() * 360}deg`,
                }}
              />

            ))}

          </div>

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

            <div className="completion-rewards">

              <div>
                <span>⏱️</span>

                <strong>
                  {selectedDuration} min
                </strong>

                <small>
                  Duration
                </small>
              </div>

              <div>
                <span>⭐</span>

                <strong>
                  +{sessionXP} XP
                </strong>

                <small>
                  XP Earned
                </small>
              </div>

              <div>
                <span>🧱</span>

                <strong>
                  {blocks}
                </strong>

                <small>
                  Blocks Mined
                </small>
              </div>

            </div>

            <button
              className="continue-button"
              onClick={continueAdventure}
            >
              ⚔️ Continue Adventure
            </button>

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