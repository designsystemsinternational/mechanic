import path from "node:path";
import fs from "node:fs";
import puppeteer from "puppeteer-core";

import { createServer, shutdownServer } from "./server.js";
import { findChrome } from "./util/chrome-finder.js";
import { assert } from "./util/fns.js";
import { createBufferFromRender } from "./util/data.js";
import { renderInClient } from "./client.js";

export const render = async ({
  distDir = "/",
  functionName,
  parameters,
  headlessMode,
  done,
  hooks = {}
}) => {
  const timeStart = performance.now();
  const fnUrl = `${functionName}.html`;
  const fnPath = path.join(distDir, fnUrl);
  const chromiumPath = findChrome();

  assert(
    chromiumPath != null && chromiumPath !== "",
    `Could not find Google Chrome installed. Please make sure you have it installed, to run headless mechanic rendering`
  );

  assert(
    fs.existsSync(fnPath),
    `Specified function ${functionName} does not exist at ${fnPath}.`
  );

  assert(
    typeof done === "function",
    `The specified done callback is not a function. Got ${typeof callback}.`
  );

  // Setup server and headless browser
  const { server, url } = await createServer(distDir);
  const browser = await puppeteer.launch({
    headless: headlessMode ?? "new",
    executablePath: chromiumPath
  });

  // Dispatch the render
  await renderInClient({
    url: `${url}/${fnUrl}`,
    browser,
    parameters,
    hooks,
    onDownload: async ({ data, name, mimeType }) => {
      // Finalize
      shutdownServer(server);
      await browser.close();

      // Send the result back to the caller
      const buffer = createBufferFromRender(data, mimeType);
      const timeEnd = performance.now();
      done({ data: buffer, name, mimeType, duration: timeEnd - timeStart });
    }
  });
};
