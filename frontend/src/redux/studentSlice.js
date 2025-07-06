import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  id: '',
  role: '',
  tabId: '',
  selectedAnswer: '',
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudentName: (state, action) => {
      state.name = action.payload;
    },
    setStudentId: (state, action) => {
      state.id = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setTabId: (state, action) => {
      state.tabId = action.payload;
    },
    setSelectedAnswer: (state, action) => {
      state.selectedAnswer = action.payload;
    },
    clearStudent: (state) => {
      state.name = '';
      state.id = '';
      state.role = '';
      state.tabId = '';
      state.selectedAnswer = '';
    },
  },
});

export const {
  setStudentName,
  setStudentId,
  setRole,
  setTabId,
  setSelectedAnswer,
  clearStudent,
} = studentSlice.actions;
export default studentSlice.reducer;