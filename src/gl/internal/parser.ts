/**
 * Parse header of shader scripts.
 */

import { Internal } from "../types/shader";

// Return array : [match string, location, data type, variable name, array sizes]
// Match pattern example : layout (location=0) in vec3 aPos[5];
const vertexInRe =
  /layout\s*\(.*location\s*=\s*(\d+).*\)\s*in\s+(\w+)\s+(\w+)\s*((?:\[\d+\]\s*)*)\s*;/g;
// Return array : [match string, location, data type, variable name, arrai sizes]
// Match pattern example : layout (location=0) uniform vec3 foo[2];
const uniformInRe =
  /layout\s*\(.*location\s*=\s*(\d+).*\)\s*uniform\s+(\w+)\s+(\w+)\s*((?:\[\d+\]\s*)*)\s*;/g;
// Return array : [match string, location, sampler type, variable name, array sizes]
// Match pattern example : layout (location=0)uniform sampler2D foo[5];
const samplerInRe =
  /layout\s*\(.*location\s*=\s*(\d+).*\)\s*uniform\s+(sampler\w+)\s+(\w+)\s*((?:\[\d+\]\s*)*)\s*;/g;
// Return array: [match string, binding, struct name, elements string, array sizes]
// Match pattern example :
// layout (binding=0) uniform Foo {
//     vec3 bar;
//     vec3 baz[10];
// } mats[1];
const uniformBlockRe =
  /layout\s+\(.*binding\s*=\s*(\d+).*\)\s+uniform\s+(\w+)\s+\{\s*((?:\s*\w+\s+\w+\s*(?:\[\d+\]\s*)*;)+)\s*\}\s*\w*\s*((?:\[\d+\]\s*)*);/g;
// Return array : [match string, data type, variable name, array size]
// Match pattern example : mat4 mvp;
const uniformBlockElemRe = /\s*(\w+)\s+(\w+)\s*((?:\[\d+\]\s*)*)\*s;/g;
// Retrun array : [match string, number of elements in the array]
// Match pattern example : [3][4][5]
const arrayRe = /\[\s*(\d+)\s*\]/g;

/**
 * Parse shader source codes and return input vertices, uniforms, etc.
 * This function load :
 *   vertex shader from `${shaderPath}.vert`
 *   fragment shader from `${shaderPath}.frag`
 *   geometry shader from `${shaderPath}.geom`
 */
export const _parseShader = (shaderPath: string): Internal.ShaderProperty => {
  const parseResult: Internal.ShaderProperty = {
    vertices: [],
    uniforms: [],
    uniformBlocks: [],
    samplers: [],
  };
  ["vert", "frag", "geom"].map((suffix) => {
    try {
      const shaderSource = require(`${shaderPath}.${suffix}`);
      const res = parseShaderImpl(shaderSource);
      parseResult.vertices.concat(res.vertices);
      parseResult.uniforms.concat(res.uniforms);
      parseResult.uniformBlocks.concat(res.uniformBlocks);
      parseResult.samplers.concat(res.samplers);
    } catch (e) {
      console.log(`Failed to load shader : ${shaderPath}.${suffix}`);
    }
  });

  const unique = <T extends { [key: string]: any }>(dictArray: T[]): T[] => {
    const uniq = new Set(dictArray.map((val) => val.location));
    return dictArray.filter((val) => uniq.delete(val.location));
  };

  return {
    vertices: unique(parseResult.vertices),
    uniforms: unique(parseResult.uniforms),
    uniformBlocks: unique(parseResult.uniformBlocks),
    samplers: unique(parseResult.samplers),
  };
};

/**
 * Parse source string of GLSL to correct input data from cpu.
 */
