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
  uniformSchemas: UniformSchema[],
  uniformProperties: Internal.UniformProperty[]
) => {
  for (const uniform of uniformProperties) {
    const uniformElem = _searchDataSchema(uniform.name, uniformSchemas);
    if (uniformElem.data == null) {
      throw new Error(`Uniform variable is empty : ${uniform.name}`);
    }
    const func = getUniformFunction(gl, uniform.dataType);
    if (uniform.dataType == "float" || uniform.dataType == "int") {
      for (let i = 0; i < uniform.arrayLength; i++) {
        func(uniform.location + i, uniformElem.data[i]);
      }
    } else if (uniform.dataType.startsWith("vec")) {
      func(
        uniform.location,
        uniform.arrayLength,
        new Float32Array(uniformElem.data)
      );
    } else if (uniform.dataType.startsWith("mat")) {
      func(
        uniform.location,
        uniform.arrayLength,
        false,
        new Float32Array(uniformElem.data)
      );
    }
  }
};

const getUniformFunction = (
  gl: WebGL2RenderingContext,
  dataType: string
): CallableFunction => {
  switch (dataType) {
    case "float":
      return gl.uniform1f;
    case "int" || "bool":
      return gl.uniform1i;
    case "vec2":
      return gl.uniform2fv;
    case "vec3":
      return gl.uniform3fv;
    case "vec4":
      return gl.uniform4fv;
    case "mat2":
      return gl.uniformMatrix2fv;
    case "mat3":
      return gl.uniformMatrix3fv;
    case "mat4":
      return gl.uniformMatrix4fv;
    case "mat2x3":
      return gl.uniformMatrix2x3fv;
    case "mat3x2":
      return gl.uniformMatrix3x2fv;
    case "mat2x4":
      return gl.uniformMatrix2x4fv;
    case "mat4x2":
      return gl.uniformMatrix4x2fv;
    case "mat3x4":
      return gl.uniformMatrix3x4fv;
    case "mat4x3":
      return gl.uniformMatrix4x3fv;
  }
  throw new Error(`Unsupported data type : ${dataType}`);
};
