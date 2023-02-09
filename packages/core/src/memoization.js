import { MechanicError } from "./mechanic-error.js";
import { hashFromString } from "./mechanic-utils.js";

const mechanicMemoizationPool = {};

/**
 * Memoizes the return value of a function. To be used when the result of a
 * heavy computation or the loading of a bigger file should be cached across
 * function runs.
 *
 * It uses the function as well as the arguments to compute a cache key. This
 * way it can be used multiple times within a user's function.
 *
 * @param{function} fn - Function to memoize
 * @param{array} args - Arguments to pass to the function
 * @return{any} - Result of the function
 *
 * @example
 * memo(() => a + b, [a, b]);
 */

export const memo = (fn, args) => {
  const key = hashFromString(`${fn.toString()}${JSON.stringify(args)}`);
  if (mechanicMemoizationPool[key]) {
    return mechanicMemoizationPool[key];
  }
  const result = fn();
  mechanicMemoizationPool[key] = result;
  return result;
};

/**
 * Preloads a file and caches its base64 representation in the memoization pool.
 * This can be used to preload an external image, data or a font file.
 * Uses the native fetch API.
 *
 * @param{string} url - URL of the file to preload
 * @return{string} - base64 representation of the file
 *
 * @example
 * const image = await preload("https://example.com/image.png");
 */
export const preload = async url => {
  const response = await memo(async () => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new MechanicError(
        `Could not preload file ${url}. Status: ${response.status}`
      );
    }

    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    return new Promise(resolve => {
      reader.onloadend = () => {
        const base64data = reader.result;
        mechanicMemoizationPool[url] = base64data;
        resolve(base64data);
      };
    });
  }, [url]);

  return response;
};

/**
 * Specialized version of the preloader that loads a font, registers it as a
 * font-face and returns the name of the registered font to be used in Canvas,
 * SVG or CSS.
 *
 * @param{string} url - URL of the font file to preloader
 * @return{string} - Name of the font to register
 *
 * @example
 * const myFont = await preloadFont('/F-Grotesk-Regular.otf');
 * ctx.font = `100 100px ${myFont}`;
 */
export const preloadFont = async url => {
  const name = `font-${hashFromString(url)}`;

  // Check if the font is already loaded and available
  if (document.fonts.check(`12px ${name}`)) return name;

  // If not load it, making use of memoizing the fetch call
  const base64Font = await preload(url);

  const fontFile = new FontFace(name, `url(${base64Font})`);
  document.fonts.add(fontFile);

  // Wait for the font to be loaded
  await fontFile.load();

  return name;
};
