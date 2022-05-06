import { Matrix4 } from "three";
import platform from "platform";
import { isImageLoaded, loadImage } from "../../gl/gl";
import { Widget } from "../../app/types/widget";
import { ImageProperty, JsonSchema } from "../types/io";
import { DEFAULT_SHADERS, MVP_VARNAME } from "../constants";
import { _convertJsonSchemaToPoint } from "./json";

export const _loadImage = async (
  gl: WebGL2RenderingContext,
  inputFile: File
): Promise<ImageProperty | undefined> => {
  const image = await _readImage(inputFile);
  const fileBasename = _basename(inputFile.name);
  if (isImageLoaded(fileBasename)) {
    return;
  }
  loadImage(gl, fileBasename, image);
  return {
    fileBasename,
    width: image.width,
    height: image.height,
  };
};

export const _convertImagePropertyToWidget = (
  imageProperty: ImageProperty,
  row: number,
  col: number,
  scale?: { [key: string]: number },
  mvpMats?: { [key: string]: Matrix4 }
): Widget => {
  const json = _getDefaultImageJsonSchema(imageProperty);
  return _convertJsonSchemaToPoint(
    json,
    imageProperty,
    row,
    col,
    scale,
    mvpMats
  );
};

const _readImage = (inputFile: File) =>
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

const _basename = (filePath: string): string => {
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

const _getDefaultImageJsonSchema = (
  imageProperty: ImageProperty
): JsonSchema => {
  const { width, height } = imageProperty;
  return {
    partsType: "image",
    renderMode: "TRIANGLE_STRIP",
    imageFilename: imageProperty.fileBasename,
    datas: [
      {
        variableName: "aPos",
        data: [0, 0, 0, width, 0, 0, 0, height, 0, width, height, 0],
      },
      {
        variableName: "aTexCoord",
        data: [0, 0, 1, 0, 0, 1, 1, 1],
      },
    ],
  };
};
