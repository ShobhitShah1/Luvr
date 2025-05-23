import { useEffect, useRef } from 'react';

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const startInterval = () => {
    if (delay !== null && !intervalId.current) {
      intervalId.current = setInterval(() => savedCallback.current(), delay);
    }
  };

  const stopInterval = () => {
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  const clearIntervalFn = () => {
    stopInterval();
    intervalId.current = null;
  };

  return { startInterval, stopInterval, clearInterval: clearIntervalFn };
}

export default useInterval;
