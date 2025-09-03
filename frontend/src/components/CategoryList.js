import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : data?.categories || []))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div>
      <h3>Categories</h3>
      <ul>
        {categories.map((c) => (
          <li key={c._id}>
            <button onClick={() => navigate(`/dashboard?category=${c._id}`)}>
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
