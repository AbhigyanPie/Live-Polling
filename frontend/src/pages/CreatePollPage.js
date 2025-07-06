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
      <input value={question} onChange={e =>
        setQuestion(e.target.value)} placeholder="Poll question" required />
      {options.map((opt, idx) => (
        <div key={idx} className="option-row">
          <input
            value={opt}
            onChange={e => handleOptionChange(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
            required
          />
          <label>
            Correct?
            <input
              type="checkbox"
              checked={correctOptions[idx]}
              onChange={e => handleCorrectedChange(idx, e.target.checked)}
            />
          </label>
        </div>
      ))}
      <button type="button" onClick={addOptions}>+ Add More Option</button>
      <label>
        Timer:
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
      </label>
      <button type="submit">Submit Poll</button>
    </form>
  );
};

export default CreatePollPage;