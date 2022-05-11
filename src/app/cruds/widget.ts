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
  const mats = rows.map((row, i) => getMVPMatrix(canvasWindow, row, cols[i]));
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
  const newWidget = convertImageToWidget(
    image,
    canvasWindow.onFocus.row,
    canvasWindow.onFocus.col,
    getMVPMatrix(canvasWindow)
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
    if (widget.row.includes(row) && widget.row.includes(col)) {
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
    if (widget.row.includes(row) && widget.row.includes(col)) {
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
  mat[MVP_VARNAME].multiplyMatrices(deltaMat, mat[MVP_VARNAME]);
};

const getMVPMatrix = (
  canvasWindow: CanvasWindow,
  row: number = -1,
  col: number = -1
): { [key: string]: Matrix4 } => {
  if (row == -1 || col == -1) {
    row = canvasWindow.onFocus.row;
    col = canvasWindow.onFocus.col;
  }
  // Search widgets already rendered on the target `row` and `col`
  const mat = canvasWindow.widgets.find(
    (w) => w.row.includes(row) && w.col.includes(col)
  )?.mvpMats;

  // If widgets already rendered are found, return the mvp matrix of the widget.
  if (mat != undefined) {
    console.log("Matrix already exists!");
    return mat;
  }

  // If widgets already rendered do not exist, create new mvp matrix.
  const { rowSizes, colSizes } = canvasWindow;
  const sx = colSizes[col] / window.innerWidth;
  const offsetx = colSizes.reduce(
    (prevVal, curVal, curIdx) => (curIdx < col ? prevVal + curVal : prevVal),
    0.0
  );
  const dx = offsetx * 2.0 - 1.0;
  const sy = rowSizes[col] / window.innerHeight;
  const offsety = rowSizes.reduce(
    (prevVal, curVal, curIdx) => (curIdx < row ? prevVal + curVal : prevVal),
    0.0
  );
  const dy = offsety * 2.0 - 1.0;
  const mvpMat = new Matrix4();
  // prettier-ignore
  mvpMat.set(sx, 0.0, 0.0, dx,
             0.0, sy, 0.0, dy,
             0.0, 0.0, 1.0, 0.0,
             0.0, 0.0, 0.0, 1.0);
  return { [MVP_VARNAME]: mvpMat };
};