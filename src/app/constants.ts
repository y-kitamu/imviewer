import { RenderMode } from "../gl/types/schemas";
import { SHADER_DIR } from "../gl/constants";
import { PartsType } from "./types/json";

export const SCALE_SLIDER_FACTOR = 10;

export const DEFAULT_SHADERS: { [key in PartsType]: string } = {
  image: `${SHADER_DIR}simple_image`,
  point: `${SHADER_DIR}simple_point`,
  line: `${SHADER_DIR}simple_line`,
  arrow: `${SHADER_DIR}simple_arrow`,
};

export const DEFAULT_RENDER_MODE: { [key in PartsType]: RenderMode } = {
  image: "TRIANGLE_STRIP",
  point: "POINTS",
  line: "LINES",
  arrow: "LINES",
};
