// useInterval.ts
import {useEffect, useRef} from 'react';

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});
  const intervalId = useRef<number | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const startInterval = () => {
    console.log('Interval ---:> Start');
    if (delay !== null && !intervalId.current) {
      intervalId.current = setInterval(() => savedCallback.current(), delay);
    }
  };

  const stopInterval = () => {
    console.log('Interval ---:> Stop');
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  const clearIntervalFn = () => {
    console.log('Interval ---:> Clear');
    stopInterval();
    intervalId.current = null;
  };

  // useEffect(() => {
  //   startInterval();

  //   // Cleanup function
  //   return () => {
  //     clearIntervalFn();
  //   };
  // }, [delay, startInterval, clearIntervalFn]);

  return {startInterval, stopInterval, clearInterval: clearIntervalFn};
}

export default useInterval;
