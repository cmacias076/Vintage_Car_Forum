const API_URL = "http://localhost:5000/api";

// Helper to get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken"); // or wherever you store it
  return { Authorization: `Bearer ${token}` };
};

// Fetch all answers for a question
export const fetchAnswers = async (questionId) => {
  const res = await fetch(`${API_URL}/questions/${questionId}/answers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.json();
};

// Post a new answer
export const postAnswer = async (questionId, content) => {
  const res = await fetch(`${API_URL}/questions/${questionId}/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
};
