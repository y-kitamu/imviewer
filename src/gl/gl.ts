import { ImageContext } from "../types/gl";

export const drawGL = (canvas: HTMLCanvasElement, image_data: ImageContext) => {
  const { image, shader, mvpMat } = image_data;
  const gl = canvas?.getContext("webgl2");
  if (!gl) {
    console.log("WebGL unavailable");
    return;
  }

  // Shader program
  const program = compileShader(gl, shader.shaderPath);
  if (program == undefined) {
    return;
  }
  // Vertex array buffer
  const buffers = shader.arrayBuffer.prepareBuffer(
    gl,
    image.width / image.height
  );
  // Uniform variable buffer
  const ubuffers = shader.uniformBuffer.prepareBuffer(gl, program, [
    mvpMat.elements,
  ]);
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

  const render = () => {
    // bind buffer
    shader.arrayBuffer.drawBuffer(gl, buffers);
    // bind uniform buffer
    shader.uniformBuffer.updateBuffer(gl, [mvpMat.elements], ubuffers);
    shader.uniformBuffer.drawBuffer(gl, ubuffers);
    // bind texture
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // bind shader
    gl.useProgram(program);

    // draw
    gl.clearColor(0, 0, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // free
    shader.arrayBuffer.unbind(gl);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.useProgram(null);

    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};

const compileShader = (
  gl: WebGL2RenderingContext,
  shaderPath: string
): WebGLProgram | undefined => {
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

  const vertShaderSource = require(`${shaderPath}.vert`);
  const fragShaderSource = require(`${shaderPath}.frag`);
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
  return program;
};
