import { WidgetsBase } from "./widgets";

export type CanvasWindow = {
  nrows: number;
  ncols: number;
  rowSizes: number[];
  colSizes: number[];
  // widgets of each sub window.
  // Widgets of window position (row, col) is contained at widgets[row][col].
  widgets: WidgetsBase[][];
};
