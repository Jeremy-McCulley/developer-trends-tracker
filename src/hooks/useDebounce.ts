// Import the necessary tools from the 'react' library for creating state and handling side effects.
import { useState, useEffect } from 'react';

// This is a special tool (a custom React Hook) that delays updating a value.
// It's useful for things like search bars so you don't perform a search for every letter typed.
// T is a placeholder for any type of data (string, number, object, etc.).
// 'value' is the data you want to delay, and 'delay' is the waiting time in milliseconds.
export function useDebounce<T>(value: T, delay: number): T {
  // Create a piece of state to hold the debounced (delayed) version of your value.
  // It starts with the initial 'value' you pass in.
  const [debouncedValue, setDebouncedValue] = useState(value);

  // This effect runs every time the 'value' or 'delay' changes.
  useEffect(() => {
    // 1. Start a timer (setTimeout).
    // The code inside this timer will only run AFTER the 'delay' time has passed.
    const handler = setTimeout(() => {
      // Once the time is up, update the debounced value with the current 'value'.
      setDebouncedValue(value);
    }, delay);

    // 2. Cleanup Function: This runs right before the effect runs again,
    // or when the component is removed.
    return () => {
      // If the 'value' changes before the timer finishes, clear the old timer.
      // This is the key step! It cancels the previous update, ensuring we only
      // update the debounced value if the 'value' stays the same for the full 'delay'.
      clearTimeout(handler);
    };
  // The effect re-runs whenever the 'value' (the input from the user) or the 'delay' changes.
  }, [value, delay]);

  // Return the stable, delayed value.
  return debouncedValue;
}