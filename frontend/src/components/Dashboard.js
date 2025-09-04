import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchUser,
  fetchCategories,
  fetchQuestions,
  createCategory,
  createQuestion,
} from '../api';

function asArray(maybeArray, nestedKey) {
  if (Array.isArray(maybeArray)) return maybeArray;
  if (maybeArray && nestedKey && Array.isArray(maybeArray[nestedKey])) {
    return maybeArray[nestedKey];
  }
  return [];
}

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  const [newCategory, setNewCategory] = useState('');
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You are not logged in. Please login first.');
      return;
    }

    fetchUser()
      .then((data) => {
        if (data && data.user) setUser(data.user);
        else setError((data && data.message) || 'Failed to fetch user');
      })
      .catch((err) => setError(err.message || 'Failed to fetch user'));

    fetchCategories()
      .then((data) => setCategories(asArray(data, 'categories')))
      .catch((err) => console.error('Categories error:', err));

    fetchQuestions()
      .then((data) => setQuestions(asArray(data, 'questions')))
      .catch((err) => console.error('Questions error:', err));
  }, []);

  const validateQuestionForm = () => {
    const errs = {};
    if (!newQuestionTitle.trim()) errs.title = 'Title is required.';
    if (!newQuestionContent.trim()) errs.content = 'Content is required.';
    else if (!newQuestionContent.trim().endsWith('?')) {
      errs.content = 'Question must end with a question mark (?)';
    }
    if (!selectedCategory) errs.category = 'Please choose a category.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const data = await createCategory(newCategory.trim());
    const created =
      (data && data.category) || (data && data._id && data) || null;

    if (created) {
      setCategories((prev) => [...prev, created]);
      setNewCategory('');
    } else {
      alert((data && data.message) || 'Failed to create category');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!validateQuestionForm()) return;

    const data = await createQuestion(
      newQuestionTitle.trim(),
      newQuestionContent.trim(),
      selectedCategory
    );

    const created =
      (data && data.question) || (data && data._id && data) || null;

    if (created) {
      setQuestions((prev) => [created, ...prev]);
      setNewQuestionTitle('');
      setNewQuestionContent('');
      setSelectedCategory('');
      setFormErrors({});
    } else {
      alert((data && data.message) || 'Failed to create question');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    navigate('/');
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Vintage Car Forum Dashboard</h2>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 12 }}>
                Welcome, {user.username} ({user.email})
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <span>Welcome Guest</span>
          )}
        </div>
      </header>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="page-grid">
        {/* LEFT COLUMN */}
        <div>
          {/* Add Category */}
          <details className="section" open>
            <summary>Add Category</summary>
            <div className="section-body">
              <form className="inline-form" onSubmit={handleAddCategory}>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                />
                <button type="submit" style={{ marginTop: 10 }}>
                  Add Category
                </button>
              </form>
            </div>
          </details>

          {/* Categories */}
          <div className="panel category-panel">
            <h3 className="section-title">Categories</h3>
            <p style={{ marginTop: -6, opacity: 0.7 }}>
              Browse topics by section
            </p>
            <ul className="scroll-list">
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat._id || cat.id} className="list-row">
                    <span>{cat.name}</span>
                    <button
                      className="btn btn-outline"
                      onClick={() => setSelectedCategory(cat._id || cat.id)}
                      title="Filter questions by this category"
                    >
                      View
                    </button>
                  </li>
                ))
              ) : (
                <li>No categories found</li>
              )}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Add Question */}
          <details className="section" open>
            <summary>Add Question</summary>
            <div className="section-body">
              <form className="inline-form" onSubmit={handleAddQuestion}>
                <div style={{ marginBottom: 8 }}>
                  <input
                    type="text"
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                    placeholder="Question title"
                    required
                  />
                  {formErrors.title && (
                    <div style={{ color: 'red', fontSize: 12 }}>
                      {formErrors.title}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 8 }}>
                  <input
                    type="text"
                    value={newQuestionContent}
                    onChange={(e) => setNewQuestionContent(e.target.value)}
                    placeholder="Question details"
                    required
                  />
                  {formErrors.content && (
                    <div style={{ color: 'red', fontSize: 12 }}>
                      {formErrors.content}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 8 }}>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    {Array.isArray(categories) &&
                      categories.map((cat) => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                  {formErrors.category && (
                    <div style={{ color: 'red', fontSize: 12 }}>
                      {formErrors.category}
                    </div>
                  )}
                </div>

                <button type="submit">Add Question</button>
              </form>
            </div>
          </details>

          {/* Questions */}
          <div className="panel">
            <h3 className="section-title">All Questions</h3>
            <ul>
              {Array.isArray(questions) && questions.length > 0 ? (
                questions.map((q) => (
                  <li key={q._id || q.id}>
                    <strong>
                      <Link to={`/question/${q._id || q.id}`}>
                        {q.title || '(No title)'}
                      </Link>
                    </strong>{' '}
                    : {q.content || '(No content)'}{' '}
                    <span className="meta">
                      Category: {q.category?.name || 'N/A'}
                    </span>
                  </li>
                ))
              ) : (
                <li>No questions found</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
