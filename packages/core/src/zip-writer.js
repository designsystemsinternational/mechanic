import JSZip from "jszip";

/**
 * Handles the export of animated design functions into a zip file
 * containing the single frames of the animation.
 *
 * This is useful if a user wants the highest quality output of a
 * video for further editing, as this does not use any compression
 * on the moving images.
 */
export class ZipWriter {
  constructor() {
    this.zipArchive = new JSZip();
    this.frameCounter = 0;
  }

  /**
   * Handles adding a frame to the ZIP archive
   *
   * @params {HTMLCanvasElement} canvas
   */
  addFrame(canvas) {
    const fileNumber = this.frameCounter.toString().padStart(10, "0");
    const fileName = `frame-${fileNumber}.png`;

    const canvasDataUrl = canvas.toDataURL("image/png");
    const buffer = canvasDataUrl.split(",")[1];

    this.zipArchive.file(fileName, buffer, { base64: true });
    this.frameCounter++;
  }

  /**
   * Finalizes the ZIP Archive and returns a blob of the file.
   *
   * @returns {Promise<Blob>}
   */
  async complete() {
    const archive = await this.zipArchive.generateAsync({ type: "blob" });
    return archive;
  }
}
