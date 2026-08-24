import { useNavigate } from "react-router-dom";

function EmailLogin() {
  const navigate = useNavigate();

  return (
    <div className="email-login-page">
      <div className="email-login-card">

        <button
          className="back-button"
          onClick={() => navigate("/login")}
        >
          ← Back
        </button>

        <div className="email-login-header">
          <div className="login-logo">
            Student<span>SENSEI</span>
          </div>

          <p className="login-label">
            EMAIL SIGN IN
          </p>

          <h1>
            Welcome
            <span> Back.</span>
          </h1>

          <p className="login-description">
            Enter your email and password to continue
            your StudentSENSEI journey.
          </p>
        </div>

        <form
          className="email-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="input-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="email-submit-button"
          >
            Sign In
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <button
            type="button"
            className="signup-button"
          >
            Create Account
          </button>
        </p>

        <p className="login-footer">
          By continuing, you agree to the
          StudentSENSEI Terms & Privacy Policy.
        </p>

      </div>
    </div>
  );
}
