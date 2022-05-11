const React = require("react");
import { CanvasWindow } from "../types/window";

export const updateOnFocusByMousePosition = (
  canvasWindow: CanvasWindow,
  event: React.MouseEvent
) => {
  const { clientX, clientY } = event;
  const x = clientX / window.innerWidth;
  const y = clientY / window.innerHeight;

  const getFocusIdx = (delta: number, sizes: number[]): number => {
    let offset = 0.0;
    for (let i = 0; i < sizes.length; i++) {
      offset += sizes[i];
      if (delta < offset) {
        return i;
      }
    }
    return sizes.length - 1;
  };
  const ix = getFocusIdx(x, canvasWindow.colSizes);
  const iy = getFocusIdx(y, canvasWindow.rowSizes);
  canvasWindow.onFocus = { row: iy, col: ix };
};
