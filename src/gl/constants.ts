// GL constants
export const FLOAT_BYTE_SIZE = 4;

export const SHADER_DIR = "./glsl/";
export const DEFAULT_SHADER_STEMS = [
  `background`,
  `simple_image`,
  `simple_point`,
  `simple_line`,
  `simple_arrow`,
];
export const DEFAULT_SHADERS = DEFAULT_SHADER_STEMS.map(
  (stem) => `${SHADER_DIR}${stem}`
);
