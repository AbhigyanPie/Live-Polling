import React from 'react';
import PollHistoryResults from './PollHistoryResults';

const PollHistory = ({ polls }) => (
  <div className="poll-history">
    <h2>Poll History</h2>
    {(Array.isArray(polls) ? polls : []).map((poll, idx) => (
      <div key={poll.id || idx} className="poll-history-block">
        <div className="poll-history-header">
          <span className="poll-history-question">Question {idx + 1}</span>
        </div>
        <div className="poll-history-question-text">{poll.question}</div>
        <PollHistoryResults pollId={poll.id} options={poll.options} />
      </div>
    ))}
  </div>
);

export default PollHistory;