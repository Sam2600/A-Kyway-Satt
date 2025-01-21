import { useEffect, useState } from "react";

export const useDebounce = (value, milliSeconds = 250) => {
  const [deBounce, setDebounce] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(value);
    }, milliSeconds);

    return () => clearTimeout(timer);
  }, [value, milliSeconds]);

  return deBounce;
};
