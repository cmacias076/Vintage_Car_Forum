import React from 'react';

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { fetchAnswers, fetchQuestionById, fetchUser, postAnswer } from '../api';

function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Please log in to view and answer questions.');
    } else {
      fetchUser().then((data) => {
        if (data && data.user) setUser(data.user);
      });
    }

    // Load single question
    fetchQuestionById(id)
      .then((data) => {
        setQuestion(data && data._id ? data : data?.question || null);
      })
      .catch(() => setError('Failed to fetch question'));

    // Load answers
    fetchAnswers(id)
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data?.answers) ? data.answers : [];
        setAnswers(list);
      })
      .catch(() => setError('Failed to fetch answers'));
  }, [id]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    setError('');

    const content = answerText.trim();
    if (!content) {
      setError('Answer cannot be empty.');
      return;
    }

    const data = await postAnswer(id, content);

    if (data && data._id) {
      setAnswers((prev) => [data, ...prev]);
      setAnswerText('');
    } else if (Array.isArray(data)) {
      setAnswers(data);
      setAnswerText('');
    } else if (Array.isArray(data?.answers)) {
      setAnswers(data.answers);
      setAnswerText('');
    } else {
      setError(data?.message || 'Failed to submit answer.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    navigate('/');
  };

  if (!question && !error) {
    return <p>Loading question…</p>;
  }

  return (
    <div>
      {/* Themed header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      {error && <p className="error">{error}</p>}

      {question ? (
        <div className="panel" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 4 }}>{question.title || '(Untitled question)'}</h3>
          <p style={{ margin: 0 }}>{question.content}</p>
          <p style={{ opacity: 0.8, marginTop: 10 }}>
            <span className="meta" style={{ marginRight: 8 }}>
              Category: {question.category?.name || 'N/A'}
            </span>
            <span className="meta">By: {question.user?.username || 'Unknown'}</span>
          </p>
        </div>
      ) : (
        <p>Question not found.</p>
      )}

      <section style={{ marginBottom: 24 }}>
        <h4>Answers</h4>
        {answers.length > 0 ? (
          <ul className="panel">
            {answers.map((a) => (
              <li key={a._id || a.id}>
                <div style={{ marginBottom: 6 }}>{a.content}</div>
                <span className="meta">
                  — {a.author?.username || a.user?.username || 'Anonymous'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="panel" style={{ padding: 12, marginTop: 8 }}>
            No answers yet.
          </p>
        )}
      </section>

      {user ? (
        <form onSubmit={handleSubmitAnswer} className="panel">
          <textarea
            rows={3}
            placeholder="Write your answer…"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            style={{ width: '100%', marginBottom: 8 }}
          />
          <div>
            <button type="submit">Submit Answer</button>
          </div>
        </form>
      ) : (
        <p style={{ opacity: 0.7 }}>Log in to submit an answer.</p>
      )}
    </div>
  );
}

export default QuestionDetail;
