import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./World.css";

function World() {
  const navigate = useNavigate();

  // =========================================
  // XP
  // =========================================

  const getXP = () => {
    const savedXP = localStorage.getItem("studentSenseiXP");
    return savedXP ? Number(savedXP) : 750;
  };

  const [xp, setXp] = useState(getXP);

  // =========================================
  // SYNC XP
  // =========================================

  useEffect(() => {
    const syncXP = () => {
      setXp(getXP());
    };

    syncXP();

    window.addEventListener("focus", syncXP);
    window.addEventListener("storage", syncXP);

    return () => {
      window.removeEventListener("focus", syncXP);
      window.removeEventListener("storage", syncXP);
    };
  }, []);

  // =========================================
  // WORLD LEVEL
  // =========================================

  let worldLevel = 1;
  let worldName = "Starting Land";

  if (xp >= 900) {
    worldLevel = 3;
    worldName = "Village";
  } else if (xp >= 800) {
    worldLevel = 2;
    worldName = "Growing Forest";
  }

  // =========================================
  // UNLOCKS
  // =========================================

  const forestUnlocked = xp >= 800;
  const villageUnlocked = xp >= 900;

  // =========================================
  // PROGRESS
  // =========================================

  const progressPercent = Math.min((xp / 1000) * 100, 100);

  let nextUnlockMessage = "⭐ 50 XP until Growing Forest";

  if (worldLevel === 2) {
    nextUnlockMessage = "⭐ 100 XP until Village";
  }

  if (worldLevel === 3) {
    nextUnlockMessage =
      "🏆 Village unlocked! Keep growing your world.";
  }

  // =========================================
  // FOCUS MINE
  // =========================================

  const handleFocusMine = () => {
    navigate("/dashboard");
  };

  // =========================================
  // LOCKED AREA
  // =========================================

  const handleLockedArea = (area) => {
    alert(
      `🔒 ${area} is locked!\n\nComplete more quests and earn XP to unlock it.`
    );
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="world-page">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="world-navbar">

        <div className="world-logo">
          Student<span>SENSEI</span>
        </div>

        <div className="world-info">

          <span>
            🌳 OVERWORLD
          </span>

          <span>
            ⭐ LEVEL {worldLevel}
          </span>

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

        </div>

      </nav>


      {/* =====================================
          HEADER
      ===================================== */}

      <section className="world-header">

        <p>
          🌳 THE OVERWORLD
        </p>

        <h1>
          Your World
        </h1>

        <span>
          {worldName} • {xp} XP
        </span>

      </section>


      {/* =====================================
          MINECRAFT WORLD
      ===================================== */}

      <main className="minecraft-world">

        {/* SKY */}

        <div className="minecraft-sky">

          <div className="sun">
            ☀️
          </div>

          <div className="cloud cloud-one">
            ☁️
          </div>

          <div className="cloud cloud-two">
            ☁️
          </div>

        </div>


        {/* LAND */}

        <div className="minecraft-land">

          {/* TREE 1 */}

          <div className="world-tree tree-one">
            🌳
          </div>


          {/* FOREST */}

          {forestUnlocked && (
            <>
              <div className="world-tree tree-two">
                🌲
              </div>

              <div className="world-tree tree-three">
                🌳
              </div>
            </>
          )}


          {/* LOCKED FOREST */}

          {!forestUnlocked && (
            <button
              className="world-locked-object locked-forest"
              onClick={() => handleLockedArea("Growing Forest")}
            >
              🔒
            </button>
          )}


          {/* VILLAGE */}

          {villageUnlocked ? (
            <>
              <div className="world-house">
                🏠
              </div>

              <div className="world-house house-two">
                🏡
              </div>
            </>
          ) : (
            <button
              className="world-locked-object locked-house"
              onClick={() => handleLockedArea("Village")}
            >
              🔒
            </button>
          )}


          {/* PLAYER */}

          <div className="world-player">
            🧑‍💻
          </div>


          {/* LAPTOP */}

          <div className="world-laptop">
            💻
          </div>


          {/* =================================
              FOCUS MINE
          ================================= */}

          <button
            className="world-mine"
            onClick={handleFocusMine}
            title="Start a Focus Session"
          >

            <div className="mine-label">
              ⛏️ FOCUS MINE
            </div>

            <div className="mine-entrance">
              🪨 🕳️ 🪨
            </div>

            <div className="mine-action">
              ENTER →
            </div>

          </button>

        </div>


        {/* =================================
            GROUND
        ================================= */}

        <div className="minecraft-ground">

          <div className="grass-layer"></div>

          <div className="dirt-layer">

            <span>🟫</span>
            <span>🟫</span>
            <span>🟫</span>
            <span>🟫</span>
            <span>🟫</span>
            <span>🟫</span>
            <span>🟫</span>
            <span>🟫</span>

          </div>

        </div>

      </main>


      {/* =====================================
          WORLD PROGRESSION
      ===================================== */}

      <section className="world-progress">

        <div className="progress-header">

          <div>

            <p>
              WORLD PROGRESSION
            </p>

            <h2>
              Level {worldLevel} • {worldName}
            </h2>

          </div>

          <strong>
            {xp} / 1000 XP
          </strong>

        </div>


        <div className="world-progress-bar">

          <div
            className="world-progress-fill"
            style={{
              width: `${progressPercent}%`,
            }}
          ></div>

        </div>


        <p className="next-unlock">
          {nextUnlockMessage}
        </p>

      </section>


      {/* =====================================
          WORLD STATS
      ===================================== */}

      <section className="world-stats">

        {/* VILLAGE */}

        <button
          className={`world-stat ${
            villageUnlocked ? "unlocked-stat" : "locked-stat"
          }`}
          onClick={() =>
            villageUnlocked
              ? alert("🏡 Welcome to your Village!")
              : handleLockedArea("Village")
          }
        >

          <span>
            🏡
          </span>

          <strong>
            Village
          </strong>

          <small>
            {villageUnlocked
              ? "UNLOCKED"
              : "🔒 900 XP required"}
          </small>

        </button>


        {/* FOREST */}

        <button
          className={`world-stat ${
            forestUnlocked ? "unlocked-stat" : "locked-stat"
          }`}
          onClick={() =>
            forestUnlocked
              ? alert("🌲 Welcome to the Growing Forest!")
              : handleLockedArea("Growing Forest")
          }
        >

          <span>
            🌲
          </span>

          <strong>
            Forest
          </strong>

          <small>
            {forestUnlocked
              ? "UNLOCKED"
              : "🔒 800 XP required"}
          </small>

        </button>


        {/* FOCUS MINE */}

        <button
          className="world-stat unlocked-stat"
          onClick={handleFocusMine}
        >

          <span>
            ⛏️
          </span>

          <strong>
            Focus Mine
          </strong>

          <small>
            ENTER MINE →
          </small>

        </button>


        {/* XP */}

        <div className="world-stat">

          <span>
            ⭐
          </span>

          <strong>
            Experience
          </strong>

          <small>
            {xp} XP
          </small>

        </div>

      </section>


      {/* =====================================
          OTHER WORLDS
      ===================================== */}

      <section className="other-worlds">

        <h2>
          🌌 Other Worlds
        </h2>

        <p>
          Continue your journey to unlock new dimensions.
        </p>


        <div className="dimension-grid">

          {/* OVERWORLD */}

          <button
            className="dimension-card active"
            onClick={() => window.scrollTo({
              top: 0,
              behavior: "smooth"
            })}
          >

            <div className="dimension-icon">
              🌳
            </div>

            <h3>
              Overworld
            </h3>

            <span>
              CURRENT WORLD
            </span>

          </button>


          {/* NETHER */}

          <button
            className="dimension-card locked"
            onClick={() => handleLockedArea("Nether")}
          >

            <div className="dimension-icon">
              🔥
            </div>

            <h3>
              Nether
            </h3>

            <span>
              🔒 LOCKED
            </span>

          </button>


          {/* THE END */}

          <button
            className="dimension-card locked"
            onClick={() => handleLockedArea("The End")}
          >

            <div className="dimension-icon">
              🟣
            </div>

            <h3>
              The End
            </h3>

            <span>
              🔒 LOCKED
            </span>

          </button>

        </div>

      </section>


      {/* =====================================
          SENSEI
      ===================================== */}

      <section className="world-sensei">

        <div className="sensei-icon">
          🧙
        </div>

        <div>

          <small>
            YOUR SENSEI
          </small>

          <h2>
            Keep completing quests.
          </h2>

          <p>
            Every quest gives you XP and helps your world grow.
          </p>

        </div>

        <button
          onClick={() => navigate("/dashboard")}
        >
          📜 View Quests
        </button>

      </section>

    </div>
  );
}

export default World;