import { Matrix4 } from "three";
import { Widget } from "../app/types/widget";
import { isImageLoaded, loadImage as loadImageToGL } from "../gl/gl";
import {
  _basename,
  _getDefaultImageJsonSchema,
  _readImage,
} from "./internal/image";
import {
  _convertJsonSchemaToLine,
  _convertJsonSchemaToWidget,
} from "./internal/json";
import { JsonSchema } from "./types/io";

/**
 * Load json and return loaded json schema.
 * @param inputFile
 */
export const loadJson = async (inputFile: File): Promise<JsonSchema[]> => {
  return new Promise<JsonSchema[]>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result;
      if (text == null) {
        return;
      }
      try {
        let json: JsonSchema | JsonSchema[] = JSON.parse(text as string);
        if (!Array.isArray(json)) {
          json = [json];
        }
        resolve(json);
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(inputFile);
  });
};

/**
 * Load image of `inputFile`, register the texture to gl internal state
 * and return image property of `inputFile`.
 * If `inputFile` has been already registered to gl internal, return undefined.
 * @param gl
 * @param inputFile
 */
export const loadImage = async (
  gl: WebGL2RenderingContext,
  inputFile: File
): Promise<{ [key: string]: HTMLImageElement } | undefined> => {
  const fileBasename = _basename(inputFile.name);
  if (isImageLoaded(fileBasename)) {
    return;
  }
  const image = await _readImage(inputFile);
  loadImageToGL(gl, fileBasename, image);
  return { [fileBasename]: image };
};

/**
 * Convert json schema to `Widget`.
 */
export const convertJsonSchemaToWidget = (
  schema: JsonSchema,
  row: number[],
  col: number[],
  mvpMats: { [key: string]: Matrix4 }[] = []
): Widget => {
  switch (schema.partsType) {
    case "image":
    case "point":
    case "arrow":
      return _convertJsonSchemaToWidget(schema, row[0], col[0], mvpMats[0]);
    case "line":
      return _convertJsonSchemaToLine(schema, row, col, mvpMats);
  }
  throw new Error(`Unsupported parts type : ${schema.partsType}`);
};

/**
 * Convert image property to `Widget`
 */
export const convertImageToWidget = (
  image: HTMLImageElement,
  row: number,
  col: number,
  mvpMats?: { [key: string]: Matrix4 }
): Widget => {
  const json = _getDefaultImageJsonSchema(image);
  return _convertJsonSchemaToWidget(json, row, col, mvpMats);
};
