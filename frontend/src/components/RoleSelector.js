import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRole } from '../redux/studentSlice';
import './components.css';

const RoleSelector = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRole = (role) => {
    dispatch(setRole(role));
    if (role === 'student') {
      navigate('/student');
    } else {
      navigate('/teacher');
    }
  };

  return (
    <div className="role-selector-container">
      <div className="role-selector-header">
        <span className="role-selector-badge">Intervue Poll</span>
        <h1>
          Welcome to the <span className="highlight">Live Polling System</span>
        </h1>
        <p className="role-selector-desc">
          Please select the role that best describes you to begin using the live polling system
        </p>
      </div>
      <div className="role-selector-cards">
        <div
          className="role-card"
          tabIndex={0}
          onClick={() => handleRole('student')}
        >
          <h3>I’m a Student</h3>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
        </div>
        <div
          className="role-card"
          tabIndex={0}
          onClick={() => handleRole('teacher')}
        >
          <h3>I’m a Teacher</h3>
          <p>Submit answers and view live poll results in real-time.</p>
        </div>
      </div>
      <button className="role-selector-continue" onClick={() => {}}>
        Continue
      </button>
    </div>
  );
};

export default RoleSelector;