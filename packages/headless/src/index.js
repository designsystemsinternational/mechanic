import path from "node:path";
import fs from "node:fs";
import puppeteer from "puppeteer";

import { createServer, shutdownServer } from "./server.js";
import { assert } from "./util/fns.js";
import { createBufferFromRender } from "./util/data.js";
import { renderInClient } from "./client.js";

export const render = async ({
  distDir = "/",
  functionName,
  parameters = { text: "Lucas Nolte" },
  headlessMode,
  callback
}) => {
  const timeStart = performance.now();
  const fnUrl = `${functionName}.html`;
  const fnPath = path.join(distDir, fnUrl);

  assert(
    fs.existsSync(fnPath),
    `Specified function ${functionName} does not exist at ${fnPath}`
  );

  assert(
    typeof callback === "function",
    `The specified callback is not a function. Got ${typeof callback}`
  );

  // Start the local preview server
  const { server, url } = await createServer(distDir);

  // Create headless browser
  const browser = await puppeteer.launch({
    headless: headlessMode ?? "new"
  });

  const page = await browser.newPage();

  await page.goto(`${url}/${fnUrl}`, {
    waitUntil: "networkidle2"
  });

  await page.exposeFunction(
    "handleDownload",
    async ({ data, name, mimeType }) => {
      // Finalize
      shutdownServer(server);
      await browser.close();
      const buffer = createBufferFromRender(data, mimeType);
      const timeEnd = performance.now();

      // Send the result back to the caller
      callback({ data: buffer, name, mimeType, duration: timeEnd - timeStart });
    }
  );

  await renderInClient({
    page,
    parameters,
  })
};
