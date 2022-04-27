import { FLOAT_BYTE_SIZE, SIMPLE_IMAGE_SHADER } from "../constants";
import { Shader, UniformBuffer, VertexArrayBuffer } from "../types/shader";
import { ImageWidget, WidgetsBase } from "../types/widgets";

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
    widget: WidgetsBase
  ): WebGLBuffer[] => {
    const image = widget as ImageWidget;
    if (image.image == null) {
      return [];
    }
    const aspect = image.image.width / image.image.height;
    let dx = 0.5;
    let dy = 0.5;
    if (aspect < 1.0) {
      dx *= aspect;
    } else if (aspect > 1.0) {
      dy /= aspect;
    }

    // Vertex Array buffer
    // Flip upside down because OpenGL expect the first element of image-buffer correspond to
    // lower-left and subsequent elements progressing left-to-right.
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

  prepareTexture: (gl: WebGL2RenderingContext, widget: WidgetsBase) => {
    const image = widget as ImageWidget;
    if (image.image == null) {
      return [];
    }
    const texture = gl.createTexture();
    if (texture == null) {
      return [];
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image.image
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_NEAREST
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    return [texture];
  },

  drawBuffer: (
    gl: WebGL2RenderingContext,
    buffers: WebGLBuffer[],
    textures: WebGLTexture[]
  ) => {
    // bind buffer
    if (buffers.length > 0) {
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
    }
    // bind texture
    if (textures.length > 0) {
      gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    }
  },

  unbind: (gl: WebGL2RenderingContext) => {
    gl.disableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
    gl.bindTexture(gl.TEXTURE_2D, null);
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
