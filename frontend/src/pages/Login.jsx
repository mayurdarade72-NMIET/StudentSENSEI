import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    localStorage.setItem("studentSenseiLoggedIn", "true");
    localStorage.setItem("studentSenseiUserName", "Guest Student");

    navigate("/dashboard", { replace: true });
  };

  const handleGoogleLogin = () => {
    alert(
      "Google Sign-In will be connected when backend authentication is integrated."
    );
  };

  return (
    <div className="auth-page">
      {/* Background */}
      <div className="auth-world-background">
        <div className="sun"></div>

        <div className="mountain mountain-one"></div>
        <div className="mountain mountain-two"></div>
        <div className="mountain mountain-three"></div>

        <div className="pixel-cloud cloud-one"></div>
        <div className="pixel-cloud cloud-two"></div>

        <div className="village-glow"></div>
      </div>

      {/* Brand */}
      <section className="auth-world-panel">
        <div className="version-label">
          v1.0.0
        </div>

        <div className="brand-block">
          <div className="brand-title">
            STUDENT<span>SENSEI</span>
          </div>

          <p>
            YOUR STUDY ADVENTURE.
            <br />
            YOUR SUCCESS WORLD.
          </p>
        </div>

        <div className="adventure-character">
          <div className="character-head">
            <div className="character-hair"></div>
            <div className="character-eye eye-left"></div>
            <div className="character-eye eye-right"></div>
          </div>

          <div className="character-body">
            <div className="character-arm arm-left"></div>
            <div className="character-torso"></div>
            <div className="character-arm arm-right"></div>
          </div>
        </div>

        <div className="world-sign">
          <div className="sign-board">
            <button
              onClick={() => navigate("/register")}
              className="world-primary-button"
            >
              START YOUR JOURNEY
            </button>

            <button
              onClick={() => navigate("/email-login")}
              className="world-secondary-button"
            >
              I ALREADY HAVE AN ACCOUNT
            </button>

            <button
              onClick={() => navigate("/world")}
              className="world-explore-button"
            >
              EXPLORE WORLDS
            </button>
          </div>
        </div>

        <div className="world-features">
          <span>⚔ BUILD YOUR HABITS</span>
          <span>⛏ LEVEL UP QUESTS</span>
        </div>
      </section>

      {/* Login */}
      <section className="auth-login-panel">
        <div className="auth-login-inner">

          <div className="auth-login-header">
            <p className="auth-welcome">
              WELCOME BACK,
            </p>

            <h1>
              ADVENTURER!
            </h1>

            <p className="auth-subtitle">
              Log in to continue your study adventure
            </p>
          </div>

          <div className="auth-form">

            <div className="auth-input-wrapper">
              <span className="input-icon">♙</span>

              <input
                type="email"
                placeholder="Email / Username"
              />
            </div>

            <div className="auth-input-wrapper">
              <span className="input-icon">🔒</span>

              <input
                type="password"
                placeholder="Password"
              />
            </div>

            <button
              className="forgot-password"
              type="button"
            >
              Forgot Password?
            </button>

            <button
              className="game-login-button"
              onClick={() => navigate("/email-login")}
            >
              LOG IN
            </button>

            <div className="auth-or">
              <span>or</span>
            </div>

            <button
              className="google-game-button"
              onClick={handleGoogleLogin}
            >
              <span className="google-game-icon">G</span>

              <span>
                CONTINUE WITH GOOGLE
              </span>
            </button>

            <p className="new-player">
              New here?

              <button
                type="button"
                onClick={() => navigate("/register")}
              >
                Start your journey
              </button>
            </p>

            <button
              className="guest-link"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </button>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;