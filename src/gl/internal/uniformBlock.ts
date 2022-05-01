import { UniformBlockSchema } from "gl/types/schemas";
import { UniformBlockProperty } from "gl/types/shader";

export const _prepareUniformBlocks = (
  gl: WebGL2RenderingContext,
  uniformBlockSchemas: UniformBlockSchema[],
  uniformBlockProperties: UniformBlockProperty[]
): WebGLBuffer[] => {
  return [];
};

export const _drawUniformBlocks = (
  gl: WebGLRenderingContext,
  uniformBlockProperties: UniformBlockProperty[],
  buffers: WebGLBuffer[]
) => {};
