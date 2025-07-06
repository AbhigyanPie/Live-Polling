import React, { useState, useEffect } from 'react';

const PollHistoryResults = ({ pollId, options }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/poll-results?poll_id=${pollId}`)
      .then(res => res.json())
      .then(data => setResults(data.results || []));
  }, [pollId]);

  const optionsArray = Array.isArray(options)
    ? options
    : typeof options === 'string'
      ? JSON.parse(options)
      : [];

  return (
    <div>
      {optionsArray.map((opt, idx) => {
        const result = results.find(r => r.answer === opt) || { count: 0, percentage: 0 };
        return (
          <div key={idx} className="poll-result-block">
            <div className="poll-result-header">
              <span className="option-number">{idx + 1}</span>
              <span className="option-text">{opt}</span>
              <span className="option-percentage">{result.percentage}%</span>
            </div>
            <div className="poll-bar-outer">
              <div
                className="poll-bar-inner"
                style={{ width: `${result.percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PollHistoryResults;