/**
 * Scripts for preparing (binding) and drawing vertex buffer object.
 */
import { Internal } from "../types/shader";
import { VertexSchema } from "../types/schemas";
import { FLOAT_BYTE_SIZE } from "../constants";
import {
  _calcNumberOfElements,
  _calcNumberOfVertices,
  _searchDataSchema,
} from "./utility";

/**
 * Create vertex buffer object (vbo) for each vertex.
 */
export const _prepareVertices = (
  gl: WebGL2RenderingContext,
  vertexSchemas: VertexSchema[],
  vertexProperties: Internal.VertexProperty[]
): WebGLBuffer => {
  // Number of elements in a single vertex.
  const numElem = _calcNumberOfElements(vertexProperties);
  // Number of vertices
  const numVert = _calcNumberOfVertices(vertexProperties[0], vertexSchemas);
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
  {
    console.log("Vertex array = ");
    console.log(array);
  }
  return buffer;
};

export const _drawVertices = (
  gl: WebGLRenderingContext,
  vertexProperties: Internal.VertexProperty[],
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
      offset * FLOAT_BYTE_SIZE
    );
    gl.enableVertexAttribArray(vert.location);
    offset += elemSize;
  }
};
