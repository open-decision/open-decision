import React from "react";

export const useKeyboardEvent = (key: string, callback: () => void): void => {
  React.useEffect(() => {
    const handler = function (event: KeyboardEvent) {
      if (event.key === key) {
        callback();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [key, callback]);
};

type localStorage = [
  getItem: () => string | null,
  setItem: (token: string) => void,
  removeItem: () => void
];

export const useLocalStorage = (name: string): localStorage => {
  const getItem = () => localStorage.getItem(name);
  const setItem = (token: string) => localStorage.setItem(name, token);
  const removeItem = () => localStorage.removeItem(name);

  return [getItem, setItem, removeItem];
};
