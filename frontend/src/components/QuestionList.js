import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(Array.isArray(data) ? data : data?.questions || []))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  return (
    <div>
      <h3>All Questions</h3>
      {questions.length > 0 ? (
        <ul>
          {questions.map((q) => (
            <li key={q._id}>
              <Link to={`/question/${q._id}`}>{q.title || q.content}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions found</p>
      )}
    </div>
  );
}

export default QuestionList;
