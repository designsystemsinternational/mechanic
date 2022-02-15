export const eventType = "mousemove";

export const eventHandler = (event) => {
  return { x: event.clientX, y: event.clientY };
};
