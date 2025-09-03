import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchQuestionById,
  fetchAnswers,
  postAnswer,
  fetchUser,
} from "../api";

function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [loadingQ, setLoadingQ] = useState(true);
  const [loadingA, setLoadingA] = useState(true);
  const [error, setError] = useState("");

  const [answerText, setAnswerText] = useState("");
  const [modalError, setModalError] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in to view and answer questions.");
    } else {
      fetchUser().then((data) => {
        if (data?.user) setUser(data.user);
      });
    }

    setLoadingQ(true);
    fetchQuestionById(id)
      .then((data) => setQuestion(data && data._id ? data : data?.question || null))
      .catch(() => setError("Failed to fetch question"))
      .finally(() => setLoadingQ(false));

    setLoadingA(true);
    fetchAnswers(id)
      .then((data) => setAnswers(Array.isArray(data) ? data : data?.answers || []))
      .catch(() => setError("Failed to fetch answers"))
      .finally(() => setLoadingA(false));
  }, [id]);

  const openModal = () => {
    setModalError("");
    setAnswerText("");
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    setModalError("");

    const content = answerText.trim();
    if (!content) {
      setModalError("Answer cannot be empty.");
      return;
    }

    const created = await postAnswer(id, content);
    if (created && created._id) {
      setAnswers((prev) => [created, ...prev]);
      closeModal();
    } else {
      setModalError(created?.message || "Failed to submit answer.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <nav>
          <Link to="/dashboard">← Back to Dashboard</Link>
        </nav>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 12 }}>
                {user.username} ({user.email})
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/">Login</Link>
          )}
        </div>
      </header>

      <h2>Question Detail</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {loadingQ ? (
        <p>Loading question…</p>
      ) : question ? (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 4 }}>{question.title || "(Untitled question)"}</h3>
          <p style={{ margin: 0 }}>{question.content}</p>
          <p style={{ opacity: 0.7, marginTop: 8 }}>
            Category: {question.category?.name || "N/A"} · By:{" "}
            {question.user?.username || "Unknown"}
          </p>
          {user && <button onClick={openModal} style={{ marginTop: 8 }}>Answer</button>}
        </div>
      ) : (
        <p>Question not found.</p>
      )}

      <section style={{ marginBottom: 24 }}>
        <h4>Answers</h4>
        {loadingA ? (
          <p>Loading answers…</p>
        ) : answers.length > 0 ? (
          <ul>
            {answers.map((a) => (
              <li key={a._id || a.id} style={{ marginBottom: 8 }}>
                {a.content}
                <div style={{ fontSize: 12, color: "#666" }}>
                  — {a.authorId?.username || a.user?.username || "Anonymous"} ·{" "}
                  {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No answers yet.</p>
        )}
      </section>

      {/* Modal */}
      <dialog ref={dialogRef} style={{ padding: 16, borderRadius: 8 }}>
        <form onSubmit={handleSubmitAnswer} method="dialog">
          <h4 style={{ marginTop: 0 }}>Add Answer</h4>
          <textarea
            rows={4}
            placeholder="Write your answer…"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />
          {modalError && <div style={{ color: "red", marginBottom: 8 }}>{modalError}</div>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={closeModal}>Cancel</button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

export default QuestionDetail;
