import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setStudentName,
  setStudentId,
  setTabId,
  setSelectedAnswer,
} from '../redux/studentSlice';
import {
  setPolls,
  addPoll,
} from '../redux/pollSlice';
import { addStudent } from '../api/studentApi';
import PollHistory from './PollHistory';
import io from 'socket.io-client';
import '../css/student-loader.css';

const socket = io(process.env.REACT_APP_API_BASE_URL);

const getTabId = () => {
  let tabId = sessionStorage.getItem('tabId');
  if (!tabId) {
    tabId = Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('tabId', tabId);
  }
  return tabId;
};

const StudentPage = () => {
  const dispatch = useDispatch();
  const { name, id, tabId, selectedAnswer } = useSelector((state) => state.student);
  const { polls } = useSelector((state) => state.poll);

  const [submitted, setSubmitted] = useState(false);
  const [answeredPollIds, setAnsweredPollIds] = useState(() => {
    const saved = sessionStorage.getItem('answeredPollIds');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputName, setInputName] = useState('');

  useEffect(() => {
    const savedName = sessionStorage.getItem('studentName');
    const savedId = sessionStorage.getItem('studentId');
    const tabId = getTabId();
    dispatch(setTabId(tabId));
    if (savedName && savedId) {
      dispatch(setStudentName(savedName));
      dispatch(setStudentId(savedId));
      setSubmitted(true);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!submitted) return;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/active-polls`)
      .then(res => res.json())
      .then(data => dispatch(setPolls(data.polls || [])));

    const handleNewPoll = (newPoll) => {
      if (!polls.some(p => p.id === newPoll.id)) {
        dispatch(addPoll(newPoll));
      }
      if (answeredPollIds.length === polls.length) {
        setCurrentIndex(0);
      }
    };
    socket.on('new_poll', handleNewPoll);

    return () => {
      socket.off('new_poll', handleNewPoll);
    };
  }, [submitted, answeredPollIds.length, polls.length, dispatch, polls, answeredPollIds.length]);

  const unansweredPolls = Array.isArray(polls)
    ? polls.filter(poll => !answeredPollIds.includes(poll.id))
    : [];
  const poll = unansweredPolls[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    try {
      const student = await addStudent(inputName);
      sessionStorage.setItem('studentName', student.name);
      sessionStorage.setItem('studentId', student.id);
      dispatch(setStudentName(student.name));
      dispatch(setStudentId(student.id));
      setSubmitted(true);
    } catch (err) {
      alert(err.message || 'Error saving student');
    }
  };

  const handleAnswer = async () => {
    setLoading(true);
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        poll_id: poll.id,
        student_id: id,
        answer: selectedAnswer,
      }),
    });
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/poll-results?poll_id=${poll.id}`);
    const data = await res.json();
    setResults(data.results);
    setAnsweredPollIds(prev => {
      const updated = [...prev, poll.id];
      sessionStorage.setItem('answeredPollIds', JSON.stringify(updated));
      return updated;
    });
    setShowResults(true);
    setLoading(false);
  };

  const handleNext = () => {
    setShowResults(false);
    dispatch(setSelectedAnswer(''));
    setResults([]);
    setCurrentIndex(idx => idx + 1);
  };

  if (!submitted) {
    return (
      <form onSubmit={handleSubmit}>
        <label>Enter Your Name:</label>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    );
  }

  if (!polls || polls.length === 0) {
    return (
      <div className="student-loader">
        <div className="loader-circle"></div>
        <p className="waiting-text">Wait for the teacher to ask questions...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div>
        <div className="student-loader">
          <div className="loader-circle"></div>
          <p className="waiting-text">Wait for the teacher to ask questions...</p>
        </div>
        <PollHistory polls={polls || []} />
      </div>
    );
  }

  const options = Array.isArray(poll?.options)
    ? poll.options
    : typeof poll?.options === 'string'
      ? JSON.parse(poll.options)
      : [];

  if (showResults) {
    return (
      <div>
        <h2>Poll Results</h2>
        {results.map((result, idx) => (
          <div key={idx} className="poll-result-block">
            <div className="poll-result-header">
              <span className="option-number">{idx + 1}</span>
              <span className="option-text">{result.answer}</span>
              <span className="option-percentage">{result.percentage}%</span>
            </div>
            <div className="poll-bar-outer">
              <div
                className="poll-bar-inner"
                style={{ width: `${result.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
        <button onClick={handleNext} className="next-question-btn">
          {unansweredPolls.length > 1 ? 'Next Question' : 'Finish'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Question {currentIndex + 1} of {unansweredPolls.length}</h2>
      <h3>{poll.question}</h3>
      <form onSubmit={e => { e.preventDefault(); handleAnswer(); }}>
        {options.map((opt, idx) => (
          <label key={idx} className="option-label">
            <input
              type="radio"
              name="answer"
              value={opt}
              checked={selectedAnswer === opt}
              onChange={() => dispatch(setSelectedAnswer(opt))}
              required
            />
            {opt}
          </label>
        ))}
        <button type="submit" disabled={loading || !selectedAnswer}>Submit</button>
      </form>
    </div>
  );
};

export default StudentPage;