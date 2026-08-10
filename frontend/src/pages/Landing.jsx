import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      <nav className="navbar">
        <div className="logo">
          StudentSENSEI
        </div>

        <button
          className="login-button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </nav>

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
            StudentSENSEI helps you stay consistent, complete your
            daily tasks, and build the discipline that turns goals
            into habits.
          </p>

          <button
            className="get-started-button"
            onClick={() => navigate("/login")}
          >
            Start Your Journey
          </button>

        </div>
      </main>

    </div>
  );
}

export default Landing;