import { ImageData } from "./types/gl";

const vertShaderSource = require("./shader/simple_image.vert");
const fragShaderSource = require("./shader/simple_image.frag");

const FLOAT_BYTE_SIZE = 4;

export const drawGL = (canvas: HTMLCanvasElement, image_data: ImageData) => {
  const { image, shaderPath, mvpMat } = image_data;
  const gl = canvas?.getContext("webgl2");
  if (!gl) {
    console.log("WebGL unavailable");
    return;
  }

  const aspect = image.naturalWidth / image.naturalHeight;
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
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

  // Uniform variable buffer
  const mvpUBO = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, mvpUBO);
  gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(mvpMat), gl.DYNAMIC_DRAW);

  // Texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST
  );
  gl.generateMipmap(gl.TEXTURE_2D);

  // Shader
  const createShader = (
    shaderType: number,
    shaderSource: string
  ): WebGLShader | undefined => {
    const shader = gl.createShader(shaderType);
    if (!shader) {
      console.log("Failed to create shader");
      return;
    }
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        "An error occurred compiling the shaders : " +
          gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return;
    }
    return shader;
  };

  const vertexShader = createShader(gl.VERTEX_SHADER, vertShaderSource);
  if (!vertexShader) {
    return;
  }
  const fragShader = createShader(gl.FRAGMENT_SHADER, fragShaderSource);
  if (!fragShader) {
    gl.deleteShader(vertexShader);
    return;
  }
  const program = gl.createProgram();
  if (!program) {
    console.log("Failed to create gl program.");
    return;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  const render = () => {
    // bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
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

    // bind texture
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // bind shader
    gl.useProgram(program);

    // draw
    gl.clearColor(0, 0, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // free
    gl.disableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.useProgram(null);

    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
  console.log("Finish drawGL");
};
