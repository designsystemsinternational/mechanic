import { useRef, useEffect } from "react";
import { interactiveInputs } from "../../INPUTS";

const resetOtherInteractive = (sources, inputs, mainSource) => {
  const sourcesCopy = [...sources];
  for (let [inputName, input] of Object.entries(inputs)) {
    if (input.type in interactiveInputs && inputName !== mainSource) {
      sourcesCopy.push({ [inputName]: undefined });
    }
  }
  return sourcesCopy;
};

const useInteractiveInputs = (inputs, iframe, onChange) => {
  const handlers = [];
  for (let [inputName, input] of Object.entries(inputs)) {
    if (input.type in interactiveInputs) {
      const interactiveInput = interactiveInputs[input.type];
      for (let type in interactiveInput) {
        handlers.push([
          type,
          event => {
            const value = interactiveInput[type](event, input);
            onChange(event, inputName, value);
          }
        ]);
      }
    }
  }

  const iframeRoot = useRef();

  useEffect(() => {
    const onLoad = () => {
      iframeRoot.current = iframe.current.contentDocument.getElementById("root");
      for (const [eventType, handler] of handlers) {
        iframeRoot.current.addEventListener(eventType, handler);
      }
    };
    iframe.current?.addEventListener?.("load", onLoad);
    return () => {
      iframe.current?.removeEventListener?.("load", onLoad);
      for (const [eventType, handler] of handlers) {
        iframeRoot.current.removeEventListener(eventType, handler);
      }
    };
  }, [inputs]);

  return handlers;
};

export { useInteractiveInputs, resetOtherInteractive };
