import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setStudentName, setStudentId } from '../redux/studentSlice';
import { addStudent } from '../api/studentApi';
import { useNavigate } from 'react-router-dom';
import './components.css';

const StudentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const student = await addStudent(name);
      sessionStorage.setItem('studentName', student.name);
      sessionStorage.setItem('studentId', student.id);
      dispatch(setStudentName(student.name));
      dispatch(setStudentId(student.id));
      navigate('/student/page');
    } catch (err) {
      alert(err.message || 'Error saving student');
    }
    setLoading(false);
  };

  return (
    <div className="student-form-bg">
      <form className="student-form-card" onSubmit={handleSubmit}>
        <div className="student-form-logo-row">
          <span className="student-form-badge">Intervue Poll</span>
        </div>
        <h2 className="student-form-title">
          Let’s <span className="highlight">Get Started</span>
        </h2>
        <p className="student-form-desc">
          If you’re a student, you’ll be able to <b>submit your answers</b>, participate in live polls, and see how your responses compare with your classmates.
        </p>
        {/* <label className="student-form-label" htmlFor="student-name">Enter your Name</label> */}
        <input
          id="student-name"
          className="student-input"
          type="text"
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
        <button className="student-btn" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;