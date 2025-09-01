import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]); // make sure it's an empty array
  const [questions, setQuestions] = useState([]);   // make sure it's an empty array

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    // Fetch current user
    fetch("http://localhost:5000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error("Error fetching user:", err));

    // Fetch categories
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || [])) // fallback to empty array
      .catch((err) => console.error("Error fetching categories:", err));

    // Fetch questions
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions || [])) // fallback to empty array
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  return (
    <div>
      <h2>Vintage Car Forum Dashboard</h2>
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
          questions.map((q) => <li key={q._id}>{q.content}</li>)
        ) : (
          <li>No questions found</li>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
