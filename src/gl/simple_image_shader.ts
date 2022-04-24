import { FLOAT_BYTE_SIZE, SIMPLE_IMAGE_SHADER } from "../constants";
import { Shader, UniformBuffer, VertexArrayBuffer } from "../types/gl";

const updateUniformBufferImpl = (
  gl: WebGL2RenderingContext,
  elem: number[][],
  buffers: WebGLBuffer[]
) => {
  gl.bindBuffer(gl.UNIFORM_BUFFER, buffers[0]);
  gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(elem[0]), gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.UNIFORM_BUFFER, null);
};

const SimpleImageArrayBuffer: VertexArrayBuffer = {
  prepareBuffer: (
    gl: WebGL2RenderingContext,
    aspectRatio?: number
  ): WebGLBuffer[] => {
    const aspect = aspectRatio ? aspectRatio : 1.0;
    let dx = 0.5;
    let dy = 0.5;
    if (aspect < 1.0) {
      dx *= aspect;
    } else if (aspect > 1.0) {
      dy /= aspect;
    }

    // Vertex Array buffer
    // Flip upside down because OpenGL expect the first element of image-buffer correspond to lower-left
    // and subsequent elements progressing left-to-right.
    // https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/glTexImage2D.xhtml
    // prettier-ignore
    const vertex = [
      -dx, -dy, 0.0, 0.0, 1.0, // bottom-left
      dx, -dy, 0.0, 1.0, 1.0, // bottom-right
        -dx, dy, 0.0, 0.0, 0.0, // top-left
      dx, dy, 0.0, 1.0, 0.0,  //top-right
    ];

    const buffer = gl.createBuffer();
    if (buffer == null) {
      return [];
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

    return [buffer];
  },

  drawBuffer: (gl: WebGL2RenderingContext, buffers: WebGLBuffer[]) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * FLOAT_BYTE_SIZE, 0);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(
      1,
      2,
      gl.FLOAT,
      false,
      5 * FLOAT_BYTE_SIZE,
      3 * FLOAT_BYTE_SIZE
    );
    gl.enableVertexAttribArray(1);
  },

  unbind: (gl: WebGL2RenderingContext) => {
    gl.disableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
  },
};

const SimpleImageUniformBuffer: UniformBuffer = {
  prepareBuffer: (
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    elem: number[][]
  ): WebGLBuffer[] => {
    const mvpUBOIdx = gl.getUniformBlockIndex(program, "matrix");
    gl.uniformBlockBinding(program, mvpUBOIdx, 0);
    const mvpUBO = gl.createBuffer();
    if (mvpUBO == null) {
      return [];
    }
    const buffers = [mvpUBO];
    updateUniformBufferImpl(gl, elem, buffers);
    return buffers;
  },

  updateBuffer: (
    gl: WebGL2RenderingContext,
    elem: number[][],
    buffers: WebGLBuffer[]
  ) => {
    updateUniformBufferImpl(gl, elem, buffers);
  },

  drawBuffer: (gl: WebGL2RenderingContext, buffers: WebGLBuffer[]) => {
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, buffers[0]);
  },
};

export const SimpleImageShader: Shader = {
  shaderPath: SIMPLE_IMAGE_SHADER,
  arrayBuffer: SimpleImageArrayBuffer,
  uniformBuffer: SimpleImageUniformBuffer,
};
