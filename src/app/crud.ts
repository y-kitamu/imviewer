import { createDrawable, removeDrawable } from "../gl/gl";
import { convertImageToWidget, convertJsonSchemaToWidget } from "../io/io";
import { JsonSchema } from "../io/types/io";
import { CanvasWindow } from "./types/window";

export const createWidget = (
  gl: WebGL2RenderingContext,
  canvasWindow: CanvasWindow,
  schema: JsonSchema
) => {
  const { row, col } = canvasWindow.onFocus;
  const imageWidget = canvasWindow.images.find(
    (img) =>
      img.row.includes(canvasWindow.onFocus.row) &&
      img.col.includes(canvasWindow.onFocus.col)
  );
  const mats = imageWidget == undefined ? [] : [imageWidget.mvpMats];
  const widget = convertJsonSchemaToWidget(schema, [row], [col], mats);
  createDrawable(gl, widget, {});
};

export const createImageWidget = (
  gl: WebGL2RenderingContext,
  canvasWindow: CanvasWindow,
  image: HTMLImageElement,
  fileBasename: string,
  key: string
) => {
  const imageWidget = getFocusedImageWidget(canvasWindow);
  //
  let newWidget = convertImageToWidget(
    image,
    canvasWindow.onFocus.row,
    canvasWindow.onFocus.col,
    imageWidget?.mvpMats
  );
  if (imageWidget == undefined) {
    newWidget.textures = { [key]: fileBasename };
    canvasWindow.images.push(newWidget);
  } else {
    newWidget.textures = imageWidget.textures;
    newWidget.textures[key] = fileBasename;
  }
  //
  removeDrawable(gl, newWidget.id);
  createDrawable(gl, newWidget, newWidget.textures);
};

export const isWidgetDrawing = (
  canvasWindow: CanvasWindow,
  schema: JsonSchema
) => {
  const { row, col } = canvasWindow.onFocus;
  for (const widget of canvasWindow.widgets) {
    if (widget.row.includes(row) && widget.row.includes(col)) {
      if (widget.vertices == schema.datas) {
        return true;
      }
    }
  }
  return false;
};

export const updateWidgetScalePosition = () => {};

export const deleteWidget = (
  gl: WebGL2RenderingContext,
  canvasWindow: CanvasWindow,
  schema: JsonSchema
) => {
  const { row, col } = canvasWindow.onFocus;
  canvasWindow.widgets = canvasWindow.widgets.filter((widget) => {
    if (widget.row.includes(row) && widget.row.includes(col)) {
      if (widget.vertices == schema.datas) {
        removeDrawable(gl, widget.id);
        return false;
      }
      return true;
    }
    return true;
  });
};

export const deleteImageWidget = (
  gl: WebGL2RenderingContext,
  canvasWindow: CanvasWindow
) => {
  const { row, col } = canvasWindow.onFocus;
  canvasWindow.images = canvasWindow.images.filter((image) => {
    if (image.row.includes(row) && image.row.includes(col)) {
      console.log("delete image :");
      console.log(image);
      removeDrawable(gl, image.id);
      return false;
    }
    return true;
  });
};

export const getFocusedImageWidget = (canvasWindow: CanvasWindow) => {
  const { row, col } = canvasWindow.onFocus;
  return canvasWindow.images.find(
    (img) => img.row.includes(row) && img.col.includes(col)
  );
};
