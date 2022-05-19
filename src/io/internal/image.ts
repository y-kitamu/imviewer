import platform from "platform";
import { JsonSchema } from "../types/io";
import { _convertJsonSchemaToWidget } from "./json";

export const _getDefaultImageJsonSchema = (
  image: HTMLImageElement
): JsonSchema => {
  const { width, height } = image;
  // prettier-ignore
  return {
    partsType: "image",
    renderMode: "TRIANGLE_STRIP",
    datas: [
      {
        variableName: "aPos",
        data: [
          0, height, 0,
          width, height, 0,
          0, 0, 0,
          width, 0, 0
        ],
      },
      {
        variableName: "aTexCoord",
        data: [0, 1, 1, 1, 0, 0, 1, 0],
      },
    ],
  };
};

export const _readImage = (inputFile: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(inputFile);
    reader.onloadend = () => {
      if (!(typeof reader.result === "string")) {
        reject(new Error("Failed to get image URL"));
        return;
      }
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        resolve(image);
      };
    };
  });

export const _basename = (filePath: string): string => {
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
