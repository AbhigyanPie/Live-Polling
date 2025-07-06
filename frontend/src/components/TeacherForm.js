import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTeacher } from '../redux/teacherSlice.js';
import './components.css';

const TeacherForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/teacher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      dispatch(setTeacher({
        id: data.teacher.id,
        name: data.teacher.name,
        email: data.teacher.email,
      }));
      navigate('/teacher/create-poll');
    } else {
      alert(data.error || 'Failed to register teacher');
    }
  };

  return (
    <div className="teacher-form-bg">
      <form className="teacher-form-card" onSubmit={handleSubmit}>
        <div className="teacher-form-logo-row">
          <span className="teacher-form-badge">Intervue Poll</span>
        </div>
        <h2 className="teacher-form-title">
          Let’s <span className="highlight">Get Started</span>
        </h2>
        <p className="teacher-form-desc">
          Enter your details to create and manage live polls for your class.
        </p>
        <label className="teacher-form-label" htmlFor="teacher-name">Name</label>
        <input
          id="teacher-name"
          className="teacher-input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your Name"
          required
        />
        <label className="teacher-form-label" htmlFor="teacher-email">Email</label>
        <input
          id="teacher-email"
          className="teacher-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <button className="teacher-btn" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default TeacherForm;
