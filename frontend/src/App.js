import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import RoleSelector from './components/RoleSelector';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import CreatePollPage from './pages/CreatePollPage';
import PollListPage from './pages/PollListPage';
import TeacherForm from './components/TeacherForm';
import {useSelector} from 'react-redux';

const App = () => {
  const teacher = useSelector(state => state.teacher);

  return (
    <Router>
      <Routes>
        <Route path ="/" element={<RoleSelector/>} />
        <Route path ="/student" element={<StudentPage/>} />
        <Route path ="/teacher" 
                  element={
                    localStorage.getItem('teacher')
                      ?<TeacherPage/>
                      :<TeacherForm/>
                      } 
        />
        <Route path ="/teacher/create-poll" element={ teacher.id ? <CreatePollPage/> : <TeacherForm/> }/>
        <Route path ="/teacher/polls" element ={<PollListPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;