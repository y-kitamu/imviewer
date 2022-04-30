import { RenderMode, WidgetType } from "./widgets";

export type JsonBufferElement = {
  // Variable name defined in GLSL.
  variableName: string;
  // If true, elements of `data` are directly passed to gpu.
  // Otherwise, elements normalized by `imageFile` data are passed to gpu.
  normalized?: boolean;
  // Image data associated with the points or lines.
  imageFilename?: string;
  data?: number[] | { variableName: string; data: number[] }[];
};

export type JsonSamplerElement = {
  // Variable name defined in GLSL.
  variableName: string;
  // Image filename to be loaded
  imageFilename: string;
};

export type InputJsonSchema = {
  widgetType: WidgetType;
  shader?: string;
  renderMode?: RenderMode;
  vertices?: JsonBufferElement[];
  uniforms?: JsonBufferElement[];
  unifromBlocks?: JsonBufferElement[];
  samplers?: JsonSamplerElement[];
}[];
