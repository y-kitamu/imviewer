import { RenderMode } from "../../gl/types/schemas";

/**
 * Definition of input json schemas.
 */
export type PartsType = "image" | "point" | "line" | "arrow";

export type JsonSchema = {
  partsType: PartsType;
  renderMode?: RenderMode;
  imageFilename?: string;
  datas: {
    variableName: string;
    data: number[];
  }[];
};
