import { Matrix4 } from "three";
import { WidgetSchema } from "../../gl/types/schemas";
import { PartsType } from "./json";

/**
 * Properties of window draw on `HTMLCanvasElement`
 */
export type CanvasWindow = {
  onFocus: { row: number; col: number };
  nrows: number;
  ncols: number;
  rowSizes: number[]; // sum(rowSizes) should be 1.0
  colSizes: number[]; // sum(colSizes) should be 1.0
  images: ImageWidget[];
  widgets: Widget[];
};

/**
 * Properties of rendering objects (point, line, image, etc.)
 */
export type Widget = WidgetSchema & {
  partsType: PartsType;
  row: number;
  col: number;
  coords: CoordinateParams;
};

/**
 * Properties of rendering image data
 */
export type ImageWidget = Widget & {
  textures: { [key: string]: ImageProperty }; // key : file basename, value: variable name
};

/**
 */
export type CoordinateParams = {
  mvpMat: Matrix4;
  scale: number;
};

/**
 * Properties of image file
 */
export type ImageProperty = {
  fileBasename: string;
  width: number;
  height: number;
};

/**
 * Properties of shader
 */
export type ShaderProperty = {
  partsType: PartsType;
  shaderStem: string;
};
