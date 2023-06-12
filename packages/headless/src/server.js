import express from "express";
import portfinder from "portfinder";

/**
 * Starts an express server serving a given static dir.
 *
 * @param {string} staticDir
 * @returns Promise<object>
 */
export const createServer = async (staticDir = '/') => {
  portfinder.basePort = 3000;
  const port = await portfinder.getPortPromise();

  const app = express();
  const { server } = await new Promise((res, rej) => {
    const server = app.listen(port, err => rej(err));

    return res({ server });
  });

  app.use(express.static(staticDir));

  return {
    server,
    port,
    url: `http://localhost:${port}`,
  };
};

/**
 * Closes an express server.
 *
 * @param {Server} server
 */
export const shutdownServer = (server) => server.close();
