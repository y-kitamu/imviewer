import { VertexProperty } from "../types/shader";
import { VertexSchema, UniformSchema } from "../types/json";

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
 * Calculate number of elements (attributes) in a single vertex.
 */
export const _calcNumberOfElements = (verticesProperty: VertexProperty[]) => {
  return verticesProperty.reduce(
    (prev: number, cur: VertexProperty) =>
      prev + cur.dataTypeSize * cur.arrayLength,
    0
  );
};
