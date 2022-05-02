/**
 * Interface data type definitions.
 */

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
  data?: number[];
};

export type UniformSchema = VertexSchema;

export type UniformBlockSchema = {
  // Variable name defined in GLSL.
  variableName: string;
  data?: { variableName: string; data: number[] }[];
};

export type SamplerSchema = {
  // Variable name defined in GLSL.
  variableName: string;
};

export type WidgetSchema = {
  id: string;
  shaderPath: string;
  renderMode?: RenderMode;
  vertices?: VertexSchema[];
  uniforms?: UniformSchema[];
  unifromBlocks?: UniformBlockSchema[];
};
