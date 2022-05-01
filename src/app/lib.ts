import * as platform from "platform";

export const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash;
};

export const basename = (filePath: string): string | undefined => {
  if (platform.os.startsWith("Windows")) {
    return filePath.split("\\").at(-1);
  } else {
    return filePath.split("/").at(-1);
  }
};
