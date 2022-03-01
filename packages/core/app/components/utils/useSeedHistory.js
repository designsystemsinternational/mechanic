import { useReducer, useCallback, useEffect } from "react";

function undoReducer(state, action) {
  const { past, current, future } = state;
  const { type, newCurrent } = action;

  switch (type) {
    case "UNDO": {
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        current: previous,
        future: [current, ...future]
      };
    }
    case "REDO": {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, current],
        current: next,
        future: newFuture
      };
    }
    case "SET": {
      if (newCurrent === current) {
        return state;
      }
      return {
        past: [...past, current],
        current: newCurrent,
        future: []
      };
    }
    case "RESET": {
      return {
        past: [],
        current: newCurrent,
        future: []
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

export function useSeedHistory(initialCurrent) {
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    current: initialCurrent,
    future: []
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const set = useCallback(newCurrent => {
    dispatch({ type: "SET", newCurrent });
  }, []);

  const reset = useCallback(newCurrent => {
    dispatch({ type: "RESET", newCurrent });
  }, []);

  return [state, { set, reset, undo, redo, canUndo, canRedo }];
}

export const useLastRunUpdate = (lastRun, seedHistory, setSeedHistory) => {
  useEffect(() => {
    if (
      lastRun?.values?._randomSeed &&
      lastRun.values._randomSeed !== seedHistory.current &&
      !seedHistory.past.includes(lastRun.values._randomSeed) &&
      !seedHistory.future.includes(lastRun.values._randomSeed)
    ) {
      if (seedHistory.current === undefined) setSeedHistory.reset(lastRun?.values?._randomSeed);
      else setSeedHistory.set(lastRun?.values?._randomSeed);
    }
  }, [lastRun, seedHistory.current, seedHistory.past, seedHistory.future]);
};
