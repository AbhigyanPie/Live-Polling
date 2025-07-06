import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  duration: 0,   
  remaining: 0,    
  running: false,   
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state, action) => {
      state.duration = action.payload;
      state.remaining = action.payload;
      state.running = true;
    },
    tick: (state) => {
      if (state.running && state.remaining > 0) {
        state.remaining -= 1;
      }
      if (state.remaining <= 0) {
        state.running = false;
      }
    },
    stopTimer: (state) => {
      state.running = false;
    },
    resetTimer: (state) => {
      state.remaining = state.duration;
      state.running = false;
    },
  },
});

export const { startTimer, tick, stopTimer, resetTimer } = timerSlice.actions;
export default timerSlice.reducer;
