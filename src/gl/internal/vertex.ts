/**
 * Scripts for preparing (binding) and drawing vertex buffer object.
 */
import { VertexProperty } from "../types/shader";
import { VertexSchema } from "../types/json";
import { FLOAT_BYTE_SIZE } from "../constants";
import { _calcNumberOfElements, _searchDataSchema } from "./utility";

/**
 * Create vertex buffer object (vbo) for each vertex.
 */
export const _prepareVertices = (
  gl: WebGL2RenderingContext,
  vertexSchemas: VertexSchema[],
  vertexProperties: VertexProperty[]
): WebGLBuffer => {
  // assertion check
  if (vertexSchemas.length != vertexProperties.length) {
    throw new Error(
      "Number of buffer elements in json must be equal to number of vertex definitions in GALLS"
    );
  }

  const calcNumberOfVertices = () => {
    const vertex = vertexProperties[0];
    const buffer = _searchDataSchema(vertex.name, vertexSchemas);
    return (
      Number(buffer.data?.length) / (vertex.dataTypeSize * vertex.arrayLength)
    );
  };

  // Number of elements in a single vertex.
  const numElem = _calcNumberOfElements(vertexProperties);
  // Number of vertices
  const numVert = calcNumberOfVertices();
  // Array passed to gpu
  const array = new Float32Array(numVert * numElem);

  // Copy (format) buffer data in json to `array`.
  let offset = 0;
  for (let i = 0; i < vertexProperties.length; i++) {
    const vertex = vertexProperties[i];
    const elemSize = vertex.dataTypeSize * vertex.arrayLength;
    const buffer = _searchDataSchema(vertex.name, vertexSchemas);
    if (buffer.data == undefined) {
      throw new Error(`Buffer is empty : ${vertex.name}`);
    }
    let srcIdx = 0;
    let dstIdx = 0;
    for (let j = 0; j < numElem; j++, dstIdx += numElem) {
      for (let k = 0; k < elemSize; k++, srcIdx++) {
        array[dstIdx + k + offset] = buffer.data[srcIdx];
      }
    }
    offset += elemSize;
  }

  // create buffer
  const buffer = gl.createBuffer();
  if (buffer == null) {
    throw new Error("Failed to create buffer");
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

  return buffer;
};

export const _drawVertices = (
  gl: WebGLRenderingContext,
  vertexProperties: VertexProperty[],
  buffer: WebGLBuffer
) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  let numElem = _calcNumberOfElements(vertexProperties);
  let offset = 0;
  for (const vert of vertexProperties) {
    const elemSize = vert.dataTypeSize * vert.arrayLength;
    gl.vertexAttribPointer(
      vert.location,
      elemSize,
      gl.FLOAT,
      false,
      numElem * FLOAT_BYTE_SIZE,
      offset
    );
    gl.enableVertexAttribArray(vert.location);
    offset += elemSize;
  }
};
