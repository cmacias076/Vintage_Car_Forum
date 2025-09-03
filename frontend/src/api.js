const API_URL = "http://localhost:5000/api";

// Helper: get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// AUTH
export const registerUser = async (username, email, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const fetchUser = async () => {
  const res = await fetch(`${API_URL}/auth/user`, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  return res.json();
};

// CATEGORIES
export const fetchCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
};

export const createCategory = async (name) => {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

// QUESTIONS
export const fetchQuestions = async () => {
  const res = await fetch(`${API_URL}/questions`);
  return res.json();
};

export const createQuestion = async (title, content, categoryId) => {
  const res = await fetch(`${API_URL}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ title, content, category: categoryId }),
  });
  return res.json();
};

// NEW: single question
export const fetchQuestionById = async (questionId) => {
  const res = await fetch(`${API_URL}/questions/${questionId}`);
  return res.json();
};

// ANSWERS
export const fetchAnswers = async (questionId) => {
  const res = await fetch(`${API_URL}/questions/${questionId}/answers`, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  return res.json();
};

export const postAnswer = async (questionId, content) => {
  const res = await fetch(`${API_URL}/questions/${questionId}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ content }),
  });
  return res.json();
};
