import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { setRole } from '../redux/studentSlice';

const RoleSelector = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRole = (role) => {
        dispatch(setRole(role));
        navigate(`/${role}`);
    };

    return (
        <div>
            <h2>Select Your Role</h2>
            <button onClick={() => handleRole('student')}>I am student</button>
            <button onClick={() => handleRole('teacher')}>I am Teacher</button>
        </div>
    );
};

export default RoleSelector;