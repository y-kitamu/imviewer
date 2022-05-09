import { createDrawable, removeDrawable } from "../gl/gl";
import {
  convertImagePropertyToWidget,
  convertJsonSchemaToWidget,
} from "../io/io";
import { ImageProperty, JsonSchema } from "../io/types/io";
import { Widget } from "./types/widget";
import { CanvasWindow } from "./types/window";

export const createWidget = (
  gl: WebGL2RenderingContext,
  canvasWindow: CanvasWindow,
  imageProperties: ImageProperty[],
  schema: JsonSchema
) => {
  const { row, col } = canvasWindow.onFocus;
  const imageWidget = canvasWindow.images.find(
    (img) =>
      img.row.includes(canvasWindow.onFocus.row) &&
      img.col.includes(canvasWindow.onFocus.col)
  );

  const getImageProperty = (): ImageProperty => {
    if (imageWidget) {
      return {
        fileBasename: "",
        width: imageWidget.scale[0],
        height: imageWidget.scale[0],
      };
    } else if (schema.imageFilename) {
      const prop = imageProperties.find(
        (property) => property.fileBasename == schema.imageFilename
      );
      if (prop) {
        return prop;
      }
    }
    return { fileBasename: "", width: 1.0, height: 1.0 };
  };
  const iprop = getImageProperty();
  const widget = convertJsonSchemaToWidget(schema, iprop, [row], [col]);
  createDrawable(gl, widget, {});
};

export const createImageWidget = (
  gl: WebGL2RenderingContext,
  canvasWindow: CanvasWindow,
  imageProperties: ImageProperty[],
  fileBasename: string,
  key: string
) => {
  const imageWidget = getFocusedImageWidget(canvasWindow);
  const imageProperty = imageProperties.find(
    (img) => img.fileBasename == fileBasename
  );
  if (imageProperty == undefined) {
    console.error(`Failed to get image property : ${fileBasename}`);
    return;
  }
  //
  let newWidget = convertImagePropertyToWidget(
    imageProperty,
    canvasWindow.onFocus.row,
    canvasWindow.onFocus.col,
    imageWidget?.scale,
    imageWidget?.mvpMats
  );
  if (imageWidget == undefined) {
    newWidget.textures = { [key]: imageProperty };
    canvasWindow.images.push(newWidget);
  } else {
    newWidget.textures = imageWidget.textures;
    newWidget.textures[key] = imageProperty;
  }
  //
  const textures: { [key: string]: string | undefined } = {};
  for (const key in newWidget.textures) {
    textures[key] = newWidget.textures[key].fileBasename;
  }
  removeDrawable(gl, newWidget.id);
  createDrawable(gl, newWidget, textures);
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
