import { Matrix4 } from "three";
import { DEFAULT_SHADERS } from "./constants";
import { getSamplerNames } from "../gl/gl";
import { UniformSchema, VertexSchema } from "../gl/types/schemas";
import {
  CanvasWindow,
  ImageProperty,
  ImageWidget,
  SubWindow,
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

export const createSubWindow = (): SubWindow => {
  return {
    image: getImageWidget(),
    mvpMat: new Matrix4(),
    scale: 1.0,
    widgets: [],
  };
};

export const getImageWidget = (
  shader: string = DEFAULT_SHADERS.image,
  imageProperty: ImageProperty = { fileBasename: "", width: 0, height: 0 },
  textures: { [key: string]: string | undefined } = {},
  mvpMat: Matrix4 = new Matrix4()
): ImageWidget => {
  const keys = getSamplerNames(shader);
  for (const key of keys) {
    if (!(key in textures)) {
      textures[key] = undefined;
    }
  }

  return {
    id: String(Math.random()),
    shaderPath: shader,
    renderMode: "TRIANGLE_STRIP",
    partsType: "image",
    textures,
    vertices: getImageVertices(imageProperty),
    uniforms: getImageUniforms(imageProperty, mvpMat),
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
