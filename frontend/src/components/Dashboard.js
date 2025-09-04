import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { createCategory, createQuestion, fetchCategories, fetchQuestions, fetchUser } from '../api';

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
    else if (!newQuestionContent.trim().endsWith('?'))
      errs.content = 'Question must end with a question mark (?)';
    if (!selectedCategory) errs.category = 'Please choose a category.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const data = await createCategory(newCategory.trim());
    const created = (data && data.category) || (data && data._id && data) || null;

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

    const created = (data && data.question) || (data && data._id && data) || null;
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
      {/* Themed header (global styles in theme.css) */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Vintage Car Forum</h2>
        <div>
          {user && (
            <>
              <span style={{ marginRight: 12 }}>
                Welcome, {user.username} ({user.email})
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      {/* Categories */}
      <section
        style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}
      >
        <aside>
          <h3>Categories</h3>
          <ul className="scroll-list panel">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat._id || cat.id || cat.name}>
                  <span>{cat.name}</span>
                </li>
              ))
            ) : (
              <li>No categories found</li>
            )}
          </ul>

          <form onSubmit={handleAddCategory} className="panel">
            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
              />
            </div>
            <button type="submit" className="btn">
              Add Category
            </button>
          </form>
        </aside>

        {/* Questions */}
        <main>
          <h3>Questions</h3>
          <ul className="panel">
            {Array.isArray(questions) && questions.length > 0 ? (
              questions.map((q) => (
                <li key={q._id || q.id}>
                  <strong>
                    <Link to={`/question/${q._id || q.id}`}>{q.title || '(No title)'}</Link>
                  </strong>
                  <div style={{ marginTop: 4 }}>
                    {q.content || '(No content)'}{' '}
                    <span className="meta">Category: {q.category?.name || 'N/A'}</span>
                  </div>
                </li>
              ))
            ) : (
              <li>No questions found</li>
            )}
          </ul>

          <div className="hr" />

          <form onSubmit={handleAddQuestion} className="panel">
            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                placeholder="Question title"
                required
              />
              {formErrors.title && (
                <div className="error" style={{ fontSize: 12 }}>
                  {formErrors.title}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                value={newQuestionContent}
                onChange={(e) => setNewQuestionContent(e.target.value)}
                placeholder="Question details (end with ?)"
                required
              />
              {formErrors.content && (
                <div className="error" style={{ fontSize: 12 }}>
                  {formErrors.content}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
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
                <div className="error" style={{ fontSize: 12 }}>
                  {formErrors.category}
                </div>
              )}
            </div>

            <button type="submit" className="btn">
              Add Question
            </button>
          </form>
        </main>
      </section>
    </div>
  );
}

export default Dashboard;
