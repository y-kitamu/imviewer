import { Matrix4 } from "three";

export type ImageContext = {
  image: HTMLImageElement;
  shader: Shader;
  mvpMat: Matrix4;
};

export type Shader = {
  shaderPath: string;
  arrayBuffer: VertexArrayBuffer;
  uniformBuffer: UniformBuffer;
};

export type VertexArrayBuffer = {
  prepareBuffer: (
    gl: WebGL2RenderingContext,
    aspectRatio?: number
  ) => WebGLBuffer[];
  drawBuffer: (gl: WebGL2RenderingContext, buffers: WebGLBuffer[]) => void;
  unbind: (gl: WebGL2RenderingContext) => void;
};

export type UniformBuffer = {
  prepareBuffer: (
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    elem: number[][]
  ) => WebGLBuffer[];

  updateBuffer: (
    gl: WebGL2RenderingContext,
    elem: number[][],
    buffers: WebGLBuffer[]
  ) => void;

  drawBuffer: (gl: WebGL2RenderingContext, buffers: WebGLBuffer[]) => void;
};
