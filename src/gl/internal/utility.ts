import { Internal } from "../types/shader";
import { RenderMode, VertexSchema, UniformSchema } from "../types/schemas";

/**
 *
 */
export const _getRenderMode = (
  gl: WebGL2RenderingContext,
  renderModeStr: RenderMode | undefined
): number => {
  if (renderModeStr == undefined) {
    return gl.TRIANGLE_STRIP;
  }
  switch (renderModeStr) {
    case "POINTS":
      return gl.POINTS;
    case "LINES":
      return gl.LINES;
    case "LINE_LOOP":
      return gl.LINE_LOOP;
    case "TRIANGLES":
      return gl.TRIANGLES;
    case "TRIANGLE_STRIP":
      return gl.TRIANGLE_STRIP;
    case "TRIANGLE_FAN":
      return gl.TRIANGLE_FAN;
  }
  throw new Error(`Unsupported render mode : ${renderModeStr}`);
};

/**
 * Search data named `variableName` in json schemas.
 */
export const _searchDataSchema = (
  variableName: string,
  dataSchemas: (VertexSchema | UniformSchema)[]
) => {
  for (const elem of dataSchemas) {
    if (elem.variableName == variableName) {
      return elem;
    }
  }
  throw new Error(`Can not find buffer elements of name : ${variableName}.`);
};

/**
 * Calculate number of vertices
 */
export const _calcNumberOfVertices = (
  vertex: Internal.VertexProperty,
  vertexSchemas: VertexSchema[]
) => {
  const buffer = _searchDataSchema(vertex.name, vertexSchemas);
  return (
    Number(buffer.data?.length) / (vertex.dataTypeSize * vertex.arrayLength)
  );
};

/**
 * Calculate number of elements (attributes) in a single vertex.
 */
export const _calcNumberOfElements = (
  verticesProperty: Internal.VertexProperty[]
) => {
  return verticesProperty.reduce(
    (prev: number, cur: Internal.VertexProperty) =>
      prev + cur.dataTypeSize * cur.arrayLength,
    0
  );
};
