import { WidgetsBase } from "./widgets";

export type ShaderParseResult = {
  vertices: VertexProperty[];
  uniforms: UniformProperty[];
  samplers: SamplerProperty[];
  uniformBlocks: UniformBlockProperty[];
};

export type VertexProperty = {
  location: number;
  elemCount: number;
  name: string;
};

export type UniformProperty = {
  location: number;
  elemCount: number;
  name: string;
};

export type UniformBlockProperty = {
  location: number;
  objectSize: number;
  name: string;
  elements: {
    baseAlign: number;
    alignOffset: number;
    elemCount: number;
    name: string;
  }[];
};

export type SamplerProperty = {
  location: string;
  samplerType: string;
  name: string;
};

export type Shader = {
  shaderPath: string;
  parseResult: ShaderParseResult;
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
