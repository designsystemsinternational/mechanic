import { panic } from "./util/fns.js";

export const renderInClient = async ({
  url,
  browser,
  parameters,
  hooks,
  onDownload
}) => {
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle2"
  });

  // Forward any console messages from the page
  page.on("console", (...args) => console.log(args));

  // These are very crude guard rails to not let a rendering
  // process run forever if there is an error in the page.
  page.on("error", (...args) => panic('A page error occured', ...args));
  page.on("pageerror", (...args) => panic('A page error occured', ...args));

  await page.exposeFunction("emit", (event, ...args) => {
    if (typeof hooks?.[event] === "function") {
      hooks[event](...args);
    }
  });

  await page.exposeFunction("handleDownload", onDownload);

  // These run in the scope of the loaded page
  await page.evaluate(`window.parameters = ${JSON.stringify(parameters)};`);
  await page.evaluate(() => {
    let frameCount = 0;
    const runtime = window.run("df", window.parameters, { isPreview: false });

    runtime.on("download", ({ data, name, mimeType }) => {
      const isBlob = data instanceof Blob;

      // Node.js has no concept of blob data, so we need to make
      // sure to convert it to an array buffer using the file reader
      // API before sending the data to the Node process.
      if (isBlob) {
        const reader = new FileReader();

        reader.onload = () => {
          handleDownload({
            data: reader.result,
            name,
            mimeType
          });
        };

        reader.readAsBinaryString(data);
      } else {
        handleDownload({ data, name, mimeType });
      }
    });

    runtime.on("afterHandleFrame", () => {
      frameCount++;
      emit("frame", frameCount);
    });

    runtime.on("afterHandleDone", () => {
      emit("done");
    });
  });
};
