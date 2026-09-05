import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Temporary frontend-only registration.
    // This will later connect to Mayur's backend.
    setTimeout(() => {
      localStorage.setItem(
        "studentSenseiLoggedIn",
        "true"
      );

      localStorage.setItem(
        "studentSenseiUserEmail",
        email
      );

      localStorage.setItem(
        "studentSenseiUserName",
        name
      );

      navigate("/dashboard", {
        replace: true,
      });
    }, 500);
  };

  return (
    <div className="auth-page">

      {/* =========================================
          WORLD SIDE
          ========================================= */}

      <section className="auth-world-panel">

        <div className="auth-world-background">

          <div className="sun"></div>

          <div className="mountain mountain-one"></div>
          <div className="mountain mountain-two"></div>
          <div className="mountain mountain-three"></div>

          <div className="pixel-cloud cloud-one"></div>
          <div className="pixel-cloud cloud-two"></div>

          <div className="village-glow"></div>

        </div>

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
              className="world-primary-button"
              onClick={() => navigate("/login")}
            >
              ALREADY HAVE AN ACCOUNT
            </button>

            <button
              className="world-explore-button"
              onClick={() => navigate("/world")}
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

      {/* =========================================
          REGISTER SIDE
          ========================================= */}

      <section className="auth-login-panel">

        <div className="auth-login-inner">

          <button
            className="back-button"
            onClick={() => navigate("/login")}
          >
            ← Back
          </button>

          <div className="auth-login-header">

            <p className="auth-welcome">
              CREATE YOUR ACCOUNT
            </p>

            <h1>
              Begin Your Journey.
            </h1>

            <p className="auth-subtitle">
              Create your StudentSENSEI account and start
              building your study world.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="auth-input-wrapper">

              <span className="input-icon">
                ♙
              </span>

              <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />

            </div>

            <div className="auth-input-wrapper">

              <span className="input-icon">
                ✉
              </span>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />

            </div>

            <div className="auth-input-wrapper">

              <span className="input-icon">
                🔒
              </span>

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />

            </div>

            <div className="auth-input-wrapper">

              <span className="input-icon">
                🛡
              </span>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />

            </div>

            {error && (
              <div className="login-error">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              className="game-login-button"
              disabled={loading}
            >
              {loading
                ? "CREATING ACCOUNT..."
                : "CREATE ACCOUNT"}
            </button>

            <div className="auth-or">
              <span>or</span>
            </div>

            <button
              type="button"
              className="google-game-button"
              onClick={() =>
                alert(
                  "Google Sign-Up will be connected when backend authentication is integrated."
                )
              }
            >
              <span className="google-game-icon">
                G
              </span>

              <span>
                SIGN UP WITH GOOGLE
              </span>
            </button>

            <p className="new-player">
              Already have an account?

              <button
                type="button"
                onClick={() => navigate("/email-login")}
              >
                Log in
              </button>
            </p>

          </form>

        </div>

      </section>

    </div>
  );
}

export default Register;