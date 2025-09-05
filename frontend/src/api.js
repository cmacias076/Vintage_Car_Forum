const API_BASE =
  process.env.REACT_APP_API_BASE ||
  'https://vintage-car-forum.onrender.com/api' ||
  'http://localhost:5000/api';


const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const jfetch = async (input, init = {}) => {
  const res = await fetch(input, init);
  return res.json();
};

/* ---------------- AUTH ---------------- */
export const registerUser = async (username, email, password) =>
  jfetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

export const loginUser = async (email, password) =>
  jfetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

export const fetchUser = async () =>
  jfetch(`${API_BASE}/auth/user`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
  });

export const register = registerUser;
export const login = loginUser;

/* --------------- CATEGORIES --------------- */
export const fetchCategories = async () => jfetch(`${API_BASE}/categories`);

export const createCategory = async (name, description = '') =>
  jfetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ name, description }),
  });

/* --------------- QUESTIONS (non-paged) --------------- */
export const fetchQuestions = async () => jfetch(`${API_BASE}/questions`);

export const fetchQuestionsByCategory = async (categoryId) =>
  jfetch(`${API_BASE}/categories/${categoryId}/questions`);

export const createQuestion = async (title, content, categoryId) =>
  jfetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ title, content, category: categoryId }),
  });

export const fetchQuestionById = async (questionId) =>
  jfetch(`${API_BASE}/questions/${questionId}`);

/* --------------- QUESTIONS (paged) --------------- */
export const fetchQuestionsPaged = async (limit = 10, cursor = null) => {
  const url = new URL(`${API_BASE}/questions-paged`);
  url.searchParams.append('limit', limit);
  if (cursor) url.searchParams.append('cursor', cursor);
  return jfetch(url);
};

export const fetchQuestionsByCategoryPaged = async (
  categoryId,
  limit = 10,
  cursor = null
) => {
  const url = new URL(`${API_BASE}/categories/${categoryId}/questions-paged`);
  url.searchParams.append('limit', limit);
  if (cursor) url.searchParams.append('cursor', cursor);
  return jfetch(url);
};

/* --------------- ANSWERS --------------- */
export const fetchAnswers = async (questionId) =>
  jfetch(`${API_BASE}/questions/${questionId}/answers`);

export const postAnswer = async (questionId, content) =>
  jfetch(`${API_BASE}/questions/${questionId}/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ content }),
  });