export const isSSR = typeof isSSRRender !== "undefined";
export const isClient = !isSSR;

export function uid(prefix = "comp") {
  return prefix + "-" + Math.random().toString(36).substring(2, 16);
}
