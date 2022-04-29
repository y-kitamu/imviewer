/**
 * Parse header of shader scripts.
 */

import { ShaderParseResult } from "../types/shader";

// Return array : [match string, location, data type, variable name]
// Match pattern example : layout (location=0) in vec3 aPos;
const vertexInRe =
  /layout\s*\(.*location\s*=\s*(\d+).*\)\s*in\s+(\w+)\s+(\w+)\s*;/g;
// Return array : [match string, binding, data type, variable name]
// Match pattern example : layout (binding=0) uniform vec3 foo;
const uniformInRe =
  /layout\s*\(.*binding\s*=\s*(\d+).*\)\s*uniform\s+(\w+)\s+(\w+)\s*;/g;
// Return array: [match string, binding, struct name, elements string]
// Match pattern example :
// layout (binding=0) uniform Foo {
//     vec3 bar;
//     vec3 baz;
// } mats;
const uniformBlockRe =
  /layout\s+\(.*binding\s*=\s*(\d+).*\)\s+uniform\s+(\w+)\s+\{\s*((?:\s*\w+\s+\w+;)+)\s*\}\s*\w*;/g;
// Return array : [match string, data type, variable name]
// Match pattern example : mat4 mvp;
const uniformBlockElemRe = /\s*(\w+)\s+(\w+)\*s;/g;
// Retrun array : [match string, number of elements in the array]
// Match pattern example : [3][4][5]
const arrayRe = /\[(\d+)\]/g;

/**
 *
 */
export const parseShader = (shaderPath: string): ShaderParseResult => {
  const parseResult: ShaderParseResult = {
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
const parseShaderImpl = (source: string): ShaderParseResult => {
  const vertices = [];
  const uniforms = [];
  const uniformBlocks = [];
  const samplers = [];

  for (const match of source.matchAll(vertexInRe)) {
    vertices.push({
      location: match[1],
      elemCount: getElementCount(match[2]),
      name: match[3],
    });
  }

  for (const match of source.matchAll(uniformInRe)) {
    if (match[2].startsWith("sampler")) {
      samplers.push({
        location: match[1],
        samplerType: match[2],
        name: match[3],
      });
    } else {
      uniforms.push({
        location: match[1],
        elemCount: getElementCount(match[2]),
        name: match[3],
      });
    }
  }

  for (const match of source.matchAll(uniformBlockRe)) {
    const elements = [];
    let offset = 0;
    for (const elem of match[3].matchAll(uniformBlockElemRe)) {
      const baseAlign = getBaseAlignment(elem[1]);
      elements.push({
        baseAlign,
        alignOffset: offset,
        elemCount: getElementCount(elem[1]),
        name: elem[2],
      });
      offset += baseAlign;
    }
    uniformBlocks.push({
      location: match[1],
      objectSize: offset,
      name: match[2],
      elements,
    });
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
const getElementCount = (dtypeStr: string) => {
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
  for (const elem of dtypeStr.matchAll(arrayRe)) {
    cnt *= Number(elem[1]);
  }
  return cnt;
};

/**
 * Get the space a variable (type: `dtypeStr`) takes within a uniform block.
 * layout rule of 'std140' : https://learnopengl.com/Advanced-OpenGL/Advanced-GLSL
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
