import { Matrix4 } from "three";
import { WidgetSchema } from "../../gl/types/schemas";
import { PartsType } from "./json";

// Parameters of sub window draw on `HTMLCanvasElement`
export type CanvasWindow = {
  onFocus: { row: number; col: number };
  nrows: number;
  ncols: number;
  rowSizes: number[]; // sum(rowSizes) should be 1.0
  colSizes: number[]; // sum(colSizes) should be 1.0
  subWindows: SubWindow[][];
};

export type SubWindow = {
  image: ImageWidget;
  mvpMat: Matrix4;
  scale: number;
  widgets: Widget[];
};

export type Widget = WidgetSchema & {
  partsType: PartsType;
  textures: { [key: string]: string | undefined }; // key : file basename, value: variable name
};

export type ImageWidget = Widget;

export type ImageProperty = {
  fileBasename: string;
  width: number;
  height: number;
};

export type ShaderProperty = {
  partsType: PartsType;
  shaderStem: string;
};
