import {useEffect, useState} from "react";

export default function useKeyPress() {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({key}) {
    setKeyPressed(key);
  }

  const upHandler = ({key}) => {
    setKeyPressed(key);
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}