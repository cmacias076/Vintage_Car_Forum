import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      const data = await loginUser(email, password);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: 14, textAlign: "center" }}>
        Don’t have an account?{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
