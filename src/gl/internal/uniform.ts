/**
 * Scripts for preparing (binding) and drawing uniform variables.
 */

import { Internal } from "../types/shader";
import { UniformSchema } from "../types/schemas";
import { _searchDataSchema } from "./utility";

/**
 */
export const _prepareUniformVariables = (
  gl: WebGL2RenderingContext,
  uniformSchemas: UniformSchema[],
  uniformProperties: Internal.UniformProperty[]
) => {};

export const _drawUniformVariables = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniformSchemas: UniformSchema[],
  uniformProperties: Internal.UniformProperty[]
) => {
  const getUniformLoc = (name: string) => {
    const uniformLoc = gl.getUniformLocation(program, name);
    if (uniformLoc == null) {
      console.log(`Can not find uniform variable of name = ${name}`);
      return null;
    }
    return uniformLoc;
  };

  for (const uniform of uniformProperties) {
    const uniformElem = _searchDataSchema(uniform.name, uniformSchemas);
    if (uniformElem.data == null) {
      throw new Error(`Uniform variable is empty : ${uniform.name}`);
    }

    const loc = getUniformLoc(uniform.name);
    const arr = new Float32Array(uniformElem.data);
    const len = uniform.arrayLength;

    if (uniform.dataType in ["float", "int"]) {
      for (let i = 0; i < uniform.arrayLength; i++) {
        const uniformLoc = getUniformLoc(`${uniform.name}[${i}]`);
        switch (uniform.dataType) {
          case "float":
            gl.uniform1f(uniformLoc, uniformElem.data[i]);
            break;
          case "int" || "bool":
            gl.uniform1i(uniformLoc, uniformElem.data[i]);
            break;
        }
      }
    } else if (uniform.dataType.startsWith("vec")) {
      switch (uniform.dataType) {
        case "vec2":
          gl.uniform2fv(loc, arr);
          break;
        case "vec3":
          gl.uniform3fv(loc, arr);
          break;
        case "vec4":
          gl.uniform4fv(loc, arr);
          break;
      }
    } else if (uniform.dataType.startsWith("mat")) {
      switch (uniform.dataType) {
        case "mat2":
          gl.uniformMatrix2fv(loc, false, arr);
          break;
        case "mat3":
          gl.uniformMatrix3fv(loc, false, arr);
          break;
        case "mat4":
          gl.uniformMatrix4fv(loc, false, arr);
          break;
        case "mat2x3":
          gl.uniformMatrix2x3fv(loc, false, arr);
          break;
        case "mat3x2":
          gl.uniformMatrix3x2fv(loc, false, arr);
          break;
        case "mat2x4":
          gl.uniformMatrix2x4fv(loc, false, arr);
          break;
        case "mat4x2":
          gl.uniformMatrix4x2fv(loc, false, arr);
          break;
        case "mat3x4":
          gl.uniformMatrix3x4fv(loc, false, arr);
          break;
        case "mat4x3":
          gl.uniformMatrix4x3fv(loc, false, arr);
          break;
      }
    }
  }
};
