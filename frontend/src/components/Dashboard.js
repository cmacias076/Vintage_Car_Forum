import { useEffect, useState } from "react";
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
  // Fallback
  return [];
}

function Dashboard() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  // Form state
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

    // Fetch current user
    fetchUser()
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        } else {
          setError((data && data.message) || "Failed to fetch user");
        }
      })
      .catch((err) => setError(err.message || "Failed to fetch user"));

    // Fetch categories
    fetchCategories()
      .then((data) => {
        const list = asArray(data, "categories");
        setCategories(list);
      })
      .catch((err) => console.error("Categories error:", err));

    // Fetch questions 
    fetchQuestions()
      .then((data) => {
        const list = asArray(data, "questions");
        setQuestions(list);
      })
      .catch((err) => console.error("Questions error:", err));
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const data = await createCategory(newCategory.trim());
    const created =
      (data && data.category) || (data && data._id && data) || null;

    if (created) {
      setCategories((prev) => [...prev, created]);
      setNewCategory("");
    } else {
      alert((data && data.message) || "Failed to create category");
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (
      !newQuestionTitle.trim() ||
      !newQuestionContent.trim() ||
      !selectedCategory
    )
      return;

    const data = await createQuestion(
      newQuestionTitle.trim(),
      newQuestionContent.trim(),
      selectedCategory
    );

    const created =
      (data && data.question) || (data && data._id && data) || null;

    if (created) {
      setQuestions((prev) => [...prev, created]);
      setNewQuestionTitle("");
      setNewQuestionContent("");
      setSelectedCategory("");
    } else {
      alert((data && data.message) || "Failed to create question");
    }
  };

  return (
    <div>
      <h2>Vintage Car Forum Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {user && (
        <p>
          Welcome, {user.username} ({user.email})!
        </p>
      )}

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
              <strong>{q.title || "(No title)"}</strong>:{" "}
              {q.content || "(No content)"}{" "}
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
