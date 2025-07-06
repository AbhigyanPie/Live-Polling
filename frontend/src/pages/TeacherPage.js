import React from 'react';
import {useNavigate} from 'react-router-dom';

const TeacherPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Welcome Teacher</h2>
            <button onClick={() => navigate('/teacher/create-poll')}>Create Poll</button>
            <button onClick={() => navigate('/teacher/polls')}>View All</button>
        </div>
    );
};

export default TeacherPage;