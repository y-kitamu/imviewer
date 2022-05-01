export type WidgetType = "image" | "point" | "line" | "arrow";
export type RenderMode =
  | "POINTS"
  | "LINES"
  | "LINE_LOOP"
  | "TRIANGLES"
  | "TRIANGLE_STRIP"
  | "TRIANGLE_FAN";

export type VertexSchema = {
  // Variable name defined in GLSL.
  variableName: string;
  // If true, elements of `data` are directly passed to gpu.
  // Otherwise, elements normalized by `imageFile` data are passed to gpu.
  normalized?: boolean;
  // Image data associated with the points or lines.
  imageFilename?: string;
  data?: number[];
};

export type UniformSchema = VertexSchema;

export type UniformBlockSchema = {
  // Variable name defined in GLSL.
  variableName: string;
  // If true, elements of `data` are directly passed to gpu.
  // Otherwise, elements normalized by `imageFile` data are passed to gpu.
  normalized?: boolean;
  // Image data associated with the points or lines.
  imageFilename?: string;
  data?: { variableName: string; data: number[] }[];
};

export type SamplerSchema = {
  // Variable name defined in GLSL.
  variableName: string;
  imageFilename?: string;
};

export type WidgetSchema = {
  id: string;
  widgetType: WidgetType;
  shaderPath: string;
  renderMode?: RenderMode;
  vertices?: VertexSchema[];
  uniforms?: UniformSchema[];
  unifromBlocks?: UniformBlockSchema[];
  samplers?: SamplerSchema[];
};
