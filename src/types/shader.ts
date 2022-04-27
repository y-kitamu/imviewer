import { WidgetsBase } from "./widgets";

export type Shader = {
  shaderPath: string;
  arrayBuffer: VertexArrayBuffer;
  uniformBuffer: UniformBuffer;
};

export type VertexArrayBuffer = {
  prepareBuffer: (
    gl: WebGL2RenderingContext,
    widget: WidgetsBase
  ) => WebGLBuffer[];
  prepareTexture?: (
    gl: WebGL2RenderingContext,
    widget: WidgetsBase
  ) => WebGLTexture[];
  drawBuffer: (
    gl: WebGL2RenderingContext,
    buffers: WebGLBuffer[],
    textures: WebGLTexture[]
  ) => void;
  unbind: (gl: WebGL2RenderingContext) => void;
};

export type UniformBuffer = {
  prepareBuffer: (
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    widget: WidgetsBase
  ) => WebGLBuffer[];

  updateBuffer: (
    gl: WebGL2RenderingContext,
    widget: WidgetsBase,
    buffers: WebGLBuffer[]
  ) => void;

  drawBuffer: (gl: WebGL2RenderingContext, buffers: WebGLBuffer[]) => void;
};
