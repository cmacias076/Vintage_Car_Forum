import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Vintage Car Forum Dashboard</h2>
      <p>Welcome! Select a category to view questions:</p>

      {categories.length ? (
        categories.map((cat) => (
          <div key={cat._id} style={{ marginBottom: "20px" }}>
            <h3>{cat.name}</h3>
            {cat.questions && cat.questions.length ? (
              <ul>
                {cat.questions.map((q) => (
                  <li key={q._id}>
                    <Link to={`/question/${q._id}`}>{q.content}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No questions yet in this category.</p>
            )}
          </div>
        ))
      ) : (
        <p>Loading categories...</p>
      )}
    </div>
  );
};

export default Dashboard;
