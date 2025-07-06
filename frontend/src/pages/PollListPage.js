import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PollListPage = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/polls`);
      const data = await response.json();
      if (response.ok) {
        setPolls(data.polls);
      } else {
        alert(data.error);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div>
      <h2>All Polls</h2>
      {polls.map((poll) => (
        <div key={poll.id}>
          <p><strong>Q:</strong>{poll.question}</p>
          <ul>
            {(Array.isArray(poll.options)
              ? poll.options
              : JSON.parse(poll.options)
            ).map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
          <hr />
        </div>
      ))}
      <button
        className="ask-new-question-btn"
        onClick={() => navigate('/teacher/create-poll')}
      >
        Ask a new question
      </button>
    </div>
  );
};

export default PollListPage;
