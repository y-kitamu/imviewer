import { Matrix4 } from "three";
import { DEFAULT_SHADERS } from "./constants";
import { getSamplerNames } from "../gl/gl";
import { UniformSchema, VertexSchema } from "../gl/types/schemas";
import {
  CanvasWindow,
  CoordinateParams,
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

  const subwindows: SubWindow[] = Array(canvasWindow.ncols).fill(
    createSubWindow()
  );
  canvasWindow.subWindows.splice(rowIdx, 0, subwindows);
  canvasWindow.nrows++;
};

export const addCol = (canvasWindow: CanvasWindow, colIdx: number) => {
  if (colIdx > canvasWindow.ncols) {
    colIdx = canvasWindow.ncols;
  }

  const factor = 1.0 / canvasWindow.ncols;
  for (let i = 0; i < canvasWindow.ncols; i++) {
    canvasWindow.colSizes[i] *= 1.0 - factor;
    canvasWindow.subWindows[i].splice(colIdx, 0, createSubWindow());
  }
  canvasWindow.colSizes.splice(colIdx, 0, factor);

  canvasWindow.ncols++;
};

export const deleteRow = (canvasWindow: CanvasWindow, rowIdx: number) => {
  if (rowIdx >= canvasWindow.nrows) {
    return;
  }
  canvasWindow.rowSizes.splice(rowIdx, 1);
  canvasWindow.subWindows.splice(rowIdx, 1);

  canvasWindow.nrows--;
};

export const deletCol = (canvasWindow: CanvasWindow, colIdx: number) => {
  if (colIdx >= canvasWindow.ncols) {
    return;
  }
  for (let i = 0; i < canvasWindow.ncols; i++) {
    canvasWindow.subWindows[i].splice(colIdx, 1);
  }
  canvasWindow.colSizes.splice(colIdx, 1);

  canvasWindow.ncols--;
};

export const getDefaultImageWidget = (
  shader: string = DEFAULT_SHADERS.image,
  row: number = 0,
  col: number = 0
): ImageWidget => {
  const imageProperty: ImageProperty = {
    fileBasename: "",
    width: 1.0,
    height: 1.0,
  };

  const coords: CoordinateParams = {
    scale: 1.0,
    mvpMat: new Matrix4(),
  };

  const textures: { [key: string]: string | undefined } = {};
  const keys = getSamplerNames(shader);
  for (const key of keys) {
    if (!(key in textures)) {
      textures[key] = undefined;
    }
  }

  return {
    id: String(Math.random()),
    row,
    col,
    shaderPath: shader,
    renderMode: "TRIANGLE_STRIP",
    partsType: "image",
    textures,
    vertices: getImageVertices(imageProperty),
    uniforms: getImageUniforms(imageProperty, mvpMat),
    coords,
  };
};

export const getImageVertices = (
  imageProperty: ImageProperty
): VertexSchema[] => {
  const { width, height } = imageProperty;
  // prettier-ignore
  return [
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
  ];
};

export const getImageUniforms = (
  imageProperty: ImageProperty,
  mvpMat: Matrix4 = new Matrix4()
): UniformSchema[] => {
  const { width, height } = imageProperty;
  return [
    {
      variableName: "scale",
      data: [Math.max(width, height)],
    },
    {
      variableName: "mvp",
      data: mvpMat.elements,
    },
  ];
};
