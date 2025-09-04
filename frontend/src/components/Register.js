import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser(username, email, password);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        navigate("/dashboard");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="brand-mark" aria-hidden>
        <svg viewBox="0 0 64 32" width="36" height="18">
          <path
            d="M4 22h4l3-6h18l6 6h7c1.8 0 3 1.2 3 3v1H4v-1c0-1.8 1.2-3 3-3zM22 16l2-5h8l3 5H22z"
            fill="currentColor"
          />
        </svg>
      </div>
      <h2>Create an Account</h2>
      <p className="subtle" style={{ textAlign: "center", marginTop: -6, marginBottom: 12 }}>
        Join the community of classic car enthusiasts.
      </p>

      <div className="hr" />

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
            autoComplete="username"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Password:</label>
          <div className="password-wrapper">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="small-toggle"
              onClick={() => setShowPwd((s) => !s)}
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="btn-row">
          <button type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create Account"}
          </button>
          <Link to="/" className="btn-ghost" style={{ textAlign: "center", lineHeight: "38px" }}>
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
