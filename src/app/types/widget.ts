/**
 * Type definitions for widgets rendered on CanvasHTMLElement.
 */

import { Matrix4 } from "three";
import { WidgetSchema } from "../../gl/types/schemas";
import { ImageProperty, PartsType } from "./io";

/**
 * Properties of rendering objects (point, line, image, etc.)
 */
export type Widget = WidgetSchema & {
  partsType: PartsType;
  row: number[];
  col: number[];
  scale: { [key: string]: number }; // key: uniform variable name, value : scale (number)
  mvpMats: { [key: string]: Matrix4 }; // key : uniform variable name, value: mvp matrix
  textures: { [key: string]: ImageProperty }; // key : file basename, value: variable name
};
