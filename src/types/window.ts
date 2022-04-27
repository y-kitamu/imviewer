import { WidgetsBase } from "./widgets";

// Sub window parameters on `HTMLCanvasElement`
export type CanvasWindow = {
  onFocus: { row: number; col: number };
  nrows: number;
  ncols: number;
  rowSizes: number[];
  colSizes: number[];
  // widgets of each sub window.
  // Widgets of window position (row, col) is contained at widgets[row][col][:].
  widgets: WidgetsBase[][][];
};
