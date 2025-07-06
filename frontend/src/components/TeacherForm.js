import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTeacher } from '../redux/teacherSlice.js';

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
    <form onSubmit={handleSubmit} className="teacher-form">
      <h2>Enter Teacher Details</h2>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Continue'}
      </button>
    </form>
  );
};

export default TeacherForm;
