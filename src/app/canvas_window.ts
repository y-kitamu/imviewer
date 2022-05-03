import { Matrix4 } from "three";
import { DEFAULT_SHADERS } from "./constants";
import { getSamplerNames } from "../gl/gl";
import {
  CanvasWindow,
  ImageProperty,
  ImageWidget,
  Widget,
} from "./types/window";

export const addRow = (canvasWindow: CanvasWindow, rowIdx: number) => {
  if (rowIdx > canvasWindow.nrows) {
    rowIdx = canvasWindow.nrows;
  }
  const factor = 1.0 / canvasWindow.nrows;
  for (let i = 0; i < canvasWindow.nrows; i++) {
    canvasWindow.rowSizes[i] *= 1.0 - factor;
  }
  canvasWindow.rowSizes.splice(rowIdx, 0, factor);

  const rowMvpMats = Array(canvasWindow.ncols).fill(new Matrix4());
  const rowScales = Array(canvasWindow.ncols).fill(1.0);
  const rowWidgets: Widget[][] = Array(canvasWindow.ncols).fill([]);
  const rowImages: ImageWidget[] = Array(canvasWindow.ncols);
  canvasWindow.mvpMats.splice(rowIdx, 0, rowMvpMats);
  canvasWindow.scales.splice(rowIdx, 0, rowScales);
  canvasWindow.widgets.splice(rowIdx, 0, rowWidgets);
  canvasWindow.images.splice(rowIdx, 0, rowImages);

  canvasWindow.nrows++;
};

export const addCol = (canvasWindow: CanvasWindow, colIdx: number) => {
  if (colIdx > canvasWindow.ncols) {
    colIdx = canvasWindow.ncols;
  }

  const factor = 1.0 / canvasWindow.ncols;
  for (let i = 0; i < canvasWindow.ncols; i++) {
    canvasWindow.colSizes[i] *= 1.0 - factor;
    canvasWindow.mvpMats[i].splice(colIdx, 0, new Matrix4());
    canvasWindow.scales[i].splice(colIdx, 0, 1.0);
    canvasWindow.widgets[i].splice(colIdx, 0, []);
    canvasWindow.images[i].splice(colIdx, 0, getImageWidget());
  }
  canvasWindow.colSizes.splice(colIdx, 0, factor);

  canvasWindow.ncols++;
};

export const deleteRow = (canvasWindow: CanvasWindow, rowIdx: number) => {
  if (rowIdx >= canvasWindow.nrows) {
    return;
  }
  canvasWindow.rowSizes.splice(rowIdx, 1);
  canvasWindow.mvpMats.splice(rowIdx, 1);
  canvasWindow.scales.splice(rowIdx, 1);
  canvasWindow.images.splice(rowIdx, 1);
  canvasWindow.widgets.splice(rowIdx, 1);

  canvasWindow.nrows--;
};

export const deletCol = (canvasWindow: CanvasWindow, colIdx: number) => {
  if (colIdx >= canvasWindow.ncols) {
    return;
  }
  for (let i = 0; i < canvasWindow.ncols; i++) {
    canvasWindow.mvpMats.splice(colIdx, 1);
    canvasWindow.scales.splice(colIdx, 1);
    canvasWindow.images.splice(colIdx, 1);
    canvasWindow.widgets.splice(colIdx, 1);
  }
  canvasWindow.colSizes.splice(colIdx, 1);

  canvasWindow.ncols--;
};

export const getImageWidget = (
  shader: string = DEFAULT_SHADERS.image,
  imageProperty: ImageProperty = { fileBasename: "", width: 0, height: 0 }
): ImageWidget => {
  const textures: { [key: string]: string | undefined } = {};
  const keys = getSamplerNames(shader);
  for (const key of keys) {
    textures[key] = undefined;
  }
  const { width, height } = imageProperty;

  // prettier-ignore
  return {
    id: String(Math.random()),
    shaderPath: shader,
    renderMode: "TRIANGLE_STRIP",
    partsType: "image",
    textures,
    vertices: [
      {
        variableName: "aPos",
        data: [
          -width, height, 0.0,
          -width, -height, 0.0,
          width, height, 0.0,
          width, -height, 0.0],
      },
      {
        variableName: "aTexCoord",
        data: [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0],
      },
    ],
  };
};
