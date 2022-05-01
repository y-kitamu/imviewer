import { WidgetSchema } from "./schemas";
import { Shader } from "./shader";

export type Drawable = {
  widget: WidgetSchema;
  shader: Shader;
  vertexBuffer: WebGLBuffer;
  uniformBlockBuffers?: WebGLBuffer[];
  textures: { [key: string]: string }; // key : filePath, value: variable name
};
