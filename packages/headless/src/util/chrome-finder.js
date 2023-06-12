import fs from "node:fs";
import { execFileSync } from "node:child_process";

/**
 * Chacks of a file can be accessed
 *
 * @param {string|undefined} file
 * @returns boolean
 */
const canAccess = file => {
  if (!file) return false;

  try {
    fs.accessSync(file);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check for Chrome Insatallation on macOS
 */
const checkMacOs = () => {
  if (process.env.CHROME_PATH && canAccess(process.env.CHROME_PATH))
    return process.env.CHROME_PATH;

  const commonPaths = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
  ];

  for (const chromePath of commonPaths) {
    if (chromePath && canAccess(chromePath)) return chromePath;
  }
};

/**
 * Check for Google Chrome Path on linux
 */
const checkLinux = () => {
  if (process.env.CHROME_PATH && canAccess(process.env.CHROME_PATH))
    return process.env.CHROME_PATH;

  const executables = ["google-chrome-stable", "google-chrome"];

  const newLineRegex = /\r?\n/;
  const installations = [];

  executables.forEach(executable => {
    try {
      const chromePath = execFileSync("which", [executable], { stdio: "pipe" })
        .toString()
        .split(newLineRegex)[0];
      if (canAccess(chromePath)) {
        installations.push(chromePath);
      }
    } catch (e) {
      // Not installed
    }
  });

  if (installations.length > 0) return installations[0];
};

/**
 * Check for Google Chrome Path on Windows
 */
const checkWindows = () => {
  if (process.env.CHROME_PATH && canAccess(process.env.CHROME_PATH))
    return process.env.CHROME_PATH;

  const sep = path.sep;
  const installations = [];

  const suffixes = [
    `${sep}Google${sep}Chrome SxS${sep}Application${sep}chrome.exe`,
    `${sep}Google${sep}Chrome${sep}Application${sep}chrome.exe`
  ];

  const prefixes = [
    process.env.LOCALAPPDATA,
    process.env.PROGRAMFILES,
    process.env["PROGRAMFILES(X86)"]
  ].filter(Boolean);

  prefixes.forEach(prefix =>
    suffixes.forEach(suffix => {
      const chromePath = path.join(prefix, suffix);
      if (canAccess(chromePath)) {
        installations.push(chromePath);
      }
    })
  );

  if (installations.length > 0) return installations[0];
};

/**
 * Finds the path to a Chrome installations to pass to Puppeteer for usage.
 * Users can overwrite this by setting the CHROME_PATH env variable.
 *
 * @returns {string|null}
 */
export const findChrome = () => {
  const os = process.platform;

  switch (os) {
    case "darwin": {
      return checkMacOs();
    }
    case "linux": {
      return checkLinux();
    }
    case "win32": {
      return checkWindows();
    }
    default: {
      throw new Error(`Unsupported platform ${os}`);
    }
  }
};
