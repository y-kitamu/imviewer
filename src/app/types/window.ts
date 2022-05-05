import { Widget } from "./widget";

/**
 * Properties of window draw on `HTMLCanvasElement`
 */
export type CanvasWindow = {
  onFocus: { row: number; col: number };
  nrows: number;
  ncols: number;
  rowSizes: number[]; // sum(rowSizes) should be 1.0
  colSizes: number[]; // sum(colSizes) should be 1.0
  images: Widget[];
  widgets: Widget[];
};
