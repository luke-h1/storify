import { useState, useEffect } from 'react';

export function useLocalState<T = undefined>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return initial;
  });
  useEffect(() => {
    if (window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return [value, setValue] as [typeof value, typeof setValue];
}
