import {
  unlink,
  readFile,
  writeFile,
  access,
  constants,
  open,
} from "fs/promises";
import { join, resolve } from "path";

const cacheDir = "cache";

export const getCache = async <T>(key: unknown): Promise<T | void> => {
  const searilizedKey = JSON.stringify(key);
  const hashedKey = Buffer.from(searilizedKey).toString("base64");
  const cacheFile = resolve(join(cacheDir, hashedKey)).replaceAll("=", "");

  try {
    // console.log("Key", cacheFile);
    await access(cacheFile, constants.R_OK);
  } catch (e) {
    console.info("no cached data file found");
    return;
  }

  if (process.env.OL_PURGE_CACHE == "true") {
    unlink(cacheFile);
    return;
  }
  const cachedData = JSON.parse(
    Buffer.from(await readFile(cacheFile, "utf-8"), "base64").toString("utf-8"),
  );

  return cachedData as T;
};

export const setCache = async (key: unknown, data: unknown) => {
  console.info("setting cache");

  const searilizedKey = JSON.stringify(key);
  const hashedKey = Buffer.from(searilizedKey).toString("base64");
  const cacheFile = resolve(join(cacheDir, hashedKey)).replaceAll("=", "");
  const fh = await open(
    cacheFile,
    constants.O_TRUNC | constants.O_WRONLY | constants.O_CREAT,
  );

  console.debug({ cacheFile });
  const searilizedData = Buffer.from(JSON.stringify(data)).toString("base64");

  try {
    await writeFile(fh, searilizedData, {
      encoding: "utf-8",
    });
    await fh.close();
  } catch (e) {
    console.info("Could not write the cache file");
    console.error(e);
    return;
  }
};
