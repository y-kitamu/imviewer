import { WindowOperationButtonsProps } from "../types/props";
import { CanvasWindow } from "../types/window";

const rescaleWindow = (canvasWindow: CanvasWindow, factor: number) => {
  canvasWindow.images.map((img) => {});
  canvasWindow.widgets.map((widget) => {});
};

const addRow = (canvasWindow: CanvasWindow, rowIdx: number) => {
  if (rowIdx > canvasWindow.nrows) {
    rowIdx = canvasWindow.nrows;
  }
  const factor = 1.0 / canvasWindow.nrows;
  rescaleWindow(canvasWindow, 1.0 - factor);
  canvasWindow.rowSizes.splice(rowIdx, 0, factor);
  canvasWindow.nrows++;
};

const addCol = (canvasWindow: CanvasWindow, colIdx: number) => {
  if (colIdx > canvasWindow.ncols) {
    colIdx = canvasWindow.ncols;
  }
  const factor = 1.0 / canvasWindow.ncols;
  rescaleWindow(canvasWindow, 1.0 - factor);
  canvasWindow.colSizes.splice(colIdx, 0, factor);
  canvasWindow.ncols++;
};

const deleteRow = (canvasWindow: CanvasWindow, rowIdx: number) => {
  if (rowIdx >= canvasWindow.nrows) {
    return;
  }
  canvasWindow.rowSizes.splice(rowIdx, 1);
  canvasWindow.images = canvasWindow.images.filter(
    (img) => !img.row.includes(rowIdx)
  );
  canvasWindow.widgets = canvasWindow.widgets.filter(
    (widget) => !widget.row.includes(rowIdx)
  );
  const factor = canvasWindow.nrows / (canvasWindow.nrows - 1);
  rescaleWindow(canvasWindow, factor);
  canvasWindow.nrows--;
};

const deleteCol = (canvasWindow: CanvasWindow, colIdx: number) => {
  if (colIdx >= canvasWindow.ncols) {
    return;
  }
  canvasWindow.colSizes.splice(colIdx, 1);
  canvasWindow.images = canvasWindow.images.filter(
    (img) => !img.col.includes(colIdx)
  );
  canvasWindow.widgets = canvasWindow.widgets.filter(
    (widget) => !widget.col.includes(colIdx)
  );
  const factor = canvasWindow.ncols / (canvasWindow.ncols - 1);
  rescaleWindow(canvasWindow, factor);

  canvasWindow.ncols--;
};

/**
 *  Insert or delete sub windows at a specified column, row.
 */
export const WindowOperationButtons = (props: WindowOperationButtonsProps) => {
  const { canvasWindow } = props;

  const insertColumn = (colIndex: number) => {};
  const insertRow = (rowIndex: number) => {};
  const deleteColumn = (colIndex: number) => {};
  const deleteRow = (rowIndex: number) => {};

  return <></>;
};
