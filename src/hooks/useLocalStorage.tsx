import { useEffect, useState } from "react";

type UseLocalStorageReturn = [string | null, (value: string) => void];
export const useLocalStorage = (props: {
  key: string;
  initialValue: string;
}): UseLocalStorageReturn => {
  const { key, initialValue } = props;
  const [storedValue, setStoredValue] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      setStoredValue(item || initialValue);
    } catch (error) {
      console.log(error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  const setValue = (value: string) => {
    try {
      localStorage.setItem(key, value);
      setStoredValue(value);
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
