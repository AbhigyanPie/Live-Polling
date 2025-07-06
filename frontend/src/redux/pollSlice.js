import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuestion: null,
  polls: [],
  pollResults: {},
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    setPolls: (state, action) => {
      state.polls = action.payload;
    },
    addPoll: (state, action) => {
      state.polls.unshift(action.payload);
    },
    setPollResults: (state, action) => {
      state.pollResults = {
        ...state.pollResults,
        [action.payload.pollId]: action.payload.results,
      };
    },
    clearPolls: (state) => {
      state.polls = [];
      state.currentQuestion = null;
      state.pollResults = {};
    },
  },
});

export const {
  setCurrentQuestion,
  setPolls,
  addPoll,
  setPollResults,
  clearPolls,
} = pollSlice.actions;
export default pollSlice.reducer;