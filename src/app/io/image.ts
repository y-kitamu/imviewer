import { basename } from "../lib";
import { isImageLoaded, loadImage } from "../../gl/gl";
import { ImageProperty } from "../types/io";
import { Matrix4 } from "three";

export const registerImage = async (
  gl: WebGL2RenderingContext,
  inputFile: File
): Promise<ImageProperty | undefined> => {
  const image = await readImage(inputFile);
  const fileBasename = basename(inputFile.name);
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

export const convertImagePropertyToImage = (
  imageProperty: ImageProperty,
  row: number,
  col: number,
  scale?: { [key: string]: number },
  mvpMats?: { [key: string]: Matrix4 }
) => {};

const readImage = (inputFile: File) =>
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
