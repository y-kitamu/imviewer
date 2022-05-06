import { WindowOperationButtonsProps } from "../types/props";
import { CanvasWindow } from "../types/window";

const addRow = (canvasWindow: CanvasWindow, rowIdx: number) => {
  if (rowIdx > canvasWindow.nrows) {
    rowIdx = canvasWindow.nrows;
  }
  const factor = 1.0 / canvasWindow.nrows;
  for (let i = 0; i < canvasWindow.nrows; i++) {
    canvasWindow.rowSizes[i] *= 1.0 - factor;
  }
  canvasWindow.rowSizes.splice(rowIdx, 0, factor);

  const subwindows: SubWindow[] = Array(canvasWindow.ncols).fill(
    createSubWindow()
  );
  canvasWindow.subWindows.splice(rowIdx, 0, subwindows);
  canvasWindow.nrows++;
};

const addCol = (canvasWindow: CanvasWindow, colIdx: number) => {
  if (colIdx > canvasWindow.ncols) {
    colIdx = canvasWindow.ncols;
  }

  const factor = 1.0 / canvasWindow.ncols;
  for (let i = 0; i < canvasWindow.ncols; i++) {
    canvasWindow.colSizes[i] *= 1.0 - factor;
    canvasWindow.subWindows[i].splice(colIdx, 0, createSubWindow());
  }
  canvasWindow.colSizes.splice(colIdx, 0, factor);

  canvasWindow.ncols++;
};

const deleteRow = (canvasWindow: CanvasWindow, rowIdx: number) => {
  if (rowIdx >= canvasWindow.nrows) {
    return;
  }
  canvasWindow.rowSizes.splice(rowIdx, 1);
  canvasWindow.subWindows.splice(rowIdx, 1);

  canvasWindow.nrows--;
};

const deletCol = (canvasWindow: CanvasWindow, colIdx: number) => {
  if (colIdx >= canvasWindow.ncols) {
    return;
  }
  for (let i = 0; i < canvasWindow.ncols; i++) {
    canvasWindow.subWindows[i].splice(colIdx, 1);
  }
  canvasWindow.colSizes.splice(colIdx, 1);

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
