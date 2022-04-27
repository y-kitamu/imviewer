import { WidgetsBase } from "./widgets";

export type Drawable = {
  widgets: WidgetsBase;
  program: WebGLProgram;
  buffers: WebGLBuffer[];
  textures: WebGLTexture[];
  ubufferes: WebGLBuffer[];
};
