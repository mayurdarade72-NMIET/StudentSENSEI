import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page">

      {/* Back to Landing */}
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          StudentSENSEI
        </div>

        {/* Heading */}
        <div className="login-header">
          <h1>Welcome Back</h1>

          <p>
            Continue building your discipline,
            <br />
            one day at a time.
          </p>
        </div>

        {/* Google Login */}
        <button className="google-button">
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        {/* Login Form */}
        <form>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="forgot-password">
            <button type="button">
              Forgot password?
            </button>
          </div>

          <button
            className="signin-button"
            type="submit"
          >
            Sign In
          </button>

        </form>

        {/* Signup */}
        <p className="signup-text">
          Don't have an account?
          <button type="button">
            Sign Up
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;