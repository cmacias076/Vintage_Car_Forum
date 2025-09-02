import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function QuestionDetail() {
  const { id } = useParams(); // gets question ID from the URL
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // Fetch question and its answers
    fetch(`http://localhost:5000/api/questions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data.question);
        setAnswers(data.answers || []);
      })
      .catch((err) => console.error("Error fetching question:", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(`http://localhost:5000/api/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newAnswer, question: id }),
      });
      const data = await res.json();
      setAnswers((prev) => [...prev, data.answer]); // add new answer to list
      setNewAnswer(""); // clear input
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };

  if (!question) return <p>Loading question...</p>;

  return (
    <div>
      <h2>{question.content}</h2>
      <h3>Answers:</h3>
      <ul>
        {answers.length > 0 ? (
          answers.map((a) => <li key={a._id}>{a.content}</li>)
        ) : (
          <li>No answers yet</li>
        )}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write your answer..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          required
        />
        <button type="submit">Submit Answer</button>
      </form>
    </div>
  );
}

export default QuestionDetail;
