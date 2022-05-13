const React = require("react");
import { CanvasWindow } from "../types/window";

export const updateOnFocusByMousePosition = (
  canvasWindow: CanvasWindow,
  event: React.MouseEvent
) => {
  const { clientX, clientY } = event;
  const x = clientX / window.innerWidth;
  const y = clientY / window.innerHeight;

  const getFocusIdx = (delta: number, num_elems: number): number => {
    return Math.floor(delta * num_elems);
  };
  const ix = getFocusIdx(x, canvasWindow.ncols);
  const iy = getFocusIdx(y, canvasWindow.nrows);
  canvasWindow.onFocus = { row: iy, col: ix };
  console.log(canvasWindow.onFocus);
};
