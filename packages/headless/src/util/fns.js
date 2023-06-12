export const assert = (pred, msg) => {
  if (!pred) throw new Error(msg);
};

export const panic = (msg, ...args) => {
  throw new Error(`${msg}\n\n${args}`);
};
