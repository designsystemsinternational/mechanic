import { useState, useEffect } from "react";

export const useShiftKey = () => {
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === "Shift") {
        setIsShiftPressed(true);
      }
    };
    const handleKeyUp = e => {
      if (e.key === "Shift") {
        setIsShiftPressed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return isShiftPressed;
};
