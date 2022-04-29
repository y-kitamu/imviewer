import { Drawable } from "./drawable";

// Parameters of sub window draw on `HTMLCanvasElement`
export type CanvasWindow = {
  onFocus: { row: number; col: number };
  nrows: number;
  ncols: number;
  rowSizes: number[]; // sum(rowSizes) should be 1.0
  colSizes: number[]; // sum(colSizes) should be 1.0
  // Drawables (OpenGL widgets) of each sub window.
  // Drawables of window position (row, col) is contained at widgets[row][col][:].
  drawables: Drawable[][][];
};
