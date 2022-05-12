import React from "react";
import { Button } from "@mui/material";
import { WindowOperationButtonsProps } from "../types/props";
import { CanvasWindow } from "../types/window";

const rescaleWindow = (canvasWindow: CanvasWindow, factor: number) => {
  canvasWindow.widgets.map((widget) => {});
};

const addRow = (canvasWindow: CanvasWindow, rowIdx: number = -1) => {
  if (rowIdx == -1 || rowIdx > canvasWindow.nrows) {
    rowIdx = canvasWindow.nrows;
  }
  const factor = 1.0 / canvasWindow.nrows;
  rescaleWindow(canvasWindow, 1.0 - factor);
  canvasWindow.rowSizes.splice(rowIdx, 0, factor);
  canvasWindow.nrows++;
};

const addCol = (canvasWindow: CanvasWindow, colIdx: number = -1) => {
  if (colIdx == -1 || colIdx > canvasWindow.ncols) {
    colIdx = canvasWindow.ncols;
  }
  const factor = 1.0 / canvasWindow.ncols;
  rescaleWindow(canvasWindow, 1.0 - factor);
  canvasWindow.colSizes.splice(colIdx, 0, factor);
  canvasWindow.ncols++;
};

const deleteRow = (canvasWindow: CanvasWindow, rowIdx: number = -1) => {
  if (canvasWindow.nrows == 1 || rowIdx >= canvasWindow.nrows) {
    return;
  }
  if (rowIdx == -1) {
    rowIdx = canvasWindow.nrows - 1;
  }
  canvasWindow.rowSizes.splice(rowIdx, 1);
  canvasWindow.widgets = canvasWindow.widgets.filter(
    (widget) => !widget.row.includes(rowIdx)
  );
  const factor = canvasWindow.nrows / (canvasWindow.nrows - 1);
  rescaleWindow(canvasWindow, factor);
  canvasWindow.nrows--;
};

const deleteCol = (canvasWindow: CanvasWindow, colIdx: number = -1) => {
  if (canvasWindow.ncols == 1 || colIdx >= canvasWindow.ncols) {
    return;
  }
  if (colIdx == -1) {
    colIdx = canvasWindow.ncols - 1;
  }
  canvasWindow.colSizes.splice(colIdx, 1);
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

  return (
    <>
      <Button
        onClick={() => {
          addRow(canvasWindow);
        }}
      >
        Add Row
      </Button>
      <Button
        onClick={() => {
          addCol(canvasWindow);
        }}
      >
        Add Col
      </Button>
      <Button
        onClick={() => {
          deleteRow(canvasWindow);
        }}
      >
        Delete Row
      </Button>
      <Button
        onClick={() => {
          deleteCol(canvasWindow);
        }}
      >
        Delete Col
      </Button>
    </>
  );
};
