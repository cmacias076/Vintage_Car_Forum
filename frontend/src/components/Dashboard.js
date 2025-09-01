import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("You are not logged in. Please login first.");
      return;
    }

    // Fetch current user
    fetch("http://localhost:5000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch((err) => setError(err.message));

    // Fetch categories
    fetch("http://localhost:5000/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => console.error("Categories error:", err));

    // Fetch questions
    fetch("http://localhost:5000/api/questions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch questions");
        return res.json();
      })
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Questions error:", err));
  }, []);

  return (
    <div>
      <h2>Vintage Car Forum Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {user && <p>Welcome, {user.username}!</p>}

      <h3>Categories</h3>
      <ul>
        {categories.length > 0 ? (
          categories.map((cat) => <li key={cat._id}>{cat.name}</li>)
        ) : (
          <li>No categories found</li>
        )}
      </ul>

      <h3>Questions</h3>
      <ul>
        {questions.length > 0 ? (
          questions.map((q) => (
            <li key={q._id}>
              {q.title}: {q.content} (Category: {q.category?.name || "N/A"})
            </li>
          ))
        ) : (
          <li>No questions found</li>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
