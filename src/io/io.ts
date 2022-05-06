import { Matrix4 } from "three";
import { Widget } from "../app/types/widget";
import { _convertImagePropertyToWidget, _loadImage } from "./internal/image";
import {
  _convertJsonSchemaToLine,
  _convertJsonSchemaToPoint,
  _loadJson,
} from "./internal/json";
import { ImageProperty, JsonSchema } from "./types/io";

/**
 * Load json and return loaded json schema.
 * @param inputFile
 */
export const loadJson = async (inputFile: File): Promise<JsonSchema[]> => {
  return await _loadJson(inputFile);
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
): Promise<ImageProperty | undefined> => {
  return await _loadImage(gl, inputFile);
};

/**
 * Convert json schema to `Widget`.
 */
export const convertJsonSchemaToWidget = (
  schema: JsonSchema,
  imageProperty: ImageProperty,
  row: number[],
  col: number[],
  scale: { [key: string]: number }[] = [],
  mvpMats: { [key: string]: Matrix4 }[] = []
): Widget => {
  switch (schema.partsType) {
    case "image" || "point" || "arrow":
      return _convertJsonSchemaToPoint(
        schema,
        imageProperty,
        row[0],
        col[0],
        scale[0],
        mvpMats[0]
      );
    case "point":
      return _convertJsonSchemaToLine(schema, row, col, scale, mvpMats);
  }
  throw new Error(`Unsupported parts type : ${schema.partsType}`);
};

/**
 * Convert image property to `Widget`
 */
export const convertImagePropertyToWidget = (
  imageProperty: ImageProperty,
  row: number,
  col: number,
  scale?: { [key: string]: number },
  mvpMats?: { [key: string]: Matrix4 }
): Widget => {
  return _convertImagePropertyToWidget(imageProperty, row, col, scale, mvpMats);
};

export const updateWidgetUniforms = () => {};
