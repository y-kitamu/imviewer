// GL constants
export const FLOAT_BYTE_SIZE = 4;

export const SHADER_DIR = "./glsl/";
export const DEFAULT_SHADER_STEMS = [
  `background`,
  `simple_image`,
  `simple_point`,
  `simple_line`,
  // `simple_arrow`,
];
export const DEFAULT_SHADERS = DEFAULT_SHADER_STEMS.map(
  (stem) => `${SHADER_DIR}${stem}`
);

export const VERTEX_SHADER_SOURCES: { [key: string]: string } = {
  background: require(`${SHADER_DIR}background.vert`),
  simple_image: require(`${SHADER_DIR}simple_image.vert`),
  simple_point: require(`${SHADER_DIR}simple_point.vert`),
  simple_line: require(`${SHADER_DIR}simple_line.vert`),
  // simple_arrow: require(`${SHADER_DIR}simple_arrow.vert`),
};

export const FRAGMENT_SHADER_SOURCES: { [key: string]: string } = {
  background: require(`${SHADER_DIR}background.frag`),
  simple_image: require(`${SHADER_DIR}simple_image.frag`),
  simple_point: require(`${SHADER_DIR}simple_point.frag`),
  simple_line: require(`${SHADER_DIR}simple_line.frag`),
  // simple_arrow: require(`${SHADER_DIR}simple_arrow.frag`),
};

// export const GEOM_SHADER_SOURCES: { [key: string]: string } = {
//   simple_arrow: require(`${SHADER_DIR}simple_arrow.geom`),
// };
