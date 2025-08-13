/**
 * TODO
 * This is just a temporary solution, so we can author the
 * headless stuff in ESM but also consume it in CJS.
 *
 * Once everything is refactored to CJS we can get rid of this.
 *
 * Why not author the headless package in CJS I hear you ask?
 * Well, the idea is that the headless package can also be used
 * programmatically in other places than the CLI (like server)
 * so ESM gives us more flexibility here.
 */
export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/cjs/index.cjs",
      format: "cjs"
    },
    {
      file: "dist/esm/index.js",
      format: "esm"
    }
  ]
};
