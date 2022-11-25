import { useState, useEffect, useRef, useMemo } from "react";
import { loadOpentypeFont } from "./opentype";

/**
  Make a React-based draw loop for animation design functions
**/
export const useDrawLoop = (isPlaying, duration) => {
  const raf = useRef();
  const starttime = useRef();
  const [runtime, setRuntime] = useState(0);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    if (!isPlaying) {
      return;
    }

    const draw = t => {
      const timestamp = t || new Date().getTime();
      if (!starttime.current) {
        starttime.current = timestamp;
      }
      setRuntime(timestamp - starttime.current);
      if (duration > timestamp - starttime.current) {
        raf.current = requestAnimationFrame(draw);
      }
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
    };
  }, [isPlaying]);

  return runtime;
};

/**
  A hook to load an opentype font
**/
export const useLoadedOpentypeFont = name => {
  const [font, setFont] = useState(null);
  useMemo(() => {
    loadOpentypeFont(name, f => {
      setFont(f);
    });
  }, [name]);
  return font;
};
