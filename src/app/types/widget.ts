/**
 * Type definitions for widgets rendered on CanvasHTMLElement.
 */

import { Matrix4 } from "three";
import { WidgetSchema } from "../../gl/types/schemas";
import { PartsType } from "../../io/types/io";

/**
 * Properties of rendering objects (point, line, image, etc.)
 * TODO : move to io/types (?)
 */
export type Widget = WidgetSchema & {
  partsType: PartsType;
  row: number[];
  col: number[];
  mvpMats: { [key: string]: Matrix4 }; // key : uniform variable name, value: mvp matrix
  textures: { [key: string]: string }; // key : variable name, value: file basename
};
