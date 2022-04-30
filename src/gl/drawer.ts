/**
 * Scripts for preparing (binding) and drawing OpenGL objects (vertex, uniform, sampler, etc.).
 */
import { VertexProperty } from "../types/shader";
import { JsonBufferElement } from "../types/json";

const prepareVertices = (
  gl: WebGL2RenderingContext,
  jsonBufferElems: JsonBufferElement[],
  verticesProperty: VertexProperty[]
) => {
  if (jsonBufferElems.length != verticesProperty.length) {
    throw new Error(
      "Number of buffer elements in json must be equal to number of vertex definitions in GLSL"
    );
  }

  const searchBufferElements = (variableName: string) => {
    for (const elem of jsonBufferElems) {
      if (elem.variableName == variableName) {
        return elem;
      }
    }
    throw new Error(`Can not find buffer elements of name : ${variableName}.`);
  };

  const calcDataCount = () => {};
};
