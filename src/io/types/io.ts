/**
 * Type definitions for data loaded from files.
 */
import { RenderMode } from "../../gl/types/schemas";

export type PartsType = "image" | "point" | "line" | "arrow";

/**
 * Schema of input JSON file.
 */
export type JsonSchema = {
  partsType: PartsType;
  renderMode?: RenderMode;
  imageFilename?: string;
  datas: {
    variableName: string;
    data: number[];
  }[];
};

/**
 * Properties of input image data
 */
export type ImageProperty = {
  fileBasename: string;
  width: number;
  height: number;
};

/**
 * Properties of input shader file.
 */
export type ShaderProperty = {
  partsType: PartsType;
  shaderStem: string;
};
