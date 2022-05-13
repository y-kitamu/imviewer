import { Widget } from "./widget";

/**
 * Properties of window draw on `HTMLCanvasElement`
 */
export type CanvasWindow = {
  onFocus: { row: number; col: number };
  nrows: number;
  ncols: number;
  widgets: Widget[];
};
