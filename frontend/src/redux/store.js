import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './studentSlice';
import teacherReducer from './teacherSlice';
import pollReducer from './pollSlice';
import timerReducer from './timerSlice';

export const store = configureStore({
  reducer: {
    student: studentReducer,
    teacher: teacherReducer,
    poll: pollReducer,
    timer: timerReducer,
  },
});
