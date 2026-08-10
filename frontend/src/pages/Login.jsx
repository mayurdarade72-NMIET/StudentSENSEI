import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page">

      <div className="login-card">

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="login-header">
          <div className="login-logo">
            Student<span>SENSEI</span>
          </div>

          <p className="login-label">
            WELCOME BACK
          </p>

          <h1>
            Continue Your
            <span> Journey.</span>
          </h1>

          <p className="login-description">
            Sign in to continue building your
            discipline and reaching your goals.
          </p>
        </div>

        <div className="login-actions">

          <button className="google-button">
            <span className="google-icon">
              G
            </span>

            Continue with Google
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="email-button">
            Continue with Email
          </button>

        </div>

        <p className="login-footer">
          By continuing, you agree to the
          StudentSENSEI Terms & Privacy Policy.
        </p>

      </div>

    </div>
  );
}

export default Login;