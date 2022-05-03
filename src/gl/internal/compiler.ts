import {
  VERTEX_SHADER_SOURCES,
  SHADER_DIR,
  FRAGMENT_SHADER_SOURCES,
} from "../constants";

export const _compileShader = (
  gl: WebGL2RenderingContext,
  shaderPath: string
): WebGLProgram => {
  console.log(`Start compiling shader : ${shaderPath}`);
  const createShader = (
    shaderType: number,
    shaderSource: string
  ): WebGLShader | undefined => {
    const shader = gl.createShader(shaderType);
    if (!shader) {
      throw new Error("Failed to create shader");
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

  const stem = shaderPath.replace(SHADER_DIR, "");
  const vertShaderSource = VERTEX_SHADER_SOURCES[stem];
  const fragShaderSource = FRAGMENT_SHADER_SOURCES[stem];
  const vertexShader = createShader(gl.VERTEX_SHADER, vertShaderSource);
  if (!vertexShader) {
    throw new Error("Failed to create vertex shader");
  }
  const fragShader = createShader(gl.FRAGMENT_SHADER, fragShaderSource);
  if (!fragShader) {
    gl.deleteShader(vertexShader);
    throw new Error("Failed to create fragment shader");
  }
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragShader);
    throw new Error("Failed to create glsl program.");
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  return program;
};
