/**
 * Prepares the function to be run in the headless browser
 * context to start the mechanic rendering.
 *
 * @param {string} functionName
 */
export const executeDesignFunction = () => {
  const runtime = window.run('df', {}, { isPreview: false });

  runtime.on("download", ({ data, name, mimeType }) => {
    const isBlob = data instanceof Blob;

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
};
