import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tick, stopTimer } from '../redux/timerSlice';

const Timer = () => {
  const dispatch = useDispatch();
  const { remaining, running } = useSelector(state => state.timer);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      dispatch(stopTimer());
      return;
    }
    const interval = setInterval(() => {
      dispatch(tick());
    }, 1000);
    return () => clearInterval(interval);
  }, [running, remaining, dispatch]);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');

  return (
    <div className="timer">
      <span role="img" aria-label="timer">⏰</span> {minutes}:{seconds}
    </div>
  );
};

export default Timer;
