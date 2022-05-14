import { Matrix4 } from "three";
import { createDrawable, removeDrawable } from "../../gl/gl";
import { convertImageToWidget, convertJsonSchemaToWidget } from "../../io/io";
import { MVP_VARNAME } from "../../io/constants";
import { JsonSchema } from "../../io/types/io";
import { CanvasWindow } from "../types/window";

export const createWidget = (
  gl: WebGL2RenderingContext,
  canvasWindow: CanvasWindow,
  schema: JsonSchema,
  rows: number[] = [],
  cols: number[] = []
) => {
  if (rows.length == 0 || cols.length == 0) {
    rows = [canvasWindow.onFocus.row];
    cols = [canvasWindow.onFocus.col];
  }
  let mats = [];
  if (rows.length == 2 && cols.length == 2) {
    if (rows[0] == rows[1] && cols[0] == cols[1]) {
      const mat = getMVPMatrix(canvasWindow, rows[0], cols[0]);
      mats.push(mat, mat);
    } else {
      mats = rows.map((row, i) => getMVPMatrix(canvasWindow, row, cols[i]));
    }
  } else {
    mats = rows.map((row, i) => getMVPMatrix(canvasWindow, row, cols[i]));
  }
  const widget = convertJsonSchemaToWidget(schema, rows, cols, mats);
  canvasWindow.widgets.push(widget);
  createDrawable(gl, widget, {});
};

/**
 *
 */
export const createImageWidget = (
  gl: WebGL2RenderingContext,
  canvasWindow: CanvasWindow,
  image: HTMLImageElement,
  fileBasename: string,
  key: string
) => {
  const { row, col } = canvasWindow.onFocus;
  const { width, height } = image;
  const newWidget = convertImageToWidget(
    image,
    row,
    col,
    getMVPMatrix(canvasWindow, row, col, width, height)
  );
  const currentWidget = getFocusedImageWidget(canvasWindow);
  if (currentWidget == undefined) {
    newWidget.textures = { [key]: fileBasename };
  } else {
    newWidget.textures = currentWidget.textures;
    newWidget.textures[key] = fileBasename;
    removeDrawable(gl, currentWidget.id);
    deleteWidget(gl, canvasWindow);
  }
  canvasWindow.widgets.push(newWidget);
  createDrawable(gl, newWidget, newWidget.textures);
};

/**
 * Check if a widget created from `schema` is rendered on the focused sub-window.
 */
export const isWidgetDrawing = (
  canvasWindow: CanvasWindow,
  schema: JsonSchema
) => {
  const { row, col } = canvasWindow.onFocus;
  for (const widget of canvasWindow.widgets) {
    if (widget.row.includes(row) && widget.col.includes(col)) {
      if (schema.schemaId && widget.id.startsWith(schema.schemaId)) {
        return true;
      }
    }
  }
  return false;
};

export const deleteWidget = (
  gl: WebGL2RenderingContext,
  canvasWindow: CanvasWindow,
  schema?: JsonSchema
) => {
  const { row, col } = canvasWindow.onFocus;
  canvasWindow.widgets = canvasWindow.widgets.filter((widget) => {
    if (widget.row.includes(row) && widget.col.includes(col)) {
      if (schema == undefined && widget.partsType == "image") {
        removeDrawable(gl, widget.id);
        return false;
      }
      if (widget.vertices == schema?.datas) {
        removeDrawable(gl, widget.id);
        return false;
      }
      return true;
    }
    return true;
  });
};

export const getFocusedImageWidget = (canvasWindow: CanvasWindow) => {
  const { row, col } = canvasWindow.onFocus;
  return canvasWindow.widgets.find(
    (img) =>
      img.partsType == "image" && img.row.includes(row) && img.col.includes(col)
  );
};

export const updateMVPMatrix = (
  canvasWindow: CanvasWindow,
  deltaMat: Matrix4
) => {
  const mat = getMVPMatrix(canvasWindow);
  if (!Object.keys(mat).includes(MVP_VARNAME)) {
    const { row, col } = canvasWindow.onFocus;
    canvasWindow.widgets.forEach((w, i) => {
      const rowIdx = w.row.findIndex((r) => row == r);
      const colIdx = w.col.findIndex((c) => col == c);
      if (rowIdx >= 0 && rowIdx == colIdx) {
        mat[MVP_VARNAME] = mat[`${MVP_VARNAME}[${i}]`];
      }
    });
  }
  if (Object.keys(mat).includes(MVP_VARNAME)) {
    mat[MVP_VARNAME].multiplyMatrices(deltaMat, mat[MVP_VARNAME]);
  }
};

const getMVPMatrix = (
  canvasWindow: CanvasWindow,
  row: number = -1,
  col: number = -1,
  imageWidth: number = -1,
  imageHeight: number = -1
): { [key: string]: Matrix4 } => {
  if (row == -1 || col == -1) {
    row = canvasWindow.onFocus.row;
    col = canvasWindow.onFocus.col;
  }
  // Search widgets already rendered on the target `row` and `col`
  const mat = canvasWindow.widgets.find((w) => {
    const rowIdx = w.row.findIndex((r) => row == r);
    const colIdx = w.col.findIndex((c) => col == c);
    return rowIdx >= 0 && rowIdx == colIdx;
  })?.mvpMats;

  // If widgets already rendered are found, return the mvp matrix of the widget.
  if (mat != undefined) {
    return mat;
  }

  // If widgets already rendered do not exist, create new mvp matrix.
  const { nrows, ncols } = canvasWindow;
  const getOffset = (idx: number, numElems: number) => {
    const offset = idx / numElems;
    return offset * 2.0 - 1.0 + 0.5 / numElems;
  };
  const getScale = () => {
    if (imageWidth == -1 || imageHeight == -1) {
      return Math.max(nrows, ncols);
    }
    const rx = (imageWidth * ncols) / window.innerWidth;
    const ry = (imageHeight * nrows) / window.innerHeight;
    return Math.max(rx, ry);
  };

  const scale = getScale();
  const sx = 1.0 / (window.innerWidth * scale);
  const dx = getOffset(col, ncols);
  const sy = 1.0 / (window.innerHeight * scale);
  const dy = getOffset(row, nrows);
  const mvpMat = new Matrix4();
  // prettier-ignore
  mvpMat.set(sx, 0.0, 0.0, dx,
             0.0, sy, 0.0, dy,
             0.0, 0.0, 1.0, 0.0,
             0.0, 0.0, 0.0, 1.0);
  return { [MVP_VARNAME]: mvpMat };
};
