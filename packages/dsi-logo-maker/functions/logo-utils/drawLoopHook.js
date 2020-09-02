import { useState, useEffect, useRef } from "react";

export const useDrawLoop = isPlaying => {
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
      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
    };
  }, [isPlaying]);

  return runtime;
};
