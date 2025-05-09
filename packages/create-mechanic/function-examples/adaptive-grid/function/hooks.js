import { useEffect, useState, useRef } from "react";

export const usePotentialRandomValue = (
  randomGenerator,
  fixedFallback,
  isRandom
) => {
  const randomValue = randomGenerator();
  const value = useRef(isRandom ? randomValue : fixedFallback);
  return value.current;
};

export const useImageHref = image => {
  const [href, setHref] = useState("");

  useEffect(() => {
    let reader;
    if (image) {
      reader = new FileReader();

      reader.readAsDataURL(image);

      reader.onload = function () {
        setHref(reader.result);
      };

      reader.onerror = function () {
        console.error(reader.error);
      };
    }
    return () => {
      if (reader) {
        reader.abort();
      }
    };
  }, [image]);

  return href;
};