const parseShaderImpl = (source: string): Internal.ShaderProperty => {
  const vertices = [];
  const uniforms = [];
  const uniformBlocks = [];
  const samplers = [];

  for (const match of source.matchAll(vertexInRe)) {
    vertices.push({
      location: Number(match[1]),
      dataTypeSize: getDataTypeSize(match[2]),
      arrayLength: getArraySize(match[4]),
      name: match[3],
    });
  }

  for (const match of source.matchAll(uniformInRe)) {
    uniforms.push({
      location: Number(match[1]),
      dataType: match[2],
      dataTypeSize: getDataTypeSize(match[2]),
      arrayLength: getArraySize(match[4]),
      name: match[3],
    });
  }

  for (const match of source.matchAll(uniformBlockRe)) {
    const elements = [];
    let offset = 0;
    for (const elem of match[3].matchAll(uniformBlockElemRe)) {
      const arrayLength = getArraySize(match[4]);
      const baseAlign = getBaseAlignment(elem[1]) * arrayLength;
      elements.push({
        baseAlign,
        alignOffset: offset,
        dataTypeSize: getDataTypeSize(elem[1]),
        arrayLength,
        name: elem[2],
      });
      offset += baseAlign;
    }
    uniformBlocks.push({
      location: Number(match[1]),
      objectSize: offset,
      arrayLength: getArraySize(match[3]),
      name: match[2],
      elements,
    });
  }

  for (const match of source.matchAll(samplerInRe)) {
    for (let i = 0; i < getArraySize(match[4]); i++) {
      samplers.push({
        location: Number(match[1]) + i,
        samplerType: match[2],
        arrayLength: getArraySize(match[4]),
        name: match[3],
      });
    }
  }

  return {
    vertices,
    uniforms,
    uniformBlocks,
    samplers,
  };
};

/**
 * Get element count of the `dtypeStr`
 */
const getDataTypeSize = (dtypeStr: string) => {
  let cnt = 0;
  if (dtypeStr.startsWith("vec")) {
    cnt = Number(dtypeStr.match(/vec(\d+)/)?.at(1));
  } else if (dtypeStr.startsWith("mat")) {
    const res = [...dtypeStr.matchAll(/\d+/g)];
    switch (res.length) {
      case 1:
        cnt = Math.pow(Number(res[0][0]), 2);
        break;
      case 2:
        cnt = Number(res[0][0]) * Number(res[1][0]);
        break;
    }
  } else if (
    dtypeStr.startsWith("float") ||
    dtypeStr.startsWith("bool") ||
    dtypeStr.startsWith("int")
  ) {
    cnt = 1;
  }
  if (cnt == 0 || cnt == NaN) {
    throw new Error(`Unsupported type : ${dtypeStr}`);
  }
  return cnt;
};

const getArraySize = (arraySizeStr: string) => {
  let cnt = 1;
  for (const elem of arraySizeStr.matchAll(arrayRe)) {
    cnt *= Number(elem[1]);
  }
  return cnt;
};

/**
 * Get the space a variable (type: `dtypeStr`) takes within a uniform block.
 * layout rule must be 'std140' : https://learnopengl.com/Advanced-OpenGL/Advanced-GLSL
 */
const getBaseAlignment = (dtypeStr: string) => {
  let cnt = 0;
  const amatch = dtypeStr.match(/\[\d+\]/g);
  // Matrices are stored as a array of column vectors, where each of those vectors has
  // a base alignment of vec4
  if (dtypeStr.startsWith("mat")) {
    cnt = Number(dtypeStr.match(/(?:[a-z]+(\d+))+/)?.at(1)) * 16;
  } else if (amatch != null) {
    // Array of scalars or vectors has base alignment equal to that of vec4
    cnt = Number(amatch[1]) * 16;
  } else if (dtypeStr.startsWith("vec")) {
    // Vec has a base alignment of either 2N or 4N.
    cnt = Number(dtypeStr.match(/\d+/)?.at(1));
    cnt = Math.floor((cnt + 1) / 2) * 32;
  } else if (
    dtypeStr.startsWith("float") ||
    dtypeStr.startsWith("bool") ||
    dtypeStr.startsWith("int")
  ) {
    // float, bool and int has a base alignment of 4.
    cnt = 4;
  }

  if (cnt == 0 || cnt == NaN) {
    throw new Error(`Unsupported type : ${dtypeStr}`);
  }
  return cnt;
};
