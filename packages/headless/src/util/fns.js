export const assert = (pred, msg) => {
  if (!pred) throw new Error(msg);
};
