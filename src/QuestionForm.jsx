// src/QuestionForm.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./QuestionForm.css";

const QuestionForm = () => {
  // function to clean response text from special characters like * and #
  const cleanResponseText = (text) => {
    return text.replace(/[*#]+/g, "");
  };

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref for chat history container
  const chatHistoryRef = useRef(null);

  // Scroll chat history to bottom on update
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/ask", {
        question,
      });
      const cleanedAnswer = cleanResponseText(response.data.answer);
      setChatHistory([
        ...chatHistory,
        { type: "question", text: question },
        { type: "answer", text: cleanedAnswer },
      ]);
      setQuestion("");
    } catch (err) {
      setError("Failed to get the answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h3>Ask a Question</h3>
      <div ref={chatHistoryRef} className="chat-history">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-bubble ${
              chat.type === "question" ? "question" : "answer"
            }`}
          >
            {chat.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !question}>
          {loading ? "Asking..." : "Ask"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default QuestionForm;

// // src/QuestionForm.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const QuestionForm = () => {
//   const [question, setQuestion] = useState('');
//   const [answer, setAnswer] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post('http://localhost:3001/ask', { question });
//       setAnswer(response.data.answer);
//     } catch (err) {
//       setError('Failed to get the answer. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Ask a Question</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Type your question here"
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Asking...' : 'Ask'}
//         </button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {answer && <p><strong>Answer:</strong> {answer}</p>}
//     </div>
//   );
// };

// export default QuestionForm;
