import { WidgetsBase } from "./widgets";

// OpenGL drawable object. (shader, array buffer, texture and uniform buffer is set up.)
export type Drawable = {
  widget: WidgetsBase;
  program: WebGLProgram;
  buffers: WebGLBuffer[];
  textures: WebGLTexture[];
  ubuffers: WebGLBuffer[];
};
