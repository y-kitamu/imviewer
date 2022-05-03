import * as platform from "platform";

export const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash;
};

export const basename = (filePath: string): string => {
  let bname = undefined;
  if (platform.os?.family?.startsWith("Windows")) {
    bname = filePath.split("\\").at(-1);
  } else {
    bname = filePath.split("/").at(-1);
  }
  if (bname == undefined) {
    throw new Error(`Failed to get file basename : ${filePath}`);
  }
  return bname;
};
