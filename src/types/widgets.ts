import { Matrix4, Vector2 } from "three";
import { Shader } from "./shader";

export type WidgetType = "image" | "point" | "line" | "arrow";

export type WidgetsBase = {
  id: number; // hash id.
  widgetType: WidgetType;
  shader: Shader;
  renderMode: number; // ex. gl.TRIANGLE_STRIP
  numVertex: number;
};

export type ImageWidget = WidgetsBase & {
  filename: string;
  file: File;
  image: HTMLImageElement | null;
  mvpMat: Matrix4;
};

export type PointWidget = WidgetsBase & {
  // Points array in normalized coordinates (-1.0 ~ 1.0).
  pointArray: Vector2[];
  mvpMat: Matrix4;
  bindedImage?: ImageWidget;
};

export type LineWidget = WidgetsBase & {
  // Start and end points of lines in normalized coordinates (-1.0 ~ 1.0).
  pointPairs: Vector2[][];
  mvpMats: Matrix4[];
  bindedImage?: ImageWidget;
};

export type ArrowWidget = PointWidget;
