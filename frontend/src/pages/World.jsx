import { useNavigate } from "react-router-dom";
import "./World.css";

function World() {
  const navigate = useNavigate();

  const worlds = [
    {
      id: 1,
      name: "Starting Land",
      icon: "🌍",
      description:
        "Your first home. Begin your study adventure and build your foundation.",
      requirement: "Available",
      unlocked: true,
      theme: "starting",
    },
    {
      id: 2,
      name: "Forest Plains",
      icon: "🌲",
      description:
        "A peaceful forest waiting for the next stage of your knowledge journey.",
      requirement: "Reach Level 3",
      unlocked: false,
      theme: "forest",
    },
    {
      id: 3,
      name: "Mines & Caves",
      icon: "⛏️",
      description:
        "Deep underground challenges filled with difficult subjects and discoveries.",
      requirement: "Reach Level 5",
      unlocked: false,
      theme: "mines",
    },
    {
      id: 4,
      name: "Farming Lands",
      icon: "🌾",
      description:
        "Grow your knowledge, develop your habits, and harvest new rewards.",
      requirement: "Reach Level 8",
      unlocked: false,
      theme: "farming",
    },
    {
      id: 5,
      name: "Nether Realm",
      icon: "🔥",
      description:
        "A dangerous realm for students ready to face harder challenges.",
      requirement: "Reach Level 12",
      unlocked: false,
      theme: "nether",
    },
    {
      id: 6,
      name: "Stronghold Keep",
      icon: "🏰",
      description:
        "An ancient stronghold reserved for dedicated adventurers.",
      requirement: "Reach Level 16",
      unlocked: false,
      theme: "stronghold",
    },
    {
      id: 7,
      name: "The End",
      icon: "🐉",
      description:
        "The final destination of your study adventure. Only the strongest reach it.",
      requirement: "Reach Level 20",
      unlocked: false,
      theme: "end",
    },
  ];

  const currentLevel = 1;

  const unlockedWorlds = worlds.filter(
    (world) => world.unlocked
  ).length;

  const handleEnterWorld = (world) => {
    if (!world.unlocked) return;

    if (world.id === 1) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="world-page">

      {/* =========================================
          BACKGROUND DECORATION
      ========================================= */}

      <div className="world-background-grid" />
      <div className="world-glow world-glow-one" />
      <div className="world-glow world-glow-two" />


      {/* =========================================
          NAVBAR
      ========================================= */}

      <nav className="world-navbar">

        <button
          className="world-back"
          onClick={() => navigate("/dashboard")}
        >
          <span>←</span>
          Dashboard
        </button>

        <div className="world-logo">
          Student<span>SENSEI</span>
        </div>

        <div className="world-level">
          <small>YOUR LEVEL</small>
          <strong>{currentLevel}</strong>
        </div>

      </nav>


      {/* =========================================
          HERO
      ========================================= */}

      <header className="world-hero">

        <div className="world-hero-badge">
          🌍 WORLD MAP
        </div>

        <p className="world-eyebrow">
          YOUR STUDY ADVENTURE
        </p>

        <h1>
          Explore Your Worlds
        </h1>

        <p className="world-subtitle">
          Complete quests, earn XP, and unlock new
          areas of your study adventure.
        </p>

      </header>


      {/* =========================================
          CURRENT WORLD
      ========================================= */}

      <section className="current-world-card">

        <div className="current-world-decoration">
          <span />
          <span />
          <span />
        </div>

        <div className="current-world-icon">
          🌍
        </div>

        <div className="current-world-info">

          <span className="current-world-label">
            CURRENT WORLD
          </span>

          <h2>
            Starting Land
          </h2>

          <p>
            Your journey begins here. Every quest and
            focus session helps you grow stronger and
            unlock the world ahead.
          </p>

          <div className="current-world-meta">

            <span>
              🟢 Active
            </span>

            <span>
              ⭐ Level {currentLevel}
            </span>

            <span>
              🌍 World 01
            </span>

          </div>

        </div>

        <button
          className="current-world-button"
          onClick={() => navigate("/dashboard")}
        >
          Enter World
          <span>→</span>
        </button>

      </section>


      {/* =========================================
          WORLD PROGRESSION
      ========================================= */}

      <section className="world-path-section">

        <div className="section-heading">

          <div>

            <span className="section-kicker">
              WORLD PROGRESSION
            </span>

            <h2>
              Your Journey
            </h2>

            <p>
              Every level brings you closer to a new world.
            </p>

          </div>

          <div className="world-counter">

            <strong>
              {unlockedWorlds}
            </strong>

            <span>
              / {worlds.length} unlocked
            </span>

          </div>

        </div>


        {/* =========================================
            PROGRESS TRACK
        ========================================= */}

        <div className="world-progress-track">

          <div
            className="world-progress-fill"
            style={{
              width: `${(unlockedWorlds / worlds.length) * 100}%`,
            }}
          />

          {worlds.map((world) => (

            <div
              key={world.id}
              className={`progress-dot ${
                world.unlocked ? "active" : ""
              } ${
                world.id === 1 ? "current" : ""
              }`}
            />

          ))}

        </div>


        {/* =========================================
            WORLD CARDS
        ========================================= */}

        <div className="world-grid">

          {worlds.map((world) => (

            <article
              key={world.id}
              className={`world-card ${
                world.unlocked
                  ? "world-unlocked"
                  : "world-locked"
              } ${
                world.id === 1
                  ? "world-current"
                  : ""
              } world-theme-${world.theme}`}
            >

              {/* CARD IMAGE AREA */}

              <div className="world-card-scene">

                <div className="scene-sky" />

                <div className="scene-stars">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="scene-mountain" />

                <div className="scene-ground" />

                <div className="world-card-icon">

                  {world.unlocked
                    ? world.icon
                    : "🔒"}

                </div>

                {world.id === 1 && (
                  <span className="current-badge">
                    CURRENT
                  </span>
                )}

              </div>


              {/* CARD CONTENT */}

              <div className="world-card-body">

                <span className="world-number">
                  WORLD {String(world.id).padStart(2, "0")}
                </span>

                <h3>
                  {world.name}
                </h3>

                <p>
                  {world.description}
                </p>

              </div>


              {/* CARD FOOTER */}

              <div className="world-card-footer">

                <span
                  className={
                    world.unlocked
                      ? "unlock-status"
                      : "lock-status"
                  }
                >

                  {world.unlocked
                    ? "✓ Unlocked"
                    : `🔒 ${world.requirement}`}

                </span>

                {world.unlocked && (

                  <button
                    className="world-enter-button"
                    onClick={() =>
                      handleEnterWorld(world)
                    }
                  >
                    Enter
                    <span>→</span>
                  </button>

                )}

              </div>

            </article>

          ))}

        </div>

      </section>


      {/* =========================================
          SENSEI MESSAGE
      ========================================= */}

      <section className="world-message">

        <div className="world-message-icon">
          🧭
        </div>

        <div className="world-message-content">

          <span>
            YOUR SENSEI
          </span>

          <h2>
            Every level unlocks a new part of your adventure.
          </h2>

          <p>
            Complete quests and focus sessions to earn XP.
            The farther you progress, the more of your world
            you can explore.
          </p>

        </div>

        <button
          onClick={() => navigate("/quests")}
        >
          Continue Adventure
          <span>→</span>
        </button>

      </section>


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="world-footer">

        <span>
          STUDENTSENSEI
        </span>

        <span>
          Your study adventure. Your success world.
        </span>

      </footer>

    </div>
  );
}

export default World;