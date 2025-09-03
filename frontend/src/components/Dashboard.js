import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchUser,
  fetchCategories,
  fetchQuestions,
  createCategory,
  createQuestion,
} from "../api";

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
  const [error, setError] = useState("");

  const [newCategory, setNewCategory] = useState("");
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You are not logged in. Please login first.");
      return;
    }

    fetchUser()
      .then((data) => {
        if (data && data.user) setUser(data.user);
        else setError((data && data.message) || "Failed to fetch user");
      })
      .catch((err) => setError(err.message || "Failed to fetch user"));

    fetchCategories()
      .then((data) => setCategories(asArray(data, "categories")))
      .catch((err) => console.error("Categories error:", err));

    fetchQuestions()
      .then((data) => setQuestions(asArray(data, "questions")))
      .catch((err) => console.error("Questions error:", err));
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = newCategory.trim();
    if (!name) return;

    const data = await createCategory(name);
    const created = (data && data.category) || (data && data._id && data) || null;

    if (created) {
      setCategories((prev) => [...prev, created]);
      setNewCategory("");
    } else {
      alert((data && data.message) || "Failed to create category");
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const title = newQuestionTitle.trim();
    const content = newQuestionContent.trim();
    if (!title || !content || !selectedCategory) return;

    const data = await createQuestion(title, content, selectedCategory);
    const created = (data && data.question) || (data && data._id && data) || null;

    if (created) {
      setQuestions((prev) => [...prev, created]);
      setNewQuestionTitle("");
      setNewQuestionContent("");
      setSelectedCategory("");
    } else {
      alert((data && data.message) || "Failed to create question");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Vintage Car Forum Dashboard</h2>
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Categories */}
      <h3>Categories</h3>
      <ul>
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((cat) => (
            <li key={cat._id || cat.id || cat.name}>{cat.name}</li>
          ))
        ) : (
          <li>No categories found</li>
        )}
      </ul>

      <form onSubmit={handleAddCategory} style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
        />
        <button type="submit">Add Category</button>
      </form>

      {/* Questions */}
      <h3>Questions</h3>
      <ul>
        {Array.isArray(questions) && questions.length > 0 ? (
          questions.map((q) => (
            <li key={q._id || q.id}>
              <strong>
                <Link to={`/question/${q._id || q.id}`}>
                  {q.title || "(No title)"}
                </Link>
              </strong>
              : {q.content || "(No content)"}{" "}
              (Category: {q.category?.name || "N/A"})
            </li>
          ))
        ) : (
          <li>No questions found</li>
        )}
      </ul>

      <form onSubmit={handleAddQuestion}>
        <input
          type="text"
          value={newQuestionTitle}
          onChange={(e) => setNewQuestionTitle(e.target.value)}
          placeholder="Question title"
          required
        />
        <input
          type="text"
          value={newQuestionContent}
          onChange={(e) => setNewQuestionContent(e.target.value)}
          placeholder="Question details"
          required
        />
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
        <button type="submit">Add Question</button>
      </form>
    </div>
  );
}

export default Dashboard;
