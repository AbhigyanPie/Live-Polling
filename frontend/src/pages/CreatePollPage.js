import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/poll-form.css';
import { useSelector } from 'react-redux';

const CreatePollPage = () => {
  const navigate = useNavigate();
  const teacher = useSelector(state => state.teacher);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState('');
  const [correctOptions, setCorrectOptions] = useState([false, false]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectedChange = (index, value) => {
    const newCorrect = [...correctOptions];
    newCorrect[index] = value;
    setCorrectOptions(newCorrect);
  };

  const addOptions = () => {
    setOptions([...options, '']);
    setCorrectOptions([...correctOptions, false]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const poll = {
      question,
      options,
      duration: parseInt(duration),
      is_active: true,
      correct_options: correctOptions,
      teacher_id: teacher.id,
    };

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(poll),
    });

    if (response.ok) {
      navigate('/teacher/polls');
    } else {
      const error = await response.json();
      alert(error.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="poll-form">
      <div className="create-logo-row">
        <span className="create-form-badge">Intervue Poll</span>
      </div>
      <h2 className="create-poll-title">
        Let’s <span className="highlight">Get Started</span>
      </h2>
      <p className="create-poll-desc">
        you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
      </p>
      <div className="question-row">
        <h3 className="question-heading">Enter your question</h3>
        <div className="timer-inline">
          <span>Timer:</span>
          <select
            value={duration}
            onChange={e => setDuration(e.target.value)}
            required
            className="timer-dropdown"
          >
            <option value="" disabled>Select timer</option>
            <option value="10">10 seconds</option>
            <option value="20">20 seconds</option>
            <option value="30">30 seconds</option>
            <option value="45">45 seconds</option>
            <option value="60">60 seconds</option>
          </select>
        </div>
      </div>
      <input
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Enter your question"
        required
        className="poll-question-input"
      />
      {options.map((opt, idx) => (
        <div key={idx} className="option-row">
          <input
            value={opt}
            onChange={e => handleOptionChange(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
            required
            className="poll-option-input"
          />
          <label className="correct-label">
            <span>Is it Correct?</span>
            <input
              type="checkbox"
              checked={correctOptions[idx]}
              onChange={e => handleCorrectedChange(idx, e.target.checked)}
            />
          </label>
        </div>
      ))}
      <button type="button" className="add-option-btn" onClick={addOptions}>
        + Add More option
      </button>
      <button type="submit" className="ask-question-btn">
        Ask Question
      </button>
    </form>
  );
};

export default CreatePollPage;
