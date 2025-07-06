import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setStudentName } from '../redux/studentSlice';

const StudentForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');

  useEffect(() => {
    const sessionName = sessionStorage.getItem('studentName');
    if (sessionName) {
      dispatch(setStudentName(sessionName));
      onSubmit && onSubmit();
    }
  }, [dispatch, onSubmit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('studentName', name);
    dispatch(setStudentName(name));
    onSubmit && onSubmit(); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Continue</button>
    </form>
  );
};

export default StudentForm;