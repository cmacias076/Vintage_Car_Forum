import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms]       = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [topError, setTopError]     = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = "Required";
    if (!email.trim()) e.email = "Required";
    if (!password.trim()) e.password = "Required";
    if (!terms) e.terms = "Please accept the terms";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTopError("");
    if (!validate()) return;

    try {
      const data = await registerUser(username.trim(), email.trim(), password);
      if (data?.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        navigate("/dashboard");
      } else {
        setTopError(data?.message || "Registration failed");
      }
    } catch (err) {
      setTopError(err.message || "Registration failed. Please try again.");
    }
  };

  const errStyle = { color: "red", marginLeft: 8, fontSize: 12 };

  return (
    <div style={{ padding: 16 }}>
      <h2>Register</h2>
      {topError && <p style={{ color: "red" }}>{topError}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "inline-block", width: 100 }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); if (formErrors.username) setFormErrors(prev => ({...prev, username: undefined})); }}
            required
          />
          {formErrors.username && <span style={errStyle}>{formErrors.username}</span>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "inline-block", width: 100 }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (formErrors.email) setFormErrors(prev => ({...prev, email: undefined})); }}
            required
          />
          {formErrors.email && <span style={errStyle}>{formErrors.email}</span>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "inline-block", width: 100 }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (formErrors.password) setFormErrors(prev => ({...prev, password: undefined})); }}
            required
          />
          {formErrors.password && <span style={errStyle}>{formErrors.password}</span>}
        </div>

        <div
          style={{
            marginTop: 12,
            padding: 8,
            borderRadius: 6,
            border: formErrors.terms ? "1px solid red" : "1px solid #ddd",
            display: "inline-block",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => { setTerms(e.target.checked); if (formErrors.terms) setFormErrors(prev => ({...prev, terms: undefined})); }}
            />
            I accept the terms
          </label>
          {formErrors.terms && <div style={errStyle}>{formErrors.terms}</div>}
        </div>

        <div style={{ marginTop: 16 }}>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
