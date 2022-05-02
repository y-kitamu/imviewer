import { basename } from "../lib";
import { loadImage } from "../../gl/gl";

export const registerImage = async (
  gl: WebGL2RenderingContext,
  inputFile: File
) => {
  const image = await readImage(inputFile);
  const fileBasename = basename(image.src);
  loadImage(gl, fileBasename, image);
  return fileBasename;
};

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
