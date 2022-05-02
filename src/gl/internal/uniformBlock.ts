import { UniformBlockSchema } from "../types/schemas";
import { Internal } from "../types/shader";

export const _prepareUniformBlocks = (
  gl: WebGL2RenderingContext,
  uniformBlockSchemas: UniformBlockSchema[],
  uniformBlockProperties: Internal.UniformBlockProperty[]
): WebGLBuffer[] => {
  return [];
};

export const _drawUniformBlocks = (
  gl: WebGLRenderingContext,
  uniformBlockProperties: Internal.UniformBlockProperty[],
  buffers: WebGLBuffer[]
) => {};
