import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-page">

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          Student<span>SENSEI</span>
        </div>

        <button
          className="login-button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="hero">
        <div className="hero-content">

          <p className="tagline">
            BUILD DISCIPLINE • BUILD YOUR FUTURE
          </p>

          <h1>
            Discipline Today.
            <br />
            <span>Success Tomorrow.</span>
          </h1>

          <p className="description">
            StudentSENSEI is your smart study companion for
            planning your day, staying focused, building better
            habits, and becoming a more consistent student.
          </p>

          <div className="hero-actions">

            <button
              className="get-started-button"
              onClick={() => navigate("/login")}
            >
              Start Your Journey
            </button>

            <button
              className="secondary-button"
              onClick={scrollToFeatures}
            >
              Explore StudentSENSEI
            </button>

          </div>
        </div>
      </main>

      {/* Features Section */}
      <section
        className="features-section"
        id="features"
      >
        <div className="section-heading">

          <p className="section-label">
            WHY STUDENTSENSEI?
          </p>

          <h2>
            Turn your goals into
            <span> daily progress.</span>
          </h2>

          <p>
            Everything you need to build a disciplined study
            routine and keep moving forward.
          </p>

        </div>

        {/* Feature Cards */}
        <div className="feature-grid">

          <article className="feature-card">
            <div className="feature-icon">
              📚
            </div>

            <h3>
              Plan Your Day
            </h3>

            <p>
              Organize your study tasks and know exactly what
              you need to accomplish.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              ⏱️
            </div>

            <h3>
              Stay Focused
            </h3>

            <p>
              Build focused study sessions and develop habits
              that make consistency easier.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              🏆
            </div>

            <h3>
              Track Your Progress
            </h3>

            <p>
              See your progress, maintain your streaks, and
              stay motivated as you improve.
            </p>
          </article>

        </div>
      </section>

    </div>
  );
}

export default Landing;