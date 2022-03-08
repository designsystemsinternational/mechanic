import { useReducer, useCallback, useEffect } from "react";
import seedrandom from "seedrandom";

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

const getNewSeed = () => seedrandom(null, { pass: (_, seed) => ({ seed }) }).seed;

export function useSeedHistory() {
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    current: getNewSeed(),
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

  const set = useCallback(() => {
    const newCurrent = getNewSeed();
    dispatch({ type: "SET", newCurrent });
    return newCurrent;
  }, []);

  const reset = useCallback(() => {
    const newCurrent = getNewSeed();
    dispatch({ type: "RESET", newCurrent: getNewSeed() });
    return newCurrent;
  }, []);

  return [state, { set, reset, undo, redo, canUndo, canRedo }];
}
