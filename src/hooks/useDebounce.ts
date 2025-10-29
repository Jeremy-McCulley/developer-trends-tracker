// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value.
 * The returned 'debouncedValue' will only update after the input 'value'
 * has stopped changing for the specified 'delay' period.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If the value changes (user keeps typing), clear the previous timer
    // so the debounced value is not updated prematurely.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect if value or delay changes

  return debouncedValue;
}