import React from "react";
import { Button } from "@mui/material";
import { removeDrawable } from "../../gl/gl";
import { WindowOperationButtonsProps } from "../types/props";
import { CanvasWindow } from "../types/window";

const addRow = (canvasWindow: CanvasWindow, rowIdx: number = -1) => {
  if (rowIdx == -1 || rowIdx > canvasWindow.nrows) {
    rowIdx = canvasWindow.nrows;
  }
  canvasWindow.nrows++;
};

const addCol = (canvasWindow: CanvasWindow, colIdx: number = -1) => {
  if (colIdx == -1 || colIdx > canvasWindow.ncols) {
    colIdx = canvasWindow.ncols;
  }
  canvasWindow.ncols++;
};

const deleteRow = (
  gl: WebGL2RenderingContext,
  canvasWindow: CanvasWindow,
  rowIdx: number = -1
) => {
  if (canvasWindow.nrows == 1 || rowIdx >= canvasWindow.nrows) {
    return;
  }
  if (rowIdx == -1) {
    rowIdx = canvasWindow.nrows - 1;
  }
  canvasWindow.widgets = canvasWindow.widgets.filter((widget) => {
    if (widget.row.includes(rowIdx)) {
      removeDrawable(gl, widget.id);
      return false;
    }
    return true;
  });
  canvasWindow.widgets.forEach((widget) => {
    widget.row = widget.row.map((r) => {
      if (r >= rowIdx) {
        r--;
      }
      return r;
    });
  });
  canvasWindow.nrows--;
};

const deleteCol = (
  gl: WebGL2RenderingContext,
  canvasWindow: CanvasWindow,
  colIdx: number = -1
) => {
  if (canvasWindow.ncols == 1 || colIdx >= canvasWindow.ncols) {
    return;
  }
  if (colIdx == -1) {
    colIdx = canvasWindow.ncols - 1;
  }
  canvasWindow.widgets = canvasWindow.widgets.filter((widget) => {
    if (widget.col.includes(colIdx)) {
      removeDrawable(gl, widget.id);
      return false;
    }
    return true;
  });
  canvasWindow.widgets.forEach((widget) => {
    widget.col = widget.col.map((c) => {
      if (c >= colIdx) {
        c--;
      }
      return c;
    });
  });
  canvasWindow.ncols--;
};

/**
 *  Insert or delete sub windows at a specified column, row.
 */
export const WindowOperationButtons = (props: WindowOperationButtonsProps) => {
  const { gl, canvasWindow, setNCols, setNRows } = props;

  return (
    <>
      <Button
        onClick={() => {
          addRow(canvasWindow);
          setNRows(canvasWindow.nrows);
        }}
      >
        Add Row
      </Button>
      <Button
        onClick={() => {
          addCol(canvasWindow);
          setNCols(canvasWindow.ncols);
        }}
      >
        Add Col
      </Button>
      <Button
        onClick={() => {
          deleteRow(gl, canvasWindow);
          setNRows(canvasWindow.nrows);
        }}
      >
        Delete Row
      </Button>
      <Button
        onClick={() => {
          deleteCol(gl, canvasWindow);
          setNCols(canvasWindow.ncols);
        }}
      >
        Delete Col
      </Button>
    </>
  );
};
