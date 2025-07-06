import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  id: '',
  isAuthenticated: false,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setTeacher: (state, action) => {
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.isAuthenticated = true;
    },
    clearTeacher: (state) => {
      state.name = '';
      state.id = '';
      state.isAuthenticated = false;
    },
    setTeacherName: (state, action) => {
      state.name = action.payload;
    },
    setTeacherId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setTeacher, clearTeacher, setTeacherName, setTeacherId } = teacherSlice.actions;
export default teacherSlice.reducer;