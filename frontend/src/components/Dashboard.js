import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchUser,
  fetchCategories,
  fetchQuestions,
  fetchQuestionsByCategory,
  createCategory,
  createQuestion,
} from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  const [newCategory, setNewCategory] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [formErrors, setFormErrors] = useState({});
  const activeCategoryFilter = searchParams.get("category") || null;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You are not logged in. Please login first.");
      return;
    }

    fetchUser()
      .then((data) => { if (data?.user) setUser(data.user); else setError(data?.message || "Failed to fetch user"); })
      .catch((err) => setError(err.message || "Failed to fetch user"));

    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : data?.categories || []))
      .catch((err) => console.error("Categories error:", err));
  }, []);

  useEffect(() => {
    const load = async () => {
      if (activeCategoryFilter) {
        const list = await fetchQuestionsByCategory(activeCategoryFilter);
        setQuestions(Array.isArray(list) ? list : list?.questions || []);
      } else {
        const all = await fetchQuestions();
        setQuestions(Array.isArray(all) ? all : all?.questions || []);
      }
    };
    load();
  }, [activeCategoryFilter]);

  const validateQuestionForm = () => {
    const errs = {};
    if (!newQuestionTitle.trim()) errs.title = "Title is required.";
    if (!newQuestionContent.trim()) errs.content = "Content is required.";
    else if (!newQuestionContent.trim().endsWith("?"))
      errs.content = 'Question must end with a question mark (?)';
    if (!selectedCategory) errs.category = "Please choose a category.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const data = await createCategory(newCategory.trim(), newCategoryDesc.trim());
    const created = (data && data._id && data) || data?.category || null;

    if (created) {
      setCategories((prev) => [...prev, created]);
      setNewCategory("");
      setNewCategoryDesc("");
    } else {
      alert(data?.message || "Failed to create category");
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

    const created = (data && data._id && data) || data?.question || null;
    if (created) {
      const createdCatId = created.category?._id || created.category;
      if (!activeCategoryFilter || activeCategoryFilter === createdCatId) {
        setQuestions((prev) => [created, ...prev]);
      }
      setNewQuestionTitle("");
      setNewQuestionContent("");
      setSelectedCategory("");
      setFormErrors({});
    } else {
      alert(data?.message || "Failed to create question");
    }
  };

  const handleFilterByCategory = (categoryId) => {
    if (!categoryId) {
      searchParams.delete("category");
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category: categoryId }, { replace: true });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
        {/* LEFT RAIL */}
        <aside className="left-rail">
          <h3>Categories</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              onClick={() => handleFilterByCategory(null)}
              style={{ textAlign: "left", fontWeight: !activeCategoryFilter ? "bold" : "normal" }}
            >
              All
            </button>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat) => {
                const id = cat._id || cat.id;
                return (
                  <button
                    key={id}
                    onClick={() => handleFilterByCategory(id)}
                    style={{
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: activeCategoryFilter === id ? "bold" : "normal",
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })
            ) : (
              <span>No categories found</span>
            )}
          </div>

          {/* Add Category */}
          <form onSubmit={handleAddCategory} style={{ marginTop: 16 }}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              style={{ width: "100%", marginBottom: 6 }}
            />
            <input
              type="text"
              value={newCategoryDesc}
              onChange={(e) => setNewCategoryDesc(e.target.value)}
              placeholder="Description (optional)"
              style={{ width: "100%", marginBottom: 6 }}
            />
            <button type="submit" style={{ width: "100%" }}>
              Add Category
            </button>
          </form>
        </aside>

        {/* MAIN */}
        <main>
          <h3>Questions</h3>
          <ul>
            {Array.isArray(questions) && questions.length > 0 ? (
              questions.map((q) => (
                <li key={q._id || q.id} style={{ marginBottom: 8 }}>
                  <strong>
                    <Link to={`/question/${q._id || q.id}`}>
                      {q.title || "(No title)"}
                    </Link>
                  </strong>{" "}
                  — {q.content || "(No content)"}{" "}
                  <span style={{ color: "#666" }}>
                    (Category: {q.category?.name || "N/A"})
                  </span>
                </li>
              ))
            ) : (
              <li>No questions found</li>
            )}
          </ul>

          {/* New Question */}
          <form onSubmit={handleAddQuestion} style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                placeholder="Question title"
                required
                style={{ width: "100%" }}
              />
              {formErrors.title && (
                <div style={{ color: "red", fontSize: 12 }}>{formErrors.title}</div>
              )}
            </div>

            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                value={newQuestionContent}
                onChange={(e) => setNewQuestionContent(e.target.value)}
                placeholder='Question details (end with "?")'
                required
                style={{ width: "100%" }}
              />
              {formErrors.content && (
                <div style={{ color: "red", fontSize: 12 }}>{formErrors.content}</div>
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
                <div style={{ color: "red", fontSize: 12 }}>{formErrors.category}</div>
              )}
            </div>

            <button type="submit">Add Question</button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
