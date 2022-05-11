/**
 * Type definitions for data loaded from files.
 */
import { PartsType, RenderMode } from "../../gl/types/schemas";

/**
 * Schema of input JSON file.
 */
export type JsonSchema = {
  schemaId?: string;
  partsType: PartsType;
  renderMode?: RenderMode;
  datas: {
    variableName: string;
    data: number[];
  }[];
};

/**
 * Properties of input shader file.
 */
export type ShaderProperty = {
  partsType: PartsType;
  shaderStem: string;
};
