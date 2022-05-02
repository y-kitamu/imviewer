import { Matrix4 } from "three";
import { WidgetSchema } from "../../gl/types/schemas";

// Parameters of sub window draw on `HTMLCanvasElement`
export type CanvasWindow = {
  onFocus: { row: number; col: number };
  nrows: number;
  ncols: number;
  rowSizes: number[]; // sum(rowSizes) should be 1.0
  colSizes: number[]; // sum(colSizes) should be 1.0
  mvpMats: Matrix4[][];
  widgets: Widget[][][];
};

export type Widget = WidgetSchema & {
  textures: { [key: string]: string }; // key : file basename, value: variable name
};
