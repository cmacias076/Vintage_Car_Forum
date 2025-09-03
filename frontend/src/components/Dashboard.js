import { useEffect, useState } from "react";
import {
  fetchUser,
  fetchCategories,
  fetchQuestions,
  createCategory,
  createQuestion,
} from "../api";

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

  // Load user, categories, questions
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("You are not logged in. Please login first.");
      return;
    }

    fetchUser()
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setError(data.message || "Failed to fetch user");
        }
      })
      .catch((err) => setError(err.message));

    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Categories error:", err));

    fetchQuestions()
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Questions error:", err));
  }, []);

  // Handle new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory) return;

    const data = await createCategory(newCategory);
    if (data._id) {
      setCategories([...categories, data]);
      setNewCategory("");
    } else {
      alert(data.message || "Failed to create category");
    }
  };

  // Handle new question
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestionTitle || !newQuestionContent || !selectedCategory) return;

    const data = await createQuestion(
      newQuestionTitle,
      newQuestionContent,
      selectedCategory
    );

    if (data._id) {
      setQuestions([...questions, data]);
      setNewQuestionTitle("");
      setNewQuestionContent("");
      setSelectedCategory("");
    } else {
      alert(data.message || "Failed to create question");
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

      {/* Category Section */}
      <h3>Categories</h3>
      <ul>
        {categories.length > 0 ? (
          categories.map((cat) => <li key={cat._id}>{cat.name}</li>)
        ) : (
          <li>No categories found</li>
        )}
      </ul>

      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
        />
        <button type="submit">Add Category</button>
      </form>

      {/* Questions Section */}
      <h3>Questions</h3>
      <ul>
        {questions.length > 0 ? (
          questions.map((q) => (
            <li key={q._id}>
              <strong>{q.title}</strong>: {q.content}{" "}
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
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
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
