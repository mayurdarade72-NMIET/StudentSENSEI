import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Focus.css";

function Focus() {
  const navigate = useNavigate();

  // =========================================
  // SESSION SETTINGS
  // =========================================

  // TEST MODE: 10 seconds
  const TOTAL_TIME = 10;

  // XP earned after completing session
  const SESSION_XP = 100;

  // =========================================
  // TIMER STATE
  // =========================================

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

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
      sessionStorage.getItem("focusSessionRewarded");

    if (alreadyRewarded === "true") {
      return;
    }

    // -----------------------------------------
    // GET CURRENT XP
    // -----------------------------------------

    const currentXP =
      Number(
        localStorage.getItem("studentSenseiXP")
      ) || 750;

    // -----------------------------------------
    // ADD XP
    // -----------------------------------------

    const newXP = currentXP + SESSION_XP;

    localStorage.setItem(
      "studentSenseiXP",
      String(newXP)
    );

    // -----------------------------------------
    // SAVE SESSION COUNT
    // -----------------------------------------

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

    // -----------------------------------------
    // SAVE BLOCKS
    // -----------------------------------------

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

    // -----------------------------------------
    // PREVENT DUPLICATE REWARD
    // -----------------------------------------

    sessionStorage.setItem(
      "focusSessionRewarded",
      "true"
    );
  }, [completed, blocks]);

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
  // START MINING
  // =========================================

  const startMining = () => {
    if (completed) {
      return;
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

    setTimeLeft(TOTAL_TIME);
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
            onClick={() => navigate("/dashboard")}
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
          MINE AREA
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
              +{SESSION_XP} XP
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

          {/* =================================
              500 CONFETTI PIECES
          ================================= */}

          <div className="confetti-container">

            {Array.from({
              length: 500
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


          {/* =================================
              COMPLETION POPUP
          ================================= */}

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


            {/* REWARDS */}

            <div className="completion-rewards">

              <div>

                <span>
                  ⭐
                </span>

                <strong>
                  +{SESSION_XP} XP
                </strong>

              </div>


              <div>

                <span>
                  🧱
                </span>

                <strong>
                  {blocks} Blocks
                </strong>

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