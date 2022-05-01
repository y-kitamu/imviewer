export type Shader = {
  program: WebGLProgram;
  property: ShaderProperty;
};

export type ShaderProperty = {
  vertices: VertexProperty[];
  uniforms: UniformProperty[];
  samplers: SamplerProperty[];
  uniformBlocks: UniformBlockProperty[];
};

export type VertexProperty = {
  location: number;
  dataTypeSize: number;
  arrayLength: number;
  name: string;
};

export type UniformProperty = {
  location: number;
  dataType: string;
  dataTypeSize: number;
  arrayLength: number;
  name: string;
};

export type UniformBlockProperty = {
  location: number;
  objectSize: number;
  arrayLength: number;
  name: string;
  elements: {
    baseAlign: number;
    alignOffset: number;
    arrayLength: number;
    name: string;
  }[];
};

export type SamplerProperty = {
  location: number;
  samplerType: string;
  arrayLength: number;
  name: string;
};
